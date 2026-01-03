import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TERRAFORM_MODULES, TF_PROVIDERS, TF_SUBCATEGORY_ICONS, getTfSubcategories, getTfModuleIcon, highlightTerraform } from './terraformData';

// ============================================================================
// CONFIGURATION - Edit these values
// ============================================================================
const CONFIG = {
  name: "Wes",
  title: "Cloud Engineer / DevOps Specialist",
  // Tech stack with icons (displayed in hero)
  techStack: [
    { name: "AWS", icon: "aws" },
    { name: "Azure", icon: "azure" },
    { name: "Terraform", icon: "terraform" },
    { name: "Docker", icon: "docker" },
    { name: "Kubernetes", icon: "kubernetes" },
    { name: "Python", icon: "python" },
  ],
  github: "beywesley1",
  workGithub: "", // Add your work GitHub username here to show work account stats
  email: "beywesley89@gmail.com",
  linkedin: "https://linkedin.com/in/yourprofile",
  yearsExperience: 16, // Started in IT in 2009 in the Navy
  resumeUrl: "/resume.pdf",
  
  // Legacy certifications for hero section badges
  certifications: [
    { name: "AWS SAP-C02", icon: "☁️", status: "certified" },
    { name: "AZ-104", icon: "🔷", status: "in-progress" },
  ],
  
  // Credly badges - paste your Credly badge URLs here
  // Get the embed URL from Credly: Share Badge > Embed Code > copy the data-share-badge-id
  credlyBadges: [
    { id: "a3966b13-05a6-4606-896d-b081b9c8d661", name: "AWS Solutions Architect Professional" },
    { id: "a3ebb6eb-001c-4e30-9b32-6dc32cbf4a58", name: "AWS SysOps Administrator Associate" },
    { id: "54e88ce4-f14b-43ca-9b75-a42b4de7780a", name: "AWS Solutions Architect Associate" },
    { id: "d677cf10-a791-4dbb-9b75-5e9415a2ad03", name: "CompTIA Security+" },
    { id: "564bab1c-138c-4e07-88f4-9151bce7328f", name: "HashiCorp Terraform Associate" },
  ],
  
  // Skills with proficiency percentages (0-100)
  skillsWithProgress: {
    cloud: [
      { name: "AWS", level: 90 },
      { name: "Azure", level: 75 },
      { name: "GCP", level: 40 },
    ],
    iac: [
      { name: "Terraform", level: 85 },
      { name: "CloudFormation", level: 70 },
      { name: "Pulumi", level: 50 },
    ],
    automation: [
      { name: "PowerShell", level: 90 },
      { name: "Bash", level: 80 },
      { name: "Python", level: 70 },
      { name: "GitHub Actions", level: 75 },
    ],
    platforms: [
      { name: "Windows Server", level: 85 },
      { name: "Linux", level: 80 },
      { name: "Active Directory", level: 90 },
      { name: "Entra ID", level: 75 },
    ],
  },
  
  // Legacy skills array for simple display
  skills: {
    cloud: ["AWS", "Azure", "CloudFormation", "ARM Templates"],
    iac: ["Terraform", "Terragrunt", "Pulumi"],
    automation: ["PowerShell", "Bash", "Python", "GitHub Actions"],
    platforms: ["Windows Server", "Linux", "Active Directory", "Entra ID"],
  },
  
  // Career Timeline
  career: [
    {
      title: "Lead DevOps Engineer",
      company: "Netcov",
      location: "Remote",
      period: "2024 – Present",
      icon: "🚀",
      technologies: ["Terraform", "AWS", "Azure", "Cloudflare", "GitHub Actions", "Kubernetes", "Docker", "Python", "Lambda"],
      highlights: [
        "Own all Terraform infrastructure as code for the organization, developing and maintaining modules for AWS, Azure, and Cloudflare",
        "Lead and mentor 1 DevOps engineer, establishing IaC standards and best practices across the team",
        "Architect cloud solutions translating business requirements into scalable, cost-effective infrastructure designs",
        "Build and maintain CI/CD pipelines using GitHub Actions for automated infrastructure and application deployments",
        "Manage container orchestration with Kubernetes and Docker, supporting containerized workloads across environments",
        "Develop AWS Lambda functions using Python to automate operational workflows and integrate cloud services",
        "Manage AWS Organization structure, implementing account governance and security guardrails",
        "Optimize and refactor Terraform codebases, improving maintainability and enforcing consistency",
      ],
    },
    {
      title: "Cloud Engineer",
      company: "ThinkStack",
      location: "Remote",
      period: "2022 – 2024",
      icon: "☁️",
      technologies: ["AWS", "Terraform", "Terraform Cloud", "GitHub Actions", "Python", "Lambda", "FortiGate", "ECS", "RDS"],
      highlights: [
        "Managed 70+ AWS accounts across 2 AWS Organizations as part of a 4-person cloud engineering team supporting managed services clients in the financial sector",
        "Developed 30+ reusable Terraform modules standardizing infrastructure provisioning for EC2, RDS, S3, ECS, VPC, and networking components across multi-tenant environments",
        "Implemented CI/CD pipelines using Terraform Cloud and GitHub Actions for automated infrastructure deployments with state management and policy enforcement",
        "Resolved 500+ client escalation tickets involving AWS infrastructure troubleshooting, performance issues, and architectural guidance",
        "Built automated solutions using AWS Lambda and Python to streamline operational tasks and reduce manual intervention",
        "Deployed and managed FortiGate firewalls and AWS Network Firewalls, implementing security controls for client environments",
        "Conducted disaster recovery testing for clients, validating backup procedures and RTO/RPO requirements",
        "Performed cost optimization assessments and remediations, identifying savings opportunities across compute, storage, and data transfer",
        "Administered core AWS services including EC2, EBS, S3, CloudFront, Route53, Redshift, RDS, ELB, ECS, ACM, and Systems Manager",
      ],
    },
    {
      title: "Information Systems Technician",
      company: "Naval Special Warfare, SEAL Team 7 / TACCOMM-1",
      location: "San Diego, CA",
      period: "2018 – 2022",
      icon: "🔱",
      technologies: ["Harris HF/SHF/SATCOM", "Tactical Radios", "ROVER Video", "Blue Force Tracker", "Mobile SATCOM", "COMSEC/EKMS"],
      highlights: [
        "SEAL Team 7 - Deployed Communications:",
        "Deployed as sole Communications Technician embedded with SEAL platoon, providing full-spectrum tactical communications support in austere environments",
        "Managed, configured, and maintained tactical communications suite including handheld radios, Harris HF/SHF/SATCOM systems, ROVER video receivers, Blue Force Trackers, and mobile satellite systems",
        "Responsible for all EKMS equipment and cryptographic keying material supporting classified platoon operations",
        "Completed U.S. Army Airborne School; performed static line jumps in support of NSW operations",
        "TACCOMM-1 - Training Coordinator:",
        "Served as Primary Training Coordinator for the command, developing and delivering curriculum for NSW support personnel",
        "Trained personnel on tactical communications equipment operation, troubleshooting, and field maintenance",
        "Instructed multi-equipment movement planning and coordination for deployed operations",
        "Prepared personnel for U.S. Army Airborne School, ensuring physical and procedural readiness",
      ],
    },
    {
      title: "Information Systems Technician",
      company: "U.S. Navy, USS Mount Whitney (LCC-20)",
      location: "Gaeta, Italy",
      period: "2015 – 2018",
      icon: "📡",
      technologies: ["HF/UHF/SHF/EHF Radio", "SATCOM", "Blade Servers", "Microsoft Exchange", "COMSEC/EKMS", "CUDIXS"],
      highlights: [
        "Served as Radio Watchfloor Supervisor directing real-time communications operations aboard the 6th Fleet flagship, supervising 12 sailors across multiple watch sections",
        "Processed 1,000+ operational messages weekly via CUDIXS and shipboard message traffic systems supporting U.S. Naval Forces Europe and NATO command staff",
        "Operated and maintained HF, UHF, SHF, EHF, and SATCOM systems ensuring uninterrupted communications for fleet operations across Europe and Africa",
        "Served as Work Center Supervisor for 3M program, managing preventive and corrective maintenance schedules ensuring material readiness of all communications and IT systems",
        "Managed 70+ pieces of cryptographic equipment and keying material in accordance with COMSEC protocols",
        "Led installation of blade server infrastructure for NIPR/SIPR network services, modernizing shipboard IT capabilities",
        "Administered Microsoft Exchange Server supporting ship's company and embarked staff communications",
        "Provided direct communications support for Baltic Operations, NATO exercises, and multiple multinational naval engagements",
        "Successfully completed INSURV inspection with communications systems fully operational",
        "Awarded Navy Achievement Medal for sustained superior performance",
      ],
    },
    {
      title: "Information Systems Technician",
      company: "Navy Recruiting Command (CNRC)",
      location: "Millington, TN",
      period: "2012 – 2015",
      icon: "🎖️",
      technologies: ["Windows Server", "Cisco Switches/Routers", "VTC Equipment", "COMSEC/EKMS", "Recruiting Applications"],
      highlights: [
        "Provided direct IT support to the Commander, Navy Recruiting Command (Rear Admiral), coordinating and executing 10+ VTCs weekly for flag-level meetings, command briefings, and inter-agency coordination",
        "Managed and maintained conference room AV systems supporting VIP visits, command presentations, and senior leadership engagements",
        "Resolved 1,000+ helpdesk tickets over three years, supporting enterprise recruiting applications used by field recruiters nationwide",
        "Troubleshot and resolved on-site hardware, software, and network issues for headquarters staff and military personnel",
        "Awarded Navy Achievement Medal for exceptional performance and dedication to mission success",
        "Recognized as Sailor of the Quarter three times; received multiple Letters of Commendation from command leadership",
      ],
    },
    {
      title: "Information Systems Technician",
      company: "U.S. Navy, USS George Washington (CVN-73)",
      location: "Yokosuka, Japan",
      period: "2009 – 2012",
      icon: "⚓",
      technologies: ["Windows Server", "UNIX/Linux", "Active Directory", "COMSEC/EKMS", "LRSAT Phone System", "Exchange Server"],
      highlights: [
        "Served as Watch Supervisor overseeing IT operations across classified (TS/SCI) and unclassified networks supporting 5,000+ crew members on a forward-deployed nuclear aircraft carrier",
        "Administered 15 Unix/Linux and Windows servers, managing Active Directory, domain controllers, Group Policy, and Exchange Server for ship-wide communications",
        "Provided direct IT support for 7 major operations and joint exercises throughout the Western Pacific",
        "Resolved 700+ IT incidents across multiple security enclaves, maintaining operational readiness during deployments and port visits",
        "Provisioned and managed 200+ user accounts, security groups, and access permissions in compliance with DoD security requirements",
        "Operated Navy Message Traffic System on TS/SCI network, ensuring timely processing of critical fleet communications",
        "Maintained cryptographic systems and keying material in accordance with COMSEC protocols",
        "Contributed to successful completion of 3 annual command inspections with zero critical findings in IT systems",
      ],
    },
  ],
};

