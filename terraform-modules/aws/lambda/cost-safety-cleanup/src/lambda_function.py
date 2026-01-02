import os
import time
from typing import Dict, Iterable, List, Optional, Tuple

import boto3

# This Lambda is intended for TEST/DEV cost safety.
# It runs on a schedule and attempts to delete/terminate cost-driving resources across regions.
#
# Safety model:
# - It will refuse to run unless the current AWS account is explicitly allowlisted.
# - It will skip resources with a keep tag (default: status=keep).
# - It supports a dry-run mode that only logs actions.


def _env_bool(name: str, default: bool = False) -> bool:
    # Parse a boolean environment variable.
    v = os.getenv(name)
    if v is None:
        return default
    return v.strip().lower() in {"1", "true", "yes", "y"}


def _split_csv(v: Optional[str]) -> List[str]:
    # Parse a CSV environment variable into a list of non-empty strings.
    if not v:
        return []
    return [x.strip() for x in v.split(",") if x.strip()]


def _get_account_id() -> str:
    # Retrieve the current AWS account ID the Lambda is running under.
    sts = boto3.client("sts")
    return sts.get_caller_identity()["Account"]


def _is_allowed_account(account_id: str, allowed: List[str]) -> bool:
    # Guardrail: do not run unless the account is explicitly allowlisted.
    return bool(allowed) and account_id in allowed


def _regions_to_scan(target_regions: List[str]) -> List[str]:
    # Choose regions to scan:
    # - If TARGET_REGIONS is provided, only scan those.
    # - Otherwise, scan all enabled regions returned by DescribeRegions.
    if target_regions:
        return target_regions

    ec2 = boto3.client("ec2")
    resp = ec2.describe_regions(AllRegions=False)
    return sorted([r["RegionName"] for r in resp.get("Regions", [])])


def _tags_match(tags: Optional[Dict[str, str]], required_key: str, required_value: str) -> bool:
    # Generic tag matcher utility (not used by the keep-tag logic).
    if not required_key:
        return True
    if not tags:
        return False
    if required_value == "":
        return required_key in tags
    return tags.get(required_key) == required_value


def _is_kept(tags: Optional[Dict[str, str]], keep_key: str, keep_value: str) -> bool:
    # Keep-tag logic:
    # If a resource has keep_key=keep_value, skip deletion/termination.
    if not keep_key:
        return False
    if not tags:
        return False
    if keep_value == "":
        return keep_key in tags
    return tags.get(keep_key) == keep_value


def _instance_tags(instance: Dict) -> Dict[str, str]:
    # Convert EC2 tag list to a simple dict.
    out: Dict[str, str] = {}
    for t in instance.get("Tags", []) or []:
        k = t.get("Key")
        v = t.get("Value")
        if k is not None and v is not None:
            out[str(k)] = str(v)
    return out


def _log(action: str, **kwargs) -> None:
    # Structured logging to CloudWatch.
    payload = {"action": action, **kwargs}
    print(payload)


def cleanup_ec2_and_ebs(region: str, required_key: str, required_value: str, dry_run: bool) -> None:
    # EC2/EBS cleanup strategy:
    # - Find instances in common active/inactive states and terminate them.
    # - Attempt to delete volumes attached to those instances.
    # - Delete unattached (available) volumes.
    # - Skip any instance/volume tagged with status=keep (configurable).
    ec2 = boto3.client("ec2", region_name=region)

    paginator = ec2.get_paginator("describe_instances")
    filters = [
        {
            "Name": "instance-state-name",
            "Values": ["pending", "running", "stopping", "stopped"],
        }
    ]

    instance_ids_to_terminate: List[str] = []
    instance_id_to_volume_ids: Dict[str, List[str]] = {}

    for page in paginator.paginate(Filters=filters):
        for reservation in page.get("Reservations", []) or []:
            for instance in reservation.get("Instances", []) or []:
                iid = instance.get("InstanceId")
                if not iid:
                    continue

                tags = _instance_tags(instance)
                if _is_kept(tags, required_key, required_value):
                    continue

                vols: List[str] = []
                for mapping in instance.get("BlockDeviceMappings", []) or []:
                    ebs = mapping.get("Ebs") or {}
                    vid = ebs.get("VolumeId")
                    if vid:
                        vols.append(vid)

                instance_ids_to_terminate.append(iid)
                instance_id_to_volume_ids[iid] = vols

    if instance_ids_to_terminate:
        # Terminate instances in a single call (best effort).
        _log(
            "ec2_terminate_instances",
            region=region,
            count=len(instance_ids_to_terminate),
            instance_ids=instance_ids_to_terminate,
            dry_run=dry_run,
        )
        if not dry_run:
            ec2.terminate_instances(InstanceIds=instance_ids_to_terminate)

    # Delete attached EBS volumes we discovered via instances
    volume_ids: List[str] = sorted({vid for vids in instance_id_to_volume_ids.values() for vid in vids})
    for vid in volume_ids:
        _delete_volume_best_effort(ec2, region, vid, required_key, required_value, dry_run)

    # Delete any unattached "available" volumes that match the tag filter
    vol_paginator = ec2.get_paginator("describe_volumes")
    for page in vol_paginator.paginate(Filters=[{"Name": "status", "Values": ["available"]}]):
        for vol in page.get("Volumes", []) or []:
            vid = vol.get("VolumeId")
            if not vid:
                continue
            tags = {t.get("Key"): t.get("Value") for t in (vol.get("Tags", []) or []) if t.get("Key")}
            if _is_kept(tags, required_key, required_value):
                continue
            _delete_volume_best_effort(ec2, region, vid, required_key, required_value, dry_run)


