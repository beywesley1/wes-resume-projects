#!/bin/bash
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
#   chmod +x setup-azure-sp.sh
#   ./setup-azure-sp.sh
# =============================================================================

SERVICE_PRINCIPAL_NAME="${1:-terraform-cloud}"
ROLE="${2:-Contributor}"

echo "============================================="
echo "Azure Service Principal Setup for Terraform"
echo "============================================="
echo ""

# -----------------------------------------------------------------------------
# Check Azure CLI is installed
# -----------------------------------------------------------------------------

echo "Checking Azure CLI installation..."
if ! command -v az &> /dev/null; then
    echo "ERROR: Azure CLI is not installed"
    echo "Install from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

AZ_VERSION=$(az version --query '"azure-cli"' -o tsv)
echo "Azure CLI version: $AZ_VERSION"

# -----------------------------------------------------------------------------
# Check if logged in
# -----------------------------------------------------------------------------

echo ""
echo "Checking Azure login status..."
ACCOUNT=$(az account show --output json 2>/dev/null)

if [ -z "$ACCOUNT" ]; then
    echo "Not logged in. Opening browser for Azure login..."
    az login
    ACCOUNT=$(az account show --output json)
fi

USER_NAME=$(echo $ACCOUNT | jq -r '.user.name')
SUB_NAME=$(echo $ACCOUNT | jq -r '.name')
SUB_ID=$(echo $ACCOUNT | jq -r '.id')
TENANT_ID=$(echo $ACCOUNT | jq -r '.tenantId')

echo "Logged in as: $USER_NAME"
echo "Subscription: $SUB_NAME"
echo "Subscription ID: $SUB_ID"
echo "Tenant ID: $TENANT_ID"

# -----------------------------------------------------------------------------
# Create Service Principal
# -----------------------------------------------------------------------------

echo ""
echo "Creating Service Principal '$SERVICE_PRINCIPAL_NAME'..."

SP=$(az ad sp create-for-rbac \
    --name "$SERVICE_PRINCIPAL_NAME" \
    --role "$ROLE" \
    --scopes "/subscriptions/$SUB_ID" \
    --output json)

if [ -z "$SP" ]; then
    echo "ERROR: Failed to create Service Principal"
    exit 1
fi

APP_ID=$(echo $SP | jq -r '.appId')
PASSWORD=$(echo $SP | jq -r '.password')
SP_TENANT=$(echo $SP | jq -r '.tenant')

echo "Service Principal created successfully!"

# -----------------------------------------------------------------------------
# Output credentials
# -----------------------------------------------------------------------------

echo ""
echo "============================================="
echo "TERRAFORM CLOUD ENVIRONMENT VARIABLES"
echo "============================================="
echo ""
echo "Add these as Environment Variables in Terraform Cloud:"
echo "(Mark all as SENSITIVE)"
echo ""
echo "ARM_CLIENT_ID=$APP_ID"
echo "ARM_CLIENT_SECRET=$PASSWORD"
echo "ARM_TENANT_ID=$SP_TENANT"
echo "ARM_SUBSCRIPTION_ID=$SUB_ID"
echo ""

# -----------------------------------------------------------------------------
# Save to file (optional)
# -----------------------------------------------------------------------------

OUTPUT_FILE="azure-sp-credentials.txt"
cat > "$OUTPUT_FILE" << EOF
# Azure Service Principal Credentials for Terraform Cloud
# Created: $(date '+%Y-%m-%d %H:%M:%S')
# Service Principal: $SERVICE_PRINCIPAL_NAME
# 
# ADD THESE TO TERRAFORM CLOUD AS ENVIRONMENT VARIABLES (SENSITIVE)
# Go to: app.terraform.io -> Your Workspace -> Variables -> Environment Variables

ARM_CLIENT_ID=$APP_ID
ARM_CLIENT_SECRET=$PASSWORD
ARM_TENANT_ID=$SP_TENANT
ARM_SUBSCRIPTION_ID=$SUB_ID

# IMPORTANT: Delete this file after copying credentials to Terraform Cloud!
EOF

echo "Credentials saved to: $OUTPUT_FILE"
echo "IMPORTANT: Delete this file after adding credentials to Terraform Cloud!"
echo ""

# -----------------------------------------------------------------------------
# Next steps
# -----------------------------------------------------------------------------

echo "============================================="
echo "NEXT STEPS"
echo "============================================="
echo ""
echo "1. Go to https://app.terraform.io"
echo "2. Navigate to your workspace (wes-portfolio)"
echo "3. Click 'Variables' in the left sidebar"
echo "4. Under 'Environment Variables', add each variable above"
echo "5. Mark each variable as 'Sensitive'"
echo "6. Delete the $OUTPUT_FILE file"
echo ""
echo "Done!"
