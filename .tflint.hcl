# AWS ruleset for AWS Terraform modules
plugin "aws" {
  enabled = true
  version = "0.35.0"
  source  = "github.com/terraform-linters/tflint-ruleset-aws"
}

# Azure AD ruleset for Microsoft Entra modules
plugin "azurerm" {
  enabled = true
  version = "0.27.0"
  source  = "github.com/terraform-linters/tflint-ruleset-azurerm"
}

config {
  format              = "compact"
  call_module_type    = "all"
  force               = false
  disabled_by_default = false
}
