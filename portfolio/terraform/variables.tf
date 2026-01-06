# =============================================================================
# VARIABLES
# =============================================================================

# -----------------------------------------------------------------------------
# AWS Configuration
# -----------------------------------------------------------------------------

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

# -----------------------------------------------------------------------------
# Domain Configuration
# -----------------------------------------------------------------------------

variable "domain_name" {
  description = "Domain name for the website"
  type        = string
  default     = "beyops.com"
}

variable "create_www_redirect" {
  description = "Create www subdomain redirect to apex"
  type        = bool
  default     = true
}

# -----------------------------------------------------------------------------
# Cloudflare Configuration
# -----------------------------------------------------------------------------

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID for the domain"
  type        = string
  # Set this in Terraform Cloud as a variable
}

# -----------------------------------------------------------------------------
# Entra ID SSO Configuration
# -----------------------------------------------------------------------------

variable "enable_entra_sso" {
  description = "Enable Microsoft Entra ID SSO integration"
  type        = bool
  default     = true
}

variable "entra_sso_role_name" {
  description = "Name for the IAM role used by Entra ID SSO"
  type        = string
  default     = "EntraID-SSO-Admin"
}

variable "entra_sso_session_duration" {
  description = "Maximum session duration in seconds (1-12 hours)"
  type        = number
  default     = 3600
}
