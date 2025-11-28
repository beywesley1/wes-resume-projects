# EC2 Instance resource defining the compute instance
resource "aws_instance" "ec2_instance" {
  ami                                  = var.ami_id
  instance_type                        = var.instance_type
  subnet_id                            = var.subnet_id
  vpc_security_group_ids               = var.vpc_security_group_ids
  key_name                             = var.key_name
  monitoring                           = var.enable_monitoring
  associate_public_ip_address          = var.associate_public_ip_address
  iam_instance_profile                 = var.iam_instance_profile
  user_data                            = var.user_data
  user_data_base64                     = var.user_data_base64
  user_data_replace_on_change          = var.user_data_replace_on_change
  private_ip                           = var.private_ip
  secondary_private_ips                = var.secondary_private_ips
  ebs_optimized                        = var.ebs_optimized
  source_dest_check                    = var.source_dest_check
  disable_api_termination              = var.disable_api_termination
  disable_api_stop                     = var.disable_api_stop
  tenancy                              = var.tenancy
  host_id                              = var.host_id
  placement_group                      = var.placement_group
  availability_zone                    = var.availability_zone
  get_password_data                    = var.store_password_in_secrets_manager ? true : var.get_password_data
  hibernation                          = var.hibernation
  instance_initiated_shutdown_behavior = var.instance_initiated_shutdown_behavior
  ipv6_address_count                   = var.ipv6_address_count
  ipv6_addresses                       = var.ipv6_addresses

  # CPU options for the instance
  dynamic "cpu_options" {
    for_each = var.cpu_options != null ? [var.cpu_options] : []
    content {
      amd_sev_snp      = lookup(cpu_options.value, "amd_sev_snp", null)
      core_count       = lookup(cpu_options.value, "core_count", null)
      threads_per_core = lookup(cpu_options.value, "threads_per_core", null)
    }
  }

  # Root block device configuration
  root_block_device {
    volume_type           = var.root_volume_type
    volume_size           = var.root_volume_size
    iops                  = var.root_volume_iops
    throughput            = var.root_volume_throughput
    delete_on_termination = var.root_volume_delete_on_termination
    encrypted             = var.root_volume_encrypted
    kms_key_id            = var.kms_key_id
    tags                  = var.root_volume_tags
  }

  # Instance metadata options configuration
  dynamic "metadata_options" {
    for_each = length(var.metadata_options) > 0 ? [var.metadata_options] : []
    content {
      http_endpoint               = lookup(metadata_options.value, "http_endpoint", "enabled")
      http_tokens                 = lookup(metadata_options.value, "http_tokens", "optional")
      http_put_response_hop_limit = lookup(metadata_options.value, "http_put_response_hop_limit", 1)
      instance_metadata_tags      = lookup(metadata_options.value, "instance_metadata_tags", "disabled")
    }
  }

  # Capacity reservation specification
  dynamic "capacity_reservation_specification" {
    for_each = var.capacity_reservation_specification != null ? [var.capacity_reservation_specification] : []
    content {
      capacity_reservation_preference = lookup(capacity_reservation_specification.value, "capacity_reservation_preference", null)
      dynamic "capacity_reservation_target" {
        for_each = lookup(capacity_reservation_specification.value, "capacity_reservation_target", [])
        content {
          capacity_reservation_id                 = lookup(capacity_reservation_target.value, "capacity_reservation_id", null)
          capacity_reservation_resource_group_arn = lookup(capacity_reservation_target.value, "capacity_reservation_resource_group_arn", null)
        }
      }
    }
  }

  # Credit specification for burstable instances
  dynamic "credit_specification" {
    for_each = var.credit_specification != null ? [var.credit_specification] : []
    content {
      cpu_credits = lookup(credit_specification.value, "cpu_credits", "standard")
    }
  }

  # Enclave options for Nitro enclaves
  dynamic "enclave_options" {
    for_each = var.enclave_options != null ? [var.enclave_options] : []
    content {
      enabled = lookup(enclave_options.value, "enabled", false)
    }
  }

  # Maintenance options
  dynamic "maintenance_options" {
    for_each = var.maintenance_options != null ? [var.maintenance_options] : []
    content {
      auto_recovery = lookup(maintenance_options.value, "auto_recovery", "default")
    }
  }

  # Private DNS name options
  dynamic "private_dns_name_options" {
    for_each = var.private_dns_name_options != null ? [var.private_dns_name_options] : []
    content {
      enable_resource_name_dns_aaaa_record = lookup(private_dns_name_options.value, "enable_resource_name_dns_aaaa_record", null)
      enable_resource_name_dns_a_record    = lookup(private_dns_name_options.value, "enable_resource_name_dns_a_record", null)
      hostname_type                        = lookup(private_dns_name_options.value, "hostname_type", null)
    }
  }

  tags = merge(
    {
      "Name" = var.instance_name
    },
    var.tags
  )

  volume_tags = var.volume_tags

  # Lifecycle rule to ignore AMI changes
  lifecycle {
    ignore_changes = [ami]
  }
}