def _delete_volume_best_effort(
    ec2,
    region: str,
    volume_id: str,
    keep_key: str,
    keep_value: str,
    dry_run: bool,
) -> None:
    # EBS deletion is best-effort:
    # - If in-use, force-detach first.
    # - Then delete.
    # - Skip volumes with keep tag.
    try:
        # Refresh state
        resp = ec2.describe_volumes(VolumeIds=[volume_id])
        vols = resp.get("Volumes", [])
        if not vols:
            return
        vol = vols[0]

        tags = {t.get("Key"): t.get("Value") for t in (vol.get("Tags", []) or []) if t.get("Key")}
        if _is_kept(tags, keep_key, keep_value):
            _log("ec2_volume_skipped_keep_tag", region=region, volume_id=volume_id)
            return

        state = vol.get("State")
        attachments = vol.get("Attachments", []) or []

        if attachments and state == "in-use":
            for att in attachments:
                _log(
                    "ec2_detach_volume",
                    region=region,
                    volume_id=volume_id,
                    instance_id=att.get("InstanceId"),
                    device=att.get("Device"),
                    dry_run=dry_run,
                )
                if not dry_run:
                    ec2.detach_volume(VolumeId=volume_id, Force=True)

            if not dry_run:
                # brief pause to allow detach to progress
                time.sleep(2)

        _log("ec2_delete_volume", region=region, volume_id=volume_id, dry_run=dry_run)
        if not dry_run:
            ec2.delete_volume(VolumeId=volume_id)

    except Exception as e:
        _log("ec2_volume_delete_failed", region=region, volume_id=volume_id, error=str(e))


def cleanup_ecs(region: str, required_key: str, required_value: str, dry_run: bool) -> None:
    # ECS cleanup strategy:
    # - Enumerate clusters.
    # - For each service, delete it (after scaling desiredCount=0) unless tagged keep.
    # - Stop running tasks, but do not stop tasks belonging to kept services.
    ecs = boto3.client("ecs", region_name=region)

    cluster_arns = []
    paginator = ecs.get_paginator("list_clusters")
    for page in paginator.paginate():
        cluster_arns.extend(page.get("clusterArns", []) or [])

    for cluster_arn in cluster_arns:
        # We don't delete clusters here; we stop tasks and delete services (cost drivers)
        # If a cluster has no tag filtering, we apply tag filtering to services/tasks.

        svc_paginator = ecs.get_paginator("list_services")
        service_arns: List[str] = []
        for page in svc_paginator.paginate(cluster=cluster_arn):
            service_arns.extend(page.get("serviceArns", []) or [])

        # Track kept services by name so we can avoid stopping their tasks.
        kept_service_names: set[str] = set()

        # Update/delete services
        for service_arn in service_arns:
            try:
                service_name = service_arn.split("/")[-1] if "/" in service_arn else service_arn
                tags_resp = ecs.list_tags_for_resource(resourceArn=service_arn)
                tags_list = tags_resp.get("tags", []) or []
                tags = {t.get("key"): t.get("value") for t in tags_list if t.get("key")}
                if _is_kept(tags, required_key, required_value):
                    kept_service_names.add(service_name)
                    continue

                _log(
                    "ecs_scale_service_zero",
                    region=region,
                    cluster_arn=cluster_arn,
                    service_arn=service_arn,
                    dry_run=dry_run,
                )
                if not dry_run:
                    ecs.update_service(cluster=cluster_arn, service=service_arn, desiredCount=0)

                _log(
                    "ecs_delete_service",
                    region=region,
                    cluster_arn=cluster_arn,
                    service_arn=service_arn,
                    dry_run=dry_run,
                )
                if not dry_run:
                    ecs.delete_service(cluster=cluster_arn, service=service_arn, force=True)

            except Exception as e:
                _log(
                    "ecs_service_cleanup_failed",
                    region=region,
                    cluster_arn=cluster_arn,
                    service_arn=service_arn,
                    error=str(e),
                )

        # Stop running tasks. Skip tasks belonging to kept services.
        task_paginator = ecs.get_paginator("list_tasks")
        task_arns: List[str] = []
        for page in task_paginator.paginate(cluster=cluster_arn, desiredStatus="RUNNING"):
            task_arns.extend(page.get("taskArns", []) or [])

        for task_arn in task_arns:
            try:
                describe = ecs.describe_tasks(cluster=cluster_arn, tasks=[task_arn])
                tasks = describe.get("tasks", []) or []
                if tasks:
                    group = tasks[0].get("group") or ""
                    # group example: "service:my-service"
                    if group.startswith("service:"):
                        svc_name = group.split(":", 1)[1]
                        if svc_name in kept_service_names:
                            _log(
                                "ecs_task_skipped_keep_service",
                                region=region,
                                cluster_arn=cluster_arn,
                                task_arn=task_arn,
                                service_name=svc_name,
                            )
                            continue

                _log(
                    "ecs_stop_task",
                    region=region,
                    cluster_arn=cluster_arn,
                    task_arn=task_arn,
                    dry_run=dry_run,
                )
                if not dry_run:
                    ecs.stop_task(cluster=cluster_arn, task=task_arn, reason="Cost safety cleanup")
            except Exception as e:
                _log(
                    "ecs_task_stop_failed",
                    region=region,
                    cluster_arn=cluster_arn,
                    task_arn=task_arn,
                    error=str(e),
                )


