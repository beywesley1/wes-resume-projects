# =============================================================================
# CloudFlare - DNS and CDN Configuration
# =============================================================================

# -----------------------------------------------------------------------------
# Variables for CloudFlare
# -----------------------------------------------------------------------------
variable "cloudflare_api_token" {
  description = "CloudFlare API token for authentication"
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "CloudFlare Zone ID for the domain"
  type        = string
}

variable "domain_name" {
  description = "Primary domain name for the website"
  type        = string
  default     = "sales-website.com"
}

# -----------------------------------------------------------------------------
# CloudFlare Provider
# -----------------------------------------------------------------------------
terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# -----------------------------------------------------------------------------
# DNS Records - Point domain to ALB
# CNAME records proxy traffic through CloudFlare for DDoS protection
# -----------------------------------------------------------------------------
resource "cloudflare_record" "root" {
  zone_id = var.cloudflare_zone_id
  name    = "@"
  content = aws_lb.main.dns_name
  type    = "CNAME"
  proxied = true
  ttl     = 1

  comment = "Root domain pointing to ALB"
}

resource "cloudflare_record" "www" {
  zone_id = var.cloudflare_zone_id
  name    = "www"
  content = var.domain_name
  type    = "CNAME"
  proxied = true
  ttl     = 1

  comment = "WWW redirects to root domain"
}

# -----------------------------------------------------------------------------
# Zone Settings - SSL/TLS and Security
# -----------------------------------------------------------------------------
resource "cloudflare_zone_settings_override" "security" {
  zone_id = var.cloudflare_zone_id

  settings {
    ssl                      = "full_strict"
    always_use_https         = "on"
    min_tls_version          = "1.2"
    automatic_https_rewrites = "on"
    brotli                   = "on"
    browser_cache_ttl        = 14400
  }
}
