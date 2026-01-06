# =============================================================================
# AWS IAM - Entra ID SSO Resources
# =============================================================================

# -----------------------------------------------------------------------------
# SAML Identity Provider
# -----------------------------------------------------------------------------
# Establishes trust between AWS and Microsoft Entra ID

resource "aws_iam_saml_provider" "entra_id" {
  count = var.enable_entra_sso ? 1 : 0

  name                   = "EntraID-SSO"
  saml_metadata_document = file("${path.module}/entra-metadata.xml")

  tags = {
    Name        = "EntraID-SSO"
    Description = "Microsoft Entra ID SAML provider for AWS Console SSO"
  }
}

# -----------------------------------------------------------------------------
# IAM Role for Federated Access
# -----------------------------------------------------------------------------
# Users authenticated via Entra ID will assume this role

resource "aws_iam_role" "entra_sso_role" {
  count = var.enable_entra_sso ? 1 : 0

  name        = var.entra_sso_role_name
  description = "IAM role for Microsoft Entra ID federated users"

  # Maximum session duration (1 hour default)
  max_session_duration = var.entra_sso_session_duration

  # Trust policy allowing SAML federation
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = aws_iam_saml_provider.entra_id[0].arn
        }
        Action = "sts:AssumeRoleWithSAML"
        Condition = {
          StringEquals = {
            "SAML:aud" = "https://signin.aws.amazon.com/saml"
          }
        }
      }
    ]
  })

  tags = {
    Name        = var.entra_sso_role_name
    Description = "Entra ID SSO Admin Role"
  }
}

# -----------------------------------------------------------------------------
# IAM Policy Attachment
# -----------------------------------------------------------------------------
# Attach policies to define what federated users can do

resource "aws_iam_role_policy_attachment" "entra_sso_admin" {
  count = var.enable_entra_sso ? 1 : 0

  role       = aws_iam_role.entra_sso_role[0].name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}
