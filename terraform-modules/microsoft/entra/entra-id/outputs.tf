# App registration identifiers

output "tenant_id" {
  value = data.azuread_client_config.current.tenant_id
}

output "application_client_id" {
  value = azuread_application.this.client_id
}

output "application_object_id" {
  value = azuread_application.this.object_id
}

# Service principal identifiers (if created)

output "service_principal_object_id" {
  value = var.create_service_principal ? azuread_service_principal.this[0].object_id : null
}

# Client secret value (if created)
# Note: treat this as sensitive.

output "client_secret" {
  value     = var.create_client_secret ? azuread_application_password.this[0].value : null
  sensitive = true
}
