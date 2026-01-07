# =============================================================================
# Variables - Static Website Infrastructure
# =============================================================================

# -----------------------------------------------------------------------------
# AWS Configuration
# -----------------------------------------------------------------------------
variable "aws_region" {
  description = "AWS region for S3 bucket"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "prod"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

# -----------------------------------------------------------------------------
# Domain Configuration
# -----------------------------------------------------------------------------
variable "domain_name" {
  description = "Primary domain name for the website"
  type        = string
  default     = "example.com"
}

variable "subdomain" {
  description = "Subdomain for the website (leave empty for apex domain)"
  type        = string
  default     = "www"
}

# -----------------------------------------------------------------------------
# CloudFlare Configuration
# -----------------------------------------------------------------------------
variable "cloudflare_api_token" {
  description = "CloudFlare API token for DNS management"
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "CloudFlare Zone ID for the domain"
  type        = string
}

# -----------------------------------------------------------------------------
# CloudFront Configuration
# -----------------------------------------------------------------------------
variable "price_class" {
  description = "CloudFront price class (PriceClass_All, PriceClass_200, PriceClass_100)"
  type        = string
  default     = "PriceClass_100"

  validation {
    condition     = contains(["PriceClass_All", "PriceClass_200", "PriceClass_100"], var.price_class)
    error_message = "Price class must be PriceClass_All, PriceClass_200, or PriceClass_100."
  }
}

variable "default_root_object" {
  description = "Default root object for CloudFront distribution"
  type        = string
  default     = "index.html"
}

variable "custom_error_response_page" {
  description = "Custom error page for 404 errors (SPA routing)"
  type        = string
  default     = "/index.html"
}

# -----------------------------------------------------------------------------
# S3 Configuration
# -----------------------------------------------------------------------------
variable "force_destroy" {
  description = "Allow destruction of S3 bucket with objects"
  type        = bool
  default     = false
}

variable "versioning_enabled" {
  description = "Enable versioning on S3 bucket"
  type        = bool
  default     = true
}
