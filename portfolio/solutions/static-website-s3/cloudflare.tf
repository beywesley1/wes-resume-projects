# =============================================================================
# CloudFlare - DNS Configuration
# =============================================================================

# -----------------------------------------------------------------------------
# DNS Record - Point domain to CloudFront
# -----------------------------------------------------------------------------
resource "cloudflare_record" "website" {
  zone_id = var.cloudflare_zone_id
  name    = var.subdomain != "" ? var.subdomain : "@"
  content = aws_cloudfront_distribution.website.domain_name
  type    = "CNAME"
  ttl     = 1
  proxied = false  # CloudFront handles CDN, CloudFlare DNS only

  comment = "Points to CloudFront distribution"
}

# Apex domain record (for redirect or direct access)
resource "cloudflare_record" "apex" {
  count   = var.subdomain != "" ? 1 : 0
  zone_id = var.cloudflare_zone_id
  name    = "@"
  content = aws_cloudfront_distribution.website.domain_name
  type    = "CNAME"
  ttl     = 1
  proxied = false

  comment = "Apex domain pointing to CloudFront"
}

# -----------------------------------------------------------------------------
# Zone Settings
# -----------------------------------------------------------------------------
resource "cloudflare_zone_settings_override" "website" {
  zone_id = var.cloudflare_zone_id

  settings {
    ssl                      = "full"
    always_use_https         = "on"
    min_tls_version          = "1.2"
    automatic_https_rewrites = "on"
  }
}