// ============================================================================
// SCRIPTS LIBRARY - Add your commonly used scripts here
// ============================================================================
const SCRIPTS_DATA = [
  // PowerShell - Active Directory
  {
    id: "ps-ad-001",
    title: "Get AD User Details",
    description: "Retrieve detailed Active Directory user information",
    category: "powershell",
    subcategory: "Active Directory",
    tags: ["active-directory", "user-management", "audit"],
    dateAdded: "2025-01-01",
    code: `# Get AD User Details
# Retrieves comprehensive user info from Active Directory
# Includes: name, email, department, manager, login history
# Usage: Run script and enter username when prompted

$username = Read-Host "Enter username"
Get-ADUser -Identity $username -Properties * | 
    Select-Object Name, EmailAddress, Department, Title, Manager, 
                  Created, LastLogonDate, PasswordLastSet |
    Format-List`,
  },
  {
    id: "ps-ad-002",
    title: "Bulk AD Group Members",
    description: "Export all members of an AD group to CSV",
    category: "powershell",
    subcategory: "Active Directory",
    tags: ["active-directory", "groups", "export"],
    dateAdded: "2025-01-02",
    code: `# Export AD Group Members to CSV
# Recursively gets all members of an AD group
# Exports to CSV with display name, username, email, department
# Output: Creates CSV file in current directory

$groupName = Read-Host "Enter group name"
Get-ADGroupMember -Identity $groupName -Recursive |
    Get-ADUser -Properties DisplayName, EmailAddress, Department |
    Select-Object DisplayName, SamAccountName, EmailAddress, Department |
    Export-Csv -Path ".\\$groupName-members.csv" -NoTypeInformation`,
  },
  // PowerShell - Azure / Entra ID
  {
    id: "ps-azure-001",
    title: "Check MFA Status",
    description: "Check MFA registration status for Azure AD users",
    category: "powershell",
    subcategory: "Azure / Entra ID",
    tags: ["azure-ad", "mfa", "security", "authentication"],
    dateAdded: "2025-01-01",
    code: `# Check MFA Status for All Users
# Requires: Microsoft.Graph PowerShell module
# Lists all users with their MFA enrollment status
# Output: User name, MFA enabled (true/false), method count

Connect-MgGraph -Scopes "UserAuthenticationMethod.Read.All"

$users = Get-MgUser -All
foreach ($user in $users) {
    $methods = Get-MgUserAuthenticationMethod -UserId $user.Id
    [PSCustomObject]@{
        User = $user.DisplayName
        MFAEnabled = ($methods.Count -gt 1)
        Methods = $methods.Count
    }
}`,
  },
  {
    id: "ps-azure-002",
    title: "Get Entra ID Sign-In Logs",
    description: "Retrieve recent sign-in logs from Entra ID",
    category: "powershell",
    subcategory: "Azure / Entra ID",
    tags: ["entra-id", "sign-in", "audit", "security"],
    dateAdded: "2025-01-03",
    code: `# Get Entra ID Sign-In Logs
# Requires: Microsoft.Graph PowerShell module
# Retrieves last 100 sign-in events for security auditing
# Shows: timestamp, user, app, IP address, status

Connect-MgGraph -Scopes "AuditLog.Read.All"

Get-MgAuditLogSignIn -Top 100 |
    Select-Object CreatedDateTime, UserPrincipalName, 
                  AppDisplayName, IPAddress, 
                  @{N='Status';E={$_.Status.ErrorCode}} |
    Format-Table -AutoSize`,
  },
  // PowerShell - AWS
  {
    id: "ps-aws-001",
    title: "AWS SSM Session",
    description: "Start SSM session to EC2 instance",
    category: "powershell",
    subcategory: "AWS",
    tags: ["aws", "ssm", "ec2", "remote-access"],
    dateAdded: "2025-01-02",
    code: `# Start AWS SSM Session
# Connects to EC2 instance via Systems Manager (no SSH needed)
# Requires: AWS CLI installed, SSM agent on instance
# Usage: Enter instance ID and optional AWS profile

$instanceId = Read-Host "Enter Instance ID"
$profile = Read-Host "Enter AWS Profile (default: default)"
if ([string]::IsNullOrEmpty($profile)) { $profile = "default" }

aws ssm start-session \`
    --target $instanceId \`
    --profile $profile`,
  },
  // Bash - AWS
  {
    id: "bash-aws-001",
    title: "EC2 Instance Report",
    description: "List all EC2 instances across regions",
    category: "bash",
    subcategory: "AWS",
    tags: ["aws", "ec2", "reporting", "multi-region"],
    dateAdded: "2025-01-01",
    code: `#!/bin/bash
# EC2 Instance Report - All Regions
# Loops through all AWS regions and lists EC2 instances
# Shows: Instance ID, State, Type, Name tag
# Useful for multi-region inventory audits

for region in $(aws ec2 describe-regions --query 'Regions[].RegionName' --output text); do
    echo "=== Region: $region ==="
    aws ec2 describe-instances \\
        --region "$region" \\
        --query 'Reservations[].Instances[].[InstanceId,State.Name,InstanceType,Tags[?Key==\`Name\`].Value|[0]]' \\
        --output table
done`,
  },
  {
    id: "bash-aws-002",
    title: "Terraform Init with Backend",
    description: "Initialize Terraform with S3 backend configuration",
    category: "bash",
    subcategory: "AWS",
    tags: ["terraform", "s3", "backend", "infrastructure"],
    dateAdded: "2025-01-01",
    code: `#!/bin/bash
# Terraform Init with S3 Backend
# Initializes Terraform with remote state in S3
# Uses DynamoDB for state locking to prevent conflicts
# Update variables below before running

BUCKET="your-terraform-state-bucket"
KEY="path/to/state/terraform.tfstate"
REGION="us-east-1"
DYNAMODB_TABLE="terraform-locks"

terraform init \\
    -backend-config="bucket=$BUCKET" \\
    -backend-config="key=$KEY" \\
    -backend-config="region=$REGION" \\
    -backend-config="dynamodb_table=$DYNAMODB_TABLE" \\
    -backend-config="encrypt=true"`,
  },
  // Bash - Docker
  {
    id: "bash-docker-001",
    title: "Docker Cleanup",
    description: "Clean up unused Docker resources",
    category: "bash",
    subcategory: "Docker",
    tags: ["docker", "cleanup", "containers", "devops"],
    dateAdded: "2025-01-02",
    code: `#!/bin/bash
# Docker Full Cleanup Script
# Stops all containers and removes unused resources
# Cleans: containers, images, volumes, networks
# WARNING: This will remove ALL unused Docker resources

echo "Stopping all containers..."
docker stop $(docker ps -aq) 2>/dev/null

echo "Removing stopped containers..."
docker container prune -f

echo "Removing unused images..."
docker image prune -af

echo "Removing unused volumes..."
docker volume prune -f

echo "Removing unused networks..."
docker network prune -f

echo "Current disk usage:"
docker system df`,
  },
  {
    id: "bash-docker-002",
    title: "Docker Logs Tail",
    description: "Tail logs from all running containers",
    category: "bash",
    subcategory: "Docker",
    tags: ["docker", "logs", "debugging"],
    dateAdded: "2025-01-03",
    code: `#!/bin/bash
# Docker Container Log Viewer
# Tails logs from a container with timestamps
# Usage: ./script.sh [container_name]
# Default: Uses first running container if none specified

CONTAINER=\${1:-$(docker ps --format '{{.Names}}' | head -1)}
echo "Tailing logs for: $CONTAINER"

docker logs -f --tail 100 --timestamps "$CONTAINER"`,
  },
  // AWS CLI - EC2
  {
    id: "aws-ec2-001",
    title: "List EC2 Instances",
    description: "List all EC2 instances with key details",
    category: "awscli",
    subcategory: "EC2",
    tags: ["aws", "ec2", "inventory", "reporting"],
    dateAdded: "2025-01-02",
    code: `# List EC2 Instances - Table Format
# Displays all EC2 instances in current region
# Shows: Name, Instance ID, State, Instance Type
# Add --region flag to query different region

aws ec2 describe-instances \\
    --query 'Reservations[].Instances[].[Tags[?Key==\`Name\`].Value|[0],InstanceId,State.Name,InstanceType]' \\
    --output table`,
  },
  // AWS CLI - S3
  {
    id: "aws-s3-001",
    title: "S3 Bucket Size",
    description: "Get total size of an S3 bucket",
    category: "awscli",
    subcategory: "S3",
    tags: ["aws", "s3", "storage", "reporting"],
    dateAdded: "2025-01-02",
    code: `# Get S3 Bucket Total Size
# Calculates total size of all objects in a bucket
# Output: Total objects count and total size
# Replace BUCKET variable with your bucket name

BUCKET="your-bucket-name"
aws s3 ls s3://$BUCKET --recursive --summarize | tail -2`,
  },
  // AWS CLI - IAM
  {
    id: "aws-iam-001",
    title: "Assume IAM Role",
    description: "Assume an IAM role and export credentials",
    category: "awscli",
    subcategory: "IAM",
    tags: ["aws", "iam", "security", "credentials"],
    dateAdded: "2025-01-03",
    code: `# Assume IAM Role and Export Credentials
# Assumes a role and sets environment variables
# Requires: jq installed for JSON parsing
# Credentials valid for 1 hour by default

ROLE_ARN="arn:aws:iam::123456789012:role/YourRole"
CREDS=$(aws sts assume-role --role-arn $ROLE_ARN --role-session-name "MySession")

export AWS_ACCESS_KEY_ID=$(echo $CREDS | jq -r '.Credentials.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(echo $CREDS | jq -r '.Credentials.SecretAccessKey')
export AWS_SESSION_TOKEN=$(echo $CREDS | jq -r '.Credentials.SessionToken')`,
  },
  // Azure CLI - Compute
  {
    id: "az-compute-001",
    title: "List VMs",
    description: "List all Azure VMs with details",
    category: "azurecli",
    subcategory: "Compute",
    tags: ["azure", "vm", "inventory", "reporting"],
    dateAdded: "2025-01-02",
    code: `# List All Azure Virtual Machines
# Displays VMs across all resource groups
# Shows: VM Name, Resource Group, VM Size
# Requires: az login first

az vm list \\
    --query '[].{Name:name, ResourceGroup:resourceGroup, Size:hardwareProfile.vmSize}' \\
    --output table`,
  },
  // Azure CLI - Storage
  {
    id: "az-storage-001",
    title: "Get Storage Account Keys",
    description: "Retrieve storage account access keys",
    category: "azurecli",
    subcategory: "Storage",
    tags: ["azure", "storage", "security", "credentials"],
    dateAdded: "2025-01-02",
    code: `# Get Azure Storage Account Access Keys
# Retrieves both primary and secondary access keys
# Update RESOURCE_GROUP and STORAGE_ACCOUNT variables
# Keys can be used for Blob, Queue, Table, File access

RESOURCE_GROUP="your-rg"
STORAGE_ACCOUNT="yourstorageaccount"

az storage account keys list \\
    --resource-group $RESOURCE_GROUP \\
    --account-name $STORAGE_ACCOUNT \\
    --output table`,
  },
  // Azure CLI - Resource Groups
  {
    id: "az-rg-001",
    title: "Create Resource Group",
    description: "Create a new Azure resource group",
    category: "azurecli",
    subcategory: "Resource Groups",
    tags: ["azure", "resource-group", "infrastructure"],
    dateAdded: "2025-01-03",
    code: `# Create Azure Resource Group
# Creates a new resource group with tags
# Resource groups are containers for Azure resources
# Tags help with cost tracking and organization

az group create \\
    --name "my-resource-group" \\
    --location "eastus" \\
    --tags Environment=Dev Project=MyProject`,
  },
];

