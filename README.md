# Wes Resume Projects

A collection of Terraform modules for AWS and Microsoft Azure infrastructure.

## Project Structure

```
├── .github/workflows/     # GitHub Actions CI/CD workflows
│   └── lint.yml           # Terraform linting workflow
├── scripts/               # Utility scripts
│   └── lint.ps1           # Local linting script (PowerShell)
├── terraform-modules/     # Reusable Terraform modules
│   ├── aws/               # AWS modules
│   │   ├── ec2-instance/  # EC2 instance with CloudWatch alarms
│   │   └── lambda/        # Lambda functions
│   └── microsoft/         # Microsoft Azure modules
│       └── entra/         # Entra ID (Azure AD) modules
├── .tflint.hcl            # TFLint configuration
├── ruff.toml              # Ruff (Python linter) configuration
└── README.md              # This file
```

## Linting

### GitHub Actions (CI)

Linting runs automatically on push and pull requests to `main`/`master` branches when Terraform files change. The workflow performs:

- **Terraform Format** - Validates consistent code formatting
- **TFLint** - Checks for best practices and potential errors
- **Terraform Validate** - Validates module syntax and configuration

### Local Linting

Run the PowerShell lint script locally:

```powershell
# Check for lint errors (no changes)
.\scripts\lint.ps1

# Auto-fix formatting issues
.\scripts\lint.ps1 -Fix

# Install missing tools (terraform, tflint, ruff)
.\scripts\lint.ps1 -InstallMissing
```

## Modules

### AWS EC2 Instance

Full-featured EC2 instance module with:
- CloudWatch CPU and status check alarms
- Optional Secrets Manager integration for password storage
- Comprehensive instance configuration options

### AWS Lambda Cost Safety Cleanup

Scheduled Lambda function for cleaning up unused AWS resources:
- Terminates untagged EC2 instances
- Removes orphaned EBS volumes
- Cleans up ECS/EKS resources
- Configurable dry-run mode and keep tags

### Microsoft Entra ID

Azure AD application registration module with:
- App registration configuration
- Optional service principal creation
- Client secret management

## Requirements

- Terraform >= 1.0
- TFLint (optional, for local linting)

## License

See [LICENSE](LICENSE) for details.
