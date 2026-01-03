# Basic app registration settings

variable "display_name" {
  type        = string
  description = "Display name for the Entra ID Application (App Registration)."
}

variable "owners" {
  type        = list(string)
  description = "List of object IDs that will be set as owners for the application (and service principal if created)."
  default     = []
}

variable "sign_in_audience" {
  type        = string
  description = "Audience for the app. Common values: AzureADMyOrg, AzureADMultipleOrgs, AzureADandPersonalMicrosoftAccount, PersonalMicrosoftAccount."
  default     = "AzureADMyOrg"
}

# Optional web settings

variable "redirect_uris" {
  type        = list(string)
  description = "Optional redirect URIs for the app's web configuration."
  default     = []
}

# Optional service principal + secret

variable "create_service_principal" {
  type        = bool
  description = "If true, create a Service Principal for the application."
  default     = true
}

variable "create_client_secret" {
  type        = bool
  description = "If true, create a client secret (application password). Requires create_service_principal=true in most use cases."
  default     = false
}

variable "client_secret_display_name" {
  type        = string
  description = "Display name for the client secret when create_client_secret=true."
  default     = "terraform"
}

variable "client_secret_end_date_relative" {
  type        = string
  description = "Relative expiry for the client secret (e.g. 240h, 720h, 8760h). Only used when create_client_secret=true."
  default     = "8760h"
}
