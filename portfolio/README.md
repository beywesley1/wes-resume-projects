# Portfolio Website

Cloud Engineer portfolio with GitHub integration, scripts library, and infrastructure as code.

## Features

- **Dynamic GitHub Stats** - Live repo data from GitHub API
- **Scripts Library** - Copy-to-clipboard PowerShell, Bash, and Terraform snippets
- **Skills Showcase** - Visual skill categories
- **Certifications** - Track certified and in-progress credentials
- **Responsive Design** - Works on all devices
- **Fast** - Static React app served via CloudFront CDN

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Your Domain                          │
│                      (Route53 + ACM)                         │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    CloudFront CDN                            │
│              (HTTPS, Caching, Edge Locations)                │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                     S3 Bucket                                │
│              (Static Website Content)                        │
└─────────────────────────────────────────────────────────────┘
```

## Prerequisites

- Docker installed and running
- AWS account with:
  - Route53 hosted zone for your domain
  - Appropriate IAM permissions
- Domain name registered

## Quick Start

### 1. Configure the Website

Edit `src/App.jsx` and update the `CONFIG` object:

```javascript
const CONFIG = {
  name: "Your Name",
  title: "Cloud Engineer",
  github: "your-github-username",
  email: "you@example.com",
  linkedin: "https://linkedin.com/in/yourprofile",
  yearsExperience: 5,
  // ... etc
};
```

Add your scripts to the `SCRIPTS` object.

### 2. Bootstrap Terraform State Backend

```bash
# Make the script executable
chmod +x run.sh

# Initialize and create state backend
./run.sh bootstrap-init
./run.sh bootstrap-plan
./run.sh bootstrap-apply
```

Copy the backend configuration from the output and update `terraform/main.tf`.

### 3. Deploy Infrastructure

```bash
# Copy and edit variables
cp terraform/terraform.tfvars.example terraform/terraform.tfvars
# Edit terraform.tfvars with your domain name

# Initialize with S3 backend
./run.sh init

# Plan and apply
./run.sh plan
./run.sh apply
```

### 4. Build and Deploy Website

```bash
# Build the React app
./run.sh build

# Deploy to S3 + invalidate CloudFront
./run.sh deploy
```

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Customization

### Adding Scripts

Edit the `SCRIPTS` object in `src/App.jsx`:

```javascript
const SCRIPTS = {
  powershell: [
    {
      title: "My Script",
      description: "What it does",
      code: `Your PowerShell code here`,
    },
  ],
  bash: [...],
  terraform: [...],
};
```

### Adding Skills

Update the `CONFIG.skills` object:

```javascript
skills: {
  cloud: ["AWS", "Azure", "GCP"],
  iac: ["Terraform", "CloudFormation"],
  // Add more categories
}
```

### Adding Certifications

```javascript
certifications: [
  { name: "AWS SAP-C02", icon: "☁️", status: "certified" },
  { name: "AZ-104", icon: "🔷", status: "in-progress" },
]
```

## Cost Estimate

| Service | Monthly Cost |
|---------|-------------|
| Route53 Hosted Zone | $0.50 |
| Route53 Queries | ~$0.01 |
| S3 Storage + Requests | ~$0.05 |
| CloudFront | ~$0.00 (free tier) |
| ACM Certificate | Free |
| DynamoDB (state lock) | ~$0.00 |
| **Total** | **~$0.55/month** |

## Infrastructure Commands

```bash
./run.sh help           # Show all commands
./run.sh plan           # Preview changes
./run.sh apply          # Apply changes
./run.sh output         # Show outputs (URLs, etc)
./run.sh destroy        # Tear down everything
./run.sh shell          # Open shell in Terraform container
```

## Updating Content

After making changes to `src/App.jsx`:

```bash
./run.sh build
./run.sh deploy
```

## Troubleshooting

### Certificate Validation Stuck

ACM DNS validation can take 5-30 minutes. Check Route53 for the CNAME records.

### CloudFront Not Updating

Run cache invalidation:
```bash
./run.sh deploy  # Includes invalidation
```

### AWS Credentials Not Found

Set environment variables:
```bash
export AWS_ACCESS_KEY_ID=your-key
export AWS_SECRET_ACCESS_KEY=your-secret
export AWS_REGION=us-east-1
```

Or configure `~/.aws/credentials`.

## License

MIT
