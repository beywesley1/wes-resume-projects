# =============================================================================
# ACM - SSL/TLS Certificate
# =============================================================================

# -----------------------------------------------------------------------------
# ACM Certificate (must be in us-east-1 for CloudFront)
# -----------------------------------------------------------------------------
resource "aws_acm_certificate" "website" {
  provider          = aws.us_east_1
  domain_name       = var.subdomain != "" ? "${var.subdomain}.${var.domain_name}" : var.domain_name
  validation_method = "DNS"

  subject_alternative_names = var.subdomain != "" ? [var.domain_name] : []

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name = "${local.project_name}-certificate"
  }
}

# -----------------------------------------------------------------------------
# DNS Validation via CloudFlare
# -----------------------------------------------------------------------------
resource "cloudflare_record" "acm_validation" {
  for_each = {
    for dvo in aws_acm_certificate.website.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id = var.cloudflare_zone_id
  name    = trimsuffix(each.value.name, ".${var.domain_name}.")
  content = trimsuffix(each.value.record, ".")
  type    = each.value.type
  ttl     = 60
  proxied = false

  comment = "ACM certificate validation for ${each.key}"
}

# -----------------------------------------------------------------------------
# Wait for Certificate Validation
# -----------------------------------------------------------------------------
resource "aws_acm_certificate_validation" "website" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.website.arn
  validation_record_fqdns = [for record in cloudflare_record.acm_validation : record.hostname]
}
