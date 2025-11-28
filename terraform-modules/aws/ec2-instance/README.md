# AWS EC2 Instance Terraform Module

A comprehensive Terraform module for deploying AWS EC2 instances with built-in CloudWatch monitoring alarms.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Usage](#usage)
- [Examples](#examples)
  - [Basic Usage](#basic-usage)
  - [Root Volume Configuration](#root-volume-configuration)
  - [Metadata Options (IMDSv2)](#metadata-options-imdsv2)
  - [CPU Options](#cpu-options)
  - [Capacity Reservations](#capacity-reservations)
  - [Credit Specification (Burstable Instances)](#credit-specification-burstable-instances)
  - [Nitro Enclaves](#nitro-enclaves)
  - [CloudWatch Alarms](#cloudwatch-alarms)
  - [Secrets Manager (Credential Storage)](#secrets-manager-credential-storage)
  - [Complete Example](#complete-example)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [License](#license)

## Features

- **EC2 Instance**: Full configuration support for all EC2 instance arguments
- **Root Volume**: Configurable root EBS volume (type, size, IOPS, throughput, encryption)
- **CloudWatch Alarms**: Built-in CPU utilization and status check monitoring
- **IMDSv2 Support**: Configurable instance metadata service options
- **Advanced Options**: CPU options, capacity reservations, credit specifications, Nitro enclaves
- **Secrets Manager**: Optional secure storage of EC2 credentials (Windows password data, connection info)
- **Lifecycle Management**: AMI changes are ignored to prevent unintended instance recreation

## Requirements

| Name | Version |
|------|---------|
| terraform | >= 1.0 |
| aws | >= 4.0 |

## Usage

```hcl
module "ec2_instance" {
  source = "path/to/terraform-modules/aws/ec2-instance"

  ami_id        = "ami-0abcdef1234567890"
  instance_type = "t3.medium"
  instance_name = "my-application-server"
  subnet_id     = "subnet-0123456789abcdef0"
  
  vpc_security_group_ids = ["sg-0123456789abcdef0"]
  key_name               = "my-key-pair"
  
  tags = {
    Environment = "production"
    Project     = "my-project"
  }
}
```

## Examples

### Basic Usage

The minimum required configuration:

```hcl
module "ec2_basic" {
  source = "path/to/terraform-modules/aws/ec2-instance"

  ami_id        = "ami-0abcdef1234567890"
  instance_name = "basic-instance"
}
```

### Root Volume Configuration

Customize the root EBS volume with specific size, type, and performance characteristics:

```hcl
module "ec2_custom_root" {
  source = "path/to/terraform-modules/aws/ec2-instance"

  ami_id        = "ami-0abcdef1234567890"
  instance_type = "m5.large"
  instance_name = "high-performance-instance"

  # Root volume configuration
  root_volume_type        = "gp3"          # General Purpose SSD v3
  root_volume_size        = 100            # 100 GiB
  root_volume_iops        = 4000           # 4000 IOPS (gp3 baseline is 3000)
  root_volume_throughput  = 250            # 250 MiB/s throughput
  root_volume_encrypted   = true           # Enable encryption
  root_volume_kms_key_id  = "arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012"
  
  root_volume_tags = {
    Name = "high-performance-root-volume"
  }
}
```

**Volume Types:**
| Type | Description | Use Case |
|------|-------------|----------|
| `gp3` | General Purpose SSD v3 | Most workloads, best price-performance |
| `gp2` | General Purpose SSD v2 | Legacy, IOPS scales with size |
| `io1` | Provisioned IOPS SSD | High-performance databases |
| `io2` | Provisioned IOPS SSD v2 | Mission-critical databases |
| `st1` | Throughput Optimized HDD | Big data, log processing |
| `sc1` | Cold HDD | Infrequently accessed data |

### Metadata Options (IMDSv2)

Configure the Instance Metadata Service (IMDS) for enhanced security:

```hcl
module "ec2_imdsv2" {
  source = "path/to/terraform-modules/aws/ec2-instance"

  ami_id        = "ami-0abcdef1234567890"
  instance_name = "secure-instance"

  # Enforce IMDSv2 (recommended for security)
  metadata_options = {
    http_endpoint               = "enabled"   # Enable metadata service
    http_tokens                 = "required"  # Require IMDSv2 tokens (secure)
    http_put_response_hop_limit = "2"         # Allow containers to access metadata
    instance_metadata_tags      = "enabled"   # Allow tag access via metadata
  }
}
```

**Metadata Options Explained:**
- `http_endpoint`: Enable or disable the metadata service (`enabled`/`disabled`)
- `http_tokens`: `optional` allows IMDSv1, `required` enforces IMDSv2 (recommended)
- `http_put_response_hop_limit`: Number of network hops for PUT responses (increase for containers)
- `instance_metadata_tags`: Allow instance tags to be accessed from metadata

### CPU Options

Fine-tune CPU configuration for licensing optimization or performance:

```hcl
module "ec2_cpu_optimized" {
  source = "path/to/terraform-modules/aws/ec2-instance"

  ami_id        = "ami-0abcdef1234567890"
  instance_type = "c5.4xlarge"  # 16 vCPUs, 8 cores
  instance_name = "cpu-optimized-instance"

  # Reduce cores for per-core licensing (e.g., Oracle, SQL Server)
  cpu_options = {
    core_count       = "4"    # Use only 4 cores instead of 8
    threads_per_core = "1"    # Disable hyperthreading (1 thread per core)
  }
}
```

**CPU Options Explained:**
- `core_count`: Number of CPU cores (reduce for per-core licensing costs)
- `threads_per_core`: `1` disables hyperthreading, `2` enables it
- `amd_sev_snp`: Enable AMD SEV-SNP for confidential computing

### Capacity Reservations

Reserve capacity to ensure instance availability:

```hcl
# Using an existing Capacity Reservation
module "ec2_reserved" {
  source = "path/to/terraform-modules/aws/ec2-instance"

  ami_id        = "ami-0abcdef1234567890"
  instance_type = "m5.large"
  instance_name = "reserved-instance"

  # Target a specific capacity reservation
  capacity_reservation_specification = {
    capacity_reservation_preference = "open"  # or "none"
    capacity_reservation_target = [{
      capacity_reservation_id = "cr-0123456789abcdef0"
    }]
  }
}

# Using a Capacity Reservation Group
module "ec2_reserved_group" {
  source = "path/to/terraform-modules/aws/ec2-instance"

  ami_id        = "ami-0abcdef1234567890"
  instance_type = "m5.large"
  instance_name = "reserved-group-instance"

  capacity_reservation_specification = {
    capacity_reservation_preference = "open"
    capacity_reservation_target = [{
      capacity_reservation_resource_group_arn = "arn:aws:resource-groups:us-east-1:123456789012:group/my-cr-group"
    }]
  }
}
```

**Capacity Reservation Options:**
- `capacity_reservation_preference`:
  - `open`: Instance can run in any open Capacity Reservation with matching attributes
  - `none`: Instance does not use Capacity Reservations
- `capacity_reservation_target`: Specify a particular reservation or group

### Credit Specification (Burstable Instances)

Configure CPU credit behavior for T2/T3/T3a instances:

```hcl
module "ec2_burstable" {
  source = "path/to/terraform-modules/aws/ec2-instance"

  ami_id        = "ami-0abcdef1234567890"
  instance_type = "t3.medium"
  instance_name = "burstable-instance"

  # Use unlimited credits (charges apply when exceeding baseline)
  credit_specification = {
    cpu_credits = "unlimited"
  }
}
```

**Credit Options:**
| Mode | Description | Best For |
|------|-------------|----------|
| `standard` | Burst above baseline using earned credits only | Cost-conscious, predictable workloads |
| `unlimited` | Burst above baseline, pay for additional usage | Variable workloads requiring consistent performance |

### Nitro Enclaves

Enable AWS Nitro Enclaves for isolated compute environments:

```hcl
module "ec2_enclave" {
  source = "path/to/terraform-modules/aws/ec2-instance"

  ami_id        = "ami-0abcdef1234567890"
  instance_type = "m5.xlarge"  # Must be Nitro-based
  instance_name = "enclave-instance"

  # Enable Nitro Enclaves
  enclave_options = {
    enabled = true
  }
}
```

> **Note:** Nitro Enclaves require Nitro-based instance types and an enclave-enabled AMI.

### CloudWatch Alarms

The module creates two CloudWatch alarms by default:

1. **CPU High Utilization**: Triggers when CPU exceeds threshold
2. **Status Check Failed**: Triggers when instance or system status checks fail

```hcl
module "ec2_monitored" {
  source = "path/to/terraform-modules/aws/ec2-instance"

  ami_id        = "ami-0abcdef1234567890"
  instance_name = "monitored-instance"

  # Enable detailed monitoring (1-minute intervals)
  enable_monitoring = true

  # CPU Alarm Configuration
  alarm_cpu_threshold           = 90                # Alarm at 90% CPU
  cpu_alarm_evaluation_periods  = 3                 # 3 consecutive periods
  cpu_alarm_period              = 300               # 5-minute periods
  cpu_alarm_statistic           = "Average"
  cpu_alarm_description         = "High CPU on production server"
  cpu_alarm_treat_missing_data  = "notBreaching"

  # Status Check Alarm Configuration
  status_check_evaluation_periods = 2
  status_check_period             = 60

  # Alarm Actions (SNS topics, Auto Scaling, etc.)
  alarm_actions = [
    "arn:aws:sns:us-east-1:123456789012:alerts"
  ]
  ok_actions = [
    "arn:aws:sns:us-east-1:123456789012:alerts"
  ]
  insufficient_data_actions = [
    "arn:aws:sns:us-east-1:123456789012:alerts"
  ]
}
```

**Alarm Configuration Options:**
- `alarm_actions_enabled`: Enable/disable alarm actions
- `treat_missing_data`: How to handle gaps (`missing`, `ignore`, `breaching`, `notBreaching`)
- `datapoints_to_alarm`: Number of datapoints that must breach to trigger
- `extended_statistic`: Percentile statistics (e.g., `p99`)

### Secrets Manager (Credential Storage)

Automatically retrieve and store EC2 credentials in AWS Secrets Manager with a single setting. This is particularly useful for Windows instances where you need to retrieve the Administrator password.

**Usage (One Setting Does Everything):**

```hcl
module "windows_server" {
  source = "path/to/terraform-modules/aws/ec2-instance"

  ami_id        = "ami-0abcdef1234567890"  # Windows AMI
  instance_type = "t3.medium"
  instance_name = "windows-server"
  key_name      = "my-key-pair"

  # This single setting:
  # 1. Enables get_password_data on the instance
  # 2. Creates a secret named "windows-server-credentials"
  # 3. Stores instance credentials in Secrets Manager
  store_password_in_secrets_manager = true
}
```

That's it! The secret is automatically named `{instance_name}-credentials`.

**With KMS Encryption (encrypts both EBS and Secrets Manager):**

```hcl
module "windows_server" {
  source = "path/to/terraform-modules/aws/ec2-instance"

  ami_id                            = "ami-0abcdef1234567890"
  instance_name                     = "windows-server"
  store_password_in_secrets_manager = true
  root_volume_encrypted             = true
  kms_key_id                        = "arn:aws:kms:us-east-1:123456789012:key/..."  # Used for both EBS and Secrets Manager
}
```

**Optional: Automatic Rotation (Advanced):**

> **Note:** EC2 Windows passwords require a custom Lambda function to rotate (unlike RDS which has built-in rotation).

```hcl
module "windows_server" {
  source = "path/to/terraform-modules/aws/ec2-instance"

  ami_id                              = "ami-0abcdef1234567890"
  instance_name                       = "windows-server"
  store_password_in_secrets_manager   = true
  secrets_manager_rotation_lambda_arn = aws_lambda_function.rotate_password.arn
  secrets_manager_rotation_days       = 30
}
```

**What Gets Stored:**

The secret contains a JSON object with:
```json
{
  "instance_id": "i-0123456789abcdef0",
  "instance_name": "windows-server",
  "password_data": "Base64-encoded encrypted password",
  "private_ip": "10.0.1.100",
  "public_ip": "52.1.2.3",
  "private_dns": "ip-10-0-1-100.ec2.internal",
  "public_dns": "ec2-52-1-2-3.compute-1.amazonaws.com",
  "key_name": "my-key-pair"
}
```

**Retrieving the Secret:**

```bash
# Get the secret value
aws secretsmanager get-secret-value \
  --secret-id "windows-server-credentials" \
  --query 'SecretString' \
  --output text | jq .

# Decrypt Windows password (requires the private key)
aws secretsmanager get-secret-value \
  --secret-id "windows-server-credentials" \
  --query 'SecretString' \
  --output text | jq -r '.password_data' | base64 -d > encrypted_password.bin

# Decrypt with OpenSSL
openssl rsautl -decrypt -inkey my-key-pair.pem -in encrypted_password.bin
```

**IAM Permissions Required:**

To retrieve the secret, the IAM principal needs:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "arn:aws:secretsmanager:*:*:secret:windows-server-credentials-*"
    }
  ]
}
```

### Complete Example

A production-ready configuration using multiple features:

```hcl
module "production_instance" {
  source = "path/to/terraform-modules/aws/ec2-instance"

  # Instance Configuration
  ami_id                    = "ami-0abcdef1234567890"
  instance_type             = "m5.xlarge"
  instance_name             = "prod-app-server-01"
  subnet_id                 = "subnet-0123456789abcdef0"
  vpc_security_group_ids    = ["sg-0123456789abcdef0", "sg-0987654321fedcba0"]
  key_name                  = "production-key"
  iam_instance_profile      = "production-instance-profile"
  availability_zone         = "us-east-1a"

  # Network Configuration
  associate_public_ip_address = false
  private_ip                  = "10.0.1.100"
  source_dest_check           = true

  # User Data
  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    yum install -y httpd
    systemctl start httpd
    systemctl enable httpd
  EOF

  # Root Volume
  root_volume_type        = "gp3"
  root_volume_size        = 100
  root_volume_iops        = 4000
  root_volume_throughput  = 250
  root_volume_encrypted   = true
  ebs_optimized           = true

  # Instance Protection
  disable_api_termination = true
  disable_api_stop        = false

  # Metadata (IMDSv2)
  metadata_options = {
    http_endpoint               = "enabled"
    http_tokens                 = "required"
    http_put_response_hop_limit = "2"
    instance_metadata_tags      = "enabled"
  }

  # Credit Specification (for T-series)
  # credit_specification = {
  #   cpu_credits = "unlimited"
  # }

  # Monitoring
  enable_monitoring     = true
  alarm_cpu_threshold   = 80
  alarm_actions         = ["arn:aws:sns:us-east-1:123456789012:production-alerts"]
  ok_actions            = ["arn:aws:sns:us-east-1:123456789012:production-alerts"]

  # Tags
  tags = {
    Environment = "production"
    Project     = "my-application"
    Owner       = "platform-team"
    ManagedBy   = "terraform"
  }

  volume_tags = {
    Environment = "production"
    Backup      = "daily"
  }
}
```

## Inputs

### EC2 Instance Variables

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| ami_id | The AMI ID to use for the instance | `string` | n/a | yes |
| instance_type | The type of instance to start | `string` | `"t2.micro"` | no |
| instance_name | Value of the Name tag for the instance | `string` | `"ec2-instance"` | no |
| subnet_id | The VPC Subnet ID to launch in | `string` | `null` | no |
| vpc_security_group_ids | A list of security group IDs to associate with | `list(string)` | `[]` | no |
| key_name | Key name of the Key Pair to use for the instance | `string` | `null` | no |
| iam_instance_profile | IAM Instance Profile to launch the instance with | `string` | `null` | no |
| availability_zone | AZ to start the instance in | `string` | `null` | no |
| associate_public_ip_address | Whether to associate a public IP address | `bool` | `null` | no |
| private_ip | Private IP address to associate with the instance | `string` | `null` | no |
| secondary_private_ips | Secondary private IPv4 addresses | `list(string)` | `null` | no |
| user_data | User data to provide when launching the instance | `string` | `null` | no |
| user_data_base64 | Base64-encoded user data | `string` | `null` | no |
| user_data_replace_on_change | Recreate instance when user_data changes | `bool` | `null` | no |
| ebs_optimized | If true, the instance will be EBS-optimized | `bool` | `null` | no |
| source_dest_check | Controls traffic routing for NAT instances | `bool` | `true` | no |
| disable_api_termination | Enable termination protection | `bool` | `false` | no |
| disable_api_stop | Enable stop protection | `bool` | `false` | no |
| tenancy | Instance tenancy (default, dedicated, host) | `string` | `null` | no |
| host_id | Dedicated host ID | `string` | `null` | no |
| placement_group | Placement group name | `string` | `null` | no |
| hibernation | Enable hibernation support | `bool` | `null` | no |
| instance_initiated_shutdown_behavior | Shutdown behavior (stop, terminate) | `string` | `null` | no |
| get_password_data | Retrieve Windows password data | `bool` | `false` | no |
| ipv6_address_count | Number of IPv6 addresses to assign | `number` | `null` | no |
| ipv6_addresses | Specific IPv6 addresses to assign | `list(string)` | `null` | no |
| tags | A mapping of tags to assign to the resource | `map(string)` | `{}` | no |
| kms_key_id | ARN of KMS key for encryption (EBS volumes, Secrets Manager) | `string` | `null` | no |
| volume_tags | Tags to assign to volumes at launch | `map(string)` | `null` | no |

### Root Volume Variables

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| root_volume_type | Type of root volume (gp2, gp3, io1, io2, st1, sc1) | `string` | `null` | no |
| root_volume_size | Size of the root volume in GiB | `number` | `null` | no |
| root_volume_iops | Provisioned IOPS for root volume | `number` | `null` | no |
| root_volume_throughput | Throughput for root volume in MiB/s (gp3 only) | `number` | `null` | no |
| root_volume_delete_on_termination | Delete root volume on termination | `bool` | `true` | no |
| root_volume_encrypted | Enable root volume encryption | `bool` | `null` | no |
| root_volume_tags | Tags for root volume | `map(string)` | `null` | no |

### Advanced Configuration Variables

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| cpu_options | CPU options (core_count, threads_per_core, amd_sev_snp) | `map(any)` | `null` | no |
| metadata_options | Instance metadata service options | `map(string)` | `{}` | no |
| capacity_reservation_specification | Capacity Reservation targeting | `any` | `null` | no |
| credit_specification | CPU credits for burstable instances | `map(string)` | `null` | no |
| enclave_options | Nitro Enclave options | `map(bool)` | `null` | no |
| maintenance_options | Maintenance options | `map(string)` | `null` | no |
| private_dns_name_options | Private DNS name options | `map(any)` | `null` | no |

### CloudWatch Alarm Variables

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| enable_monitoring | Enable detailed monitoring | `bool` | `false` | no |
| alarm_actions | Actions for ALARM state | `list(string)` | `[]` | no |
| ok_actions | Actions for OK state | `list(string)` | `[]` | no |
| insufficient_data_actions | Actions for INSUFFICIENT_DATA state | `list(string)` | `[]` | no |
| alarm_actions_enabled | Enable alarm actions | `bool` | `true` | no |
| alarm_cpu_threshold | CPU utilization threshold percentage | `number` | `80` | no |
| cpu_alarm_comparison_operator | Comparison operator for CPU alarm | `string` | `"GreaterThanOrEqualToThreshold"` | no |
| cpu_alarm_evaluation_periods | Evaluation periods for CPU alarm | `number` | `2` | no |
| cpu_alarm_period | Period in seconds for CPU alarm | `number` | `120` | no |
| cpu_alarm_statistic | Statistic for CPU alarm | `string` | `"Average"` | no |
| status_check_threshold | Threshold for status check alarm | `number` | `1` | no |
| status_check_evaluation_periods | Evaluation periods for status check | `number` | `2` | no |
| status_check_period | Period in seconds for status check | `number` | `120` | no |

### Secrets Manager Variables (Optional)

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| store_password_in_secrets_manager | Automatically retrieve password and store in Secrets Manager (uses global `kms_key_id` for encryption) | `bool` | `false` | no |
| secrets_manager_rotation_lambda_arn | ARN of Lambda function for automatic rotation | `string` | `null` | no |
| secrets_manager_rotation_days | Days between automatic rotations | `number` | `30` | no |

## Outputs

| Name | Description |
|------|-------------|
| instance_id | The ID of the EC2 instance |
| arn | The ARN of the EC2 instance |
| public_ip | The public IP address of the instance |
| private_ip | The private IP address of the instance |
| public_dns | The public DNS name of the instance |
| private_dns | The private DNS name of the instance |
| availability_zone | The availability zone of the instance |
| primary_network_interface_id | The ID of the primary network interface |
| instance_state | The state of the instance |
| password_data | Encrypted password data (Windows) |
| outpost_arn | The ARN of the Outpost |
| cpu_alarm_arn | The ARN of the CPU alarm |
| cpu_alarm_id | The ID of the CPU alarm |
| status_check_alarm_arn | The ARN of the status check alarm |
| status_check_alarm_id | The ID of the status check alarm |
| secrets_manager_secret_arn | The ARN of the Secrets Manager secret (if enabled) |
| secrets_manager_secret_name | The name of the Secrets Manager secret (if enabled) |
| secrets_manager_secret_id | The ID of the Secrets Manager secret (if enabled) |

## Notes

### AMI Lifecycle

This module includes a lifecycle rule that ignores changes to the AMI ID. This prevents Terraform from attempting to recreate the instance when a new AMI version is released. If you need to update the AMI, you should:

1. Update the `ami_id` variable
2. Run `terraform taint module.<name>.aws_instance.ec2_instance`
3. Run `terraform apply`

### Additional EBS Volumes

This module manages only the root volume. For additional EBS volumes, use a separate EBS volume module with `aws_ebs_volume` and `aws_volume_attachment` resources.

### Security Best Practices

1. **IMDSv2**: Always set `http_tokens = "required"` in `metadata_options`
2. **Encryption**: Enable `root_volume_encrypted` with a customer-managed KMS key
3. **Security Groups**: Use least-privilege security group rules
4. **IAM Roles**: Use instance profiles instead of embedding credentials

## License

MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
