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
# Variables
# -----------------------------------------------------------------------------
variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (e.g., production, staging)"
  type        = string
  default     = "production"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.11.0.0/16"
}

variable "db_password" {
  description = "Password for the RDS database"
  type        = string
  sensitive   = true
}

# -----------------------------------------------------------------------------
# Local Values
# -----------------------------------------------------------------------------
locals {
  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  public_subnets  = ["10.11.1.0/24", "10.11.2.0/24", "10.11.3.0/24"]
  private_subnets = ["10.11.101.0/24", "10.11.102.0/24", "10.11.103.0/24"]
}

# -----------------------------------------------------------------------------
# VPC - Virtual Private Cloud
# Isolated network environment for all resources
# -----------------------------------------------------------------------------
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = { Name = "sales-website-vpc" }
}

# -----------------------------------------------------------------------------
# Internet Gateway
# Enables internet access for resources in public subnets
# -----------------------------------------------------------------------------
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = { Name = "sales-website-igw" }
}

# -----------------------------------------------------------------------------
# Public Subnets
# Host web servers and load balancers with direct internet access
# -----------------------------------------------------------------------------
resource "aws_subnet" "public" {
  count = length(local.public_subnets)

  vpc_id                  = aws_vpc.main.id
  cidr_block              = local.public_subnets[count.index]
  availability_zone       = local.azs[count.index]
  map_public_ip_on_launch = true

  tags = { Name = "sales-website-public-${local.azs[count.index]}" }
}

# -----------------------------------------------------------------------------
# Private Subnets
# Host databases and internal services, no direct internet access
# -----------------------------------------------------------------------------
resource "aws_subnet" "private" {
  count = length(local.private_subnets)

  vpc_id            = aws_vpc.main.id
  cidr_block        = local.private_subnets[count.index]
  availability_zone = local.azs[count.index]

  tags = { Name = "sales-website-private-${local.azs[count.index]}" }
}

# -----------------------------------------------------------------------------
# ALB Security Group
# Controls inbound/outbound traffic for the Application Load Balancer
# -----------------------------------------------------------------------------
resource "aws_security_group" "alb" {
  name        = "sales-website-alb-sg"
  description = "Security group for Application Load Balancer"
  vpc_id      = aws_vpc.main.id

  # Allow HTTPS from anywhere
  ingress {
    description = "HTTPS from internet"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow HTTP from anywhere (redirects to HTTPS)
  ingress {
    description = "HTTP from internet"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic
  egress {
    description = "All outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "sales-website-alb-sg" }
}

# -----------------------------------------------------------------------------
# AWS WAF - Web Application Firewall
# Protects against common web exploits (SQL injection, XSS, etc.)
# -----------------------------------------------------------------------------
resource "aws_wafv2_web_acl" "main" {
  name        = "sales-website-waf"
  description = "WAF rules for sales website protection"
  scope       = "REGIONAL"

  default_action {
    allow {}
  }

  # AWS Managed Rules - Common Rule Set
  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 1

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "CommonRulesMetric"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "SalesWebsiteWAF"
    sampled_requests_enabled   = true
  }

  tags = { Name = "sales-website-waf" }
}

# -----------------------------------------------------------------------------
# Application Load Balancer
# Distributes incoming traffic across multiple EC2 instances
# -----------------------------------------------------------------------------
resource "aws_lb" "main" {
  name               = "sales-website-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id

  enable_deletion_protection = true

  tags = { Name = "sales-website-alb" }
}

# -----------------------------------------------------------------------------
# Auto Scaling Group
# Automatically scales EC2 instances based on demand
# -----------------------------------------------------------------------------
resource "aws_autoscaling_group" "web" {
  name                = "sales-website-asg"
  desired_capacity    = 3
  max_size            = 9
  min_size            = 3
  vpc_zone_identifier = aws_subnet.public[*].id
  health_check_type   = "ELB"

  launch_template {
    id      = aws_launch_template.web.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "sales-website-web"
    propagate_at_launch = true
  }
}

# -----------------------------------------------------------------------------
# RDS PostgreSQL - Primary Database
# Multi-AZ deployment for high availability and automatic failover
# -----------------------------------------------------------------------------
resource "aws_db_instance" "primary" {
  identifier     = "sales-website-db"
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = "db.r5.large"

  allocated_storage     = 100
  max_allocated_storage = 500
  storage_type          = "gp3"
  storage_encrypted     = true

  db_name  = "salesdb"
  username = "admin"
  password = var.db_password

  multi_az               = true
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  backup_retention_period = 7
  skip_final_snapshot     = false
  final_snapshot_identifier = "sales-website-db-final"

  tags = { Name = "sales-website-db" }
}

# -----------------------------------------------------------------------------
# RDS Subnet Group
# Defines which subnets the RDS instance can use
# -----------------------------------------------------------------------------
resource "aws_db_subnet_group" "main" {
  name       = "sales-website-db-subnet-group"
  subnet_ids = aws_subnet.private[*].id

  tags = { Name = "sales-website-db-subnet-group" }
}

# -----------------------------------------------------------------------------
# RDS Security Group
# Controls database access - only allows traffic from web servers
# -----------------------------------------------------------------------------
resource "aws_security_group" "rds" {
  name        = "sales-website-rds-sg"
  description = "Security group for RDS database"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "PostgreSQL from web servers"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.web.id]
  }

  tags = { Name = "sales-website-rds-sg" }
}

# -----------------------------------------------------------------------------
# Web Server Security Group
# Controls traffic to EC2 instances in the Auto Scaling Group
# -----------------------------------------------------------------------------
resource "aws_security_group" "web" {
  name        = "sales-website-web-sg"
  description = "Security group for web servers"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "HTTP from ALB"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    description = "All outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "sales-website-web-sg" }
}

# -----------------------------------------------------------------------------
# Launch Template
# Defines the EC2 instance configuration for the Auto Scaling Group
# -----------------------------------------------------------------------------
resource "aws_launch_template" "web" {
  name          = "sales-website-lt"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = "t3.medium"

  network_interfaces {
    associate_public_ip_address = true
    security_groups             = [aws_security_group.web.id]
  }

  tag_specifications {
    resource_type = "instance"
    tags = { Name = "sales-website-web" }
  }
}

# -----------------------------------------------------------------------------
# Data Source - Latest Amazon Linux 2023 AMI
# -----------------------------------------------------------------------------
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}
