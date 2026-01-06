# Terraform Scripts

Helper scripts for setting up infrastructure dependencies.

## Azure Service Principal Setup

Creates a Service Principal for Terraform Cloud to authenticate with Azure.

### Prerequisites

- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) installed
- Azure account with permissions to create Service Principals

### Usage

**PowerShell (Windows):**
```powershell
cd portfolio/terraform/scripts
.\setup-azure-sp.ps1
```

**Bash (Linux/macOS/WSL):**
```bash
cd portfolio/terraform/scripts
chmod +x setup-azure-sp.sh
./setup-azure-sp.sh
```

### What it does

1. Checks Azure CLI installation
2. Logs you into Azure (if not already logged in)
3. Creates a Service Principal named `terraform-cloud`
4. Assigns `Contributor` role to your subscription
5. Outputs the credentials needed for Terraform Cloud
6. Saves credentials to `azure-sp-credentials.txt`

### After running

1. Copy the credentials to Terraform Cloud:
   - Go to [app.terraform.io](https://app.terraform.io)
   - Navigate to your workspace → Variables → Environment Variables
   - Add each `ARM_*` variable and mark as **Sensitive**

2. **Delete** the `azure-sp-credentials.txt` file (contains secrets!)

### Custom options

```powershell
# Custom service principal name
.\setup-azure-sp.ps1 -ServicePrincipalName "my-terraform-sp"

# Custom role (default is Contributor)
.\setup-azure-sp.ps1 -Role "Owner"
```
