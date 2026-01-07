# =============================================================================
# AWS ACM - SSL/TLS Certificate
# =============================================================================

# -----------------------------------------------------------------------------
# ACM Certificate
# -----------------------------------------------------------------------------
# Must be in us-east-1 for CloudFront

resource "aws_acm_certificate" "website" {
  provider          = aws.us_east_1
  domain_name       = var.domain_name
  validation_method = "DNS"

  subject_alternative_names = var.create_www_redirect ? ["www.${var.domain_name}"] : []

  lifecycle {
    create_before_destroy = true
  }
}

# -----------------------------------------------------------------------------
# ACM Certificate Validation
# -----------------------------------------------------------------------------

resource "aws_acm_certificate_validation" "website" {
  provider        = aws.us_east_1
  certificate_arn = aws_acm_certificate.website.arn

  # Wait for Cloudflare DNS records to propagate
  depends_on = [cloudflare_record.cert_validation]
}
