# cost-safety-cleanup

Terraform module that deploys a scheduled AWS Lambda to reduce surprise AWS costs in a **test/dev** account.

The Lambda runs on a schedule (default: **9pm America/New_York**) and attempts to find and delete/terminate cost-driving resources across regions.

## What this deletes

This module is intentionally aggressive.

- **EC2**
  - Terminates instances in states: `pending`, `running`, `stopping`, `stopped`
- **EBS**
  - Deletes volumes attached to terminated instances (best-effort)
  - Deletes unattached (`available`) volumes
- **ECS**
  - For each ECS cluster, deletes services (scales `desiredCount` to 0 then deletes)
  - Stops running tasks (best-effort)
- **EKS**
  - Deletes EKS nodegroups, then deletes the EKS cluster

## Keep tag (opt-out)

Everything is eligible for cleanup **unless** you opt a resource out with a keep tag.

- Default keep tag is **`status=keep`**
- Configure via `keep_tag_key` and `keep_tag_value`

Notes:

- **EC2** instances with the keep tag are skipped.
- **EBS** volumes with the keep tag are skipped.
- **ECS** services with the keep tag are skipped, and tasks that belong to kept services are not stopped.
- **EKS** clusters with the keep tag are skipped.

## Guardrails (highly recommended)

This Lambda will refuse to run unless the current AWS Account ID is explicitly allowlisted.

- Set `allowed_account_ids` to your test account ID.
- If `allowed_account_ids` is empty (default), the Lambda will log a `guardrail_blocked` event and exit.

## Dry run

`dry_run` defaults to `true`.

When `dry_run=true`, the Lambda **only logs** what it would do.

## Schedule / timezone

This module uses **EventBridge Scheduler** (not the older CloudWatch Events rule) so it can be timezone-aware.

- Default schedule is daily at **9pm** in `America/New_York`.
- The schedule expression is evaluated in the timezone specified by `schedule_timezone`.

## Usage

Example root module usage:

```hcl
module "cost_safety_cleanup" {
  source = "../../terraform-modules/aws/lambda/cost-safety-cleanup"

  name = "test"

  # Guardrail: do not run in any account except the ones you specify.
  allowed_account_ids = ["123456789012"]

  # Keep resources by tagging them: status=keep
  keep_tag_key   = "status"
  keep_tag_value = "keep"

  # Start safe.
  dry_run = true

  # 9pm Eastern (DST-safe)
  schedule_timezone   = "America/New_York"
  schedule_expression = "cron(0 21 * * ? *)"

  # Optional: limit scanning to a subset of regions
  # target_regions = ["us-east-1", "us-west-2"]
}
```

## Inputs

- `name` (string, required)
- `allowed_account_ids` (list(string), default `[]`) **required for execution**
- `keep_tag_key` (string, default `status`)
- `keep_tag_value` (string, default `keep`)
- `dry_run` (bool, default `true`)
- `schedule_expression` (string, default `cron(0 21 * * ? *)`)
- `schedule_timezone` (string, default `America/New_York`)
- `target_regions` (list(string), default `[]`)
- `lambda_timeout` (number, default `900`)
- `lambda_memory_size` (number, default `512`)

## Outputs

- `lambda_function_name`
- `lambda_function_arn`
- `event_rule_arn` (this is the EventBridge Scheduler ARN)

## Operational notes

- This Lambda relies on **IAM permissions** to enumerate and delete resources.
- EBS deletion is best-effort and may fail transiently (detach timing, dependencies, etc.).
- Deleting EKS clusters/nodegroups can take time and may require multiple scheduled runs to fully converge.

## Warning

This module is **destructive**.

Use it only in accounts where deleting resources is acceptable, and keep `allowed_account_ids` set.
