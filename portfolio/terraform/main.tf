# ============================================================================
# PORTFOLIO WEBSITE INFRASTRUCTURE
# S3 + CloudFront + Cloudflare DNS + ACM
# Domain: beyops.com
# ============================================================================

terraform {
  required_version = ">= 1.5.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
  
  # Terraform Cloud backend - update organization name
  cloud {
    organization = "wes-resume-projects"
    
    workspaces {
      name = "wes-portfolio"
    }
  }
}

# ============================================================================
# PROVIDERS
# ============================================================================

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "portfolio"
      ManagedBy   = "terraform"
      Environment = "production"
    }
  }
}

# ACM certificates for CloudFront must be in us-east-1
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
  
  default_tags {
    tags = {
      Project     = "portfolio"
      ManagedBy   = "terraform"
      Environment = "production"
    }
  }
}

# Cloudflare provider for DNS management
provider "cloudflare" {
  # API token set via CLOUDFLARE_API_TOKEN environment variable
}

# ============================================================================
# VARIABLES
# ============================================================================

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "domain_name" {
  description = "Domain name for the website"
  type        = string
  default     = "beyops.com"
}

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID for the domain"
  type        = string
  # Set this in Terraform Cloud as a variable
}

variable "create_www_redirect" {
  description = "Create www subdomain redirect to apex"
  type        = bool
  default     = true
}



# ============================================================================
# S3 BUCKET - Website Content
# ============================================================================

resource "aws_s3_bucket" "website" {
  bucket = var.domain_name
}

resource "aws_s3_bucket_public_access_block" "website" {
  bucket = aws_s3_bucket.website.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "website" {
  bucket = aws_s3_bucket.website.id
  
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "website" {
  bucket = aws_s3_bucket.website.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# ============================================================================
# CLOUDFRONT ORIGIN ACCESS CONTROL
# ============================================================================

resource "aws_cloudfront_origin_access_control" "website" {
  name                              = "${var.domain_name}-oac"
  description                       = "OAC for ${var.domain_name}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# ============================================================================
# S3 BUCKET POLICY - Allow CloudFront access
# ============================================================================

resource "aws_s3_bucket_policy" "website" {
  bucket = aws_s3_bucket.website.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontServicePrincipal"
        Effect    = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.website.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.website.arn
          }
        }
      }
    ]
  })
}

# ============================================================================
# ACM CERTIFICATE
# ============================================================================

resource "aws_acm_certificate" "website" {
  provider          = aws.us_east_1
  domain_name       = var.domain_name
  validation_method = "DNS"
  
  subject_alternative_names = var.create_www_redirect ? ["www.${var.domain_name}"] : []

  lifecycle {
    create_before_destroy = true
  }
}

# Create DNS validation records in Cloudflare
resource "cloudflare_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.website.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id = var.cloudflare_zone_id
  name    = each.value.name
  content = each.value.record
  type    = each.value.type
  ttl     = 60
  proxied = false  # Must be false for ACM validation
}

resource "aws_acm_certificate_validation" "website" {
  provider        = aws.us_east_1
  certificate_arn = aws_acm_certificate.website.arn
  
  # Wait for Cloudflare DNS records to propagate
  depends_on = [cloudflare_record.cert_validation]
}

# ============================================================================
# CLOUDFRONT DISTRIBUTION
# ============================================================================

resource "aws_cloudfront_distribution" "website" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  aliases             = var.create_www_redirect ? [var.domain_name, "www.${var.domain_name}"] : [var.domain_name]
  price_class         = "PriceClass_100"  # US, Canada, Europe only - cheapest
  comment             = "${var.domain_name} portfolio website"
  
  origin {
    domain_name              = aws_s3_bucket.website.bucket_regional_domain_name
    origin_id                = "S3-${var.domain_name}"
    origin_access_control_id = aws_cloudfront_origin_access_control.website.id
  }
  
  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${var.domain_name}"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    
    # Managed cache policy: CachingOptimized
    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6"
  }
  
  # Handle SPA routing - return index.html for 403/404
  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }
  
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }
  
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  
  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.website.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
  
  depends_on = [aws_acm_certificate_validation.website]
}

# ============================================================================
# CLOUDFLARE DNS RECORDS
# ============================================================================

# Apex domain (beyops.com) -> CloudFront
resource "cloudflare_record" "apex" {
  zone_id = var.cloudflare_zone_id
  name    = "@"
  content = aws_cloudfront_distribution.website.domain_name
  type    = "CNAME"
  ttl     = 1  # Auto TTL
  proxied = false  # Must be false to use CloudFront SSL
  comment = "Portfolio website - CloudFront distribution"
}

# WWW subdomain -> CloudFront
resource "cloudflare_record" "www" {
  count   = var.create_www_redirect ? 1 : 0
  zone_id = var.cloudflare_zone_id
  name    = "www"
  content = aws_cloudfront_distribution.website.domain_name
  type    = "CNAME"
  ttl     = 1  # Auto TTL
  proxied = false  # Must be false to use CloudFront SSL
  comment = "Portfolio website - WWW redirect"
}

# ============================================================================
# OUTPUTS
# ============================================================================

output "website_url" {
  description = "Website URL"
  value       = "https://${var.domain_name}"
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID (for cache invalidation)"
  value       = aws_cloudfront_distribution.website.id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.website.domain_name
}

output "s3_bucket_name" {
  description = "S3 bucket name for uploading content"
  value       = aws_s3_bucket.website.id
}

output "deploy_command" {
  description = "Command to deploy website content"
  value = <<-EOT
    
    # Build and deploy:
    cd ../
    npm run build
    aws s3 sync dist/ s3://${aws_s3_bucket.website.id} --delete
    aws cloudfront create-invalidation --distribution-id ${aws_cloudfront_distribution.website.id} --paths "/*"
    
  EOT
}
