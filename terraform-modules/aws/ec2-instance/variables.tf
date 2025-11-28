#------------------------------------------------------------------------------
# EC2 Instance Variables
#------------------------------------------------------------------------------

variable "ami_id" {
  description = "The AMI ID to use for the instance"
  type        = string
}

variable "instance_type" {
  description = "The type of instance to start"
  type        = string
  default     = "t2.micro"
}

variable "subnet_id" {
  description = "The VPC Subnet ID to launch in"
  type        = string
  default     = null
}

variable "vpc_security_group_ids" {
  description = "A list of security group IDs to associate with"
  type        = list(string)
  default     = []
}

variable "key_name" {
  description = "Key name of the Key Pair to use for the instance"
  type        = string
  default     = null
}

variable "instance_name" {
  description = "Value of the Name tag for the instance"
  type        = string
  default     = "ec2-instance"
}

variable "tags" {
  description = "A mapping of tags to assign to the resource"
  type        = map(string)
  default     = {}
}

variable "kms_key_id" {
  description = "ARN of the KMS key to use for encryption across all services (EBS volumes, Secrets Manager). Uses AWS managed keys if not specified"
  type        = string
  default     = null
}

variable "volume_tags" {
  description = "A mapping of tags to assign to the devices created by the instance at launch time"
  type        = map(string)
  default     = null
}

variable "associate_public_ip_address" {
  description = "Whether to associate a public IP address with an instance in a VPC"
  type        = bool
  default     = null
}

variable "iam_instance_profile" {
  description = "IAM Instance Profile to launch the instance with"
  type        = string
  default     = null
}

variable "user_data" {
  description = "User data to provide when launching the instance"
  type        = string
  default     = null
}

variable "user_data_base64" {
  description = "Can be used instead of user_data to pass base64-encoded binary data directly"
  type        = string
  default     = null
}

variable "user_data_replace_on_change" {
  description = "When true, changes to user_data or user_data_base64 will trigger a destroy and recreate"
  type        = bool
  default     = null
}

variable "private_ip" {
  description = "Private IP address to associate with the instance in a VPC"
  type        = string
  default     = null
}

variable "secondary_private_ips" {
  description = "A list of secondary private IPv4 addresses to assign to the instance's primary network interface"
  type        = list(string)
  default     = null
}

variable "ebs_optimized" {
  description = "If true, the launched EC2 instance will be EBS-optimized"
  type        = bool
  default     = null
}

variable "source_dest_check" {
  description = "Controls if traffic is routed to the instance when the destination address does not match"
  type        = bool
  default     = true
}

variable "disable_api_termination" {
  description = "If true, enables EC2 Instance Termination Protection"
  type        = bool
  default     = false
}

variable "disable_api_stop" {
  description = "If true, enables EC2 Instance Stop Protection"
  type        = bool
  default     = false
}

variable "tenancy" {
  description = "The tenancy of the instance (if the instance is running in a VPC). Values: default, dedicated, host"
  type        = string
  default     = null
}

variable "host_id" {
  description = "ID of a dedicated host that the instance will be assigned to"
  type        = string
  default     = null
}

variable "placement_group" {
  description = "The Placement Group to start the instance in"
  type        = string
  default     = null
}

variable "availability_zone" {
  description = "AZ to start the instance in"
  type        = string
  default     = null
}

variable "get_password_data" {
  description = "If true, wait for password data to become available and retrieve it"
  type        = bool
  default     = false
}

variable "hibernation" {
  description = "If true, the launched EC2 instance will support hibernation"
  type        = bool
  default     = null
}

variable "instance_initiated_shutdown_behavior" {
  description = "Shutdown behavior for the instance. Values: stop, terminate"
  type        = string
  default     = null
}

variable "ipv6_address_count" {
  description = "Number of IPv6 addresses to associate with the primary network interface"
  type        = number
  default     = null
}

variable "ipv6_addresses" {
  description = "Specify one or more IPv6 addresses from the range of the subnet to associate"
  type        = list(string)
  default     = null
}

variable "cpu_options" {
  description = "CPU options for the instance (core_count, threads_per_core, amd_sev_snp)"
  type        = map(any)
  default     = null
}

#------------------------------------------------------------------------------
# Root Volume Variables
#------------------------------------------------------------------------------

variable "root_volume_type" {
  description = "Type of root volume. Values: standard, gp2, gp3, io1, io2, sc1, st1"
  type        = string
  default     = null
}

variable "root_volume_size" {
  description = "Size of the root volume in gibibytes (GiB)"
  type        = number
  default     = null
}

variable "root_volume_iops" {
  description = "Amount of provisioned IOPS for root volume. Only valid for volume_type of io1, io2, or gp3"
  type        = number
  default     = null
}

variable "root_volume_throughput" {
  description = "Throughput to provision for root volume in MiB/s. Only valid for volume_type of gp3"
  type        = number
  default     = null
}

variable "root_volume_delete_on_termination" {
  description = "Whether the root volume should be destroyed on instance termination"
  type        = bool
  default     = true
}

variable "root_volume_encrypted" {
  description = "Whether to enable root volume encryption"
  type        = bool
  default     = null
}

variable "root_volume_tags" {
  description = "A mapping of tags to assign to the root volume"
  type        = map(string)
  default     = null
}

#------------------------------------------------------------------------------
# Metadata and Advanced Configuration Variables
#------------------------------------------------------------------------------

variable "metadata_options" {
  description = "Customize the metadata options of the instance"
  type        = map(string)
  default     = {}
}

