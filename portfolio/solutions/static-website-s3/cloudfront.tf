# =============================================================================
# CloudFront - CDN Distribution
# =============================================================================

# -----------------------------------------------------------------------------
# Origin Access Control (OAC) for S3
# -----------------------------------------------------------------------------
resource "aws_cloudfront_origin_access_control" "website" {
  name                              = "${local.project_name}-oac"
  description                       = "OAC for ${local.project_name} S3 bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# -----------------------------------------------------------------------------
# CloudFront Distribution
# -----------------------------------------------------------------------------
resource "aws_cloudfront_distribution" "website" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${local.project_name} - Static Website Distribution"
  default_root_object = var.default_root_object
  price_class         = var.price_class
  http_version        = "http2and3"

  # Domain aliases
  aliases = [
    var.subdomain != "" ? "${var.subdomain}.${var.domain_name}" : var.domain_name
  ]

  # S3 Origin Configuration
  origin {
    domain_name              = aws_s3_bucket.website.bucket_regional_domain_name
    origin_id                = "S3-${aws_s3_bucket.website.id}"
    origin_access_control_id = aws_cloudfront_origin_access_control.website.id
  }

  # Default Cache Behavior
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.website.id}"

    # Use managed cache policy for static content
    cache_policy_id          = data.aws_cloudfront_cache_policy.caching_optimized.id
    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.cors_s3.id

    viewer_protocol_policy = "redirect-to-https"
    compress               = true
  }

  # Cache behavior for static assets (longer TTL)
  ordered_cache_behavior {
    path_pattern     = "/assets/*"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.website.id}"

    cache_policy_id = data.aws_cloudfront_cache_policy.caching_optimized.id

    viewer_protocol_policy = "redirect-to-https"
    compress               = true
  }

  # Custom Error Response for SPA routing
  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = var.custom_error_response_page
    error_caching_min_ttl = 10
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = var.custom_error_response_page
    error_caching_min_ttl = 10
  }

  # Geo Restrictions (none by default)
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # SSL/TLS Configuration
  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.website.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  # Wait for S3 bucket to be ready
  depends_on = [aws_s3_bucket.website]

  tags = {
    Name = "${local.project_name}-distribution"
  }
}

# -----------------------------------------------------------------------------
# CloudFront Function for Security Headers
# -----------------------------------------------------------------------------
resource "aws_cloudfront_function" "security_headers" {
  name    = "${local.project_name}-security-headers"
  runtime = "cloudfront-js-2.0"
  comment = "Add security headers to responses"
  publish = true

  code = <<-EOF
    function handler(event) {
      var response = event.response;
      var headers = response.headers;

      // Security headers
      headers['strict-transport-security'] = { value: 'max-age=31536000; includeSubdomains; preload' };
      headers['x-content-type-options'] = { value: 'nosniff' };
      headers['x-frame-options'] = { value: 'DENY' };
      headers['x-xss-protection'] = { value: '1; mode=block' };
      headers['referrer-policy'] = { value: 'strict-origin-when-cross-origin' };

      return response;
    }
  EOF
}
