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
# -----------------------------------------------------------------------------
resource "cloudflare_record" "root" {
  zone_id = var.cloudflare_zone_id
  name    = "@"
  content = aws_lb.main.dns_name
  type    = "CNAME"
  proxied = true
  ttl     = 1  # Auto when proxied

  comment = "Root domain pointing to ALB"
}

resource "cloudflare_record" "www" {
  zone_id = var.cloudflare_zone_id
  name    = "www"
  content = aws_lb.main.dns_name
  type    = "CNAME"
  proxied = true
  ttl     = 1

  comment = "WWW subdomain pointing to ALB"
}

# -----------------------------------------------------------------------------
# Redirect Rule - www to root (CloudFlare v4 syntax)
# -----------------------------------------------------------------------------
resource "cloudflare_ruleset" "redirect_www" {
  zone_id     = var.cloudflare_zone_id
  name        = "Redirect www to root"
  description = "Redirect www subdomain to root domain"
  kind        = "zone"
  phase       = "http_request_dynamic_redirect"

  rules {
    action = "redirect"
    action_parameters {
      from_value {
        status_code = 301
        target_url {
          expression = "concat(\"https://${var.domain_name}\", http.request.uri.path)"
        }
      }
    }
    expression  = "(http.host eq \"www.${var.domain_name}\")"
    description = "Redirect www to root domain"
    enabled     = true
  }
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

# -----------------------------------------------------------------------------
# Rate Limiting Rule (CloudFlare v4 syntax)
# -----------------------------------------------------------------------------
resource "cloudflare_ruleset" "rate_limit" {
  zone_id     = var.cloudflare_zone_id
  name        = "Rate limiting rules"
  description = "Rate limit sensitive endpoints"
  kind        = "zone"
  phase       = "http_ratelimit"

  rules {
    action = "block"
    ratelimit {
      characteristics     = ["ip.src"]
      period              = 60
      requests_per_period = 10
    }
    expression  = "(http.request.uri.path contains \"/api/login\")"
    description = "Rate limit login attempts"
    enabled     = true
  }
}