// Category configuration with icons
const CATEGORIES = {
  powershell: {
    label: "PowerShell",
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.181 2.974c.568 0 .923.463.792 1.035l-3.659 15.982c-.13.572-.697 1.035-1.265 1.035H.819c-.568 0-.923-.463-.792-1.035L3.686 4.009c.13-.572.697-1.035 1.265-1.035h18.23zM6.497 16.239l.917-1.107-3.283-2.576 3.283-2.576-.917-1.107-4.2 3.683 4.2 3.683zm4.503.761l1.2-.3-2.4-9.6-1.2.3 2.4 9.6zm6.5-.761l4.2-3.683-4.2-3.683-.917 1.107 3.283 2.576-3.283 2.576.917 1.107z"/></svg>`,
  },
  bash: {
    label: "Bash",
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21.038 4.9l-7.577-4.498c-.567-.337-1.348-.337-1.915 0L4.005 4.9c-.567.337-.91.96-.91 1.56v8.988c0 .6.343 1.223.91 1.56l7.541 4.498c.567.337 1.348.337 1.915 0l7.577-4.498c.567-.337.91-.96.91-1.56V6.46c0-.6-.343-1.223-.91-1.56zM12 17.75l-5.5-3.25v-6.5L12 4.75l5.5 3.25v6.5L12 17.75z"/></svg>`,
  },
  awscli: {
    label: "AWS CLI",
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="#FF9900"><path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103a6.4 6.4 0 0 0-.862.272 2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586z"/></svg>`,
  },
  azurecli: {
    label: "Azure CLI",
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="#0078D4"><path d="M13.05 4.24L6.56 18.05a.5.5 0 0 1-.47.31H2.85a.5.5 0 0 1-.44-.75l6.37-11.3a.5.5 0 0 0 0-.5L6.23 2.69a.5.5 0 0 1 .44-.75h4.19a.5.5 0 0 1 .44.26l1.75 3.04zm8.1 13.81l-6.37-11.3a.5.5 0 0 0-.44-.26h-4.19a.5.5 0 0 0-.44.75l6.37 11.3a.5.5 0 0 0 .44.26h4.19a.5.5 0 0 0 .44-.75z"/></svg>`,
  },
};

// Get subcategories for a category
const getSubcategories = (category) => {
  const scripts = SCRIPTS_DATA.filter(s => s.category === category);
  return [...new Set(scripts.map(s => s.subcategory))].sort();
};

// Subcategory icons mapping
const SUBCATEGORY_ICONS = {
  "Active Directory": `<svg width="14" height="14" viewBox="0 0 24 24" fill="#0078D4"><path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h5.879a1.5 1.5 0 0 1 1.06.44l1.122 1.12A1.5 1.5 0 0 0 10.621 4H22.5A1.5 1.5 0 0 1 24 5.5v15a1.5 1.5 0 0 1-1.5 1.5h-21A1.5 1.5 0 0 1 0 20.5v-17z"/></svg>`,
  "Azure / Entra ID": `<svg width="14" height="14" viewBox="0 0 24 24" fill="#0078D4"><path d="M13.05 4.24L6.56 18.05a.5.5 0 0 1-.47.31H2.85a.5.5 0 0 1-.44-.75l6.37-11.3a.5.5 0 0 0 0-.5L6.23 2.69a.5.5 0 0 1 .44-.75h4.19a.5.5 0 0 1 .44.26l1.75 3.04zm8.1 13.81l-6.37-11.3a.5.5 0 0 0-.44-.26h-4.19a.5.5 0 0 0-.44.75l6.37 11.3a.5.5 0 0 0 .44.26h4.19a.5.5 0 0 0 .44-.75z"/></svg>`,
  "AWS": `<svg width="14" height="14" viewBox="0 0 24 24" fill="#FF9900"><path d="M7.163 6.688c0 .352.039.64.109.848.078.207.176.434.305.68a.435.435 0 0 1 .07.227c0 .098-.059.196-.184.293l-.61.406a.466.466 0 0 1-.254.09c-.098 0-.195-.047-.293-.133a3.013 3.013 0 0 1-.351-.457 7.249 7.249 0 0 1-.301-.574c-.762.898-1.719 1.348-2.871 1.348-.82 0-1.473-.234-1.95-.703-.48-.469-.723-1.094-.723-1.875 0-.828.293-1.5.886-2.012.594-.512 1.383-.766 2.383-.766.332 0 .672.027 1.027.074.356.047.723.121 1.106.215v-.715c0-.742-.156-1.262-.46-1.562-.31-.3-.837-.45-1.587-.45-.34 0-.691.04-1.054.125a7.77 7.77 0 0 0-1.055.332 2.606 2.606 0 0 1-.32.125.556.556 0 0 1-.145.027c-.129 0-.192-.093-.192-.285V5.04c0-.149.02-.262.067-.332a.69.69 0 0 1 .273-.207c.34-.176.75-.324 1.23-.442a5.9 5.9 0 0 1 1.524-.183c1.16 0 2.008.262 2.555.789.54.527.813 1.328.813 2.402v3.164h.004zm-3.965 1.48c.32 0 .652-.058.996-.175.344-.118.649-.336.906-.637.156-.187.27-.394.332-.625.063-.23.098-.508.098-.832v-.402a8.149 8.149 0 0 0-.883-.168 7.233 7.233 0 0 0-.902-.059c-.652 0-1.13.125-1.445.383-.316.258-.469.621-.469 1.094 0 .445.114.777.348 1.004.227.234.559.347.996.347l.023.07zm7.836 1.055c-.164 0-.273-.027-.34-.086-.066-.051-.125-.168-.175-.324l-1.965-6.465a1.553 1.553 0 0 1-.078-.34c0-.136.066-.21.199-.21h.918c.172 0 .29.026.348.085.066.051.117.168.168.325l1.406 5.535 1.305-5.535c.043-.164.094-.274.16-.325.066-.05.191-.085.355-.085h.75c.172 0 .29.035.356.085.066.051.125.168.16.325l1.32 5.605 1.446-5.605c.05-.164.109-.274.168-.325.066-.05.183-.085.347-.085h.871c.133 0 .207.067.207.21 0 .044-.008.087-.016.137a1.26 1.26 0 0 1-.062.21l-2.016 6.466c-.05.164-.11.273-.176.324-.066.051-.183.086-.34.086h-.808c-.172 0-.29-.035-.356-.094-.066-.058-.125-.168-.16-.332l-1.297-5.394-1.29 5.387c-.042.17-.093.28-.16.339-.065.058-.19.093-.355.093h-.808l.023.004z"/></svg>`,
  "Docker": `<svg width="14" height="14" viewBox="0 0 24 24" fill="#2496ED"><path d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 0 0 .184-.186V6.29a.185.185 0 0 0-.185-.185H8.1a.185.185 0 0 0-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 0 0 .185-.186V6.29a.185.185 0 0 0-.185-.185H5.136a.186.186 0 0 0-.186.185v1.887c0 .102.084.186.186.186m5.893 2.715h2.118a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.185-.186h-2.12a.186.186 0 0 0-.185.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 0 0-.75.748 11.376 11.376 0 0 0 .692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 0 0 3.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288z"/></svg>`,
  "EC2": `<svg width="14" height="14" viewBox="0 0 24 24" fill="#FF9900"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
  "S3": `<svg width="14" height="14" viewBox="0 0 24 24" fill="#569A31"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
  "IAM": `<svg width="14" height="14" viewBox="0 0 24 24" fill="#DD344C"><path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v3H9V7c0-1.654 1.346-3 3-3zm0 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/></svg>`,
  "Compute": `<svg width="14" height="14" viewBox="0 0 24 24" fill="#0078D4"><path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v2H8V8zm0 4h8v2H8v-2z"/></svg>`,
  "Storage": `<svg width="14" height="14" viewBox="0 0 24 24" fill="#0078D4"><path d="M2 4c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4zm2 0v4h16V4H4zm-2 8c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4zm2 0v4h16v-4H4zm-2 8c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4zm2 0v4h16v-4H4z"/></svg>`,
  "Resource Groups": `<svg width="14" height="14" viewBox="0 0 24 24" fill="#0078D4"><path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm8-2h8v8h-8v-8zm2 2v4h4v-4h-4z"/></svg>`,
};

// Get icon for a script based on its tags/subcategory
const getScriptIcon = (script) => {
  // Check for specific technology icons based on tags or subcategory
  if (script.tags.includes('aws') || script.subcategory === 'AWS' || script.subcategory === 'EC2' || script.subcategory === 'S3' || script.subcategory === 'IAM') {
    return `<svg width="22" height="22" viewBox="0 0 304 182" fill="#FF9900"><path d="M86.4 66.4c0 3.7.4 6.7 1.1 8.9.8 2.2 1.8 4.6 3.2 7.2.5.8.7 1.6.7 2.3 0 1-.6 2-1.9 3l-6.3 4.2c-.9.6-1.8.9-2.6.9-1 0-2-.5-3-1.4-1.4-1.5-2.6-3.1-3.6-4.7-1-1.7-2-3.6-3.1-5.9-7.8 9.2-17.6 13.8-29.4 13.8-8.4 0-15.1-2.4-20-7.2-4.9-4.8-7.4-11.2-7.4-19.2 0-8.5 3-15.4 9.1-20.6 6.1-5.2 14.2-7.8 24.5-7.8 3.4 0 6.9.3 10.6.8 3.7.5 7.5 1.3 11.5 2.2v-7.3c0-7.6-1.6-12.9-4.7-16-3.2-3.1-8.6-4.6-16.3-4.6-3.5 0-7.1.4-10.8 1.3-3.7.9-7.3 2-10.8 3.4-1.6.7-2.8 1.1-3.5 1.3-.7.2-1.2.3-1.5.3-1.3 0-2-.9-2-2.8v-4.9c0-1.5.2-2.6.7-3.3.5-.7 1.4-1.4 2.8-2.1 3.5-1.8 7.7-3.3 12.6-4.5 4.9-1.3 10.1-1.9 15.6-1.9 11.9 0 20.6 2.7 26.2 8.1 5.5 5.4 8.3 13.6 8.3 24.6v32.4zM45.8 81.6c3.3 0 6.7-.6 10.3-1.8 3.6-1.2 6.8-3.4 9.5-6.4 1.6-1.9 2.8-4 3.4-6.4.6-2.4 1-5.3 1-8.7v-4.2c-2.9-.7-6-1.3-9.2-1.7-3.2-.4-6.3-.6-9.4-.6-6.7 0-11.6 1.3-14.9 4-3.3 2.7-4.9 6.5-4.9 11.5 0 4.7 1.2 8.2 3.7 10.6 2.4 2.5 5.9 3.7 10.5 3.7zm80.3 10.8c-1.7 0-2.9-.3-3.7-1-.8-.6-1.5-2-2.1-3.9L96.7 10.2c-.6-2-.9-3.3-.9-4 0-1.6.8-2.5 2.4-2.5h9.8c1.8 0 3.1.3 3.8 1 .8.6 1.4 2 2 3.9l16.8 66.2 15.6-66.2c.5-2 1.1-3.3 1.9-3.9.8-.6 2.1-1 3.9-1h8c1.8 0 3.1.3 3.9 1 .8.6 1.5 2 1.9 3.9l15.8 67 17.3-67c.6-2 1.3-3.3 2-3.9.8-.6 2.1-1 3.8-1h9.3c1.6 0 2.5.8 2.5 2.5 0 .5-.1 1-.2 1.6-.1.6-.3 1.4-.7 2.5l-24.1 77.3c-.6 2-1.3 3.3-2.1 3.9-.8.6-2.1 1-3.7 1h-8.5c-1.8 0-3.1-.3-3.9-1-.8-.7-1.5-2-1.9-4L156 23l-15.4 64.4c-.5 2-1.1 3.3-1.9 4-.8.7-2.2 1-3.9 1h-8.7zm128.5 2.7c-5.2 0-10.4-.6-15.4-1.8-5-1.2-8.9-2.5-11.5-4-1.6-.9-2.7-1.9-3.1-2.8-.4-.9-.6-1.9-.6-2.8v-5.1c0-1.9.7-2.8 2.1-2.8.5 0 1.1.1 1.6.2.5.1 1.3.4 2.1.7 2.8 1.3 5.9 2.3 9.2 3 3.4.7 6.7 1 10.1 1 5.4 0 9.5-.9 12.4-2.8 2.9-1.9 4.4-4.6 4.4-8.2 0-2.4-.8-4.4-2.3-6.1-1.5-1.7-4.4-3.2-8.6-4.7l-12.3-3.8c-6.2-2-10.8-4.9-13.7-8.8-2.9-3.9-4.3-8.2-4.3-12.9 0-3.7.8-7 2.4-9.8 1.6-2.8 3.7-5.3 6.4-7.3 2.7-2 5.8-3.6 9.3-4.6 3.5-1.1 7.2-1.6 11.2-1.6 2 0 4.1.1 6.1.4 2.1.3 4 .6 5.9 1.1 1.8.5 3.5 1 5.1 1.6 1.6.6 2.8 1.2 3.7 1.8 1.2.8 2.1 1.6 2.6 2.4.5.8.7 1.8.7 3.1v4.7c0 1.9-.7 2.9-2.1 2.9-.7 0-1.9-.3-3.4-1-5-2.3-10.6-3.4-16.8-3.4-4.9 0-8.7.7-11.4 2.2-2.7 1.5-4.1 3.8-4.1 7 0 2.4.9 4.5 2.6 6.2 1.7 1.7 5 3.4 9.7 5l12 3.8c6.1 1.9 10.5 4.7 13.2 8.2 2.7 3.5 4 7.6 4 12.1 0 3.8-.8 7.3-2.3 10.3-1.6 3.1-3.7 5.7-6.4 8-2.7 2.3-6 4-9.8 5.2-4 1.4-8.2 2-12.8 2z"/></svg>`;
  }
  if (script.tags.includes('azure') || script.subcategory === 'Azure / Entra ID' || script.subcategory === 'Compute' || script.subcategory === 'Storage' || script.subcategory === 'Resource Groups') {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="#0078D4"><path d="M13.05 4.24L6.56 18.05a.5.5 0 0 1-.47.31H2.85a.5.5 0 0 1-.44-.75l6.37-11.3a.5.5 0 0 0 0-.5L6.23 2.69a.5.5 0 0 1 .44-.75h4.19a.5.5 0 0 1 .44.26l1.75 3.04zm8.1 13.81l-6.37-11.3a.5.5 0 0 0-.44-.26h-4.19a.5.5 0 0 0-.44.75l6.37 11.3a.5.5 0 0 0 .44.26h4.19a.5.5 0 0 0 .44-.75z"/></svg>`;
  }
  if (script.tags.includes('docker') || script.subcategory === 'Docker') {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="#2496ED"><path d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 0 0 .184-.186V6.29a.185.185 0 0 0-.185-.185H8.1a.185.185 0 0 0-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 0 0 .185-.186V6.29a.185.185 0 0 0-.185-.185H5.136a.186.186 0 0 0-.186.185v1.887c0 .102.084.186.186.186m5.893 2.715h2.118a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.185-.186h-2.12a.186.186 0 0 0-.185.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.082.185.185.185m15.08-2.715h2.118a.186.186 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.082.186.185.186"/></svg>`;
  }
  if (script.tags.includes('active-directory') || script.subcategory === 'Active Directory') {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="#0078D4"><path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h5.879a1.5 1.5 0 0 1 1.06.44l1.122 1.12A1.5 1.5 0 0 0 10.621 4H22.5A1.5 1.5 0 0 1 24 5.5v15a1.5 1.5 0 0 1-1.5 1.5h-21A1.5 1.5 0 0 1 0 20.5v-17z"/></svg>`;
  }
  if (script.tags.includes('entra-id') || script.tags.includes('azure-ad')) {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="#0078D4"><path d="M13.05 4.24L6.56 18.05a.5.5 0 0 1-.47.31H2.85a.5.5 0 0 1-.44-.75l6.37-11.3a.5.5 0 0 0 0-.5L6.23 2.69a.5.5 0 0 1 .44-.75h4.19a.5.5 0 0 1 .44.26l1.75 3.04zm8.1 13.81l-6.37-11.3a.5.5 0 0 0-.44-.26h-4.19a.5.5 0 0 0-.44.75l6.37 11.3a.5.5 0 0 0 .44.26h4.19a.5.5 0 0 0 .44-.75z"/></svg>`;
  }
  // Default - return category icon
  return CATEGORIES[script.category]?.icon || '';
};

// Syntax highlighting function for code
const highlightCode = (code, category) => {
  let highlighted = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // Comments (# for shell/powershell, // for others)
  highlighted = highlighted.replace(/(#[^\n]*)/g, '<span class="comment">$1</span>');
  
  // Strings (double and single quotes)
  highlighted = highlighted.replace(/("(?:[^"\\]|\\.)*")/g, '<span class="string">$1</span>');
  highlighted = highlighted.replace(/('(?:[^'\\]|\\.)*')/g, '<span class="string">$1</span>');
  
  // Variables ($var for PowerShell/Bash, ${var})
  highlighted = highlighted.replace(/(\$\{?[\w_]+\}?)/g, '<span class="variable">$1</span>');
  
  // Keywords
  const keywords = ['if', 'else', 'elseif', 'for', 'foreach', 'while', 'do', 'function', 'return', 'export', 'then', 'fi', 'done', 'in', 'case', 'esac'];
  keywords.forEach(kw => {
    const regex = new RegExp(`\\b(${kw})\\b`, 'g');
    highlighted = highlighted.replace(regex, '<span class="keyword">$1</span>');
  });
  
  // Common commands
  const commands = ['aws', 'az', 'docker', 'terraform', 'git', 'echo', 'Get-ADUser', 'Get-ADGroupMember', 'Connect-MgGraph', 'Get-MgUser', 'Get-MgAuditLogSignIn', 'Select-Object', 'Format-List', 'Format-Table', 'Export-Csv', 'Read-Host'];
  commands.forEach(cmd => {
    const regex = new RegExp(`\\b(${cmd})\\b`, 'g');
    highlighted = highlighted.replace(regex, '<span class="command">$1</span>');
  });
  
  // Numbers
  highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="number">$1</span>');
  
  return highlighted;
};

// ============================================================================
// SCROLL ANIMATION HOOK
// ============================================================================
function useScrollAnimation() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, isVisible];
}

// ============================================================================
// STYLES
// ============================================================================
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
  
  :root {
    --bg-primary: #050508;
    --bg-primary-rgb: 5, 5, 8;
    --bg-secondary: #0a0a10;
    --bg-tertiary: #101018;
    --bg-card: #0c0c14;
    --border: #1a1a2e;
    --border-hover: #2a2a4a;
    --text-primary: #e4e4e7;
    --text-secondary: #a1a1aa;
    --text-muted: #71717a;
    --accent-blue: #3b82f6;
    --accent-cyan: #06b6d4;
    --accent-green: #10b981;
    --accent-orange: #f59e0b;
    --accent-purple: #8b5cf6;
    --accent-pink: #ec4899;
    --font-mono: 'JetBrains Mono', monospace;
    --font-sans: 'Space Grotesk', system-ui, sans-serif;
  }
  
  /* Light mode variables */
  [data-theme="light"] {
    --bg-primary: #f8fafc;
    --bg-primary-rgb: 248, 250, 252;
    --bg-secondary: #f1f5f9;
    --bg-tertiary: #e2e8f0;
    --bg-card: #ffffff;
    --border: #cbd5e1;
    --border-hover: #94a3b8;
    --text-primary: #0f172a;
    --text-secondary: #475569;
    --text-muted: #64748b;
  }
  
  [data-theme="light"] .abstract-bg {
    background: radial-gradient(ellipse at 50% 0%, #dbeafe 0%, #f8fafc 50%, #ffffff 100%);
  }
  
  [data-theme="light"] .abstract-bg::before {
    background: 
      radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.05) 0%, transparent 40%);
  }
  
  [data-theme="light"] .abstract-bg::after {
    background: 
      radial-gradient(circle at 70% 70%, rgba(59, 130, 246, 0.08) 0%, transparent 40%),
      radial-gradient(circle at 30% 30%, rgba(6, 182, 212, 0.05) 0%, transparent 40%);
  }
  
  [data-theme="light"] .orb-1 {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(6, 182, 212, 0.1));
  }
  
  [data-theme="light"] .orb-2 {
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(59, 130, 246, 0.08));
  }
  
  [data-theme="light"] .orb-3 {
    background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(16, 185, 129, 0.05));
  }
  
  [data-theme="light"] .grid-overlay {
    background-image: 
      linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px);
  }
  
  /* Scroll animations */
  .scroll-animate {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }
  
  .scroll-animate.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  .scroll-animate-left {
    opacity: 0;
    transform: translateX(-30px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }
  
  .scroll-animate-left.visible {
    opacity: 1;
    transform: translateX(0);
  }
  
  .scroll-animate-right {
    opacity: 0;
    transform: translateX(30px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }
  
  .scroll-animate-right.visible {
    opacity: 1;
    transform: translateX(0);
  }
  
  .scroll-animate-scale {
    opacity: 0;
    transform: scale(0.95);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }
  
  .scroll-animate-scale.visible {
    opacity: 1;
    transform: scale(1);
  }
  
  /* Staggered children animations */
  .stagger-children > * {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.4s ease-out, transform 0.4s ease-out;
  }
  
  .stagger-children.visible > *:nth-child(1) { transition-delay: 0.1s; opacity: 1; transform: translateY(0); }
  .stagger-children.visible > *:nth-child(2) { transition-delay: 0.2s; opacity: 1; transform: translateY(0); }
  .stagger-children.visible > *:nth-child(3) { transition-delay: 0.3s; opacity: 1; transform: translateY(0); }
  .stagger-children.visible > *:nth-child(4) { transition-delay: 0.4s; opacity: 1; transform: translateY(0); }
  .stagger-children.visible > *:nth-child(5) { transition-delay: 0.5s; opacity: 1; transform: translateY(0); }
  .stagger-children.visible > *:nth-child(6) { transition-delay: 0.6s; opacity: 1; transform: translateY(0); }
  
  /* Theme toggle button */
  .theme-toggle {
    position: fixed;
    top: 72px;
    right: 24px;
    z-index: 1000;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1px solid var(--border);
    background: var(--bg-card);
    color: var(--text-primary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .theme-toggle:hover {
    border-color: var(--accent-blue);
    transform: scale(1.05);
  }
  
  .theme-toggle svg {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
  }
  
  .theme-toggle:hover svg {
    transform: rotate(15deg);
  }
  
  /* Navigation Header */
  .nav-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(var(--bg-primary-rgb), 0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 0 24px;
  }
  
  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
  }
  
  .nav-logo {
    font-family: var(--font-mono);
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0;
    background: none;
    border: none;
    cursor: pointer;
  }
  
  .nav-logo span {
    color: var(--accent-blue);
  }
  
  .nav-tabs {
    display: flex;
    gap: 8px;
  }
  
  .nav-tab {
    padding: 8px 16px;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--text-secondary);
    text-decoration: none;
    border-radius: 6px;
    transition: all 0.2s ease;
    border: 1px solid var(--border);
    background: var(--bg-tertiary);
    cursor: pointer;
  }
  
  .nav-tab:hover {
    color: var(--text-primary);
    background: var(--bg-secondary);
    border-color: var(--border-hover);
  }
  
  .nav-tab.active {
    color: #fff;
    background: var(--accent-blue);
    border-color: var(--accent-blue);
  }
  
  .nav-tab.coming-soon {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .nav-tab.coming-soon:hover {
    background: var(--bg-tertiary);
    color: var(--text-secondary);
  }
  
  /* Scripts Page Styles */
  .scripts-page {
    position: relative;
    z-index: 1;
    min-height: calc(100vh - 60px);
  }
  
  .scripts-layout {
    display: flex;
    gap: 0;
    min-height: calc(100vh - 60px);
  }
  
  /* Sidebar */
  .scripts-sidebar {
    width: 280px;
    flex-shrink: 0;
    background: var(--bg-secondary);
    border-right: 1px solid var(--border);
    overflow-y: auto;
    height: calc(100vh - 60px);
    position: sticky;
    top: 60px;
  }
  
  .sidebar-header {
    padding: 20px;
    border-bottom: 1px solid var(--border);
  }
  
  .sidebar-header h2 {
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 4px 0;
    color: var(--text-primary);
  }
  
  .sidebar-header p {
    font-size: 12px;
    color: var(--text-muted);
    margin: 0;
  }
  
  .sidebar-search {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
  }
  
  .sidebar-search input {
    width: 100%;
    padding: 10px 12px;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--text-primary);
    background: var(--bg-tertiary);
    border: 1px solid var(--border);
    border-radius: 6px;
    outline: none;
  }
  
  .sidebar-search input:focus {
    border-color: var(--accent-blue);
  }
  
  .sidebar-search input::placeholder {
    color: var(--text-muted);
  }
  
  .sidebar-categories {
    padding: 8px 0;
  }
  
  .sidebar-all-scripts {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-secondary);
    cursor: pointer;
    border-bottom: 1px solid var(--border);
    transition: all 0.2s ease;
  }
  
  .sidebar-all-scripts:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }
  
  .sidebar-all-scripts.active {
    background: rgba(59, 130, 246, 0.1);
    color: var(--accent-blue);
  }
  
  .sidebar-category {
    border-bottom: 1px solid var(--border);
  }
  
  .sidebar-category:last-child {
    border-bottom: none;
  }
  
  .sidebar-category-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    cursor: pointer;
    transition: background 0.2s ease;
  }
  
  .sidebar-category-header:hover {
    background: var(--bg-tertiary);
  }
  
  .sidebar-category.expanded .sidebar-category-header {
    background: var(--bg-tertiary);
  }
  
  .sidebar-category-label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .sidebar-category-label svg {
    flex-shrink: 0;
  }
  
  .sidebar-category-toggle {
    color: var(--text-muted);
    transition: transform 0.2s ease;
  }
  
  .sidebar-category.expanded .sidebar-category-toggle {
    transform: rotate(180deg);
  }
  
  .sidebar-subcategories {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }
  
  .sidebar-category.expanded .sidebar-subcategories {
    max-height: 500px;
  }
  
  .sidebar-subcategory {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px 10px 36px;
    font-size: 13px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .sidebar-subcategory-label {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .sidebar-subcategory-label svg {
    flex-shrink: 0;
  }
  
  .sidebar-subcategory:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }
  
  .sidebar-subcategory.active {
    background: rgba(59, 130, 246, 0.1);
    color: var(--accent-blue);
  }
  
  .sidebar-subcategory-count {
    font-size: 11px;
    padding: 2px 8px;
    background: var(--bg-tertiary);
    border-radius: 10px;
    color: var(--text-muted);
  }
  
  .sidebar-subcategory.active .sidebar-subcategory-count {
    background: rgba(59, 130, 246, 0.2);
    color: var(--accent-blue);
  }
  
  /* Main Content */
  .scripts-main {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
    height: calc(100vh - 60px);
  }
  
  .scripts-main-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .scripts-main-title {
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }
  
  .scripts-main-count {
    font-size: 13px;
    color: var(--text-muted);
  }
  
  .scripts-sort select {
    padding: 8px 32px 8px 12px;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-primary);
    background: var(--bg-tertiary);
    border: 1px solid var(--border);
    border-radius: 6px;
    cursor: pointer;
    outline: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
  }
  
  /* Script List */
  .scripts-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .script-item {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    transition: all 0.2s ease;
  }
  
  .script-item:hover {
    border-color: var(--border-hover);
  }
  
  .script-item.expanded {
    border-color: var(--accent-blue);
  }
  
  .script-item-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 18px;
    cursor: pointer;
    gap: 12px;
  }
  
  .script-item-header:hover {
    background: var(--bg-tertiary);
  }
  
  .script-item-info {
    flex: 1;
    min-width: 0;
  }
  
  .script-item-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 6px 0;
  }
  
  .script-item-icon {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  
  .script-item-icon svg {
    width: 22px;
    height: 22px;
  }
  
  .script-item-description {
    font-size: 12px;
    color: var(--text-secondary);
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .script-item-toggle {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    background: var(--bg-tertiary);
    color: var(--text-muted);
    flex-shrink: 0;
    transition: all 0.2s ease;
  }
  
  .script-item.expanded .script-item-toggle {
    background: var(--accent-blue);
    color: #fff;
    transform: rotate(180deg);
  }
  
  .script-item-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }
  
  .script-item.expanded .script-item-content {
    max-height: 500px;
  }
  
  .script-item-code-wrapper {
    padding: 0 16px 16px;
  }
  
  .script-item-code-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .script-item-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  
  .script-item-tag {
    font-size: 10px;
    font-family: var(--font-mono);
    padding: 2px 6px;
    background: rgba(59, 130, 246, 0.1);
    color: var(--accent-blue);
    border-radius: 4px;
  }
  
  .script-item-code {
    background: var(--bg-primary);
    border-radius: 8px;
    padding: 14px;
    overflow-x: auto;
    max-height: 300px;
    overflow-y: auto;
  }
  
  .script-item-code pre {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 12px;
    line-height: 1.6;
    color: var(--text-primary);
    white-space: pre-wrap;
    word-break: break-word;
  }
  
  /* Syntax highlighting for code */
  .script-item-code .comment { color: #6a9955; font-style: italic; }
  .script-item-code .keyword { color: #569cd6; }
  .script-item-code .string { color: #ce9178; }
  .script-item-code .variable { color: #9cdcfe; }
  .script-item-code .function { color: #dcdcaa; }
  .script-item-code .number { color: #b5cea8; }
  .script-item-code .operator { color: #d4d4d4; }
  .script-item-code .command { color: #4ec9b0; }
  
  [data-theme="light"] .script-item-code .comment { color: #008000; }
  [data-theme="light"] .script-item-code .keyword { color: #0000ff; }
  [data-theme="light"] .script-item-code .string { color: #a31515; }
  [data-theme="light"] .script-item-code .variable { color: #001080; }
  [data-theme="light"] .script-item-code .function { color: #795e26; }
  [data-theme="light"] .script-item-code .number { color: #098658; }
  [data-theme="light"] .script-item-code .command { color: #267f99; }
  
  .scripts-empty {
    text-align: center;
    padding: 60px 20px;
    color: var(--text-muted);
  }
  
  /* Mobile Responsive */
  @media (max-width: 768px) {
    .scripts-layout {
      flex-direction: column;
    }
    
    .scripts-sidebar {
      width: 100%;
      height: auto;
      position: relative;
      top: 0;
      max-height: 50vh;
    }
    
    .scripts-main {
      height: auto;
      min-height: 50vh;
    }
  }
  
  /* Search and Sort Controls */
  .scripts-controls {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    flex-wrap: wrap;
    align-items: center;
  }
  
  .search-wrapper {
    flex: 1;
    min-width: 200px;
    position: relative;
  }
  
  .search-wrapper svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    pointer-events: none;
  }
  
  .search-input {
    width: 100%;
    padding: 12px 16px 12px 44px;
    font-family: var(--font-mono);
    font-size: 14px;
    color: var(--text-primary);
    background: var(--bg-tertiary);
    border: 1px solid var(--border);
    border-radius: 8px;
    outline: none;
    transition: all 0.2s ease;
  }
  
  .search-input:focus {
    border-color: var(--accent-blue);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .search-input::placeholder {
    color: var(--text-muted);
  }
  
  .sort-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .sort-wrapper label {
    font-size: 13px;
    color: var(--text-secondary);
    white-space: nowrap;
  }
  
  .sort-select {
    padding: 12px 36px 12px 14px;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--text-primary);
    background: var(--bg-tertiary);
    border: 1px solid var(--border);
    border-radius: 8px;
    cursor: pointer;
    outline: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    transition: all 0.2s ease;
  }
  
  .sort-select:focus {
    border-color: var(--accent-blue);
  }
  
  .scripts-count {
    font-size: 13px;
    color: var(--text-muted);
    padding: 8px 0;
  }
  
  /* Collapsible Script Cards */
  .script-card-collapsed {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.2s ease;
  }
  
  .script-card-collapsed:hover {
    border-color: var(--border-hover);
  }
  
  .script-card-collapsed.expanded {
    border-color: var(--accent-blue);
  }
  
  .script-card-header {
    padding: 16px 20px;
    cursor: pointer;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }
  
  .script-card-header:hover {
    background: var(--bg-tertiary);
  }
  
  .script-card-info {
    flex: 1;
    min-width: 0;
  }
  
  .script-card-title-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
  }
  
  .script-card-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }
  
  .script-card-category {
    font-size: 11px;
    font-family: var(--font-mono);
    padding: 3px 8px;
    background: var(--bg-tertiary);
    border-radius: 4px;
    color: var(--text-muted);
    white-space: nowrap;
  }
  
  .script-card-description {
    font-size: 13px;
    color: var(--text-secondary);
    margin: 0 0 8px 0;
  }
  
  .script-card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  
  .script-tag {
    font-size: 11px;
    font-family: var(--font-mono);
    padding: 2px 8px;
    background: rgba(59, 130, 246, 0.1);
    color: var(--accent-blue);
    border-radius: 4px;
  }
  
  .script-card-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background: var(--bg-tertiary);
    color: var(--text-secondary);
    flex-shrink: 0;
    transition: all 0.2s ease;
  }
  
  .script-card-collapsed.expanded .script-card-toggle {
    background: var(--accent-blue);
    color: #fff;
    transform: rotate(180deg);
  }
  
  .script-card-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }
  
  .script-card-collapsed.expanded .script-card-content {
    max-height: 600px;
  }
  
  .script-card-code-wrapper {
    padding: 0 20px 16px;
  }
  
  .script-card-code-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 8px;
  }
  
  .script-card-code {
    background: var(--bg-primary);
    border-radius: 8px;
    padding: 16px;
    overflow-x: auto;
  }
  
  .script-card-code pre {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 1.5;
    color: var(--text-primary);
    white-space: pre-wrap;
    word-break: break-word;
  }
  
  @media (max-width: 600px) {
    .scripts-controls {
      flex-direction: column;
      align-items: stretch;
    }
    
    .search-wrapper {
      min-width: 100%;
    }
    
    .sort-wrapper {
      justify-content: space-between;
    }
    
    .script-card-header {
      padding: 14px 16px;
    }
    
    .script-card-title {
      font-size: 14px;
    }
    
    .script-card-tags {
      display: none;
    }
    
    .scripts-category-tabs {
      gap: 8px;
    }
    
    .category-tab {
      padding: 10px 14px;
      font-size: 12px;
    }
    
    .category-tab svg {
      width: 14px;
      height: 14px;
    }
  }
  
  @media (max-width: 600px) {
    .nav-header {
      padding: 0 16px;
    }
    
    .nav-container {
      height: 52px;
    }
    
    .nav-logo {
      font-size: 16px;
    }
    
    .nav-tabs {
      gap: 4px;
    }
    
    .nav-tab {
      padding: 6px 10px;
      font-size: 11px;
    }
  }
  
  /* Add padding to body for fixed header */
  .app-content {
    padding-top: 60px;
  }
  
  @media (max-width: 600px) {
    .app-content {
      padding-top: 52px;
    }
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: var(--font-sans);
    background: var(--bg-primary);
    color: var(--text-primary);
    line-height: 1.6;
    overflow-x: hidden;
  }
  
  /* Abstract Animated Background */
  .abstract-bg {
    position: fixed;
    inset: 0;
    overflow: hidden;
    z-index: 0;
    background: radial-gradient(ellipse at 50% 0%, #0a1628 0%, #050508 50%, #000 100%);
  }
  
  .abstract-bg::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: 
      radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.08) 0%, transparent 40%);
    animation: float 20s ease-in-out infinite;
  }
  
  .abstract-bg::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 70% 70%, rgba(59, 130, 246, 0.12) 0%, transparent 40%),
      radial-gradient(circle at 30% 30%, rgba(6, 182, 212, 0.08) 0%, transparent 40%);
    animation: float 25s ease-in-out infinite reverse;
  }
  
  @keyframes float {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(2%, 2%) rotate(1deg); }
    50% { transform: translate(-1%, 3%) rotate(-1deg); }
    75% { transform: translate(-2%, -1%) rotate(0.5deg); }
  }
  
  /* Floating orbs */
  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.5;
    animation: orb-float 15s ease-in-out infinite;
  }
  
  .orb-1 {
    width: 600px;
    height: 600px;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(6, 182, 212, 0.2));
    top: -200px;
    right: -200px;
    animation-delay: 0s;
  }
  
  .orb-2 {
    width: 400px;
    height: 400px;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(59, 130, 246, 0.15));
    bottom: -100px;
    left: -100px;
    animation-delay: -5s;
  }
  
  .orb-3 {
    width: 300px;
    height: 300px;
    background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(16, 185, 129, 0.1));
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation-delay: -10s;
  }
  
  @keyframes orb-float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -30px) scale(1.05); }
    66% { transform: translate(-20px, 20px) scale(0.95); }
  }
  
  /* Grid overlay */
  .grid-overlay {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
    -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }
  
  /* Noise texture overlay */
  .noise-overlay {
    position: absolute;
    inset: 0;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    position: relative;
    z-index: 1;
  }
  
  /* Hero Section */
  .hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 80px 0;
  }
  
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border);
    border-radius: 100px;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--accent-green);
    margin-bottom: 24px;
    width: fit-content;
  }
  
  .hero-badge::before {
    content: '';
    width: 8px;
    height: 8px;
    background: var(--accent-green);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  .hero h1 {
    font-size: clamp(48px, 8vw, 96px);
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin-bottom: 16px;
  }
  
  .hero h1 span {
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-cyan));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .hero-title {
    font-size: clamp(24px, 4vw, 40px);
    font-weight: 500;
    color: var(--text-secondary);
    margin-bottom: 12px;
  }
  
  .hero-subtitle {
    font-family: var(--font-mono);
    font-size: 14px;
    color: var(--text-muted);
    margin-bottom: 40px;
  }
  
  .hero-tech-stack {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
    margin-bottom: 40px;
    justify-content: center;
  }
  
  .tech-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-mono);
    font-size: 14px;
    color: var(--text-secondary);
    transition: all 0.2s ease;
  }
  
  .tech-item:hover {
    color: var(--text-primary);
    transform: translateY(-2px);
  }
  
  .tech-item svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
  
  @media (max-width: 600px) {
    .hero-tech-stack {
      gap: 16px;
    }
    
    .tech-item {
      font-size: 12px;
    }
    
    .tech-item svg {
      width: 16px;
      height: 16px;
    }
  }
  
  .hero-cta {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  @media (max-width: 480px) {
    .hero-cta {
      flex-direction: column;
      width: 100%;
    }
  }
  
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 28px;
    border-radius: 8px;
    font-family: var(--font-sans);
    font-weight: 500;
    font-size: 15px;
    text-decoration: none;
    transition: all 0.2s ease;
    cursor: pointer;
    border: none;
  }
  
  @media (max-width: 480px) {
    .btn {
      width: 100%;
      padding: 16px 24px;
    }
  }
  
  .btn-primary {
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-cyan));
    color: white;
  }
  
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(59, 130, 246, 0.3);
  }
  
  .btn-secondary {
    background: var(--bg-tertiary);
    border: 1px solid var(--border);
    color: var(--text-primary);
  }
  
  .btn-secondary:hover {
    border-color: var(--border-hover);
    background: var(--bg-card);
  }
  
  /* Stats Bar */
  .stats-bar {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    padding: 60px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
  
  @media (max-width: 900px) {
    .stats-bar {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 480px) {
    .stats-bar {
      grid-template-columns: 1fr;
      gap: 12px;
      padding: 40px 0;
    }
  }
  
  .stat-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px;
    transition: all 0.2s ease;
    text-align: center;
  }
  
  @media (max-width: 480px) {
    .stat-card {
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-align: left;
    }
  }
  
  .stat-card:hover {
    border-color: var(--border-hover);
    transform: translateY(-2px);
  }
  
  .stat-value {
    font-size: 36px;
    font-weight: 700;
    font-family: var(--font-mono);
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  @media (max-width: 900px) {
    .stat-value {
      font-size: 28px;
    }
  }
  
  @media (max-width: 480px) {
    .stat-value {
      font-size: 24px;
      order: 2;
    }
  }
  
  .stat-label {
    font-size: 14px;
    color: var(--text-muted);
    margin-top: 4px;
  }
  
  @media (max-width: 480px) {
    .stat-label {
      margin-top: 0;
      font-size: 13px;
    }
  }
  
  /* Section Styles */
  .section {
    padding: 48px 0;
  }
  
  @media (max-width: 768px) {
    .section {
      padding: 36px 0;
    }
  }
  
  @media (max-width: 480px) {
    .section {
      padding: 24px 0;
    }
  }
  
  .section-header {
    margin-bottom: 32px;
  }
  
  @media (max-width: 480px) {
    .section-header {
      margin-bottom: 20px;
    }
  }
  
  .section-label {
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--accent-cyan);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 12px;
  }
  
  .section-title {
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  
  /* Skills Grid */
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }
  
  .skill-category {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px;
  }
  
  .skill-category h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .skill-category h3 span {
    font-size: 24px;
  }
  
  .skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .skill-tag {
    padding: 8px 14px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border);
    border-radius: 6px;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--text-secondary);
    transition: all 0.2s ease;
  }
  
  .skill-tag:hover {
    border-color: var(--accent-blue);
    color: var(--accent-blue);
  }
  
  /* Scripts Section */
  .scripts-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }
  
  .tab-btn {
    padding: 12px 24px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border);
    border-radius: 8px;
    font-family: var(--font-mono);
    font-size: 14px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .tab-btn:hover {
    border-color: var(--border-hover);
  }
  
  .tab-btn.active {
    background: var(--accent-blue);
    border-color: var(--accent-blue);
    color: white;
  }
  
  .scripts-grid {
    display: grid;
    gap: 20px;
  }
  
  .script-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
  }
  
  .script-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 20px;
    border-bottom: 1px solid var(--border);
  }
  
  .script-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  .script-description {
    font-size: 13px;
    color: var(--text-muted);
  }
  
  .copy-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border);
    border-radius: 6px;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }
  
  .copy-btn:hover {
    border-color: var(--accent-green);
    color: var(--accent-green);
  }
  
  .copy-btn.copied {
    background: var(--accent-green);
    border-color: var(--accent-green);
    color: white;
  }
  
  .script-code {
    padding: 20px;
    background: var(--bg-primary);
    overflow-x: auto;
  }
  
  .script-code pre {
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 1.7;
    color: var(--text-secondary);
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
  }
  
  /* GitHub Section */
  .github-repos {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 20px;
  }
  
  .repo-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px;
    transition: all 0.2s ease;
  }
  
  .repo-card:hover {
    border-color: var(--border-hover);
    transform: translateY(-2px);
  }
  
  .repo-name {
    font-size: 18px;
    font-weight: 600;
    color: var(--accent-blue);
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .repo-description {
    font-size: 14px;
    color: var(--text-muted);
    margin-bottom: 16px;
    line-height: 1.5;
  }
  
  .repo-stats {
    display: flex;
    gap: 16px;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--text-secondary);
  }
  
  .repo-stat {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .repo-language {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .language-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  
  /* Certifications */
  .certs-grid {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    margin-top: 32px;
  }
  
  .cert-badge {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 24px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
  }
  
  .cert-badge.certified {
    border-color: var(--accent-green);
    background: rgba(16, 185, 129, 0.1);
  }
  
  .cert-badge.in-progress {
    border-color: var(--accent-orange);
    background: rgba(245, 158, 11, 0.1);
  }
  
  .cert-icon {
    font-size: 28px;
  }
  
  .cert-info h4 {
    font-size: 15px;
    font-weight: 600;
  }
  
  .cert-status {
    font-size: 12px;
    font-family: var(--font-mono);
    color: var(--text-muted);
    text-transform: uppercase;
  }
  
  .cert-badge.certified .cert-status {
    color: var(--accent-green);
  }
  
  .cert-badge.in-progress .cert-status {
    color: var(--accent-orange);
  }
  
  /* Repos Section */
  .repos-section {
    padding: 48px 0;
    background: var(--bg-secondary);
  }
  
  .github-repos {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 20px;
  }
  
  .repo-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px;
    transition: all 0.2s ease;
  }
  
  .repo-card:hover {
    border-color: var(--border-hover);
    transform: translateY(-2px);
  }
  
  .repo-name {
    font-size: 18px;
    font-weight: 600;
    color: var(--accent-blue);
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .repo-description {
    font-size: 14px;
    color: var(--text-muted);
    margin-bottom: 16px;
    line-height: 1.5;
  }
  
  .repo-stats {
    display: flex;
    gap: 16px;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--text-secondary);
  }
  
  .repo-stat {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .repo-language {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .language-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  
  /* Credly Badges Section */
  .credly-section {
    padding: 80px 0;
    background: var(--bg-secondary);
  }
  
  .credly-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    justify-content: center;
    align-items: center;
  }
  
  .credly-badge-wrapper {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 20px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .credly-badge-wrapper:hover {
    border-color: var(--accent-blue);
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15);
  }
  
  .credly-placeholder {
    text-align: center;
    padding: 40px;
    background: var(--bg-card);
    border: 2px dashed var(--border);
    border-radius: 16px;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .credly-placeholder h4 {
    color: var(--text-secondary);
    margin-bottom: 12px;
  }
  
  .credly-placeholder p {
    color: var(--text-muted);
    font-size: 14px;
    line-height: 1.6;
  }
  
  .credly-placeholder code {
    background: var(--bg-tertiary);
    padding: 2px 8px;
    border-radius: 4px;
    font-family: var(--font-mono);
    font-size: 12px;
  }
  
  /* Progress Bar Skills */
  .skills-progress-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
  
  @media (max-width: 1200px) {
    .skills-progress-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 768px) {
    .skills-progress-grid {
      grid-template-columns: 1fr;
    }
  }
  
  .skill-progress-category {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px;
  }
  
  .skill-progress-category h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .skill-progress-category h3 span {
    font-size: 24px;
  }
  
  .skill-progress-item {
    margin-bottom: 20px;
  }
  
  .skill-progress-item:last-child {
    margin-bottom: 0;
  }
  
  .skill-progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .skill-progress-name {
    font-family: var(--font-mono);
    font-size: 14px;
    color: var(--text-secondary);
  }
  
  .skill-progress-percent {
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: 600;
    color: var(--accent-cyan);
  }
  
  .skill-progress-bar {
    height: 8px;
    background: var(--bg-tertiary);
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }
  
  .skill-progress-fill {
    height: 100%;
    border-radius: 4px;
    background: linear-gradient(90deg, var(--accent-blue), var(--accent-cyan));
    transition: width 1s ease-out;
    position: relative;
  }
  
  .skill-progress-fill::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    animation: shimmer-bar 2s infinite;
  }
  
  @keyframes shimmer-bar {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  /* Circular Progress Widget */
  .circular-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    justify-content: center;
    margin-top: 40px;
  }
  
  .circular-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  
  .circular-progress {
    position: relative;
    width: 120px;
    height: 120px;
  }
  
  .circular-progress svg {
    transform: rotate(-90deg);
    width: 120px;
    height: 120px;
  }
  
  .circular-progress .bg {
    fill: none;
    stroke: var(--bg-tertiary);
    stroke-width: 8;
  }
  
  .circular-progress .progress {
    fill: none;
    stroke: url(#gradient);
    stroke-width: 8;
    stroke-linecap: round;
    stroke-dasharray: 314;
    stroke-dashoffset: 314;
    transition: stroke-dashoffset 1.5s ease-out;
  }
  
  .circular-progress .value {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: var(--font-mono);
    font-size: 24px;
    font-weight: 700;
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-cyan));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .circular-stat-label {
    font-size: 14px;
    color: var(--text-muted);
    text-align: center;
  }
  
  /* GitHub Activity Section */
  .github-activity-section {
    padding: 80px 0;
  }
  
  .github-accounts {
    display: flex;
    flex-direction: column;
    gap: 48px;
  }
  
  .github-account {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 32px;
  }
  
  .github-account-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }
  
  .github-account-header h3 {
    font-size: 20px;
    font-weight: 600;
  }
  
  .github-account-header .account-type {
    font-size: 12px;
    font-family: var(--font-mono);
    padding: 4px 10px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border);
    border-radius: 100px;
    color: var(--text-muted);
  }
  
  .github-account-header .account-type.personal {
    color: var(--accent-cyan);
    border-color: var(--accent-cyan);
    background: rgba(6, 182, 212, 0.1);
  }
  
  .github-account-header .account-type.work {
    color: var(--accent-purple);
    border-color: var(--accent-purple);
    background: rgba(139, 92, 246, 0.1);
  }
  
  .github-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }
  
  .github-stat-card {
    background: var(--bg-tertiary);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .github-stat-card:hover {
    border-color: var(--accent-blue);
    transform: translateY(-2px);
  }
  
  .github-stat-card img {
    width: 100%;
    height: auto;
    display: block;
  }
  
  .github-contribution-graph {
    margin-top: 20px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    padding: 16px;
  }
  
  .github-contribution-graph img {
    width: 100%;
    height: auto;
    display: block;
  }
  
  /* Language Bar for Repos */
  .repo-languages {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--border);
  }
  
  .repo-language-bar {
    display: flex;
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
    background: var(--bg-tertiary);
    margin-bottom: 8px;
  }
  
  .repo-language-segment {
    height: 100%;
    transition: all 0.3s ease;
  }
  
  .repo-language-segment:hover {
    filter: brightness(1.2);
  }
  
  .repo-language-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 16px;
    font-size: 11px;
  }
  
  .repo-language-item {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text-muted);
  }
  
  .repo-language-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  
  .repo-language-name {
    font-weight: 500;
    color: var(--text-secondary);
  }
  
  .repo-language-percent {
    color: var(--text-muted);
  }
  
  /* Career Timeline */
  .career-timeline {
    position: relative;
    padding-left: 40px;
  }
  
  @media (max-width: 600px) {
    .career-timeline {
      padding-left: 32px;
    }
  }
  
  .career-timeline::before {
    content: '';
    position: absolute;
    left: 12px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, var(--accent-blue), var(--accent-cyan), var(--accent-purple));
  }
  
  @media (max-width: 600px) {
    .career-timeline::before {
      left: 10px;
    }
  }
  
  .career-item {
    position: relative;
    margin-bottom: 48px;
  }
  
  @media (max-width: 480px) {
    .career-item {
      margin-bottom: 32px;
    }
  }
  
  .career-item:last-child {
    margin-bottom: 0;
  }
  
  .career-marker {
    position: absolute;
    left: -40px;
    top: 0;
    width: 26px;
    height: 26px;
    background: var(--bg-primary);
    border: 2px solid var(--accent-blue);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    z-index: 1;
  }
  
  @media (max-width: 600px) {
    .career-marker {
      left: -32px;
      width: 22px;
      height: 22px;
      font-size: 12px;
    }
  }
  
  .career-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px;
    transition: all 0.3s ease;
  }
  
  @media (max-width: 480px) {
    .career-card {
      padding: 20px;
      border-radius: 12px;
    }
  }
  
  .career-card:hover {
    border-color: var(--accent-blue);
    transform: translateX(4px);
  }
  
  .career-header {
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    .career-header {
      margin-bottom: 16px;
    }
  }
  
  .career-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 8px;
  }
  
  @media (max-width: 480px) {
    .career-title {
      font-size: 18px;
    }
  }
  
  .career-company {
    font-size: 16px;
    color: var(--accent-cyan);
    font-weight: 500;
    margin-bottom: 4px;
  }
  
  @media (max-width: 480px) {
    .career-company {
      font-size: 14px;
    }
  }
  
  .career-meta {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    font-size: 13px;
    color: var(--text-muted);
  }
  
  .career-meta span {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .career-highlights {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .career-highlights li {
    position: relative;
    padding-left: 20px;
    margin-bottom: 12px;
    font-size: 14px;
    line-height: 1.6;
    color: var(--text-secondary);
  }
  
  .career-highlights li:last-child {
    margin-bottom: 0;
  }
  
  .career-highlights li::before {
    content: '▸';
    position: absolute;
    left: 0;
    color: var(--accent-blue);
    font-size: 12px;
  }
  
  .career-technologies {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
  }
  
  .career-tech-tag {
    font-size: 11px;
    font-family: var(--font-mono);
    padding: 4px 10px;
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 4px;
    color: var(--accent-cyan);
  }
  
  /* Architecture Section */
  .architecture-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    align-items: start;
  }
  
  @media (max-width: 1024px) {
    .architecture-container {
      grid-template-columns: 1fr;
    }
  }
  
  .architecture-diagram {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 32px;
    text-align: center;
  }
  
  @media (max-width: 480px) {
    .architecture-diagram {
      padding: 20px;
    }
  }
  
  .architecture-diagram h3 {
    font-size: 18px;
    margin-bottom: 24px;
    color: var(--text-primary);
  }
  
  @media (max-width: 480px) {
    .architecture-diagram h3 {
      font-size: 16px;
      margin-bottom: 16px;
    }
  }
  
  .arch-flow {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  
  /* X-shaped Architecture Layout */
  .arch-x-layout {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  
  .arch-x-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
  
  .arch-x-center {
    display: flex;
    justify-content: center;
  }
  
  .arch-node-center {
    background: rgba(123, 66, 188, 0.1) !important;
  }
  
  .arch-x-arrow-down {
    color: var(--accent-blue);
    font-size: 24px;
    font-weight: bold;
  }
  
  .arch-x-arrows-split {
    display: flex;
    justify-content: center;
    gap: 80px;
    color: var(--accent-blue);
    font-size: 24px;
    font-weight: bold;
  }
  
  .arch-arrow-h {
    color: var(--accent-blue);
    font-size: 20px;
    font-weight: bold;
  }
  
  @media (max-width: 600px) {
    .arch-x-layout {
      gap: 6px;
    }
    
    .arch-x-row {
      gap: 8px;
    }
    
    .arch-x-arrow-down {
      font-size: 18px;
    }
    
    .arch-x-arrows-split {
      gap: 40px;
      font-size: 18px;
    }
    
    .arch-arrow-h {
      font-size: 14px;
    }
  }
  
  @media (max-width: 480px) {
    .arch-flow {
      gap: 12px;
    }
  }
  
  .arch-node {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 24px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border);
    border-radius: 12px;
    min-width: 200px;
    transition: all 0.3s ease;
  }
  
  @media (max-width: 480px) {
    .arch-node {
      padding: 12px 16px;
      min-width: 160px;
      gap: 10px;
    }
  }
  
  .arch-node:hover {
    border-color: var(--accent-blue);
    transform: scale(1.02);
  }
  
  .arch-node.highlight {
    border-color: var(--accent-cyan);
    background: rgba(6, 182, 212, 0.1);
  }
  
  .arch-node-icon {
    font-size: 28px;
  }
  
  @media (max-width: 480px) {
    .arch-node-icon {
      font-size: 22px;
    }
  }
  
  .arch-node-info h4 {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 2px;
  }
  
  @media (max-width: 480px) {
    .arch-node-info h4 {
      font-size: 12px;
    }
  }
  
  .arch-node-info span {
    font-size: 11px;
    color: var(--text-muted);
    font-family: var(--font-mono);
  }
  
  @media (max-width: 480px) {
    .arch-node-info span {
      font-size: 10px;
    }
  }
  
  .arch-arrow {
    color: var(--accent-blue);
    font-size: 20px;
  }
  
  @media (max-width: 480px) {
    .arch-arrow {
      font-size: 16px;
    }
  }
  
  .architecture-code {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
  }
  
  .architecture-code-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--border);
  }
  
  @media (max-width: 480px) {
    .architecture-code-header {
      padding: 10px 16px;
    }
  }
  
  .architecture-code-header h3 {
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  @media (max-width: 480px) {
    .architecture-code-header h3 {
      font-size: 12px;
    }
  }
  
  .architecture-code-content {
    padding: 20px;
    max-height: 500px;
    overflow-y: auto;
  }
  
  @media (max-width: 480px) {
    .architecture-code-content {
      padding: 12px;
      max-height: 350px;
    }
  }
  
  .architecture-code-content pre {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 12px;
    line-height: 1.6;
    color: var(--text-secondary);
    white-space: pre-wrap;
    word-break: break-word;
  }
  
  @media (max-width: 480px) {
    .architecture-code-content pre {
      font-size: 10px;
      line-height: 1.5;
    }
  }
  
  .code-highlighted {
    line-height: 1.6;
  }
  
  .code-comment {
    color: #6a9955;
    font-style: italic;
  }
  
  .code-keyword {
    color: #c586c0;
    font-weight: 600;
  }
  
  .code-string {
    color: #ce9178;
  }
  
  .code-attr {
    color: #9cdcfe;
  }
  
  .code-bool {
    color: #569cd6;
    font-weight: 600;
  }
  
  .code-ref {
    color: #4ec9b0;
  }
  
  .code-number {
    color: #b5cea8;
  }
  
  [data-theme="light"] .code-number {
    color: #098658;
  }
  
  [data-theme="light"] .code-comment {
    color: #008000;
  }
  
  [data-theme="light"] .code-keyword {
    color: #af00db;
  }
  
  [data-theme="light"] .code-string {
    color: #a31515;
  }
  
  [data-theme="light"] .code-attr {
    color: #001080;
  }
  
  [data-theme="light"] .code-bool {
    color: #0000ff;
  }
  
  [data-theme="light"] .code-ref {
    color: #267f99;
  }
  
  .arch-features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
    margin-top: 32px;
  }
  
  @media (max-width: 480px) {
    .arch-features {
      grid-template-columns: 1fr;
      gap: 12px;
      margin-top: 24px;
    }
  }
  
  .arch-feature {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
  }
  
  .arch-feature-icon {
    font-size: 24px;
    flex-shrink: 0;
  }
  
  .arch-feature h4 {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 4px;
  }
  
  .arch-feature p {
    font-size: 12px;
    color: var(--text-muted);
    line-height: 1.5;
  }
  
  /* Contact Section */
  .contact-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: start;
  }
  
  @media (max-width: 900px) {
    .contact-container {
      grid-template-columns: 1fr;
      gap: 32px;
    }
  }
  
  .contact-info {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  @media (max-width: 480px) {
    .contact-info {
      gap: 16px;
    }
  }
  
  .contact-info p {
    font-size: 16px;
    color: var(--text-secondary);
    line-height: 1.7;
  }
  
  @media (max-width: 480px) {
    .contact-info p {
      font-size: 14px;
    }
  }
  
  .contact-links {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }
  
  @media (max-width: 480px) {
    .contact-links {
      flex-direction: column;
      gap: 12px;
    }
  }
  
  .contact-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 28px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    text-decoration: none;
    color: var(--text-primary);
    font-weight: 500;
    transition: all 0.2s ease;
  }
  
  @media (max-width: 480px) {
    .contact-link {
      padding: 14px 20px;
      justify-content: center;
    }
  }
  
  .contact-link:hover {
    border-color: var(--accent-blue);
    transform: translateY(-2px);
  }
  
  .contact-link svg {
    width: 20px;
    height: 20px;
  }
  
  /* Contact Form */
  .contact-form {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 32px;
  }
  
  .contact-form h3 {
    font-size: 20px;
    margin-bottom: 24px;
    color: var(--text-primary);
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-secondary);
    margin-bottom: 8px;
  }
  
  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 14px 16px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text-primary);
    font-family: var(--font-sans);
    font-size: 15px;
    transition: all 0.2s ease;
  }
  
  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: var(--accent-blue);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .form-group input::placeholder,
  .form-group textarea::placeholder {
    color: var(--text-muted);
  }
  
  .form-group textarea {
    min-height: 120px;
    resize: vertical;
  }
  
  .submit-btn {
    width: 100%;
    padding: 16px 24px;
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-cyan));
    border: none;
    border-radius: 8px;
    color: white;
    font-family: var(--font-sans);
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  
  .submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
  }
  
  .submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
  
  .submit-btn svg {
    width: 18px;
    height: 18px;
  }
  
  .form-success {
    text-align: center;
    padding: 40px 20px;
  }
  
  .form-success-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  .form-success h4 {
    font-size: 20px;
    color: var(--text-primary);
    margin-bottom: 8px;
  }
  
  .form-success p {
    color: var(--text-secondary);
  }
  
  /* Footer */
  .footer {
    padding: 40px 0;
    border-top: 1px solid var(--border);
    text-align: center;
  }
  
  .footer p {
    font-size: 14px;
    color: var(--text-muted);
    font-family: var(--font-mono);
  }
  
  /* Loading States */
  .skeleton {
    background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-card) 50%, var(--bg-tertiary) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
  }
  
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .hero h1 {
      font-size: 40px;
    }
    
    .hero-title {
      font-size: 24px;
    }
    
    .stats-bar {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .section {
      padding: 60px 0;
    }
  }
`;

// ============================================================================
// COMPONENTS
// ============================================================================

// GitHub Stats Hook
function useGitHubStats(username) {
  const [stats, setStats] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [linesOfCode, setLinesOfCode] = useState({ added: 0, deleted: 0 });
  
  useEffect(() => {
    if (!username || username === 'YOUR_GITHUB_USERNAME') {
      setLoading(false);
      return;
    }
    
    async function fetchData() {
      try {
        // Fetch user data
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        if (!userRes.ok) {
          console.warn('GitHub API rate limited or user not found');
          setLoading(false);
          return;
        }
        const userData = await userRes.json();
        
        // Fetch all repos for stats calculation
        const allReposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        const allReposData = await allReposRes.json();
        
        // Get top 6 repos for display and fetch their languages
        const displayReposRaw = allReposData.slice(0, 6);
        
        // Fetch languages for each display repo
        const displayRepos = await Promise.all(
          displayReposRaw.map(async (repo) => {
            try {
              const langRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/languages`);
              const langData = await langRes.json();
              return { ...repo, languages: langData };
            } catch (e) {
              return { ...repo, languages: {} };
            }
          })
        );
        
        setStats({
          publicRepos: userData.public_repos,
          followers: userData.followers,
        });
        setRepos(displayRepos);
        
        // Fetch lines of code from contributor stats with retry logic
        // GitHub's stats API returns 202 on first request while computing, need to retry
        let totalAdded = 0;
        let totalDeleted = 0;
        
        const fetchWithRetry = async (url, retries = 3, delay = 1000) => {
          for (let i = 0; i < retries; i++) {
            const res = await fetch(url);
            if (res.status === 200) {
              return await res.json();
            } else if (res.status === 202) {
              // GitHub is computing stats, wait and retry
              await new Promise(r => setTimeout(r, delay));
            } else {
              return null;
            }
          }
          return null;
        };
        
        // Fetch contributor stats for each repo to get lines added/deleted
        const statsPromises = allReposData.slice(0, 10).map(async (repo) => {
          try {
            const statsData = await fetchWithRetry(`https://api.github.com/repos/${username}/${repo.name}/stats/contributors`);
            if (Array.isArray(statsData)) {
              // Find the user's contributions
              const userStats = statsData.find(c => c.author?.login?.toLowerCase() === username.toLowerCase());
              if (userStats && userStats.weeks) {
                userStats.weeks.forEach(week => {
                  totalAdded += week.a || 0;
                  totalDeleted += week.d || 0;
                });
              }
            }
          } catch (e) {
            // Silently fail for individual repos
          }
        });
        
        await Promise.all(statsPromises);
        setLinesOfCode({ added: totalAdded, deleted: totalDeleted });
        
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [username]);
  
  return { stats, repos, loading, linesOfCode };
}

// Copy to clipboard hook
function useCopyToClipboard() {
  const [copiedId, setCopiedId] = useState(null);
  
  const copy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  return { copiedId, copy };
}

// Language colors for GitHub repos
const languageColors = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  HCL: '#844fba',
  Shell: '#89e051',
  PowerShell: '#012456',
  Go: '#00ADD8',
  Rust: '#dea584',
  default: '#6e7681',
};

// ============================================================================
// TECH ICONS COMPONENT
// ============================================================================
function TechIcon({ name }) {
  const icons = {
    aws: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ color: '#FF9900' }}>
        <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167z"/>
      </svg>
    ),
    azure: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ color: '#0078D4' }}>
        <path d="M5.483 21.3H24L14.025 4.013l-3.038 8.347 5.836 6.938L5.483 21.3zM13.23 2.7L6.105 8.677 0 19.253h5.505v.014L13.23 2.7z"/>
      </svg>
    ),
    terraform: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ color: '#7B42BC' }}>
        <path d="M1.44 0v7.575l6.561 3.79V3.787L1.44 0zm7.94 4.553v7.574l6.56 3.788V8.34L9.38 4.553zm0 8.738v7.575l6.56 3.787v-7.574l-6.56-3.788zm7.94-4.952v7.574l6.56-3.787V4.55l-6.56 3.789z"/>
      </svg>
    ),
    docker: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ color: '#2496ED' }}>
        <path d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.186m0 2.716h2.118a.187.187 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 0 0 .184-.186V6.29a.185.185 0 0 0-.185-.185H8.1a.185.185 0 0 0-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 0 0 .185-.186V6.29a.185.185 0 0 0-.185-.185H5.136a.186.186 0 0 0-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.185-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.084.185.185.185m-2.92 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.186.186 0 0 0-.185.185v1.888c0 .102.084.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 0 0-.75.748 11.376 11.376 0 0 0 .692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 0 0 3.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z"/>
      </svg>
    ),
    kubernetes: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ color: '#326CE5' }}>
        <path d="M10.204 14.35l.007.01-.999 2.413a5.171 5.171 0 0 1-2.075-2.597l2.578-.437.004.005a.44.44 0 0 1 .484.606zm-.833-2.129a.44.44 0 0 0 .173-.756l.002-.011L7.585 9.7a5.143 5.143 0 0 0-.73 3.255l2.514-.725.002-.009zm1.145-1.98a.44.44 0 0 0 .699-.337l.01-.005.15-2.62a5.144 5.144 0 0 0-3.01 1.442l2.147 1.523.004-.002zm.76 2.75l.723.349.722-.347.18-.78-.5-.623h-.804l-.5.623.179.778zm1.5-2.095a.44.44 0 0 0 .7.336l.008.003 2.134-1.513a5.188 5.188 0 0 0-2.992-1.442l.148 2.615.002.001zm10.876 5.97l-5.773 7.181a1.6 1.6 0 0 1-1.248.594H9.261a1.6 1.6 0 0 1-1.247-.594l-5.776-7.18a1.583 1.583 0 0 1-.307-1.34L3.823 5.12a1.583 1.583 0 0 1 .947-1.074l7.703-3.2a1.6 1.6 0 0 1 1.227 0l7.703 3.2c.478.198.84.598.947 1.074l1.89 10.406c.108.503-.023 1.014-.307 1.34zm-8.09-6.756a.44.44 0 0 0 .18.758l.009.001 2.566.724a5.188 5.188 0 0 0-.72-3.266l-2.03 1.778-.004.005zm.136 2.95l-.007.006 1.01 2.418a5.188 5.188 0 0 0 2.067-2.61l-2.578-.422-.003.005a.44.44 0 0 0-.49.603z"/>
      </svg>
    ),
    python: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ color: '#3776AB' }}>
        <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"/>
      </svg>
    ),
  };
  
  return icons[name] || null;
}

