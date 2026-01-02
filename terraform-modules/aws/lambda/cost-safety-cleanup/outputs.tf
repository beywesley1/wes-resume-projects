# Lambda identifiers (useful for manual testing / log discovery)

output "lambda_function_name" {
  value = aws_lambda_function.this.function_name
}

output "lambda_function_arn" {
  value = aws_lambda_function.this.arn
}

# Scheduler ARN (useful for validation and troubleshooting)

output "event_rule_arn" {
  value = aws_scheduler_schedule.schedule.arn
}
