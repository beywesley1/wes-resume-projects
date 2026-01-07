# =============================================================================
# TERRAFORM AND PROVIDER VERSIONS
# =============================================================================

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    # AWS provider for S3, CloudFront, ACM, IAM
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }

    # Cloudflare provider for DNS management
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }

    # Azure AD provider for Microsoft Entra ID
    azuread = {
      source  = "hashicorp/azuread"
      version = "~> 2.47"
    }

    # Azure RM provider for Azure Static Web App
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }

  # Terraform Cloud backend
  cloud {
    organization = "wes-resume-projects"

    workspaces {
      name = "wes-portfolio"
    }
  }
}
