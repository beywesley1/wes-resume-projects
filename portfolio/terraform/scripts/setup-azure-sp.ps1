# =============================================================================
# Azure Service Principal Setup Script for Terraform Cloud
# =============================================================================
# This script creates a Service Principal with Contributor access
# and outputs the credentials needed for Terraform Cloud
#
# Prerequisites:
#   - Azure CLI installed (https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
#   - Logged into Azure CLI (az login)
#
# Usage:
#   .\setup-azure-sp.ps1
# =============================================================================

param(
    [string]$ServicePrincipalName = "terraform-cloud",
    [string]$Role = "Contributor"
)

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Azure Service Principal Setup for Terraform" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# -----------------------------------------------------------------------------
# Check Azure CLI is installed
# -----------------------------------------------------------------------------

Write-Host "Checking Azure CLI installation..." -ForegroundColor Yellow
try {
    $azVersion = az version --output json | ConvertFrom-Json
    Write-Host "Azure CLI version: $($azVersion.'azure-cli')" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Azure CLI is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Install from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows" -ForegroundColor Yellow
    exit 1
}

# -----------------------------------------------------------------------------
# Check if logged in
# -----------------------------------------------------------------------------

Write-Host ""
Write-Host "Checking Azure login status..." -ForegroundColor Yellow
$account = az account show --output json 2>$null | ConvertFrom-Json

if (-not $account) {
    Write-Host "Not logged in. Opening browser for Azure login..." -ForegroundColor Yellow
    az login
    $account = az account show --output json | ConvertFrom-Json
}

Write-Host "Logged in as: $($account.user.name)" -ForegroundColor Green
Write-Host "Subscription: $($account.name)" -ForegroundColor Green
Write-Host "Subscription ID: $($account.id)" -ForegroundColor Green
Write-Host "Tenant ID: $($account.tenantId)" -ForegroundColor Green

# -----------------------------------------------------------------------------
# Create Service Principal
# -----------------------------------------------------------------------------

Write-Host ""
Write-Host "Creating Service Principal '$ServicePrincipalName'..." -ForegroundColor Yellow

$sp = az ad sp create-for-rbac `
    --name $ServicePrincipalName `
    --role $Role `
    --scopes "/subscriptions/$($account.id)" `
    --output json | ConvertFrom-Json

if (-not $sp) {
    Write-Host "ERROR: Failed to create Service Principal" -ForegroundColor Red
    exit 1
}

Write-Host "Service Principal created successfully!" -ForegroundColor Green

# -----------------------------------------------------------------------------
# Output credentials
# -----------------------------------------------------------------------------

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "TERRAFORM CLOUD ENVIRONMENT VARIABLES" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Add these as Environment Variables in Terraform Cloud:" -ForegroundColor Yellow
Write-Host "(Mark all as SENSITIVE)" -ForegroundColor Yellow
Write-Host ""
Write-Host "ARM_CLIENT_ID=$($sp.appId)" -ForegroundColor White
Write-Host "ARM_CLIENT_SECRET=$($sp.password)" -ForegroundColor White
Write-Host "ARM_TENANT_ID=$($sp.tenant)" -ForegroundColor White
Write-Host "ARM_SUBSCRIPTION_ID=$($account.id)" -ForegroundColor White
Write-Host ""

# -----------------------------------------------------------------------------
# Save to file (optional)
# -----------------------------------------------------------------------------

$outputFile = "azure-sp-credentials.txt"
$credentials = @"
# Azure Service Principal Credentials for Terraform Cloud
# Created: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
# Service Principal: $ServicePrincipalName
# 
# ADD THESE TO TERRAFORM CLOUD AS ENVIRONMENT VARIABLES (SENSITIVE)
# Go to: app.terraform.io -> Your Workspace -> Variables -> Environment Variables

ARM_CLIENT_ID=$($sp.appId)
ARM_CLIENT_SECRET=$($sp.password)
ARM_TENANT_ID=$($sp.tenant)
ARM_SUBSCRIPTION_ID=$($account.id)

# IMPORTANT: Delete this file after copying credentials to Terraform Cloud!
"@

$credentials | Out-File -FilePath $outputFile -Encoding UTF8
Write-Host "Credentials saved to: $outputFile" -ForegroundColor Yellow
Write-Host "IMPORTANT: Delete this file after adding credentials to Terraform Cloud!" -ForegroundColor Red
Write-Host ""

# -----------------------------------------------------------------------------
# Next steps
# -----------------------------------------------------------------------------

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "NEXT STEPS" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to https://app.terraform.io" -ForegroundColor White
Write-Host "2. Navigate to your workspace (wes-portfolio)" -ForegroundColor White
Write-Host "3. Click 'Variables' in the left sidebar" -ForegroundColor White
Write-Host "4. Under 'Environment Variables', add each variable above" -ForegroundColor White
Write-Host "5. Mark each variable as 'Sensitive'" -ForegroundColor White
Write-Host "6. Delete the $outputFile file" -ForegroundColor White
Write-Host ""
Write-Host "Done!" -ForegroundColor Green
