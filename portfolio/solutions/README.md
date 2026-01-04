# Solutions

This folder contains infrastructure solutions displayed on the portfolio website's **Solutions** tab.

Each solution is a standalone project with its own Terraform code and metadata.

## Folder Structure

```
solutions/
├── README.md                    # This file
├── vpc-sales-website/           # Solution 1
│   ├── main.tf                  # Terraform infrastructure code
│   └── solution.json            # Metadata (title, description, tags)
├── eks-microservices/           # Solution 2 (example)
│   ├── main.tf
│   └── solution.json
└── [your-solution]/             # Add more solutions here
    ├── main.tf
    └── solution.json
```

## Adding a New Solution

1. **Create a folder** with a descriptive kebab-case name:
   ```bash
   mkdir solutions/my-new-solution
   ```

2. **Add your Terraform code** (`main.tf` or multiple `.tf` files):
   ```hcl
   # solutions/my-new-solution/main.tf
   resource "aws_vpc" "main" {
     cidr_block = "10.0.0.0/16"
   }
   ```

3. **Create metadata file** (`solution.json`):
   ```json
   {
     "title": "My New Solution",
     "description": "Brief description of what this solution does",
     "provider": "aws",
     "tags": ["vpc", "networking", "security"],
     "diagram": true
   }
   ```

4. **Rebuild the website** to pick up changes:
   ```bash
   npm run build
   ```

## Metadata Schema (solution.json)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Display title for the solution |
| `description` | string | Yes | Brief description (1-2 sentences) |
| `provider` | string | Yes | Primary cloud provider (`aws`, `azure`, `gcp`, `cloudflare`) |
| `tags` | array | Yes | Searchable tags for filtering |
| `diagram` | boolean | No | Whether to show architecture diagram (default: true) |
| `featured` | boolean | No | Highlight on main page (default: false) |

## Validation

Validate your Terraform code before committing:

```bash
cd solutions/my-new-solution
terraform init -backend=false
terraform validate
terraform fmt
```

## Tips

- Keep solutions focused on a single use case
- Include comments in your Terraform code explaining the architecture
- Use descriptive resource names
- Tag resources appropriately for the diagram generator
