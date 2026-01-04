# =============================================================================
# AWS Sales Website Infrastructure - Terraform Configuration
# Production-ready with WAF, Shield, ALB, ASG, and RDS Multi-AZ
# =============================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Remote state storage in S3 with DynamoDB locking
  backend "s3" {
    bucket         = "sales-website-tfstate"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

# -----------------------------------------------------------------------------
# Provider Configuration
# -----------------------------------------------------------------------------
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = "sales-website"
      ManagedBy   = "terraform"
    }
  }
}

# -----------------------------------------------------------------------------
# Local Values
# -----------------------------------------------------------------------------
locals {
  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  public_subnets  = ["10.11.1.0/24", "10.11.2.0/24", "10.11.3.0/24"]
  private_subnets = ["10.11.101.0/24", "10.11.102.0/24", "10.11.103.0/24"]
}
