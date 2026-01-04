# Terraform Solutions

This folder contains Terraform infrastructure code that is automatically imported into the portfolio website diagrams.

## How It Works

The `.tf` files in this folder are imported at build time using Vite's `?raw` import feature. This means:

1. **Edit real `.tf` files** - Full IDE support, syntax highlighting, linting
2. **Auto-updates on rebuild** - Changes are picked up automatically
3. **HMR in development** - Hot module reload works during development

## Folder Structure

```
terraform-solutions/
├── README.md
├── vpc-sales-website/      # VPC architecture for sales website
│   └── main.tf
└── [future-solution]/      # Add more solutions here
    └── main.tf
```

## Adding a New Solution

1. Create a new folder with a descriptive name
2. Add your `.tf` files inside
3. Import in `App.jsx`:
   ```javascript
   import myNewCode from './terraform-solutions/my-solution/main.tf?raw';
   ```
4. Use the imported string in your diagram component

## Validation

You can validate the Terraform code using:

```bash
cd src/terraform-solutions/vpc-sales-website
terraform init -backend=false
terraform validate
```
