# =============================================================================
# AZURE STATIC WEB APP
# =============================================================================

# -----------------------------------------------------------------------------
# Resource Group
# -----------------------------------------------------------------------------

resource "azurerm_resource_group" "website" {
  count    = var.enable_azure_site ? 1 : 0
  name     = "rg-${replace(var.domain_name, ".", "-")}"
  location = var.azure_location
  
  tags = {
    Project     = "portfolio"
    ManagedBy   = "terraform"
    Environment = "production"
  }
}

# -----------------------------------------------------------------------------
# Static Web App
# -----------------------------------------------------------------------------

resource "azurerm_static_web_app" "azure_site" {
  count               = var.enable_azure_site ? 1 : 0
  name                = "stapp-${replace(var.domain_name, ".", "-")}"
  resource_group_name = azurerm_resource_group.website[0].name
  location            = azurerm_resource_group.website[0].location
  sku_tier            = "Free"
  sku_size            = "Free"

  tags = {
    Project     = "portfolio"
    ManagedBy   = "terraform"
    Environment = "production"
  }
}

# -----------------------------------------------------------------------------
# DNS Propagation Delay
# -----------------------------------------------------------------------------

resource "time_sleep" "wait_for_dns" {
  count           = var.enable_azure_site ? 1 : 0
  create_duration = "30s"

  depends_on = [cloudflare_record.azure_site]
}

# -----------------------------------------------------------------------------
# Custom Domain Association
# -----------------------------------------------------------------------------

resource "azurerm_static_web_app_custom_domain" "azure_site" {
  count               = var.enable_azure_site ? 1 : 0
  static_web_app_id   = azurerm_static_web_app.azure_site[0].id
  domain_name         = "azure.${var.domain_name}"
  validation_type     = "cname-delegation"

  # Ensure DNS record exists and has propagated before attempting validation
  depends_on = [time_sleep.wait_for_dns]
}
