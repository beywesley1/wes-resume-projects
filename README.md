# Wes Resume Projects

A monorepo containing my portfolio website, Terraform modules, and AWS architecture solutions.

## 🌐 Live Site

**[beyops.com](https://beyops.com)** - Interactive portfolio showcasing cloud engineering experience, scripts, and architecture diagrams.

## Project Structure

```
├── .github/workflows/        # GitHub Actions CI/CD
│   ├── deploy.yml            # Portfolio deployment to S3/CloudFront
│   └── lint.yml              # Terraform linting workflow
├── portfolio/                # React portfolio website
│   ├── src/                  # React source code
│   │   └── App.jsx           # Main application component
│   ├── solutions/            # AWS architecture solutions
│   │   ├── vpc-sales-website/    # VPC with ALB, ASG, RDS
│   │   └── static-website-s3/    # S3 + CloudFront static site
│   ├── public/               # Static assets
│   │   └── aws-icons/        # AWS service icons for diagrams
│   └── terraform/            # Portfolio infrastructure as code
├── terraform-modules/        # Reusable Terraform modules
│   ├── aws/                  # AWS modules
│   │   ├── ec2-instance/     # EC2 with CloudWatch alarms
│   │   └── lambda/           # Lambda functions
│   ├── azure/                # Azure modules (planned)
│   └── microsoft/            # Microsoft modules
│       └── entra/            # Entra ID (Azure AD)
├── scripts/                  # Utility scripts
│   └── lint.ps1              # Local linting (PowerShell)
├── .tflint.hcl               # TFLint configuration
└── ruff.toml                 # Python linter configuration
```

## Portfolio Website

A modern React single-page application featuring:

- **Interactive Architecture Diagrams** - SVG diagrams with official AWS icons
- **Terraform Code Viewer** - Syntax-highlighted infrastructure code
- **GitHub Integration** - Live stats with token-based API calls
- **Script Library** - PowerShell, Python, and Bash scripts with copy-to-clipboard
- **Responsive Design** - Mobile-friendly dark theme

### Tech Stack

- React 18 + Vite
- TailwindCSS styling
- AWS S3 + CloudFront hosting
- GitHub Actions CI/CD

### Local Development

```bash
cd portfolio
npm install
npm run dev
```

## AWS Architecture Solutions

### VPC Sales Website

Production-ready 3-tier architecture:
- CloudFlare DNS + DDoS protection
- Application Load Balancer with WAF
- Auto Scaling Group across 3 AZs
- RDS PostgreSQL with read replica
- Complete Terraform configuration

### S3 Static Website

Cost-effective static hosting:
- CloudFlare DNS management
- CloudFront CDN distribution
- S3 bucket with OAC
- ACM SSL certificate
- ~$1-5/month operational cost

## Terraform Modules

### AWS EC2 Instance

- CloudWatch CPU and status check alarms
- Optional Secrets Manager integration
- Comprehensive instance configuration

### AWS Lambda Cost Cleanup

- Terminates untagged EC2 instances
- Removes orphaned EBS volumes
- Configurable dry-run mode

### Microsoft Entra ID

- App registration configuration
- Service principal creation
- Client secret management

## CI/CD Workflows

### Deploy (deploy.yml)

Triggers on push to `main` when `portfolio/**` changes:
1. Build React application
2. Sync to S3 bucket
3. Invalidate CloudFront cache

### Lint (lint.yml)

Validates Terraform code:
- `terraform fmt` - Code formatting
- `tflint` - Best practices
- `terraform validate` - Syntax validation

## Local Linting

```powershell
# Check for errors
.\scripts\lint.ps1

# Auto-fix formatting
.\scripts\lint.ps1 -Fix

# Install missing tools
.\scripts\lint.ps1 -InstallMissing
```

## Requirements

- Node.js >= 20 (for portfolio)
- Terraform >= 1.0
- TFLint (optional)

## License

See [LICENSE](LICENSE) for details.
