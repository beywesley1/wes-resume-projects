# =============================================================================
# MICROSOFT ENTRA ID (Azure AD) - SSO Configuration
# =============================================================================

# -----------------------------------------------------------------------------
# Data Sources
# -----------------------------------------------------------------------------

data "azuread_client_config" "current" {}

# -----------------------------------------------------------------------------
# Entra ID Application Registration
# -----------------------------------------------------------------------------
# This is the AWS Single-Account Access gallery app from Azure Marketplace

resource "azuread_application" "aws_sso" {
  count = var.enable_entra_sso ? 1 : 0

  display_name     = "AWS Single-Account Access"
  sign_in_audience = "AzureADMyOrg"

  identifier_uris = ["urn:amazon:webservices"]

  web {
    redirect_uris = ["https://signin.aws.amazon.com/saml"]
  }

  lifecycle {
    ignore_changes = [
      # Gallery apps have additional attributes managed by Azure
      owners,
      tags,
      feature_tags,
    ]
  }
}

# -----------------------------------------------------------------------------
# Entra ID Service Principal (Enterprise Application)
# -----------------------------------------------------------------------------

resource "azuread_service_principal" "aws_sso" {
  count = var.enable_entra_sso ? 1 : 0

  client_id                     = azuread_application.aws_sso[0].client_id
  app_role_assignment_required  = true
  preferred_single_sign_on_mode = "saml"

  lifecycle {
    ignore_changes = [
      # Gallery apps have additional attributes managed by Azure
      owners,
      tags,
      feature_tags,
    ]
  }
}
