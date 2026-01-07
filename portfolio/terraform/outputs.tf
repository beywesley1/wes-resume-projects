# =============================================================================
# OUTPUTS
# =============================================================================

# -----------------------------------------------------------------------------
# Website Outputs
# -----------------------------------------------------------------------------

output "website_url" {
  description = "Website URL"
  value       = "https://${var.domain_name}"
}

output "s3_bucket_name" {
  description = "S3 bucket name for uploading content"
  value       = aws_s3_bucket.website.id
}

# -----------------------------------------------------------------------------
# CloudFront Outputs
# -----------------------------------------------------------------------------

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID (for cache invalidation)"
  value       = aws_cloudfront_distribution.website.id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.website.domain_name
}

# -----------------------------------------------------------------------------
# Entra ID SSO Outputs
# -----------------------------------------------------------------------------

output "entra_tenant_id" {
  description = "Microsoft Entra ID Tenant ID"
  value       = data.azuread_client_config.current.tenant_id
}

output "entra_app_id" {
  description = "Entra ID Application (Client) ID"
  value       = var.enable_entra_sso ? data.azuread_application.aws_sso[0].client_id : null
}

output "entra_sso_provider_arn" {
  description = "ARN of the SAML Identity Provider"
  value       = var.enable_entra_sso ? aws_iam_saml_provider.entra_id[0].arn : null
}

output "entra_sso_role_arn" {
  description = "ARN of the IAM Role for federated users"
  value       = var.enable_entra_sso ? aws_iam_role.entra_sso_role[0].arn : null
}

output "entra_claims_value" {
  description = "Value for the Role attribute in Entra ID (Provider ARN,Role ARN)"
  value       = var.enable_entra_sso ? "${aws_iam_saml_provider.entra_id[0].arn},${aws_iam_role.entra_sso_role[0].arn}" : null
}

output "entra_sso_login_url" {
  description = "URL for users to initiate SSO login to AWS"
  value       = var.enable_entra_sso ? "https://myapps.microsoft.com/signin/${data.azuread_application.aws_sso[0].client_id}?tenantId=${data.azuread_client_config.current.tenant_id}" : null
}

# -----------------------------------------------------------------------------
# Deployment Helper
# -----------------------------------------------------------------------------

output "deploy_command" {
  description = "Command to deploy website content"
  value       = <<-EOT

    # Build and deploy:
    cd ../
    npm run build
    aws s3 sync dist/ s3://${aws_s3_bucket.website.id} --delete
    aws cloudfront create-invalidation --distribution-id ${aws_cloudfront_distribution.website.id} --paths "/*"

  EOT
}

