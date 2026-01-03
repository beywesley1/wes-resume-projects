# entra-id

Terraform module for Microsoft Entra ID (Azure AD) that creates an **App Registration** and optionally an **Enterprise Application (Service Principal)** and **Client Secret**.

## What this creates

- **Application**: `azuread_application`
- **Service Principal (optional)**: `azuread_service_principal`
- **Client Secret (optional)**: `azuread_application_password`

## Provider

This module uses the `hashicorp/azuread` provider.

You must authenticate Terraform to Entra ID (for example using `az login` + environment variables, or a service principal).

## Usage

```hcl
module "entra_id" {
  source = "../../terraform-modules/microsoft/entra/entra-id"

  display_name = "my-test-app"

  # Optional
  redirect_uris = [
    "http://localhost:3000/callback",
  ]

  # Optional safety defaults
  create_service_principal = true
  create_client_secret     = false
}
```

## Inputs

- `display_name` (string, required)
- `owners` (list(string), default `[]`)
- `sign_in_audience` (string, default `AzureADMyOrg`)
- `redirect_uris` (list(string), default `[]`)
- `create_service_principal` (bool, default `true`)
- `create_client_secret` (bool, default `false`)
- `client_secret_display_name` (string, default `terraform`)
- `client_secret_end_date_relative` (string, default `8760h`)

## Outputs

- `tenant_id`
- `application_client_id`
- `application_object_id`
- `service_principal_object_id`
- `client_secret` (sensitive)
