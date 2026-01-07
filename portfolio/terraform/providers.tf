# =============================================================================
# PROVIDER CONFIGURATIONS
# =============================================================================

# -----------------------------------------------------------------------------
# AWS Provider (Default Region)
# -----------------------------------------------------------------------------

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "portfolio"
      ManagedBy   = "terraform"
      Environment = "production"
    }
  }
}

# -----------------------------------------------------------------------------
# AWS Provider (us-east-1 for ACM/CloudFront)
# -----------------------------------------------------------------------------
# ACM certificates for CloudFront must be in us-east-1

provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project     = "portfolio"
      ManagedBy   = "terraform"
      Environment = "production"
    }
  }
}

# -----------------------------------------------------------------------------
# Cloudflare Provider
# -----------------------------------------------------------------------------
# API token set via CLOUDFLARE_API_TOKEN environment variable

provider "cloudflare" {}

# -----------------------------------------------------------------------------
# Azure AD Provider (Microsoft Entra ID)
# -----------------------------------------------------------------------------
# Uses ARM_CLIENT_ID, ARM_CLIENT_SECRET, ARM_TENANT_ID environment variables
# Or Azure CLI authentication (az login)

provider "azuread" {}

# -----------------------------------------------------------------------------
# Azure RM Provider (Azure Static Web App)
# -----------------------------------------------------------------------------
# Uses ARM_CLIENT_ID, ARM_CLIENT_SECRET, ARM_TENANT_ID, ARM_SUBSCRIPTION_ID
# environment variables or Azure CLI authentication

provider "azurerm" {
  features {}
  skip_provider_registration = true
}
