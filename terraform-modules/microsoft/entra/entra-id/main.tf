# Discover tenant context (useful for outputs and validation)

data "azuread_client_config" "current" {}

# Entra ID Application (App Registration)

resource "azuread_application" "this" {
  display_name     = var.display_name
  owners           = var.owners
  sign_in_audience = var.sign_in_audience

  # Optional web config
  dynamic "web" {
    for_each = length(var.redirect_uris) > 0 ? [1] : []
    content {
      redirect_uris = var.redirect_uris
    }
  }
}

# Optional Service Principal (Enterprise Application)

resource "azuread_service_principal" "this" {
  count = var.create_service_principal ? 1 : 0

  client_id = azuread_application.this.client_id
  owners    = var.owners
}

# Optional client secret (application password)

resource "azuread_application_password" "this" {
  count = var.create_client_secret ? 1 : 0

  application_id = azuread_application.this.id
  display_name   = var.client_secret_display_name

  end_date = timeadd(timestamp(), var.client_secret_end_date_relative)
}