# CloudWatch alarm to monitor high CPU utilization
resource "aws_cloudwatch_metric_alarm" "cpu_high" {
  alarm_name                = "${var.instance_name}-cpu-high"
  comparison_operator       = var.cpu_alarm_comparison_operator
  evaluation_periods        = var.cpu_alarm_evaluation_periods
  metric_name               = "CPUUtilization"
  namespace                 = "AWS/EC2"
  period                    = var.cpu_alarm_period
  statistic                 = var.cpu_alarm_statistic
  threshold                 = var.alarm_cpu_threshold
  alarm_description         = var.cpu_alarm_description
  alarm_actions             = var.alarm_actions
  ok_actions                = var.ok_actions
  insufficient_data_actions = var.insufficient_data_actions
  actions_enabled           = var.alarm_actions_enabled
  treat_missing_data        = var.cpu_alarm_treat_missing_data
  datapoints_to_alarm       = var.cpu_alarm_datapoints_to_alarm
  extended_statistic        = var.cpu_alarm_extended_statistic
  unit                      = var.cpu_alarm_unit
  tags                      = var.tags

  dimensions = {
    InstanceId = aws_instance.ec2_instance.id
  }
}

# CloudWatch alarm to monitor status check failures
resource "aws_cloudwatch_metric_alarm" "status_check_failed" {
  alarm_name                = "${var.instance_name}-status-check-failed"
  comparison_operator       = var.status_check_comparison_operator
  evaluation_periods        = var.status_check_evaluation_periods
  metric_name               = "StatusCheckFailed"
  namespace                 = "AWS/EC2"
  period                    = var.status_check_period
  statistic                 = var.status_check_statistic
  threshold                 = var.status_check_threshold
  alarm_description         = var.status_check_alarm_description
  alarm_actions             = var.alarm_actions
  ok_actions                = var.ok_actions
  insufficient_data_actions = var.insufficient_data_actions
  actions_enabled           = var.alarm_actions_enabled
  treat_missing_data        = var.status_check_treat_missing_data
  datapoints_to_alarm       = var.status_check_datapoints_to_alarm
  extended_statistic        = var.status_check_extended_statistic
  unit                      = var.status_check_unit
  tags                      = var.tags

  dimensions = {
    InstanceId = aws_instance.ec2_instance.id
  }
}

#------------------------------------------------------------------------------
# AWS Secrets Manager - Store EC2 Credentials (Optional)
#------------------------------------------------------------------------------

# Secret container for EC2 credentials (auto-named: {instance_name}-credentials)
resource "aws_secretsmanager_secret" "ec2_credentials" {
  count                   = var.store_password_in_secrets_manager ? 1 : 0
  name                    = "${var.instance_name}-credentials"
  description             = "Credentials for EC2 instance ${var.instance_name}"
  kms_key_id              = var.kms_key_id
  recovery_window_in_days = 7

  tags = merge(
    {
      "Name" = "${var.instance_name}-credentials"
    },
    var.tags
  )
}

# Secret version containing the actual credentials
resource "aws_secretsmanager_secret_version" "ec2_credentials" {
  count     = var.store_password_in_secrets_manager ? 1 : 0
  secret_id = aws_secretsmanager_secret.ec2_credentials[0].id
  secret_string = jsonencode({
    instance_id   = aws_instance.ec2_instance.id
    instance_name = var.instance_name
    password_data = aws_instance.ec2_instance.password_data
    private_ip    = aws_instance.ec2_instance.private_ip
    public_ip     = aws_instance.ec2_instance.public_ip
    private_dns   = aws_instance.ec2_instance.private_dns
    public_dns    = aws_instance.ec2_instance.public_dns
    key_name      = var.key_name
  })
}

# Optional automatic rotation (requires custom Lambda function)
resource "aws_secretsmanager_secret_rotation" "ec2_credentials" {
  count               = var.store_password_in_secrets_manager && var.secrets_manager_rotation_lambda_arn != null ? 1 : 0
  secret_id           = aws_secretsmanager_secret.ec2_credentials[0].id
  rotation_lambda_arn = var.secrets_manager_rotation_lambda_arn

  rotation_rules {
    automatically_after_days = var.secrets_manager_rotation_days
  }
}