variable "capacity_reservation_specification" {
  description = "Targeting for Capacity Reservations"
  type        = any
  default     = null
}

variable "credit_specification" {
  description = "Credit specification for burstable instances (T2/T3)"
  type        = map(string)
  default     = null
}

variable "enclave_options" {
  description = "Enclave options for Nitro enclaves"
  type        = map(bool)
  default     = null
}

variable "maintenance_options" {
  description = "Maintenance options for the instance"
  type        = map(string)
  default     = null
}

variable "private_dns_name_options" {
  description = "Private DNS name options for the instance"
  type        = map(any)
  default     = null
}

#------------------------------------------------------------------------------
# Monitoring Variables
#------------------------------------------------------------------------------

variable "enable_monitoring" {
  description = "State of detailed monitoring"
  type        = bool
  default     = false
}

variable "alarm_actions" {
  description = "The list of actions to execute when this alarm transitions into an ALARM state"
  type        = list(string)
  default     = []
}

variable "ok_actions" {
  description = "The list of actions to execute when this alarm transitions into an OK state"
  type        = list(string)
  default     = []
}

variable "insufficient_data_actions" {
  description = "The list of actions to execute when this alarm transitions into an INSUFFICIENT_DATA state"
  type        = list(string)
  default     = []
}

variable "alarm_actions_enabled" {
  description = "Indicates whether actions should be executed during any changes to the alarm state"
  type        = bool
  default     = true
}

#------------------------------------------------------------------------------
# CPU Alarm Variables
#------------------------------------------------------------------------------

variable "alarm_cpu_threshold" {
  description = "The percentage threshold for the CPU utilization alarm"
  type        = number
  default     = 80
}

variable "cpu_alarm_comparison_operator" {
  description = "Comparison operator for CPU alarm"
  type        = string
  default     = "GreaterThanOrEqualToThreshold"
}

variable "cpu_alarm_evaluation_periods" {
  description = "Evaluation periods for CPU alarm"
  type        = number
  default     = 2
}

variable "cpu_alarm_period" {
  description = "Period in seconds for CPU alarm"
  type        = number
  default     = 120
}

variable "cpu_alarm_statistic" {
  description = "Statistic for CPU alarm. Values: SampleCount, Average, Sum, Minimum, Maximum"
  type        = string
  default     = "Average"
}

variable "cpu_alarm_description" {
  description = "Description for the CPU utilization alarm"
  type        = string
  default     = "This metric monitors ec2 cpu utilization"
}

variable "cpu_alarm_treat_missing_data" {
  description = "How to treat missing data for CPU alarm. Values: missing, ignore, breaching, notBreaching"
  type        = string
  default     = null
}

variable "cpu_alarm_datapoints_to_alarm" {
  description = "Number of datapoints that must be breaching to trigger the CPU alarm"
  type        = number
  default     = null
}

variable "cpu_alarm_extended_statistic" {
  description = "Extended statistic for the CPU alarm (percentile, e.g., p99)"
  type        = string
  default     = null
}

variable "cpu_alarm_unit" {
  description = "Unit for the CPU alarm metric"
  type        = string
  default     = null
}

#------------------------------------------------------------------------------
# Status Check Alarm Variables
#------------------------------------------------------------------------------

variable "status_check_threshold" {
  description = "Threshold for Status Check Failed alarm"
  type        = number
  default     = 1
}

variable "status_check_comparison_operator" {
  description = "Comparison operator for Status Check alarm"
  type        = string
  default     = "GreaterThanOrEqualToThreshold"
}

variable "status_check_evaluation_periods" {
  description = "Evaluation periods for Status Check alarm"
  type        = number
  default     = 2
}

variable "status_check_period" {
  description = "Period in seconds for Status Check alarm"
  type        = number
  default     = 120
}

variable "status_check_statistic" {
  description = "Statistic for Status Check alarm. Values: SampleCount, Average, Sum, Minimum, Maximum"
  type        = string
  default     = "Average"
}

variable "status_check_alarm_description" {
  description = "Description for the status check alarm"
  type        = string
  default     = "This metric monitors ec2 status check failures"
}

variable "status_check_treat_missing_data" {
  description = "How to treat missing data for status check alarm. Values: missing, ignore, breaching, notBreaching"
  type        = string
  default     = null
}

variable "status_check_datapoints_to_alarm" {
  description = "Number of datapoints that must be breaching to trigger the status check alarm"
  type        = number
  default     = null
}

variable "status_check_extended_statistic" {
  description = "Extended statistic for the status check alarm (percentile, e.g., p99)"
  type        = string
  default     = null
}

variable "status_check_unit" {
  description = "Unit for the status check alarm metric"
  type        = string
  default     = null
}

#------------------------------------------------------------------------------
# Secrets Manager Variables (Optional)
#------------------------------------------------------------------------------

variable "store_password_in_secrets_manager" {
  description = "Automatically retrieve the instance password and store it in AWS Secrets Manager. Enables get_password_data and creates a secret named {instance_name}-credentials. Uses kms_key_id for encryption if provided"
  type        = bool
  default     = false
}

variable "secrets_manager_rotation_lambda_arn" {
  description = "ARN of a Lambda function that can rotate the credentials. Only used when store_password_in_secrets_manager is true"
  type        = string
  default     = null
}

variable "secrets_manager_rotation_days" {
  description = "Number of days between automatic rotation. Only used when rotation_lambda_arn is provided"
  type        = number
  default     = 30
}
