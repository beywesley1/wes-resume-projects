# =============================================================================
# AZURE STATIC WEB APP - azure.beyops.com
# =============================================================================
# This creates a separate Azure-hosted version of the portfolio site
# Demonstrates multi-cloud architecture with the same codebase

# -----------------------------------------------------------------------------
# Resource Group
# -----------------------------------------------------------------------------

resource "azurerm_resource_group" "azure_site" {
  count    = var.enable_azure_site ? 1 : 0
  name     = "rg-beyops-azure-site"
  location = var.azure_location

  tags = {
    Project     = "portfolio"
    Environment = "production"
    ManagedBy   = "terraform"
    Purpose     = "Azure mirror site"
  }
}

# -----------------------------------------------------------------------------
# Azure Static Web App
# -----------------------------------------------------------------------------

resource "azurerm_static_web_app" "azure_site" {
  count               = var.enable_azure_site ? 1 : 0
  name                = "swa-beyops-azure"
  resource_group_name = azurerm_resource_group.azure_site[0].name
  location            = azurerm_resource_group.azure_site[0].location
  sku_tier            = "Free"
  sku_size            = "Free"

  tags = {
    Project     = "portfolio"
    Environment = "production"
    ManagedBy   = "terraform"
    Purpose     = "Azure mirror site"
  }
}

# -----------------------------------------------------------------------------
# Custom Domain for Azure Static Web App
# -----------------------------------------------------------------------------

resource "azurerm_static_web_app_custom_domain" "azure_subdomain" {
  count             = var.enable_azure_site ? 1 : 0
  static_web_app_id = azurerm_static_web_app.azure_site[0].id
  domain_name       = "azure.${var.domain_name}"
  validation_type   = "cname-delegation"
}
