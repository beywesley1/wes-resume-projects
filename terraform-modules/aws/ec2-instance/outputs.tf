#------------------------------------------------------------------------------
# EC2 Instance Outputs
#------------------------------------------------------------------------------

output "instance_id" {
  description = "The ID of the EC2 instance"
  value       = aws_instance.ec2_instance.id
}

output "arn" {
  description = "The ARN of the EC2 instance"
  value       = aws_instance.ec2_instance.arn
}

output "public_ip" {
  description = "The public IP address of the EC2 instance"
  value       = aws_instance.ec2_instance.public_ip
}

output "private_ip" {
  description = "The private IP address of the EC2 instance"
  value       = aws_instance.ec2_instance.private_ip
}

output "public_dns" {
  description = "The public DNS name assigned to the instance"
  value       = aws_instance.ec2_instance.public_dns
}

output "private_dns" {
  description = "The private DNS name assigned to the instance"
  value       = aws_instance.ec2_instance.private_dns
}

output "availability_zone" {
  description = "The availability zone of the instance"
  value       = aws_instance.ec2_instance.availability_zone
}

output "primary_network_interface_id" {
  description = "The ID of the instance's primary network interface"
  value       = aws_instance.ec2_instance.primary_network_interface_id
}

output "instance_state" {
  description = "The state of the instance"
  value       = aws_instance.ec2_instance.instance_state
}

output "password_data" {
  description = "Base-64 encoded encrypted password data for the instance (Windows)"
  value       = aws_instance.ec2_instance.password_data
}

output "outpost_arn" {
  description = "The ARN of the Outpost the instance is assigned to"
  value       = aws_instance.ec2_instance.outpost_arn
}

#------------------------------------------------------------------------------
# CloudWatch Alarm Outputs
#------------------------------------------------------------------------------

output "cpu_alarm_arn" {
  description = "The ARN of the CPU high utilization alarm"
  value       = aws_cloudwatch_metric_alarm.cpu_high.arn
}

output "cpu_alarm_id" {
  description = "The ID of the CPU high utilization alarm"
  value       = aws_cloudwatch_metric_alarm.cpu_high.id
}

output "status_check_alarm_arn" {
  description = "The ARN of the status check failed alarm"
  value       = aws_cloudwatch_metric_alarm.status_check_failed.arn
}

output "status_check_alarm_id" {
  description = "The ID of the status check failed alarm"
  value       = aws_cloudwatch_metric_alarm.status_check_failed.id
}

#------------------------------------------------------------------------------
# Secrets Manager Outputs (Optional)
#------------------------------------------------------------------------------

output "secrets_manager_secret_arn" {
  description = "The ARN of the Secrets Manager secret containing EC2 credentials"
  value       = var.store_password_in_secrets_manager ? aws_secretsmanager_secret.ec2_credentials[0].arn : null
}

output "secrets_manager_secret_name" {
  description = "The name of the Secrets Manager secret containing EC2 credentials"
  value       = var.store_password_in_secrets_manager ? aws_secretsmanager_secret.ec2_credentials[0].name : null
}

output "secrets_manager_secret_id" {
  description = "The ID of the Secrets Manager secret containing EC2 credentials"
  value       = var.store_password_in_secrets_manager ? aws_secretsmanager_secret.ec2_credentials[0].id : null
}