def cleanup_eks(region: str, required_key: str, required_value: str, dry_run: bool) -> None:
    # EKS cleanup strategy:
    # - Enumerate clusters.
    # - Skip clusters tagged keep.
    # - Delete nodegroups first, then the cluster.
    eks = boto3.client("eks", region_name=region)

    clusters: List[str] = []
    paginator = eks.get_paginator("list_clusters")
    for page in paginator.paginate():
        clusters.extend(page.get("clusters", []) or [])

    for cluster_name in clusters:
        try:
            desc = eks.describe_cluster(name=cluster_name)
            cluster = desc.get("cluster") or {}
            cluster_arn = cluster.get("arn")
            if not cluster_arn:
                continue

            tags = (cluster.get("tags") or {})
            if _is_kept(tags, required_key, required_value):
                continue

            # Delete nodegroups first
            ngs: List[str] = []
            ng_paginator = eks.get_paginator("list_nodegroups")
            for page in ng_paginator.paginate(clusterName=cluster_name):
                ngs.extend(page.get("nodegroups", []) or [])

            for ng in ngs:
                _log(
                    "eks_delete_nodegroup",
                    region=region,
                    cluster_name=cluster_name,
                    nodegroup=ng,
                    dry_run=dry_run,
                )
                if not dry_run:
                    eks.delete_nodegroup(clusterName=cluster_name, nodegroupName=ng)

            _log(
                "eks_delete_cluster",
                region=region,
                cluster_name=cluster_name,
                dry_run=dry_run,
            )
            if not dry_run:
                eks.delete_cluster(name=cluster_name)

        except Exception as e:
            _log(
                "eks_cleanup_failed",
                region=region,
                cluster_name=cluster_name,
                error=str(e),
            )


def lambda_handler(event, context):
    # Entrypoint:
    # - Validate allowlisted account.
    # - Determine regions.
    # - Run cleanup routines per region.
    allowed = _split_csv(os.getenv("ALLOWED_ACCOUNT_IDS"))
    keep_key = os.getenv("KEEP_TAG_KEY", "")
    keep_value = os.getenv("KEEP_TAG_VALUE", "")
    dry_run = _env_bool("DRY_RUN", default=True)
    target_regions = _split_csv(os.getenv("TARGET_REGIONS"))

    account_id = _get_account_id()
    if not _is_allowed_account(account_id, allowed):
        _log(
            "guardrail_blocked",
            account_id=account_id,
            allowed_account_ids=allowed,
            reason="Account not in allowlist (or allowlist empty)",
        )
        return {"ok": False, "reason": "blocked_by_guardrail"}

    regions = _regions_to_scan(target_regions)
    _log(
        "start",
        account_id=account_id,
        regions=regions,
        keep_tag_key=keep_key,
        keep_tag_value=keep_value,
        dry_run=dry_run,
    )

    for region in regions:
        cleanup_ec2_and_ebs(region, keep_key, keep_value, dry_run)
        cleanup_ecs(region, keep_key, keep_value, dry_run)
        cleanup_eks(region, keep_key, keep_value, dry_run)

    _log("done", account_id=account_id, dry_run=dry_run)
    return {"ok": True, "dry_run": dry_run}