// ============================================================================
// MAIN APP
// ============================================================================

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [activeTab, setActiveTab] = useState('powershell');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('a-z');
  const [expandedScript, setExpandedScript] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(['powershell']);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  // Terraform page state
  const [tfSearchQuery, setTfSearchQuery] = useState('');
  const [tfSortOrder, setTfSortOrder] = useState('az');
  const [expandedModule, setExpandedModule] = useState(null);
  const [expandedProviders, setExpandedProviders] = useState(['aws']);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedTfSubcategory, setSelectedTfSubcategory] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [formStatus, setFormStatus] = useState('idle'); // idle, sending, success, error
  const { stats, repos, loading, linesOfCode } = useGitHubStats(CONFIG.github);
  const { copiedId, copy } = useCopyToClipboard();
  
  // Filter and sort scripts
  const filteredScripts = React.useMemo(() => {
    let scripts = [...SCRIPTS_DATA];
    
    // Filter by category and subcategory
    if (selectedCategory && selectedSubcategory) {
      scripts = scripts.filter(s => s.category === selectedCategory && s.subcategory === selectedSubcategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      scripts = scripts.filter(s => 
        s.title.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Sort
    switch (sortOrder) {
      case 'newest':
        scripts.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        break;
      case 'oldest':
        scripts.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
        break;
      case 'a-z':
        scripts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'z-a':
        scripts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }
    
    return scripts;
  }, [selectedCategory, selectedSubcategory, searchQuery, sortOrder]);
  
  // Filter and sort Terraform modules
  const filteredModules = useMemo(() => {
    let modules = [...TERRAFORM_MODULES];
    
    // Filter by provider and subcategory
    if (selectedProvider && selectedTfSubcategory) {
      modules = modules.filter(m => m.provider === selectedProvider && m.subcategory === selectedTfSubcategory);
    } else if (selectedProvider) {
      modules = modules.filter(m => m.provider === selectedProvider);
    }
    
    // Filter by search query
    if (tfSearchQuery.trim()) {
      const query = tfSearchQuery.toLowerCase();
      modules = modules.filter(m => 
        m.title.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query) ||
        m.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Sort
    switch (tfSortOrder) {
      case 'newest':
        modules.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        break;
      case 'oldest':
        modules.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
        break;
      case 'az':
        modules.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'za':
        modules.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        modules.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    return modules;
  }, [selectedProvider, selectedTfSubcategory, tfSearchQuery, tfSortOrder]);
  
  // Scroll animation refs
  const [skillsRef, skillsVisible] = useScrollAnimation();
  const [careerRef, careerVisible] = useScrollAnimation();
  const [certsRef, certsVisible] = useScrollAnimation();
  const [archRef, archVisible] = useScrollAnimation();
  const [reposRef, reposVisible] = useScrollAnimation();
  const [contactRef, contactVisible] = useScrollAnimation();
  
  // Theme toggle
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };
  
  // Contact form handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    
    const formData = new FormData(e.target);
    
    try {
      // Create your form at formspree.io and replace the ID below
      const response = await fetch('https://formspree.io/f/mwpkgjvq', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setFormStatus('success');
        e.target.reset();
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      setFormStatus('error');
    }
  };
  
  // Load Credly embed script when badges are configured
  useEffect(() => {
    if (CONFIG.credlyBadges.length > 0) {
      const script = document.createElement('script');
      script.src = '//cdn.credly.com/assets/utilities/embed.js';
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);
  
  return (
    <>
      <style>{styles}</style>
      
      {/* Theme Toggle Button */}
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'dark' ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>
      
      {/* Navigation Header */}
      <header className="nav-header">
        <div className="nav-container">
          <button onClick={() => setCurrentPage('home')} className="nav-logo">
            <span>&lt;</span>beyops<span>/&gt;</span>
          </button>
          <nav className="nav-tabs">
            <button onClick={() => setCurrentPage('home')} className={`nav-tab ${currentPage === 'home' ? 'active' : ''}`}>Home</button>
            <button onClick={() => setCurrentPage('scripts')} className={`nav-tab ${currentPage === 'scripts' ? 'active' : ''}`}>Scripts</button>
            <button onClick={() => setCurrentPage('terraform')} className={`nav-tab ${currentPage === 'terraform' ? 'active' : ''}`}>Terraform Modules</button>
            <button className="nav-tab coming-soon" title="Coming Soon">Diagrams</button>
          </nav>
        </div>
      </header>
      
      <div className="app-content">
      {/* SVG Gradient Definition for circular progress */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent-blue)" />
            <stop offset="100%" stopColor="var(--accent-cyan)" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Abstract Animated Background */}
      <div className="abstract-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-overlay" />
        <div className="noise-overlay" />
      </div>
      
      {/* Scripts Page */}
      {currentPage === 'scripts' && (
        <div className="scripts-page">
          <div className="scripts-layout">
            {/* Sidebar */}
            <aside className="scripts-sidebar">
              <div className="sidebar-header">
                <h2>Scripts Library</h2>
                <p>{SCRIPTS_DATA.length} scripts available</p>
              </div>
              
              <div className="sidebar-search">
                <input
                  type="text"
                  placeholder="Search scripts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="sidebar-categories">
                {/* All Scripts Option */}
                <div 
                  className={`sidebar-all-scripts ${selectedCategory === null && selectedSubcategory === null ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedSubcategory(null);
                  }}
                >
                  <span>All Scripts</span>
                  <span className="sidebar-subcategory-count">{SCRIPTS_DATA.length}</span>
                </div>
                
                {Object.entries(CATEGORIES).map(([catKey, catConfig]) => {
                  const subcats = getSubcategories(catKey);
                  const isExpanded = expandedCategories.includes(catKey);
                  
                  return (
                    <div key={catKey} className={`sidebar-category ${isExpanded ? 'expanded' : ''}`}>
                      <div 
                        className="sidebar-category-header"
                        onClick={() => {
                          if (isExpanded) {
                            setExpandedCategories(expandedCategories.filter(c => c !== catKey));
                          } else {
                            setExpandedCategories([...expandedCategories, catKey]);
                          }
                        }}
                      >
                        <span className="sidebar-category-label" dangerouslySetInnerHTML={{ __html: catConfig.icon + catConfig.label }} />
                        <svg className="sidebar-category-toggle" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 9l6 6 6-6"/>
                        </svg>
                      </div>
                      <div className="sidebar-subcategories">
                        {subcats.map(subcat => {
                          const count = SCRIPTS_DATA.filter(s => s.category === catKey && s.subcategory === subcat).length;
                          const isActive = selectedCategory === catKey && selectedSubcategory === subcat;
                          const subcatIcon = SUBCATEGORY_ICONS[subcat] || '';
                          
                          return (
                            <div 
                              key={subcat}
                              className={`sidebar-subcategory ${isActive ? 'active' : ''}`}
                              onClick={() => {
                                setSelectedCategory(catKey);
                                setSelectedSubcategory(subcat);
                              }}
                            >
                              <span className="sidebar-subcategory-label">
                                {subcatIcon && <span dangerouslySetInnerHTML={{ __html: subcatIcon }} />}
                                {subcat}
                              </span>
                              <span className="sidebar-subcategory-count">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </aside>
            
            {/* Main Content */}
            <main className="scripts-main">
              <div className="scripts-main-header">
                <div>
                  <h3 className="scripts-main-title">
                    {selectedSubcategory ? `${CATEGORIES[selectedCategory]?.label} → ${selectedSubcategory}` : 'All Scripts'}
                  </h3>
                  <span className="scripts-main-count">{filteredScripts.length} script{filteredScripts.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="scripts-sort">
                  <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="a-z">A → Z</option>
                    <option value="z-a">Z → A</option>
                  </select>
                </div>
              </div>
              
              <div className="scripts-list">
                {filteredScripts.length > 0 ? (
                  filteredScripts.map((script) => (
                    <div 
                      key={script.id} 
                      className={`script-item ${expandedScript === script.id ? 'expanded' : ''}`}
                    >
                      <div 
                        className="script-item-header"
                        onClick={() => setExpandedScript(expandedScript === script.id ? null : script.id)}
                      >
                        <div className="script-item-info">
                          <h4 className="script-item-title">
                            <span className="script-item-icon" dangerouslySetInnerHTML={{ __html: getScriptIcon(script) }} />
                            {script.title}
                          </h4>
                          <p className="script-item-description">{script.description}</p>
                        </div>
                        <div className="script-item-toggle">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 9l6 6 6-6"/>
                          </svg>
                        </div>
                      </div>
                      <div className="script-item-content">
                        <div className="script-item-code-wrapper">
                          <div className="script-item-code-header">
                            <div className="script-item-tags">
                              {script.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="script-item-tag">{tag}</span>
                              ))}
                            </div>
                            <button
                              className={`copy-btn ${copiedId === script.id ? 'copied' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                copy(script.code, script.id);
                              }}
                            >
                              {copiedId === script.id ? '✓ Copied' : 'Copy'}
                            </button>
                          </div>
                          <div className="script-item-code">
                            <pre dangerouslySetInnerHTML={{ __html: highlightCode(script.code, script.category) }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="scripts-empty">
                    <p>No scripts found matching your criteria.</p>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      )}
      
      {/* Terraform Modules Page */}
      {currentPage === 'terraform' && (
        <div className="scripts-page">
          <div className="scripts-layout">
            {/* Sidebar */}
            <aside className="scripts-sidebar">
              <div className="sidebar-search">
                <input 
                  type="text" 
                  placeholder="Search modules..." 
                  value={tfSearchQuery}
                  onChange={(e) => setTfSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="sidebar-categories">
                {/* All Modules Option */}
                <div 
                  className={`sidebar-all-scripts ${!selectedProvider ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedProvider(null);
                    setSelectedTfSubcategory(null);
                  }}
                >
                  <span className="sidebar-all-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                    </svg>
                  </span>
                  <span>All Modules</span>
                  <span className="sidebar-count">{TERRAFORM_MODULES.length}</span>
                </div>
                
                {Object.entries(TF_PROVIDERS).map(([providerKey, provider]) => {
                  const providerModules = TERRAFORM_MODULES.filter(m => m.provider === providerKey);
                  const subcategories = getTfSubcategories(providerKey);
                  const isExpanded = expandedProviders.includes(providerKey);
                  
                  return (
                    <div key={providerKey} className="sidebar-category">
                      <div 
                        className={`sidebar-category-header ${selectedProvider === providerKey && !selectedTfSubcategory ? 'active' : ''}`}
                        onClick={() => {
                          if (isExpanded) {
                            setExpandedProviders(expandedProviders.filter(c => c !== providerKey));
                          } else {
                            setExpandedProviders([...expandedProviders, providerKey]);
                          }
                          setSelectedProvider(providerKey);
                          setSelectedTfSubcategory(null);
                        }}
                      >
                        <span className="sidebar-category-icon" dangerouslySetInnerHTML={{ __html: provider.icon }} />
                        <span className="sidebar-category-label">{provider.label}</span>
                        <span className="sidebar-count">{providerModules.length}</span>
                        <span className={`sidebar-chevron ${isExpanded ? 'expanded' : ''}`}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18l6-6-6-6"/>
                          </svg>
                        </span>
                      </div>
                      
                      {isExpanded && (
                        <div className="sidebar-subcategories">
                          {subcategories.map(sub => {
                            const subCount = providerModules.filter(m => m.subcategory === sub).length;
                            return (
                              <div 
                                key={sub}
                                className={`sidebar-subcategory ${selectedProvider === providerKey && selectedTfSubcategory === sub ? 'active' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedProvider(providerKey);
                                  setSelectedTfSubcategory(sub);
                                }}
                              >
                                <span className="subcategory-label">
                                  <span className="subcategory-icon" dangerouslySetInnerHTML={{ __html: TF_SUBCATEGORY_ICONS[sub] || '' }} />
                                  {sub}
                                </span>
                                <span className="sidebar-count">{subCount}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </aside>
            
            {/* Main Content */}
            <main className="scripts-main">
              <div className="scripts-main-header">
                <div>
                  <h3 className="scripts-main-title">
                    {selectedTfSubcategory ? `${TF_PROVIDERS[selectedProvider]?.label} → ${selectedTfSubcategory}` : selectedProvider ? TF_PROVIDERS[selectedProvider]?.label : 'All Modules'}
                  </h3>
                  <span className="scripts-main-count">{filteredModules.length} module{filteredModules.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="scripts-sort">
                  <select value={tfSortOrder} onChange={(e) => setTfSortOrder(e.target.value)}>
                    <option value="az">A → Z</option>
                    <option value="za">Z → A</option>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                  </select>
                </div>
              </div>
              
              <div className="scripts-list">
                {filteredModules.length > 0 ? (
                  filteredModules.map((module) => (
                    <div 
                      key={module.id} 
                      className={`script-item ${expandedModule === module.id ? 'expanded' : ''}`}
                    >
                      <div 
                        className="script-item-header"
                        onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                      >
                        <div className="script-item-info">
                          <h4 className="script-item-title">
                            <span className="script-item-icon" dangerouslySetInnerHTML={{ __html: getTfModuleIcon(module) }} />
                            {module.title}
                          </h4>
                          <p className="script-item-description">{module.description}</p>
                        </div>
                        <div className="script-item-toggle">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 9l6 6 6-6"/>
                          </svg>
                        </div>
                      </div>
                      <div className="script-item-content">
                        <div className="script-item-code-wrapper">
                          <div className="script-item-code-header">
                            <div className="script-item-tags">
                              {module.tags.map(tag => (
                                <span key={tag} className="script-tag">{tag}</span>
                              ))}
                            </div>
                            <button 
                              className={`copy-btn ${copiedId === module.id ? 'copied' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                copy(module.code, module.id);
                              }}
                            >
                              {copiedId === module.id ? '✓ Copied' : 'Copy'}
                            </button>
                          </div>
                          <div className="script-item-code">
                            <pre dangerouslySetInnerHTML={{ __html: highlightTerraform(module.code) }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="scripts-empty">
                    <p>No modules found matching your criteria.</p>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      )}
      
      {/* Home Page Content */}
      {currentPage === 'home' && (
      <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">Available for opportunities</div>
          <h1>
            Hi, I'm <span>{CONFIG.name}</span>
          </h1>
          <p className="hero-title">{CONFIG.title}</p>
          <div className="hero-tech-stack">
            {CONFIG.techStack.map((tech, i) => (
              <div key={i} className="tech-item">
                <TechIcon name={tech.icon} />
                <span>{tech.name}</span>
              </div>
            ))}
          </div>
          
          <div className="hero-cta">
            <a href={`https://github.com/${CONFIG.github}`} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              View GitHub
            </a>
            <a href={CONFIG.resumeUrl} className="btn btn-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              Download Resume
            </a>
          </div>
          
          {/* Stats Bar - moved into hero */}
          <div className="stats-bar" style={{ marginTop: '32px' }}>
            <div className="stat-card">
              <div className="stat-value">{CONFIG.yearsExperience}+</div>
              <div className="stat-label">Years Experience</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">70+</div>
              <div className="stat-label">AWS Accounts Managed</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">10</div>
              <div className="stat-label">Certifications</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">2,000+</div>
              <div className="stat-label">Terraform Runs</div>
            </div>
          </div>
          
          </div>
      </section>
      
      {/* Architecture Section - How This Site is Built */}
      <section className="section" style={{ paddingTop: '40px' }}>
        <div className="container">
          <div className="section-header">
            <p className="section-label">// Infrastructure as Code</p>
            <h2 className="section-title">How This Site is Built</h2>
          </div>
          
          <div className="architecture-container">
            {/* CI/CD Pipeline Diagram - X Shape */}
            <div className="architecture-diagram">
              <h3>CI/CD Pipeline & Infrastructure</h3>
              <div className="arch-x-layout">
                {/* Top Row: VS Code → GitHub */}
                <div className="arch-x-row">
                  <div className="arch-node" style={{ borderColor: '#007ACC' }}>
                    <span className="arch-node-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="#007ACC">
                        <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/>
                      </svg>
                    </span>
                    <div className="arch-node-info">
                      <h4>VS Code</h4>
                      <span>Development</span>
                    </div>
                  </div>
                  
                  <div className="arch-arrow-h">→</div>
                  
                  <div className="arch-node" style={{ borderColor: '#6e5494' }}>
                    <span className="arch-node-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                    </span>
                    <div className="arch-node-info">
                      <h4>GitHub</h4>
                      <span>Source Control</span>
                    </div>
                  </div>
                </div>
                
                {/* Arrow from GitHub down to Terraform */}
                <div className="arch-x-arrow-down">↓</div>
                
                {/* Center: Terraform Cloud */}
                <div className="arch-x-center">
                  <div className="arch-node arch-node-center" style={{ borderColor: '#7B42BC' }}>
                    <span className="arch-node-icon">
                      <svg width="32" height="32" viewBox="0 0 128 128" fill="#7B42BC">
                        <path d="M77.941 44.5v36.836L46.324 62.918V26.082zm0 0" />
                        <path d="M81.41 81.336l31.633-18.418V26.082L81.41 44.5zm0 0" />
                        <path d="M11.242 42.36L42.86 60.776V23.941L11.242 5.523zm0 0" />
                        <path d="M77.941 85.375L46.324 66.957v36.82l31.617 18.418zm0 0" />
                      </svg>
                    </span>
                    <div className="arch-node-info">
                      <h4>Terraform Cloud</h4>
                      <span>IaC Automation</span>
                    </div>
                  </div>
                </div>
                
                {/* Arrows down to AWS and Cloudflare */}
                <div className="arch-x-arrows-split">
                  <span>↙</span>
                  <span>↘</span>
                </div>
                
                {/* Bottom Row: AWS + Cloudflare */}
                <div className="arch-x-row">
                  <div className="arch-node" style={{ borderColor: '#FF9900' }}>
                    <span className="arch-node-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="#FF9900">
                        <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.414l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167z"/>
                      </svg>
                    </span>
                    <div className="arch-node-info">
                      <h4>AWS</h4>
                      <span>S3 + CloudFront</span>
                    </div>
                  </div>
                  
                  <div className="arch-node" style={{ borderColor: '#F38020' }}>
                    <span className="arch-node-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="#F38020">
                        <path d="M16.5088 16.8447c.1475-.5068.0908-.9707-.1553-1.3154-.2246-.3164-.6045-.499-1.0615-.5205l-8.6592-.1123a.1559.1559 0 0 1-.1333-.0713c-.0283-.042-.0351-.0986-.021-.1553.0278-.084.1123-.1484.2036-.1562l8.7359-.1123c1.0351-.0489 2.1582-.8984 2.5537-1.9336l.499-1.3086c.0215-.0576.0283-.1152.0147-.168-.5625-2.5254-2.8301-4.4062-5.5606-4.4062-2.499 0-4.6289 1.5898-5.4199 3.8086-.4844-.3594-1.0986-.5625-1.7696-.499-1.1953.1191-2.1484 1.0566-2.2891 2.2519-.0352.2871-.0205.5674.0283.8301C1.0273 12.3838 0 13.5918 0 15.0508c0 .1699.0137.3359.0352.499.0146.0918.0908.1602.1826.1602l15.7471.0059c.0283 0 .0566-.0059.0849-.0137.0566-.0205.1054-.0625.1269-.1192l.3321-.7314z"/>
                      </svg>
                    </span>
                    <div className="arch-node-info">
                      <h4>Cloudflare</h4>
                      <span>DNS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Terraform Code - Full main.tf */}
            <div className="architecture-code">
              <div className="architecture-code-header">
                <h3>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="16 18 22 12 16 6"/>
                    <polyline points="8 6 2 12 8 18"/>
                  </svg>
                  main.tf
                </h3>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Terraform • 332 lines</span>
              </div>
              <div className="architecture-code-content" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <pre className="code-highlighted">
                  <span className="code-comment"># S3 bucket stores the React build files</span>{'\n'}
                  <span className="code-keyword">resource</span> <span className="code-string">"aws_s3_bucket"</span> <span className="code-string">"website"</span> {'{\n'}
                  {'  '}<span className="code-attr">bucket</span> = <span className="code-string">"beyops.com"</span>{'\n'}
                  {'}\n\n'}
                  <span className="code-comment"># Block all public access - CloudFront handles delivery</span>{'\n'}
                  <span className="code-keyword">resource</span> <span className="code-string">"aws_s3_bucket_public_access_block"</span> <span className="code-string">"website"</span> {'{\n'}
                  {'  '}<span className="code-attr">bucket</span>                  = <span className="code-ref">aws_s3_bucket.website.id</span>{'\n'}
                  {'  '}<span className="code-attr">block_public_acls</span>       = <span className="code-bool">true</span>{'\n'}
                  {'  '}<span className="code-attr">block_public_policy</span>     = <span className="code-bool">true</span>{'\n'}
                  {'  '}<span className="code-attr">ignore_public_acls</span>      = <span className="code-bool">true</span>{'\n'}
                  {'  '}<span className="code-attr">restrict_public_buckets</span> = <span className="code-bool">true</span>{'\n'}
                  {'}\n\n'}
                  <span className="code-comment"># OAC allows CloudFront to securely access private S3</span>{'\n'}
                  <span className="code-keyword">resource</span> <span className="code-string">"aws_cloudfront_origin_access_control"</span> <span className="code-string">"website"</span> {'{\n'}
                  {'  '}<span className="code-attr">name</span>                              = <span className="code-string">"beyops-oac"</span>{'\n'}
                  {'  '}<span className="code-attr">origin_access_control_origin_type</span> = <span className="code-string">"s3"</span>{'\n'}
                  {'  '}<span className="code-attr">signing_behavior</span>                  = <span className="code-string">"always"</span>{'\n'}
                  {'  '}<span className="code-attr">signing_protocol</span>                  = <span className="code-string">"sigv4"</span>{'\n'}
                  {'}\n\n'}
                  <span className="code-comment"># SSL certificate for HTTPS (must be in us-east-1)</span>{'\n'}
                  <span className="code-keyword">resource</span> <span className="code-string">"aws_acm_certificate"</span> <span className="code-string">"website"</span> {'{\n'}
                  {'  '}<span className="code-attr">provider</span>                  = <span className="code-ref">aws.us_east_1</span>{'\n'}
                  {'  '}<span className="code-attr">domain_name</span>               = <span className="code-string">"beyops.com"</span>{'\n'}
                  {'  '}<span className="code-attr">subject_alternative_names</span> = [<span className="code-string">"www.beyops.com"</span>]{'\n'}
                  {'  '}<span className="code-attr">validation_method</span>         = <span className="code-string">"DNS"</span>{'\n'}
                  {'}\n\n'}
                  <span className="code-comment"># CDN for global edge caching and SSL termination</span>{'\n'}
                  <span className="code-keyword">resource</span> <span className="code-string">"aws_cloudfront_distribution"</span> <span className="code-string">"website"</span> {'{\n'}
                  {'  '}<span className="code-attr">enabled</span>             = <span className="code-bool">true</span>{'\n'}
                  {'  '}<span className="code-attr">default_root_object</span> = <span className="code-string">"index.html"</span>{'\n'}
                  {'  '}<span className="code-attr">aliases</span>             = [<span className="code-string">"beyops.com"</span>, <span className="code-string">"www.beyops.com"</span>]{'\n\n'}
                  {'  '}<span className="code-keyword">origin</span> {'{\n'}
                  {'    '}<span className="code-attr">domain_name</span>              = <span className="code-ref">aws_s3_bucket.website.bucket_regional_domain_name</span>{'\n'}
                  {'    '}<span className="code-attr">origin_access_control_id</span> = <span className="code-ref">aws_cloudfront_origin_access_control.website.id</span>{'\n'}
                  {'  }\n\n'}
                  {'  '}<span className="code-keyword">default_cache_behavior</span> {'{\n'}
                  {'    '}<span className="code-attr">viewer_protocol_policy</span> = <span className="code-string">"redirect-to-https"</span>{'\n'}
                  {'    '}<span className="code-attr">compress</span>               = <span className="code-bool">true</span>{'\n'}
                  {'  }\n\n'}
                  {'  '}<span className="code-comment"># SPA routing - serve index.html for all paths</span>{'\n'}
                  {'  '}<span className="code-keyword">custom_error_response</span> {'{\n'}
                  {'    '}<span className="code-attr">error_code</span>         = <span className="code-number">403</span>{'\n'}
                  {'    '}<span className="code-attr">response_code</span>      = <span className="code-number">200</span>{'\n'}
                  {'    '}<span className="code-attr">response_page_path</span> = <span className="code-string">"/index.html"</span>{'\n'}
                  {'  }\n\n'}
                  {'  '}<span className="code-keyword">viewer_certificate</span> {'{\n'}
                  {'    '}<span className="code-attr">acm_certificate_arn</span> = <span className="code-ref">aws_acm_certificate.website.arn</span>{'\n'}
                  {'    '}<span className="code-attr">ssl_support_method</span>  = <span className="code-string">"sni-only"</span>{'\n'}
                  {'  }\n'}
                  {'}\n\n'}
                  <span className="code-comment"># DNS records point domain to CloudFront</span>{'\n'}
                  <span className="code-keyword">resource</span> <span className="code-string">"cloudflare_record"</span> <span className="code-string">"apex"</span> {'{\n'}
                  {'  '}<span className="code-attr">zone_id</span> = <span className="code-ref">var.cloudflare_zone_id</span>{'\n'}
                  {'  '}<span className="code-attr">name</span>    = <span className="code-string">"@"</span>{'\n'}
                  {'  '}<span className="code-attr">content</span> = <span className="code-ref">aws_cloudfront_distribution.website.domain_name</span>{'\n'}
                  {'  '}<span className="code-attr">type</span>    = <span className="code-string">"CNAME"</span>{'\n'}
                  {'  '}<span className="code-attr">proxied</span> = <span className="code-bool">false</span>{'\n'}
                  {'}'}
                </pre>
              </div>
            </div>
          </div>
          
          {/* Feature highlights */}
          <div className="arch-features">
            <div className="arch-feature">
              <span className="arch-feature-icon">🔒</span>
              <div>
                <h4>SSL/TLS Encryption</h4>
                <p>ACM certificate with automatic renewal for HTTPS</p>
              </div>
            </div>
            <div className="arch-feature">
              <span className="arch-feature-icon">🌍</span>
              <div>
                <h4>Global CDN</h4>
                <p>CloudFront edge locations for low-latency delivery</p>
              </div>
            </div>
            <div className="arch-feature">
              <span className="arch-feature-icon">💰</span>
              <div>
                <h4>Cost Effective</h4>
                <p>~$0.50/month for S3 + CloudFront static hosting</p>
              </div>
            </div>
            <div className="arch-feature">
              <span className="arch-feature-icon">🔄</span>
              <div>
                <h4>CI/CD Ready</h4>
                <p>GitHub Actions deploys on push to main branch</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Career Timeline Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">// Experience</p>
            <h2 className="section-title">Career Timeline</h2>
          </div>
          
          <div className="career-timeline">
            {CONFIG.career.map((job, i) => (
              <div key={i} className="career-item">
                <div className="career-marker">{job.icon}</div>
                <div className="career-card">
                  <div className="career-header">
                    <h3 className="career-title">{job.title}</h3>
                    <div className="career-company">{job.company}</div>
                    <div className="career-meta">
                      <span>📍 {job.location}</span>
                      <span>📅 {job.period}</span>
                    </div>
                  </div>
                  {job.technologies && job.technologies.length > 0 && (
                    <div className="career-technologies">
                      {job.technologies.map((tech, k) => (
                        <span key={k} className="career-tech-tag">{tech}</span>
                      ))}
                    </div>
                  )}
                  <ul className="career-highlights">
                    {job.highlights.map((highlight, j) => (
                      <li key={j}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Skills Section with Progress Bars */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">// Expertise</p>
            <h2 className="section-title">Skills & Proficiency</h2>
          </div>
          
          <div className="skills-progress-grid">
            <div className="skill-progress-category">
              <h3><span>☁️</span> Cloud Platforms</h3>
              {CONFIG.skillsWithProgress.cloud.map((skill, i) => (
                <div key={i} className="skill-progress-item">
                  <div className="skill-progress-header">
                    <span className="skill-progress-name">{skill.name}</span>
                    <span className="skill-progress-percent">{skill.level}%</span>
                  </div>
                  <div className="skill-progress-bar">
                    <div className="skill-progress-fill" style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="skill-progress-category">
              <h3><span>🏗️</span> Infrastructure as Code</h3>
              {CONFIG.skillsWithProgress.iac.map((skill, i) => (
                <div key={i} className="skill-progress-item">
                  <div className="skill-progress-header">
                    <span className="skill-progress-name">{skill.name}</span>
                    <span className="skill-progress-percent">{skill.level}%</span>
                  </div>
                  <div className="skill-progress-bar">
                    <div className="skill-progress-fill" style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="skill-progress-category">
              <h3><span>⚙️</span> Automation</h3>
              {CONFIG.skillsWithProgress.automation.map((skill, i) => (
                <div key={i} className="skill-progress-item">
                  <div className="skill-progress-header">
                    <span className="skill-progress-name">{skill.name}</span>
                    <span className="skill-progress-percent">{skill.level}%</span>
                  </div>
                  <div className="skill-progress-bar">
                    <div className="skill-progress-fill" style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="skill-progress-category">
              <h3><span>🖥️</span> Platforms</h3>
              {CONFIG.skillsWithProgress.platforms.map((skill, i) => (
                <div key={i} className="skill-progress-item">
                  <div className="skill-progress-header">
                    <span className="skill-progress-name">{skill.name}</span>
                    <span className="skill-progress-percent">{skill.level}%</span>
                  </div>
                  <div className="skill-progress-bar">
                    <div className="skill-progress-fill" style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* GitHub Repos Section */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }} ref={skillsRef}>
        <div className={`container scroll-animate ${skillsVisible ? 'visible' : ''}`}>
          <div className="section-header">
            <p className="section-label">// Projects</p>
            <h2 className="section-title">GitHub Repositories</h2>
          </div>
          
          <div className="github-repos">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="repo-card">
                  <div className="skeleton" style={{ height: 24, width: '60%', marginBottom: 12 }} />
                  <div className="skeleton" style={{ height: 40, marginBottom: 16 }} />
                  <div className="skeleton" style={{ height: 16, width: '40%' }} />
                </div>
              ))
            ) : repos.length > 0 ? (
              repos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="repo-card"
                  style={{ textDecoration: 'none' }}
                >
                  <h3 className="repo-name">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                    </svg>
                    {repo.name}
                  </h3>
                  <p className="repo-description">
                    {repo.description || 'No description available'}
                  </p>
                  <div className="repo-stats">
                    <span className="repo-stat">⭐ {repo.stargazers_count}</span>
                    <span className="repo-stat">🔀 {repo.forks_count}</span>
                  </div>
                  
                  {/* Language breakdown bar */}
                  {repo.languages && Object.keys(repo.languages).length > 0 && (() => {
                    const total = Object.values(repo.languages).reduce((a, b) => a + b, 0);
                    const sortedLangs = Object.entries(repo.languages)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 6);
                    return (
                      <div className="repo-languages">
                        <div className="repo-language-bar">
                          {sortedLangs.map(([lang, bytes]) => (
                            <div
                              key={lang}
                              className="repo-language-segment"
                              style={{
                                width: `${(bytes / total) * 100}%`,
                                background: languageColors[lang] || languageColors.default,
                              }}
                              title={`${lang}: ${((bytes / total) * 100).toFixed(1)}%`}
                            />
                          ))}
                        </div>
                        <div className="repo-language-list">
                          {sortedLangs.map(([lang, bytes]) => (
                            <span key={lang} className="repo-language-item">
                              <span
                                className="repo-language-dot"
                                style={{ background: languageColors[lang] || languageColors.default }}
                              />
                              <span className="repo-language-name">{lang}</span>
                              <span className="repo-language-percent">{((bytes / total) * 100).toFixed(1)}%</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </a>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>
                Configure your GitHub username in CONFIG to display repos
              </p>
            )}
          </div>
          
          {/* GitHub Activity Stats - below repos */}
          <div className="github-accounts" style={{ marginTop: '48px' }}>
            <div className="github-account">
              <div className="github-account-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <h3>@{CONFIG.github}</h3>
                <span className="account-type personal">Personal</span>
              </div>
              
              {/* Stats from API */}
              <div className="github-stats-grid" style={{ marginBottom: '20px' }}>
                <div className="github-stat-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '32px' }}>📦</div>
                  <div>
                    <div style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'var(--font-mono)', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {loading ? '...' : stats?.publicRepos || 0}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Public Repos</div>
                  </div>
                </div>
                <div className="github-stat-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '32px' }}>👥</div>
                  <div>
                    <div style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'var(--font-mono)', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {loading ? '...' : stats?.followers || 0}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Followers</div>
                  </div>
                </div>
                <div className="github-stat-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '32px' }}>⭐</div>
                  <div>
                    <div style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'var(--font-mono)', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {loading ? '...' : repos.reduce((acc, repo) => acc + repo.stargazers_count, 0)}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total Stars</div>
                  </div>
                </div>
                <div className="github-stat-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '32px' }}>🔀</div>
                  <div>
                    <div style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'var(--font-mono)', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {loading ? '...' : repos.reduce((acc, repo) => acc + repo.forks_count, 0)}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total Forks</div>
                  </div>
                </div>
                <div className="github-stat-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '32px', color: '#22c55e' }}>++</div>
                  <div>
                    <div style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'var(--font-mono)', background: 'linear-gradient(135deg, #22c55e, #4ade80)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {loading ? '...' : linesOfCode.added.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Lines Added</div>
                  </div>
                </div>
                <div className="github-stat-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '32px', color: '#ef4444' }}>--</div>
                  <div>
                    <div style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'var(--font-mono)', background: 'linear-gradient(135deg, #ef4444, #f87171)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {loading ? '...' : linesOfCode.deleted.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Lines Deleted</div>
                  </div>
                </div>
              </div>
              
              <div className="github-contribution-graph">
                <img 
                  src={`https://ghchart.rshah.org/3b82f6/${CONFIG.github}`}
                  alt="GitHub Contribution Graph"
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            </div>
            
            {CONFIG.workGithub && (
              <div className="github-account">
                <div className="github-account-header">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  <h3>@{CONFIG.workGithub}</h3>
                  <span className="account-type work">Work</span>
                </div>
                
                <div className="github-contribution-graph">
                  <img 
                    src={`https://ghchart.rshah.org/8b5cf6/${CONFIG.workGithub}`}
                    alt="GitHub Contribution Graph"
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }} ref={contactRef}>
        <div className={`container scroll-animate ${contactVisible ? 'visible' : ''}`}>
          <div className="section-header">
            <p className="section-label">// Get in touch</p>
            <h2 className="section-title">Let's Connect</h2>
          </div>
          
          <div className="contact-container">
            <div className="contact-info">
              <p>
                I'm always interested in hearing about new opportunities, challenging projects, 
                or just connecting with fellow tech enthusiasts. Whether you have a question 
                or just want to say hi, feel free to reach out!
              </p>
              
              <div className="contact-links">
                <a href={`mailto:${CONFIG.email}`} className="contact-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Email
                </a>
                <a href={`https://github.com/${CONFIG.github}`} className="contact-link" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
                <a href={CONFIG.linkedin} className="contact-link" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
              </div>
            </div>
            
            <div className="contact-form">
              <h3>Send a Message</h3>
              {formStatus === 'success' ? (
                <div className="form-success">
                  <div className="form-success-icon">✅</div>
                  <h4>Message Sent!</h4>
                  <p>Thanks for reaching out. I'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      placeholder="Your name"
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      placeholder="your@email.com"
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      placeholder="What would you like to discuss?"
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={formStatus === 'sending'}
                  >
                    {formStatus === 'sending' ? (
                      <>Sending...</>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="22" y1="2" x2="11" y2="13"/>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                        Send Message
                      </>
                    )}
                  </button>
                  {formStatus === 'error' && (
                    <p style={{ color: '#ef4444', marginTop: '12px', fontSize: '14px' }}>
                      Something went wrong. Please try again or email me directly.
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>Built with React • Deployed with Terraform • Hosted on AWS</p>
        </div>
      </footer>
      </>
      )}
      </div>
    </>
  );
}
