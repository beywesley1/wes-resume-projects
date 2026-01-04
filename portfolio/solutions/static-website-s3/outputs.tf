# =============================================================================
# Outputs - Static Website Infrastructure
# =============================================================================

# -----------------------------------------------------------------------------
# S3 Outputs
# -----------------------------------------------------------------------------
output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.website.id
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.website.arn
}

output "s3_bucket_regional_domain" {
  description = "Regional domain name of the S3 bucket"
  value       = aws_s3_bucket.website.bucket_regional_domain_name
}

# -----------------------------------------------------------------------------
# CloudFront Outputs
# -----------------------------------------------------------------------------
output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.website.id
}

output "cloudfront_distribution_arn" {
  description = "CloudFront distribution ARN"
  value       = aws_cloudfront_distribution.website.arn
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.website.domain_name
}

# -----------------------------------------------------------------------------
# Website URLs
# -----------------------------------------------------------------------------
output "website_url" {
  description = "Primary website URL"
  value       = "https://${var.subdomain != "" ? "${var.subdomain}." : ""}${var.domain_name}"
}

output "cloudfront_url" {
  description = "Direct CloudFront URL"
  value       = "https://${aws_cloudfront_distribution.website.domain_name}"
}

# -----------------------------------------------------------------------------
# Certificate Outputs
# -----------------------------------------------------------------------------
output "certificate_arn" {
  description = "ACM certificate ARN"
  value       = aws_acm_certificate.website.arn
}

output "certificate_status" {
  description = "ACM certificate status"
  value       = aws_acm_certificate.website.status
}
