# =============================================================================
# MICROSOFT ENTRA ID (Azure AD) - SSO Configuration
# =============================================================================
# NOTE: The AWS Single-Account Access app is a Microsoft gallery app.
# The Application and Service Principal were created manually in the portal.
# We use data sources to reference them instead of managing them via Terraform.

# -----------------------------------------------------------------------------
# Data Sources
# -----------------------------------------------------------------------------

data "azuread_client_config" "current" {}

# Reference the existing AWS SSO application by display name
data "azuread_application" "aws_sso" {
  count        = var.enable_entra_sso ? 1 : 0
  display_name = "AWS Single-Account Access"
}

# Reference the existing service principal
data "azuread_service_principal" "aws_sso" {
  count     = var.enable_entra_sso ? 1 : 0
  client_id = data.azuread_application.aws_sso[0].client_id
}
