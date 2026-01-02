data "aws_caller_identity" "current" {}

data "aws_partition" "current" {}

data "aws_region" "current" {}

locals {
  # Name prefix for all resources created by this module.
  lambda_name = "${var.name}-cost-safety-cleanup"
}

# Package Lambda source code into a zip for deployment.
# Note: This relies on local build artifacts, so Terraform runs should happen from a workstation/CI runner.

data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/src"
  output_path = "${path.module}/build/lambda.zip"
}

# Lambda execution role.
# This role grants the Lambda permissions to discover and delete resources.
resource "aws_iam_role" "lambda" {
  name = "${local.lambda_name}-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# Inline policy for the Lambda execution role.
# This is intentionally broad because the Lambda enumerates and deletes resources across regions.
# Use `allowed_account_ids`, `dry_run`, and the keep tag to ensure safe operation.
resource "aws_iam_role_policy" "lambda" {
  name = "${local.lambda_name}-policy"
  role = aws_iam_role.lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Logs"
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "*"
      },
      {
        Sid    = "EC2"
        Effect = "Allow"
        Action = [
          "ec2:DescribeRegions",
          "ec2:DescribeInstances",
          "ec2:TerminateInstances",
          "ec2:DescribeVolumes",
          "ec2:DetachVolume",
          "ec2:DeleteVolume",
          "ec2:DescribeTags"
        ]
        Resource = "*"
      },
      {
        Sid    = "ECS"
        Effect = "Allow"
        Action = [
          "ecs:ListClusters",
          "ecs:DescribeClusters",
          "ecs:ListServices",
          "ecs:DescribeServices",
          "ecs:UpdateService",
          "ecs:DeleteService",
          "ecs:ListTasks",
          "ecs:DescribeTasks",
          "ecs:StopTask",
          "ecs:ListTagsForResource"
        ]
        Resource = "*"
      },
      {
        Sid    = "EKS"
        Effect = "Allow"
        Action = [
          "eks:ListClusters",
          "eks:DescribeCluster",
          "eks:ListNodegroups",
          "eks:DescribeNodegroup",
          "eks:DeleteNodegroup",
          "eks:DeleteCluster",
          "eks:ListTagsForResource"
        ]
        Resource = "*"
      }
    ]
  })
}

# The cost safety cleanup Lambda.
# It uses env vars for guardrails and behavior switches.
resource "aws_lambda_function" "this" {
  function_name = local.lambda_name
  role          = aws_iam_role.lambda.arn
  handler       = "lambda_function.lambda_handler"
  runtime       = "python3.11"

  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  timeout     = var.lambda_timeout
  memory_size = var.lambda_memory_size

  environment {
    variables = {
      # Guardrail: refuse to run unless current account is allowlisted.
      ALLOWED_ACCOUNT_IDS = join(",", var.allowed_account_ids)

      # Opt-out: anything tagged keep_tag_key=keep_tag_value will be skipped.
      KEEP_TAG_KEY        = var.keep_tag_key
      KEEP_TAG_VALUE      = var.keep_tag_value

      # Safety switch: log actions only.
      DRY_RUN             = tostring(var.dry_run)

      # Optional: limit scanning to these regions (CSV). Empty means "all enabled regions".
      TARGET_REGIONS      = join(",", var.target_regions)
    }
  }
}

# EventBridge Scheduler invoke role.
# EventBridge Scheduler assumes this role in order to invoke the Lambda.
resource "aws_iam_role" "scheduler" {
  name = "${local.lambda_name}-scheduler-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "scheduler.amazonaws.com"
        }
      }
    ]
  })
}

# Scheduler role policy allowing invocation of the Lambda.
resource "aws_iam_role_policy" "scheduler" {
  name = "${local.lambda_name}-scheduler-policy"
  role = aws_iam_role.scheduler.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "InvokeLambda"
        Effect = "Allow"
        Action = [
          "lambda:InvokeFunction"
        ]
        Resource = aws_lambda_function.this.arn
      }
    ]
  })
}

# EventBridge Scheduler schedule.
# This is timezone-aware (handles DST) when `schedule_expression_timezone` is set.
resource "aws_scheduler_schedule" "schedule" {
  name                         = "${local.lambda_name}-schedule"
  schedule_expression          = var.schedule_expression
  schedule_expression_timezone = var.schedule_timezone

  flexible_time_window {
    mode = "OFF"
  }

  target {
    arn      = aws_lambda_function.this.arn
    role_arn = aws_iam_role.scheduler.arn
  }
}

# Allow EventBridge Scheduler to invoke the Lambda.
resource "aws_lambda_permission" "allow_scheduler" {
  statement_id  = "AllowExecutionFromScheduler"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.this.function_name
  principal     = "scheduler.amazonaws.com"
  source_arn    = aws_scheduler_schedule.schedule.arn
}
