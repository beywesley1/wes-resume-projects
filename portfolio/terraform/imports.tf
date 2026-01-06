# =============================================================================
# TERRAFORM IMPORT BLOCKS
# =============================================================================
# Import existing resources created manually in Azure Portal
# These blocks will import resources on the next terraform apply
# After successful import, these blocks can be removed

# -----------------------------------------------------------------------------
# Import Existing Entra ID Application Registration
# -----------------------------------------------------------------------------
# Find this ID in Azure Portal:
# Entra ID -> App registrations -> Your App -> Object ID (not Application ID)

import {
  to = azuread_application.aws_sso[0]
  id = "33c70962-082a-4027-a2b5-c5933f7cdf68"
}

# -----------------------------------------------------------------------------
# Import Existing Entra ID Service Principal (Enterprise Application)
# -----------------------------------------------------------------------------
# Find this ID in Azure Portal:
# Entra ID -> Enterprise applications -> Your App -> Object ID

import {
  to = azuread_service_principal.aws_sso[0]
  id = "33c70962-082a-4027-a2b5-c5933f7cdf68"
}
