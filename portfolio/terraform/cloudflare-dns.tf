# =============================================================================
# CLOUDFLARE DNS RECORDS
# =============================================================================

# -----------------------------------------------------------------------------
# ACM Certificate Validation Records
# -----------------------------------------------------------------------------

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
  proxied = false # Must be false for ACM validation
}

# -----------------------------------------------------------------------------
# Website DNS Records
# -----------------------------------------------------------------------------

# Apex domain (beyops.com) -> CloudFront
resource "cloudflare_record" "apex" {
  zone_id = var.cloudflare_zone_id
  name    = "@"
  content = aws_cloudfront_distribution.website.domain_name
  type    = "CNAME"
  ttl     = 1 # Auto TTL
  proxied = false # Must be false to use CloudFront SSL
  comment = "Portfolio website - CloudFront distribution"
}

# WWW subdomain -> CloudFront
resource "cloudflare_record" "www" {
  count   = var.create_www_redirect ? 1 : 0
  zone_id = var.cloudflare_zone_id
  name    = "www"
  content = aws_cloudfront_distribution.website.domain_name
  type    = "CNAME"
  ttl     = 1 # Auto TTL
  proxied = false # Must be false to use CloudFront SSL
  comment = "Portfolio website - WWW redirect"
}
