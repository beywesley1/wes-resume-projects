# =============================================================================
# CLOUDFLARE DNS - Azure Static Web App (azure.beyops.com)
# =============================================================================
# DNS records for the Azure-hosted mirror site

# -----------------------------------------------------------------------------
# CNAME Record for Azure Static Web App
# -----------------------------------------------------------------------------

resource "cloudflare_record" "azure_site" {
  count   = var.enable_azure_site ? 1 : 0
  zone_id = var.cloudflare_zone_id
  name    = "azure"
  content = azurerm_static_web_app.azure_site[0].default_host_name
  type    = "CNAME"
  ttl     = 1     # Auto TTL
  proxied = false # Must be false for Azure custom domain validation
  comment = "Azure Static Web App - mirror site"
}
