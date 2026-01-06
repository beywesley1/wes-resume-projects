import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TERRAFORM_MODULES, TF_PROVIDERS, TF_SUBCATEGORY_ICONS, getTfSubcategories, getTfModuleIcon } from './terraformData';

// Import Terraform solutions as raw text (Vite feature)
// Solutions are stored in /solutions folder at project root for easier management
import VPC_MAIN from '../solutions/vpc-sales-website/main.tf?raw';
import VPC_VARIABLES from '../solutions/vpc-sales-website/variables.tf?raw';
import VPC_VPC from '../solutions/vpc-sales-website/vpc.tf?raw';
import VPC_SECURITY_GROUPS from '../solutions/vpc-sales-website/security_groups.tf?raw';
import VPC_ALB from '../solutions/vpc-sales-website/alb.tf?raw';
import VPC_ASG from '../solutions/vpc-sales-website/asg.tf?raw';
import VPC_RDS from '../solutions/vpc-sales-website/rds.tf?raw';
import VPC_WAF from '../solutions/vpc-sales-website/waf.tf?raw';
import VPC_CLOUDFLARE from '../solutions/vpc-sales-website/cloudflare.tf?raw';
import VPC_DATA from '../solutions/vpc-sales-website/data.tf?raw';

// Import Static Website S3 solution files
import S3_MAIN from '../solutions/static-website-s3/main.tf?raw';
import S3_VARIABLES from '../solutions/static-website-s3/variables.tf?raw';
import S3_S3 from '../solutions/static-website-s3/s3.tf?raw';
import S3_CLOUDFRONT from '../solutions/static-website-s3/cloudfront.tf?raw';
import S3_CLOUDFLARE from '../solutions/static-website-s3/cloudflare.tf?raw';
import S3_ACM from '../solutions/static-website-s3/acm.tf?raw';
import S3_DATA from '../solutions/static-website-s3/data.tf?raw';
import S3_OUTPUTS from '../solutions/static-website-s3/outputs.tf?raw';

// Solution files configuration (alphabetically sorted)
const VPC_SOLUTION_FILES = [
  { name: 'alb.tf', code: VPC_ALB, description: 'Load balancer' },
  { name: 'asg.tf', code: VPC_ASG, description: 'Auto scaling' },
  { name: 'cloudflare.tf', code: VPC_CLOUDFLARE, description: 'CloudFlare DNS' },
  { name: 'data.tf', code: VPC_DATA, description: 'Data sources' },
  { name: 'main.tf', code: VPC_MAIN, description: 'Provider & locals' },
  { name: 'rds.tf', code: VPC_RDS, description: 'Database' },
  { name: 'security_groups.tf', code: VPC_SECURITY_GROUPS, description: 'Security groups' },
  { name: 'variables.tf', code: VPC_VARIABLES, description: 'Input variables' },
  { name: 'vpc.tf', code: VPC_VPC, description: 'VPC & subnets' },
  { name: 'waf.tf', code: VPC_WAF, description: 'Web firewall' },
];

// S3 Static Website solution files (alphabetically sorted)
const S3_SOLUTION_FILES = [
  { name: 'acm.tf', code: S3_ACM, description: 'SSL certificate' },
  { name: 'cloudflare.tf', code: S3_CLOUDFLARE, description: 'DNS config' },
  { name: 'cloudfront.tf', code: S3_CLOUDFRONT, description: 'CDN distribution' },
  { name: 'data.tf', code: S3_DATA, description: 'Data sources' },
  { name: 'main.tf', code: S3_MAIN, description: 'Provider & locals' },
  { name: 'outputs.tf', code: S3_OUTPUTS, description: 'Output values' },
  { name: 's3.tf', code: S3_S3, description: 'S3 bucket' },
  { name: 'variables.tf', code: S3_VARIABLES, description: 'Input variables' },
];

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
  
  // Credly profile username for badge wallet embed
  credlyUsername: "wesley-bey",
  
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
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><text x="0" y="16" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#FF9900">aws</text></svg>`,
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
  "AWS": `<svg width="16" height="16" viewBox="0 0 24 24" fill="#FF9900"><path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103a6.4 6.4 0 0 0-.862.272 2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.264-.168.312a.549.549 0 0 1-.32.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.415-.287-.806-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167zM21.698 16.207c-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.27-.351 3.384 1.963 7.559 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.439-.2.814.287.385.607zM22.792 14.961c-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399.287.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151.32-.79 1.03-2.57.695-2.994z"/></svg>`,
  "Docker": `<svg width="16" height="16" viewBox="0 0 640 512" fill="#2496ED"><path d="M349.9 236.3h-66.1v-59.4h66.1v59.4zm0-204.3h-66.1v60.7h66.1V32zm78.2 144.8H362v59.4h66.1v-59.4zm-156.3-72.1h-66.1v60.1h66.1v-60.1zm78.1 0h-66.1v60.1h66.1v-60.1zm276.8 100c-14.4-9.7-47.6-13.2-73.1-8.4-3.3-24-16.7-44.9-41.1-63.7l-14-9.3-9.3 14c-18.4 27.8-23.4 73.6-3.7 103.8-8.7 4.7-25.8 11.1-48.4 10.7H2.4c-8.7 50.8 5.8 116.8 44 162.1 37.1 43.9 92.7 66.2 165.4 66.2 157.4 0 273.9-72.5 328.4-204.2 21.4.4 67.6.1 91.3-45.2 1.5-2.5 6.6-13.2 8.5-17.1l-13.3-8.9zm-511.1-27.9h-66v59.4h66.1v-59.4zm78.1 0h-66.1v59.4h66.1v-59.4zm78.1 0h-66.1v59.4h66.1v-59.4zm-78.1-72.1h-66.1v60.1h66.1v-60.1z"/></svg>`,
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
    return `<svg width="22" height="22" viewBox="0 0 640 512" fill="#2496ED"><path d="M349.9 236.3h-66.1v-59.4h66.1v59.4zm0-204.3h-66.1v60.7h66.1V32zm78.2 144.8H362v59.4h66.1v-59.4zm-156.3-72.1h-66.1v60.1h66.1v-60.1zm78.1 0h-66.1v60.1h66.1v-60.1zm276.8 100c-14.4-9.7-47.6-13.2-73.1-8.4-3.3-24-16.7-44.9-41.1-63.7l-14-9.3-9.3 14c-18.4 27.8-23.4 73.6-3.7 103.8-8.7 4.7-25.8 11.1-48.4 10.7H2.4c-8.7 50.8 5.8 116.8 44 162.1 37.1 43.9 92.7 66.2 165.4 66.2 157.4 0 273.9-72.5 328.4-204.2 21.4.4 67.6.1 91.3-45.2 1.5-2.5 6.6-13.2 8.5-17.1l-13.3-8.9zm-511.1-27.9h-66v59.4h66.1v-59.4zm78.1 0h-66.1v59.4h66.1v-59.4zm78.1 0h-66.1v59.4h66.1v-59.4zm-78.1-72.1h-66.1v60.1h66.1v-60.1z"/></svg>`;
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

// Unified syntax highlighting component for all code blocks
// VS Code Dark+ inspired highlighting
const HighlightedCode = ({ code }) => {
  if (!code) return null;
  
  // Highlight tokens within a line (not comments)
  const highlightLine = (line, _isResourceLine = false) => {
    const parts = [];
    let remaining = line;
    let keyIndex = 0;
    
    while (remaining.length > 0) {
      // Strings (double quotes)
      const dqMatch = remaining.match(/^("(?:[^"\\]|\\.)*")/);
      if (dqMatch) {
        parts.push(<span key={keyIndex++} className="hl-string">{dqMatch[1]}</span>);
        remaining = remaining.slice(dqMatch[1].length);
        continue;
      }
      
      // Strings (single quotes)
      const sqMatch = remaining.match(/^('(?:[^'\\]|\\.)*')/);
      if (sqMatch) {
        parts.push(<span key={keyIndex++} className="hl-string">{sqMatch[1]}</span>);
        remaining = remaining.slice(sqMatch[1].length);
        continue;
      }
      
      // Variables (${...}) - interpolation
      const varBraceMatch = remaining.match(/^(\$\{[^}]+\})/);
      if (varBraceMatch) {
        parts.push(<span key={keyIndex++} className="hl-variable">{varBraceMatch[1]}</span>);
        remaining = remaining.slice(varBraceMatch[1].length);
        continue;
      }
      
      // Variables ($word) - shell/PowerShell
      const varMatch = remaining.match(/^(\$[\w_]+)/);
      if (varMatch) {
        parts.push(<span key={keyIndex++} className="hl-variable">{varMatch[1]}</span>);
        remaining = remaining.slice(varMatch[1].length);
        continue;
      }
      
      // var.something references (Terraform)
      const varRefMatch = remaining.match(/^(var\.[\w_]+)/);
      if (varRefMatch) {
        parts.push(<span key={keyIndex++} className="hl-variable">{varRefMatch[1]}</span>);
        remaining = remaining.slice(varRefMatch[1].length);
        continue;
      }
      
      // aws_*.something or resource references
      const resourceRefMatch = remaining.match(/^(aws_[\w_]+\.[\w_]+\.[\w_]+)/);
      if (resourceRefMatch) {
        parts.push(<span key={keyIndex++} className="hl-type">{resourceRefMatch[1]}</span>);
        remaining = remaining.slice(resourceRefMatch[1].length);
        continue;
      }
      
      // Terraform keywords at line start
      const tfKeywords = ['resource', 'data', 'variable', 'output', 'locals', 'module', 'provider', 'terraform', 'backend', 'required_providers', 'required_version'];
      const tfMatch = remaining.match(new RegExp(`^(${tfKeywords.join('|')})(?=\\s|$)`));
      if (tfMatch && parts.length === 0) {
        parts.push(<span key={keyIndex++} className="hl-keyword">{tfMatch[1]}</span>);
        remaining = remaining.slice(tfMatch[1].length);
        continue;
      }
      
      // Shell/Bash keywords
      const shellKeywords = ['if', 'then', 'else', 'elif', 'fi', 'for', 'do', 'done', 'while', 'until', 'case', 'esac', 'in', 'function', 'return', 'export', 'local', 'readonly', 'declare'];
      const shellMatch = remaining.match(new RegExp(`^(${shellKeywords.join('|')})\\b`));
      if (shellMatch) {
        parts.push(<span key={keyIndex++} className="hl-keyword">{shellMatch[1]}</span>);
        remaining = remaining.slice(shellMatch[1].length);
        continue;
      }
      
      // PowerShell cmdlets and common commands
      const commands = ['aws', 'az', 'docker', 'terraform', 'git', 'echo', 'curl', 'wget', 'grep', 'sed', 'awk', 'cat', 'ls', 'cd', 'mkdir', 'rm', 'cp', 'mv', 'chmod', 'chown', 'Get-ADUser', 'Get-ADGroupMember', 'Connect-MgGraph', 'Get-MgUser', 'Get-MgAuditLogSignIn', 'Select-Object', 'Format-List', 'Format-Table', 'Export-Csv', 'Read-Host', 'Write-Host', 'Set-Location', 'Get-ChildItem', 'New-Item', 'Remove-Item', 'Copy-Item', 'Move-Item', 'Invoke-WebRequest', 'ConvertTo-Json', 'ConvertFrom-Json'];
      const cmdMatch = remaining.match(new RegExp(`^(${commands.join('|')})\\b`));
      if (cmdMatch) {
        parts.push(<span key={keyIndex++} className="hl-function">{cmdMatch[1]}</span>);
        remaining = remaining.slice(cmdMatch[1].length);
        continue;
      }
      
      // Booleans
      const boolMatch = remaining.match(/^(true|false|null)\b/);
      if (boolMatch) {
        parts.push(<span key={keyIndex++} className="hl-boolean">{boolMatch[1]}</span>);
        remaining = remaining.slice(boolMatch[1].length);
        continue;
      }
      
      // Numbers
      const numMatch = remaining.match(/^(\d+)/);
      if (numMatch) {
        parts.push(<span key={keyIndex++} className="hl-number">{numMatch[1]}</span>);
        remaining = remaining.slice(numMatch[1].length);
        continue;
      }
      
      // Operators
      const opMatch = remaining.match(/^(==|!=|>=|<=|=>|->|&&|\|\||[=<>!+\-*/%])/);
      if (opMatch) {
        parts.push(<span key={keyIndex++} className="hl-operator">{opMatch[1]}</span>);
        remaining = remaining.slice(opMatch[1].length);
        continue;
      }
      
      // Brackets and braces
      const bracketMatch = remaining.match(/^([{}[\]()])/);
      if (bracketMatch) {
        parts.push(<span key={keyIndex++} className="hl-bracket">{bracketMatch[1]}</span>);
        remaining = remaining.slice(bracketMatch[1].length);
        continue;
      }
      
      // Attribute names (word followed by =)
      const attrMatch = remaining.match(/^([\w_]+)(\s*=)/);
      if (attrMatch) {
        parts.push(<span key={keyIndex++} className="hl-attribute">{attrMatch[1]}</span>);
        parts.push(attrMatch[2]);
        remaining = remaining.slice(attrMatch[0].length);
        continue;
      }
      
      // Plain text - grab one character at a time for safety
      parts.push(remaining[0]);
      remaining = remaining.slice(1);
    }
    
    return parts;
  };
  
  // Process each line separately
  const lines = code.split('\n');
  
  return (
    <>
      {lines.map((line, lineIndex) => {
        // Check if line is a comment (starts with optional whitespace then #)
        const commentMatch = line.match(/^(\s*)(#.*)$/);
        if (commentMatch) {
          return (
            <React.Fragment key={lineIndex}>
              {commentMatch[1]}<span className="hl-comment">{commentMatch[2]}</span>
              {lineIndex < lines.length - 1 ? '\n' : ''}
            </React.Fragment>
          );
        }
        
        // For non-comment lines, highlight tokens
        return (
          <React.Fragment key={lineIndex}>
            {highlightLine(line)}
            {lineIndex < lines.length - 1 ? '\n' : ''}
          </React.Fragment>
        );
      })}
    </>
  );
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

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
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
    min-width: 280px;
    flex-shrink: 0;
    background: var(--bg-secondary);
    border-right: 1px solid var(--border);
    overflow-y: auto;
    height: calc(100vh - 60px);
    position: sticky;
    top: 60px;
    display: block;
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
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .sidebar-search svg {
    flex-shrink: 0;
    color: var(--text-muted);
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
  
  /* Unified syntax highlighting for all code blocks - VS Code Dark+ inspired */
  .hl-comment { color: #6A9955; font-style: italic; }
  .hl-keyword { color: #C586C0; font-weight: 500; }
  .hl-string { color: #CE9178; }
  .hl-variable { color: #9CDCFE; }
  .hl-boolean { color: #569CD6; font-weight: 500; }
  .hl-number { color: #B5CEA8; }
  .hl-command { color: #DCDCAA; }
  .hl-type { color: #4EC9B0; }
  .hl-attribute { color: #9CDCFE; }
  .hl-operator { color: #D4D4D4; }
  .hl-bracket { color: #FFD700; }
  .hl-function { color: #DCDCAA; }
  .hl-resource-type { color: #4EC9B0; }
  .hl-resource-name { color: #CE9178; }
  
  [data-theme="light"] .hl-comment { color: #008000; }
  [data-theme="light"] .hl-keyword { color: #AF00DB; }
  [data-theme="light"] .hl-string { color: #A31515; }
  [data-theme="light"] .hl-variable { color: #001080; }
  [data-theme="light"] .hl-boolean { color: #0000FF; }
  [data-theme="light"] .hl-number { color: #098658; }
  [data-theme="light"] .hl-command { color: #795E26; }
  [data-theme="light"] .hl-type { color: #267F99; }
  [data-theme="light"] .hl-attribute { color: #001080; }
  [data-theme="light"] .hl-resource-type { color: #267F99; }
  [data-theme="light"] .hl-resource-name { color: #A31515; }
  
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
  
  @keyframes pulse-glow {
    0%, 100% { 
      opacity: 1; 
      text-shadow: 0 0 5px var(--accent-cyan);
    }
    50% { 
      opacity: 0.6; 
      text-shadow: 0 0 15px var(--accent-cyan), 0 0 25px var(--accent-blue);
    }
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
  
  /* Certifications Grid */
  .certifications-grid {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 24px;
    flex-wrap: wrap;
  }
  
  .certification-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    transition: transform 0.2s ease;
  }
  
  .certification-badge:hover {
    transform: translateY(-4px);
  }
  
  .certification-badge a {
    text-decoration: none;
    color: var(--text-muted);
  }
  
  .certification-badge a:hover {
    color: var(--accent-blue);
  }
  
  .certification-name {
    margin-top: 8px;
    font-size: 11px;
    text-align: center;
    line-height: 1.3;
    max-width: 140px;
  }
  
  /* Credly iframe styling */
  .certification-badge iframe {
    border: none;
  }
  
  @media (max-width: 768px) {
    .certifications-grid {
      gap: 16px;
    }
    
    .certification-name {
      font-size: 10px;
      max-width: 120px;
    }
  }
  
  @media (max-width: 480px) {
    .certifications-grid {
      gap: 12px;
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
  
  .footer-tech {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .footer-item {
    display: inline-flex;
    align-items: center;
  }
  
  .footer-separator {
    color: var(--text-muted);
    margin: 0 4px;
  }
  
  /* Solutions Page */
  .solutions-page {
    padding: 80px 0 40px;
    min-height: 100vh;
  }
  
  .diagram-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 32px;
  }
  
  .diagram-header {
    padding: 24px;
    border-bottom: 1px solid var(--border);
  }
  
  .diagram-header h3 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--text-primary);
  }
  
  .diagram-header p {
    font-size: 14px;
    color: var(--text-muted);
  }
  
  .diagram-container {
    padding: 24px;
    background: #0a0a0f;
    display: flex;
    justify-content: center;
    overflow-x: auto;
  }
  
  .network-diagram {
    width: 100%;
    max-width: 900px;
    height: auto;
  }
  
  .diagram-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
    padding: 24px;
    border-top: 1px solid var(--border);
  }
  
  .diagram-detail-card {
    background: var(--bg-tertiary);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px;
  }
  
  .diagram-detail-card h4 {
    font-size: 14px;
    font-weight: 600;
    color: var(--accent-blue);
    margin-bottom: 12px;
    font-family: var(--font-mono);
  }
  
  .diagram-detail-card ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .diagram-detail-card li {
    font-size: 13px;
    color: var(--text-secondary);
    padding: 4px 0;
    font-family: var(--font-mono);
  }
  
  .diagram-detail-card li strong {
    color: var(--text-primary);
  }
  
  @media (max-width: 768px) {
    .diagram-container {
      padding: 12px;
    }
    
    .diagram-details {
      grid-template-columns: 1fr;
    }
  }
  
  /* Terraform Code Section */
  .terraform-code-section {
    background: #0d1117;
    border-radius: 0 0 12px 12px;
  }
  
  .terraform-code-tabs {
    display: flex;
    gap: 0;
    padding: 12px 24px 0;
    border-bottom: 1px solid #30363d;
  }
  
  .terraform-tab {
    padding: 10px 20px;
    background: #161b22;
    border: 1px solid #30363d;
    border-bottom: none;
    border-radius: 8px 8px 0 0;
    color: #58a6ff;
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
  }
  
  .terraform-tab.active {
    background: #0d1117;
    border-bottom: 1px solid #0d1117;
    margin-bottom: -1px;
  }
  
  .terraform-code-content {
    padding: 0;
    max-height: 600px;
    overflow: auto;
  }
  
  .terraform-code {
    margin: 0;
    padding: 20px 24px;
    background: transparent;
    color: #c9d1d9;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 12px;
    line-height: 1.6;
    white-space: pre;
    overflow-x: auto;
  }
  
  .terraform-code-highlighted {
    margin: 0;
    padding: 20px 24px;
    background: transparent;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 12px;
    line-height: 1.6;
    white-space: pre;
    overflow-x: auto;
  }
  
  /* Terraform code block uses unified hl- classes defined above */
  
  .terraform-code-content::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  .terraform-code-content::-webkit-scrollbar-track {
    background: #161b22;
  }
  
  .terraform-code-content::-webkit-scrollbar-thumb {
    background: #30363d;
    border-radius: 4px;
  }
  
  .terraform-code-content::-webkit-scrollbar-thumb:hover {
    background: #484f58;
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

// GitHub Stats Hook - Optimized with caching and token support
function useGitHubStats(username) {
  const [stats, setStats] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [linesOfCode, setLinesOfCode] = useState(null); // null = not loaded yet, object = loaded
  
  // GitHub token from environment variable (increases rate limit from 60 to 5000 requests/hour)
  const githubToken = import.meta.env.VITE_GITHUB_TOKEN;
  const headers = githubToken ? { Authorization: `token ${githubToken}` } : {};
  
  useEffect(() => {
    if (!username || username === 'YOUR_GITHUB_USERNAME') {
      setLoading(false);
      return;
    }
    
    // Check for cached data (valid for 5 minutes)
    const cacheKey = `github_stats_${username}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          setStats(data.stats);
          setRepos(data.repos);
          setLinesOfCode(data.linesOfCode);
          setLoading(false);
          return;
        }
      } catch {
        sessionStorage.removeItem(cacheKey);
      }
    }
    
    async function fetchData() {
      try {
        // Fetch user data and repos in parallel
        const [userRes, allReposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`, { headers }),
          fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, { headers })
        ]);
        
        if (!userRes.ok) {
          console.warn('GitHub API rate limited or user not found');
          setLoading(false);
          return;
        }
        
        const [userData, allReposData] = await Promise.all([
          userRes.json(),
          allReposRes.json()
        ]);
        
        // Get top 6 repos for display and fetch their languages
        const top6Repos = allReposData.slice(0, 6);
        const displayRepos = await Promise.all(
          top6Repos.map(async (repo) => {
            try {
              const langRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/languages`, { headers });
              const languages = langRes.ok ? await langRes.json() : {};
              return { ...repo, languages };
            } catch {
              return { ...repo, languages: {} };
            }
          })
        );
        
        const statsData = {
          publicRepos: userData.public_repos,
          followers: userData.followers,
        };
        
        setStats(statsData);
        setRepos(displayRepos);
        
        // Fetch lines of code from contributor stats with retry logic
        // GitHub's stats API returns 202 on first request while computing, need to retry
        let totalAdded = 0;
        let totalDeleted = 0;
        
        const fetchWithRetry = async (url, retries = 5, delay = 2000) => {
          for (let i = 0; i < retries; i++) {
            try {
              const res = await fetch(url, { headers });
              if (res.status === 200) {
                return await res.json();
              } else if (res.status === 202) {
                // GitHub is computing stats, wait and retry with exponential backoff
                await new Promise(r => setTimeout(r, delay * (i + 1)));
              } else if (res.status === 403) {
                // Rate limited - stop retrying
                console.warn('GitHub API rate limited');
                return null;
              } else {
                return null;
              }
            } catch {
              // Network error - retry
              await new Promise(r => setTimeout(r, delay));
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
          } catch {
            // Silently fail for individual repos
          }
        });
        
        await Promise.all(statsPromises);
        // Only set lines of code if we actually got some data
        const linesData = (totalAdded > 0 || totalDeleted > 0) 
          ? { added: totalAdded, deleted: totalDeleted } 
          : null;
        setLinesOfCode(linesData);
        
        // Cache the results
        sessionStorage.setItem(cacheKey, JSON.stringify({
          data: { stats: statsData, repos: displayRepos, linesOfCode: linesData },
          timestamp: Date.now()
        }));
        
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
  const [_activeTab, _setActiveTab] = useState('powershell');
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
  const [expandedCareerItems, setExpandedCareerItems] = useState([]); // All collapsed by default
  const [diagramSearch, setDiagramSearch] = useState('');
  // VPC Solution state
  const [vpcCardExpanded, setVpcCardExpanded] = useState(false);
  const [vpcCodeExpanded, setVpcCodeExpanded] = useState(false);
  const [vpcSelectedFile, setVpcSelectedFile] = useState(0);
  // S3 Solution state
  const [s3CardExpanded, setS3CardExpanded] = useState(false);
  const [s3CodeExpanded, setS3CodeExpanded] = useState(false);
  const [s3SelectedFile, setS3SelectedFile] = useState(0);
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
  const [_careerRef, _careerVisible] = useScrollAnimation();
  const [_certsRef, _certsVisible] = useScrollAnimation();
  const [_archRef, _archVisible] = useScrollAnimation();
  const [_reposRef, _reposVisible] = useScrollAnimation();
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
      const response = await fetch('https://formspree.io/f/mdakydyl', {
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
    } catch {
      setFormStatus('error');
    }
  };
  
  // Credly badges now use direct iframe embeds - no script needed
  
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
            <button onClick={() => setCurrentPage('solutions')} className={`nav-tab ${currentPage === 'solutions' ? 'active' : ''}`}>Solutions</button>
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
                            <pre><HighlightedCode code={script.code} /></pre>
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
                            <pre><HighlightedCode code={module.code} /></pre>
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
      
      {/* Solutions Page */}
      {currentPage === 'solutions' && (
        <div className="scripts-page">
          <div className="scripts-layout" style={{ display: 'flex' }}>
            {/* Sidebar */}
            <aside className="scripts-sidebar" style={{ minWidth: '280px', width: '280px', display: 'block', background: '#1a1a2e' }}>
              <div className="sidebar-header">
                <h2>Solutions</h2>
                <p>Architecture diagrams & IaC</p>
              </div>
              <div className="sidebar-search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search solutions..." 
                  value={diagramSearch}
                  onChange={(e) => setDiagramSearch(e.target.value)}
                />
              </div>
              
              <div className="sidebar-categories">
                {/* AWS Category */}
                <div className="sidebar-category">
                  <div className="sidebar-category-header" style={{ cursor: 'default' }}>
                    <div className="category-label">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF9900">
                        <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103a6.4 6.4 0 0 0-.862.272 2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586z"/>
                      </svg>
                      AWS Architectures
                    </div>
                    <span className="sidebar-count">2</span>
                  </div>
                  <div className="sidebar-subcategories" style={{ display: 'block' }}>
                    <div className="sidebar-subcategory">
                      <span className="subcategory-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#8B5CF6">
                          <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h6v2H7v-2z"/>
                        </svg>
                        VPC - Sales Website
                      </span>
                    </div>
                    <div className="sidebar-subcategory">
                      <span className="subcategory-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#22c55e">
                          <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.5L18 8l-6 3.5L6 8l6-3.5zM5 9.5l6 3.5v6.5l-6-3.5V9.5zm14 0v6.5l-6 3.5v-6.5l6-3.5z"/>
                        </svg>
                        S3 Static Website
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Coming Soon */}
                <div className="sidebar-category">
                  <div className="sidebar-category-header" style={{ cursor: 'default', opacity: 0.5 }}>
                    <div className="category-label">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#0078D4">
                        <path d="M13.05 4.24L6.56 18.05a.5.5 0 0 1-.47.31H2.85a.5.5 0 0 1-.44-.75l6.37-11.3a.5.5 0 0 0 0-.5L6.23 2.69a.5.5 0 0 1 .44-.75h4.19a.5.5 0 0 1 .44.26l1.75 3.04z"/>
                      </svg>
                      Azure Architectures
                    </div>
                    <span className="sidebar-count coming-soon-badge">Soon</span>
                  </div>
                </div>
              </div>
            </aside>
            
            {/* Main Content */}
            <main className="scripts-main">
              {/* VPC Sales Website Solution */}
              <div className="diagram-card" style={{ maxWidth: '100%', marginBottom: '24px' }}>
                <div 
                  className="diagram-header"
                  onClick={() => setVpcCardExpanded(!vpcCardExpanded)}
                  style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>
                    <h3>AWS VPC - Sales Website Architecture</h3>
                    <p>High-availability web application with Auto Scaling, RDS Multi-AZ, WAF & Shield protection</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{vpcCardExpanded ? 'Collapse' : 'Expand'}</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: vpcCardExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </div>
                </div>
                
                {vpcCardExpanded && (
                <>
                {/* Terraform Code Section */}
                <div 
                  className="terraform-code-header"
                  onClick={() => setVpcCodeExpanded(!vpcCodeExpanded)}
                  style={{ 
                    cursor: 'pointer', 
                    padding: '16px 24px', 
                    borderTop: '1px solid var(--border)', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', color: '#a78bfa', fontFamily: 'monospace' }}>Terraform Infrastructure Code</h4>
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>Complete IaC ready for CI/CD pipeline deployment</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{vpcCodeExpanded ? 'Collapse' : 'Expand'}</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" style={{ transform: vpcCodeExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </div>
                </div>
                
                {vpcCodeExpanded && (
                  <div className="terraform-code-section" style={{ background: '#0d1117' }}>
                    <div className="terraform-code-tabs" style={{ background: '#161b22', borderBottom: '1px solid #30363d', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                      {VPC_SOLUTION_FILES.map((file, index) => (
                        <button
                          key={file.name}
                          onClick={(e) => { e.stopPropagation(); setVpcSelectedFile(index); }}
                          style={{ 
                            background: vpcSelectedFile === index ? '#0d1117' : 'transparent',
                            color: vpcSelectedFile === index ? '#58a6ff' : '#8b949e',
                            padding: '6px 12px',
                            borderRadius: '6px 6px 0 0',
                            fontSize: '12px',
                            fontFamily: 'monospace',
                            border: 'none',
                            cursor: 'pointer',
                            borderBottom: vpcSelectedFile === index ? '2px solid #58a6ff' : '2px solid transparent',
                            transition: 'all 0.2s ease'
                          }}
                          title={file.description}
                        >
                          {file.name}
                        </button>
                      ))}
                      <button 
                        className={`copy-btn ${copiedId === 'terraform-vpc' ? 'copied' : ''}`}
                        onClick={(e) => { e.stopPropagation(); copy(VPC_SOLUTION_FILES[vpcSelectedFile].code, 'terraform-vpc'); }}
                        style={{ marginLeft: 'auto', background: '#21262d', border: '1px solid #30363d', color: '#c9d1d9', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontFamily: 'monospace' }}
                      >
                        {copiedId === 'terraform-vpc' ? '✓ Copied' : '📋 Copy'}
                      </button>
                    </div>
                    <div className="terraform-code-content" style={{ maxHeight: '500px', overflow: 'auto' }}>
                      <pre 
                        className="terraform-code-highlighted" 
                        style={{ 
                          margin: 0, 
                          padding: '20px 24px', 
                          background: '#0d1117', 
                          color: '#c9d1d9', 
                          fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace", 
                          fontSize: '13px', 
                          lineHeight: '1.6'
                        }}
                      ><HighlightedCode code={VPC_SOLUTION_FILES[vpcSelectedFile].code} /></pre>
                    </div>
                  </div>
                )}
                    
                    <div className="diagram-container" style={{ padding: '24px', overflow: 'auto' }}>
                      <svg viewBox="0 0 1200 750" className="network-diagram" style={{ minWidth: '1100px' }}>
                  {/* Background Gradients & Definitions */}
                  <defs>
                    <linearGradient id="vpcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1a1a2e" />
                      <stop offset="100%" stopColor="#16213e" />
                    </linearGradient>
                    <linearGradient id="subnetGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#0f3460" />
                      <stop offset="100%" stopColor="#1a1a2e" />
                    </linearGradient>
                    <linearGradient id="privateSubnetGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#1e1b4b" />
                      <stop offset="100%" stopColor="#1a1a2e" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#8B5CF6"/>
                    </marker>
                    <marker id="arrowheadOrange" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#F6821F"/>
                    </marker>
                    <marker id="arrowheadYellow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#FF9900"/>
                    </marker>
                    <marker id="arrowheadGreen" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e"/>
                    </marker>
                    
                    {/* AWS Service Icons */}
                    <symbol id="aws-vpc-icon" viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="2" fill="none" stroke="#8B5CF6" strokeWidth="2"/>
                      <path d="M7 7h10v10H7z" fill="none" stroke="#8B5CF6" strokeWidth="1.5"/>
                      <circle cx="12" cy="12" r="2" fill="#8B5CF6"/>
                    </symbol>
                    <symbol id="aws-ec2-icon" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="2" fill="#FF9900"/>
                      <rect x="6" y="8" width="12" height="8" rx="1" fill="#232f3e"/>
                      <circle cx="9" cy="12" r="1.5" fill="#FF9900"/>
                      <circle cx="15" cy="12" r="1.5" fill="#FF9900"/>
                    </symbol>
                    <symbol id="aws-rds-icon" viewBox="0 0 24 24">
                      <ellipse cx="12" cy="6" rx="8" ry="3" fill="#3B48CC"/>
                      <path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6" fill="none" stroke="#3B48CC" strokeWidth="2"/>
                      <ellipse cx="12" cy="12" rx="8" ry="3" fill="none" stroke="#3B48CC" strokeWidth="1"/>
                      <ellipse cx="12" cy="18" rx="8" ry="3" fill="none" stroke="#3B48CC" strokeWidth="1"/>
                    </symbol>
                    <symbol id="aws-alb-icon" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" fill="none" stroke="#8B5CF6" strokeWidth="2"/>
                      <path d="M12 6v12M6 12h12" stroke="#8B5CF6" strokeWidth="2"/>
                      <circle cx="12" cy="12" r="3" fill="#8B5CF6"/>
                    </symbol>
                    <symbol id="aws-waf-icon" viewBox="0 0 24 24">
                      <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="none" stroke="#ef4444" strokeWidth="2"/>
                      <path d="M9 12l2 2 4-4" stroke="#ef4444" strokeWidth="2" fill="none"/>
                    </symbol>
                    <symbol id="aws-shield-icon" viewBox="0 0 24 24">
                      <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="#06b6d4" fillOpacity="0.3" stroke="#06b6d4" strokeWidth="2"/>
                      <path d="M12 6v10M8 11h8" stroke="#06b6d4" strokeWidth="2"/>
                    </symbol>
                    <symbol id="aws-igw-icon" viewBox="0 0 24 24">
                      <rect x="4" y="8" width="16" height="8" rx="2" fill="none" stroke="#FF9900" strokeWidth="2"/>
                      <path d="M12 4v4M12 16v4M4 12H2M22 12h-2" stroke="#FF9900" strokeWidth="2"/>
                    </symbol>
                    <symbol id="cloudflare-icon" viewBox="0 0 24 24">
                      <path d="M16.5 8.5c-.3-1.4-1.5-2.5-3-2.5-1.3 0-2.4.8-2.9 2-.4-.3-.9-.5-1.4-.5-1.4 0-2.5 1.1-2.5 2.5 0 .2 0 .3.1.5C5.2 10.7 4 12 4 13.5 4 15.4 5.6 17 7.5 17h9c1.9 0 3.5-1.6 3.5-3.5 0-1.8-1.4-3.3-3.1-3.5l-.4-1.5z" fill="#F6821F"/>
                      <path d="M17.8 12.8l-1.3-4.5c-.1-.4-.5-.6-.9-.5l-4.1 1.2c-.3.1-.5.3-.5.6l-.3 3.9c0 .2.1.4.3.5.2.1.4.1.6 0l1.5-.8 1.4 1.4c.2.2.4.2.6.1.2-.1.3-.3.3-.5l.3-1.8 1.8.3c.2 0 .4-.1.5-.3.1-.2.1-.4-.2-.6z" fill="#FAAD3F"/>
                    </symbol>
                    <symbol id="internet-icon" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="#60a5fa" strokeWidth="2"/>
                      <ellipse cx="12" cy="12" rx="4" ry="10" fill="none" stroke="#60a5fa" strokeWidth="1"/>
                      <line x1="2" y1="12" x2="22" y2="12" stroke="#60a5fa" strokeWidth="1"/>
                      <line x1="12" y1="2" x2="12" y2="22" stroke="#60a5fa" strokeWidth="1"/>
                    </symbol>
                  </defs>
                  
                  {/* INTERNET (Top) */}
                  <rect x="520" y="15" width="160" height="50" rx="8" fill="#1e293b" stroke="#60a5fa" strokeWidth="2"/>
                  <use href="#internet-icon" x="535" y="23" width="30" height="30"/>
                  <text x="600" y="45" fill="#60a5fa" fontSize="14" textAnchor="middle" fontWeight="bold" fontFamily="monospace">Internet</text>
                  
                  {/* CloudFlare DNS & CDN - Left of Internet */}
                  <rect x="40" y="10" width="200" height="70" rx="8" fill="#1a1a2e" stroke="#F6821F" strokeWidth="2"/>
                  <image href="/aws-icons/cloudflare.svg" x="50" y="18" width="36" height="36"/>
                  <text x="150" y="35" fill="#F6821F" fontSize="13" textAnchor="middle" fontWeight="bold" fontFamily="monospace">CloudFlare</text>
                  <text x="150" y="52" fill="#FAAD3F" fontSize="9" textAnchor="middle" fontFamily="monospace">DNS + CDN + DDoS + SSL</text>
                  <text x="150" y="68" fill="#6ee7b7" fontSize="9" textAnchor="middle" fontFamily="monospace">sales-website.com</text>
                  
                  {/* Arrow CloudFlare to Internet */}
                  <line x1="240" y1="45" x2="515" y2="40" stroke="#F6821F" strokeWidth="2" markerEnd="url(#arrowheadOrange)"/>
                  <text x="380" y="35" fill="#F6821F" fontSize="9" textAnchor="middle" fontFamily="monospace">DNS Resolution</text>
                  
                  {/* AWS Cloud Border */}
                  <rect x="300" y="80" width="880" height="650" rx="12" fill="none" stroke="#FF9900" strokeWidth="2" strokeDasharray="8,4" opacity="0.5"/>
                  <text x="740" y="105" fill="#FF9900" fontSize="16" fontFamily="monospace" fontWeight="bold">AWS Cloud (us-east-1)</text>
                  
                  {/* Arrow Internet to IGW */}
                  <line x1="600" y1="65" x2="600" y2="120" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrowheadYellow)"/>
                  
                  {/* Internet Gateway - At VPC Edge */}
                  <rect x="530" y="125" width="140" height="45" rx="6" fill="#232f3e" stroke="#FF9900" strokeWidth="2"/>
                  <use href="#aws-igw-icon" x="540" y="133" width="28" height="28"/>
                  <text x="620" y="152" fill="#FF9900" fontSize="13" textAnchor="middle" fontFamily="monospace" fontWeight="bold">IGW</text>
                  
                  {/* VPC Container */}
                  <rect x="320" y="185" width="840" height="530" rx="10" fill="url(#vpcGradient)" stroke="#8B5CF6" strokeWidth="3"/>
                  <use href="#aws-vpc-icon" x="335" y="195" width="24" height="24"/>
                  <text x="365" y="212" fill="#8B5CF6" fontSize="14" fontWeight="bold" fontFamily="monospace">VPC</text>
                  <text x="335" y="228" fill="#a78bfa" fontSize="11" fontFamily="monospace">10.11.0.0/16</text>
                  
                  {/* Arrow IGW to ALB */}
                  <line x1="600" y1="170" x2="600" y2="230" stroke="#FF9900" strokeWidth="2" markerEnd="url(#arrowheadYellow)"/>
                  
                  {/* Application Load Balancer */}
                  <rect x="430" y="235" width="300" height="70" rx="8" fill="#232f3e" stroke="#8B5CF6" strokeWidth="2" filter="url(#glow)"/>
                  <image href="/aws-icons/elb.svg" x="445" y="247" width="36" height="36"/>
                  <text x="580" y="260" fill="#8B5CF6" fontSize="14" textAnchor="middle" fontWeight="bold" fontFamily="monospace">Application Load Balancer</text>
                  <text x="580" y="278" fill="#a78bfa" fontSize="10" textAnchor="middle" fontFamily="monospace">sales-website-alb.amazonaws.com</text>
                  
                  {/* WAF - Separate component to the right */}
                  <rect x="800" y="225" width="90" height="75" rx="6" fill="#232f3e" stroke="#DD344C" strokeWidth="2"/>
                  <image href="/aws-icons/waf.svg" x="820" y="232" width="32" height="32"/>
                  <text x="845" y="278" fill="#DD344C" fontSize="10" textAnchor="middle" fontWeight="bold" fontFamily="monospace">WAF</text>
                  <text x="845" y="292" fill="#fca5a5" fontSize="7" textAnchor="middle" fontFamily="monospace">SQL/XSS Protection</text>
                  
                  {/* Line connecting WAF to ALB */}
                  <line x1="730" y1="270" x2="795" y2="262" stroke="#DD344C" strokeWidth="2" strokeDasharray="4,2"/>
                  <text x="762" y="258" fill="#DD344C" fontSize="7" textAnchor="middle" fontFamily="monospace">protects</text>
                  
                  {/* PUBLIC SUBNETS SECTION */}
                  <text x="340" y="330" fill="#22c55e" fontSize="14" fontWeight="bold" fontFamily="monospace">PUBLIC SUBNETS (Web Tier)</text>
                  
                  {/* Subnet A */}
                  <rect x="340" y="345" width="250" height="155" rx="8" fill="url(#subnetGradient)" stroke="#22c55e" strokeWidth="2"/>
                  <text x="465" y="365" fill="#22c55e" fontSize="12" textAnchor="middle" fontWeight="bold" fontFamily="monospace">Public Subnet A</text>
                  <text x="465" y="380" fill="#4ade80" fontSize="9" textAnchor="middle" fontFamily="monospace">10.11.1.0/24 | us-east-1a</text>
                  
                  {/* Server 1A with EIP */}
                  <rect x="355" y="395" width="100" height="55" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="2"/>
                  <image href="/aws-icons/ec2.svg" x="360" y="400" width="20" height="20"/>
                  <text x="405" y="418" fill="#3b82f6" fontSize="9" textAnchor="middle" fontWeight="bold" fontFamily="monospace">Server 1A</text>
                  <text x="405" y="432" fill="#60a5fa" fontSize="8" textAnchor="middle" fontFamily="monospace">10.11.1.10</text>
                  <text x="405" y="444" fill="#6b7280" fontSize="7" textAnchor="middle" fontFamily="monospace">t3.medium</text>
                  <rect x="430" y="390" width="30" height="18" rx="3" fill="#1e293b" stroke="#22c55e" strokeWidth="1"/>
                  <text x="445" y="402" fill="#22c55e" fontSize="7" textAnchor="middle" fontFamily="monospace">EIP</text>
                  
                  {/* Server 2A with EIP (ASG) */}
                  <rect x="475" y="395" width="100" height="55" rx="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="2"/>
                  <image href="/aws-icons/ec2.svg" x="480" y="400" width="20" height="20"/>
                  <text x="525" y="418" fill="#f59e0b" fontSize="9" textAnchor="middle" fontWeight="bold" fontFamily="monospace">Server 2A</text>
                  <text x="525" y="432" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">10.11.1.11</text>
                  <text x="525" y="444" fill="#6b7280" fontSize="7" textAnchor="middle" fontFamily="monospace">ASG Scaled</text>
                  <rect x="550" y="390" width="30" height="18" rx="3" fill="#1e293b" stroke="#22c55e" strokeWidth="1"/>
                  <text x="565" y="402" fill="#22c55e" fontSize="7" textAnchor="middle" fontFamily="monospace">EIP</text>
                  
                  {/* ASG indicator A */}
                  <rect x="355" y="460" width="220" height="20" rx="4" fill="#292524" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,2"/>
                  <text x="465" y="474" fill="#f59e0b" fontSize="8" textAnchor="middle" fontFamily="monospace">⚡ ASG: 2/3 (High Traffic)</text>
                  
                  {/* Subnet B */}
                  <rect x="610" y="345" width="250" height="155" rx="8" fill="url(#subnetGradient)" stroke="#22c55e" strokeWidth="2"/>
                  <text x="735" y="365" fill="#22c55e" fontSize="12" textAnchor="middle" fontWeight="bold" fontFamily="monospace">Public Subnet B</text>
                  <text x="735" y="380" fill="#4ade80" fontSize="9" textAnchor="middle" fontFamily="monospace">10.11.2.0/24 | us-east-1b</text>
                  
                  {/* Server 1B with EIP */}
                  <rect x="680" y="395" width="110" height="55" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="2"/>
                  <image href="/aws-icons/ec2.svg" x="685" y="400" width="20" height="20"/>
                  <text x="735" y="418" fill="#3b82f6" fontSize="9" textAnchor="middle" fontWeight="bold" fontFamily="monospace">Server 1B</text>
                  <text x="735" y="432" fill="#60a5fa" fontSize="8" textAnchor="middle" fontFamily="monospace">10.11.2.10</text>
                  <text x="735" y="444" fill="#6b7280" fontSize="7" textAnchor="middle" fontFamily="monospace">t3.medium</text>
                  <rect x="765" y="390" width="30" height="18" rx="3" fill="#1e293b" stroke="#22c55e" strokeWidth="1"/>
                  <text x="780" y="402" fill="#22c55e" fontSize="7" textAnchor="middle" fontFamily="monospace">EIP</text>
                  
                  {/* ASG indicator B */}
                  <rect x="625" y="460" width="220" height="20" rx="4" fill="#292524" stroke="#22c55e" strokeWidth="1" strokeDasharray="4,2"/>
                  <text x="735" y="474" fill="#22c55e" fontSize="8" textAnchor="middle" fontFamily="monospace">ASG: 1/3 (Normal)</text>
                  
                  {/* Subnet C */}
                  <rect x="880" y="345" width="250" height="155" rx="8" fill="url(#subnetGradient)" stroke="#22c55e" strokeWidth="2"/>
                  <text x="1005" y="365" fill="#22c55e" fontSize="12" textAnchor="middle" fontWeight="bold" fontFamily="monospace">Public Subnet C</text>
                  <text x="1005" y="380" fill="#4ade80" fontSize="9" textAnchor="middle" fontFamily="monospace">10.11.3.0/24 | us-east-1c</text>
                  
                  {/* Server 1C with EIP */}
                  <rect x="950" y="395" width="110" height="55" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="2"/>
                  <image href="/aws-icons/ec2.svg" x="955" y="400" width="20" height="20"/>
                  <text x="1005" y="418" fill="#3b82f6" fontSize="9" textAnchor="middle" fontWeight="bold" fontFamily="monospace">Server 1C</text>
                  <text x="1005" y="432" fill="#60a5fa" fontSize="8" textAnchor="middle" fontFamily="monospace">10.11.3.10</text>
                  <text x="1005" y="444" fill="#6b7280" fontSize="7" textAnchor="middle" fontFamily="monospace">t3.medium</text>
                  <rect x="1035" y="390" width="30" height="18" rx="3" fill="#1e293b" stroke="#22c55e" strokeWidth="1"/>
                  <text x="1050" y="402" fill="#22c55e" fontSize="7" textAnchor="middle" fontFamily="monospace">EIP</text>
                  
                  {/* ASG indicator C */}
                  <rect x="895" y="460" width="220" height="20" rx="4" fill="#292524" stroke="#22c55e" strokeWidth="1" strokeDasharray="4,2"/>
                  <text x="1005" y="474" fill="#22c55e" fontSize="8" textAnchor="middle" fontFamily="monospace">ASG: 1/3 (Normal)</text>
                  
                  {/* Connection lines from ALB to subnets */}
                  <line x1="520" y1="305" x2="465" y2="345" stroke="#8B5CF6" strokeWidth="2" opacity="0.8"/>
                  <line x1="600" y1="305" x2="735" y2="345" stroke="#8B5CF6" strokeWidth="2" opacity="0.8"/>
                  <line x1="680" y1="305" x2="1005" y2="345" stroke="#8B5CF6" strokeWidth="2" opacity="0.8"/>
                  
                  {/* PRIVATE SUBNETS SECTION */}
                  <text x="340" y="530" fill="#a855f7" fontSize="14" fontWeight="bold" fontFamily="monospace">PRIVATE SUBNETS (Database Tier)</text>
                  
                  {/* Private Subnet A */}
                  <rect x="340" y="545" width="250" height="120" rx="8" fill="url(#privateSubnetGradient)" stroke="#a855f7" strokeWidth="2"/>
                  <text x="465" y="565" fill="#a855f7" fontSize="12" textAnchor="middle" fontWeight="bold" fontFamily="monospace">Private Subnet A</text>
                  <text x="465" y="580" fill="#c084fc" fontSize="9" textAnchor="middle" fontFamily="monospace">10.11.101.0/24 | us-east-1a</text>
                  
                  {/* RDS Writer */}
                  <rect x="360" y="595" width="210" height="55" rx="6" fill="#1e293b" stroke="#06b6d4" strokeWidth="2"/>
                  <image href="/aws-icons/rds.svg" x="365" y="600" width="24" height="24"/>
                  <text x="475" y="615" fill="#06b6d4" fontSize="10" textAnchor="middle" fontWeight="bold" fontFamily="monospace">RDS Writer</text>
                  <text x="465" y="630" fill="#22d3ee" fontSize="8" textAnchor="middle" fontFamily="monospace">10.11.101.10 | db.r5.large</text>
                  <text x="465" y="642" fill="#6b7280" fontSize="7" textAnchor="middle" fontFamily="monospace">PostgreSQL 15 | Primary</text>
                  
                  {/* Private Subnet B */}
                  <rect x="610" y="545" width="250" height="120" rx="8" fill="url(#privateSubnetGradient)" stroke="#a855f7" strokeWidth="2"/>
                  <text x="735" y="565" fill="#a855f7" fontSize="12" textAnchor="middle" fontWeight="bold" fontFamily="monospace">Private Subnet B</text>
                  <text x="735" y="580" fill="#c084fc" fontSize="9" textAnchor="middle" fontFamily="monospace">10.11.102.0/24 | us-east-1b</text>
                  
                  {/* RDS Reader */}
                  <rect x="630" y="595" width="210" height="55" rx="6" fill="#1e293b" stroke="#10b981" strokeWidth="2"/>
                  <image href="/aws-icons/rds.svg" x="635" y="600" width="24" height="24"/>
                  <text x="745" y="615" fill="#10b981" fontSize="10" textAnchor="middle" fontWeight="bold" fontFamily="monospace">RDS Reader</text>
                  <text x="735" y="630" fill="#34d399" fontSize="8" textAnchor="middle" fontFamily="monospace">10.11.102.10 | db.r5.large</text>
                  <text x="735" y="642" fill="#6b7280" fontSize="7" textAnchor="middle" fontFamily="monospace">PostgreSQL 15 | Replica</text>
                  
                  {/* Private Subnet C */}
                  <rect x="880" y="545" width="250" height="120" rx="8" fill="url(#privateSubnetGradient)" stroke="#a855f7" strokeWidth="2"/>
                  <text x="1005" y="565" fill="#a855f7" fontSize="12" textAnchor="middle" fontWeight="bold" fontFamily="monospace">Private Subnet C</text>
                  <text x="1005" y="580" fill="#c084fc" fontSize="9" textAnchor="middle" fontFamily="monospace">10.11.103.0/24 | us-east-1c</text>
                  
                  {/* Failover Standby */}
                  <rect x="900" y="595" width="210" height="55" rx="6" fill="#1e293b" stroke="#6b7280" strokeWidth="1" strokeDasharray="4,2"/>
                  <text x="1005" y="620" fill="#6b7280" fontSize="9" textAnchor="middle" fontFamily="monospace">Failover Standby</text>
                  <text x="1005" y="635" fill="#4b5563" fontSize="8" textAnchor="middle" fontFamily="monospace">(Multi-AZ Ready)</text>
                  
                  {/* RDS Replication line */}
                  <line x1="570" y1="622" x2="630" y2="622" stroke="#06b6d4" strokeWidth="2" strokeDasharray="5,3"/>
                  <text x="600" y="615" fill="#06b6d4" fontSize="8" textAnchor="middle" fontFamily="monospace">sync</text>
                  
                  {/* Connection: Server 1A to RDS Writer (writes) */}
                  <line x1="370" y1="450" x2="370" y2="520" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6"/>
                  <line x1="370" y1="520" x2="420" y2="545" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6"/>
                  <text x="345" y="490" fill="#06b6d4" fontSize="7" fontFamily="monospace">writes</text>
                  
                  {/* Connection: RDS Reader to all public subnets (reads) */}
                  <line x1="840" y1="595" x2="840" y2="500" stroke="#10b981" strokeWidth="1.5" opacity="0.5"/>
                  <line x1="525" y1="500" x2="1050" y2="500" stroke="#10b981" strokeWidth="1.5" opacity="0.5"/>
                  <line x1="525" y1="500" x2="525" y2="485" stroke="#10b981" strokeWidth="1.5" opacity="0.5"/>
                  <line x1="735" y1="500" x2="735" y2="485" stroke="#10b981" strokeWidth="1.5" opacity="0.5"/>
                  <line x1="1050" y1="500" x2="1050" y2="485" stroke="#10b981" strokeWidth="1.5" opacity="0.5"/>
                  <text x="950" y="492" fill="#10b981" fontSize="7" fontFamily="monospace">reads</text>
                </svg>
              </div>
              
              <div className="diagram-details">
                <div className="diagram-detail-card">
                  <h4>VPC Configuration</h4>
                  <ul>
                    <li><strong>CIDR Block:</strong> 10.11.0.0/16</li>
                    <li><strong>Available IPs:</strong> 65,536</li>
                    <li><strong>Region:</strong> us-east-1</li>
                    <li><strong>AZs:</strong> 3 (a, b, c)</li>
                  </ul>
                </div>
                <div className="diagram-detail-card">
                  <h4>Public Subnets (Web Tier)</h4>
                  <ul>
                    <li><strong>Subnet A:</strong> 10.11.1.0/24</li>
                    <li><strong>Subnet B:</strong> 10.11.2.0/24</li>
                    <li><strong>Subnet C:</strong> 10.11.3.0/24</li>
                  </ul>
                </div>
                <div className="diagram-detail-card">
                  <h4>Private Subnets (DB Tier)</h4>
                  <ul>
                    <li><strong>Subnet A:</strong> 10.11.101.0/24</li>
                    <li><strong>Subnet B:</strong> 10.11.102.0/24</li>
                    <li><strong>Subnet C:</strong> 10.11.103.0/24</li>
                  </ul>
                </div>
                <div className="diagram-detail-card">
                  <h4>Auto Scaling Group</h4>
                  <ul>
                    <li><strong>Min:</strong> 3 | <strong>Max:</strong> 9</li>
                    <li><strong>Current:</strong> 4 (high traffic AZ-A)</li>
                    <li><strong>Instance:</strong> t3.medium</li>
                  </ul>
                </div>
                <div className="diagram-detail-card">
                  <h4>RDS Configuration</h4>
                  <ul>
                    <li><strong>Engine:</strong> PostgreSQL 15</li>
                    <li><strong>Instance:</strong> db.r5.large</li>
                    <li><strong>Multi-AZ:</strong> Enabled</li>
                  </ul>
                </div>
                <div className="diagram-detail-card">
                  <h4>Security</h4>
                  <ul>
                    <li><strong>WAF:</strong> SQL injection, XSS</li>
                    <li><strong>Shield:</strong> DDoS protection</li>
                    <li><strong>ACLs:</strong> Network isolation</li>
                  </ul>
                </div>
              </div>
              </>
              )}
              </div>

              {/* S3 Static Website Solution */}
              <div className="diagram-card" style={{ maxWidth: '100%' }}>
                <div 
                  className="diagram-header"
                  onClick={() => setS3CardExpanded(!s3CardExpanded)}
                  style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>
                    <h3>Static Website - S3 + CloudFront + CloudFlare</h3>
                    <p>Cost-effective static hosting with global CDN, SSL/TLS, and edge caching</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s3CardExpanded ? 'Collapse' : 'Expand'}</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: s3CardExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </div>
                </div>
                
                {s3CardExpanded && (
                <>
                {/* Terraform Code Section */}
                <div 
                  className="terraform-code-header"
                  onClick={() => setS3CodeExpanded(!s3CodeExpanded)}
                  style={{ 
                    cursor: 'pointer', 
                    padding: '16px 24px', 
                    borderTop: '1px solid var(--border)', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', color: '#4ade80', fontFamily: 'monospace' }}>Terraform Infrastructure Code</h4>
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>Complete IaC for S3 + CloudFront static hosting</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{s3CodeExpanded ? 'Collapse' : 'Expand'}</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" style={{ transform: s3CodeExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </div>
                </div>
                
                {s3CodeExpanded && (
                  <div className="terraform-code-section" style={{ background: '#0d1117' }}>
                    <div className="terraform-code-tabs" style={{ background: '#161b22', borderBottom: '1px solid #30363d', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                      {S3_SOLUTION_FILES.map((file, index) => (
                        <button
                          key={file.name}
                          onClick={(e) => { e.stopPropagation(); setS3SelectedFile(index); }}
                          style={{ 
                            background: s3SelectedFile === index ? '#0d1117' : 'transparent',
                            color: s3SelectedFile === index ? '#4ade80' : '#8b949e',
                            padding: '6px 12px',
                            borderRadius: '6px 6px 0 0',
                            fontSize: '12px',
                            fontFamily: 'monospace',
                            border: 'none',
                            cursor: 'pointer',
                            borderBottom: s3SelectedFile === index ? '2px solid #4ade80' : '2px solid transparent',
                            transition: 'all 0.2s ease'
                          }}
                          title={file.description}
                        >
                          {file.name}
                        </button>
                      ))}
                      <button 
                        className={`copy-btn ${copiedId === 'terraform-s3' ? 'copied' : ''}`}
                        onClick={(e) => { e.stopPropagation(); copy(S3_SOLUTION_FILES[s3SelectedFile].code, 'terraform-s3'); }}
                        style={{ marginLeft: 'auto', background: '#21262d', border: '1px solid #30363d', color: '#c9d1d9', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontFamily: 'monospace' }}
                      >
                        {copiedId === 'terraform-s3' ? '✓ Copied' : '📋 Copy'}
                      </button>
                    </div>
                    <div style={{ padding: '0' }}>
                      <pre style={{ 
                        margin: 0, 
                        padding: '16px', 
                        background: '#0d1117', 
                        overflow: 'auto', 
                        maxHeight: '500px',
                        fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace", 
                        fontSize: '13px', 
                        lineHeight: '1.6'
                      }}><HighlightedCode code={S3_SOLUTION_FILES[s3SelectedFile].code} /></pre>
                    </div>
                  </div>
                )}
                    
                    <div className="diagram-container" style={{ padding: '24px', overflow: 'auto' }}>
                      <svg viewBox="0 0 1000 510" className="network-diagram" style={{ minWidth: '900px' }}>
                  {/* Background Gradients & Definitions */}
                  <defs>
                    <linearGradient id="awsGradientS3" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1a1a2e" />
                      <stop offset="100%" stopColor="#16213e" />
                    </linearGradient>
                    <filter id="glowS3">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    <marker id="arrowheadOrangeS3" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#F6821F"/>
                    </marker>
                    <marker id="arrowheadPurpleS3" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#8B5CF6"/>
                    </marker>
                    <marker id="arrowheadGreenS3" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e"/>
                    </marker>
                  </defs>
                  
                  {/* User */}
                  <rect x="40" y="180" width="100" height="80" rx="8" fill="#1e293b" stroke="#60a5fa" strokeWidth="2"/>
                  <text x="90" y="215" fill="#60a5fa" fontSize="24" textAnchor="middle">👤</text>
                  <text x="90" y="245" fill="#60a5fa" fontSize="12" textAnchor="middle" fontWeight="bold" fontFamily="monospace">User</text>
                  
                  {/* Arrow User to CloudFlare */}
                  <line x1="140" y1="220" x2="195" y2="220" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrowheadOrangeS3)"/>
                  <text x="168" y="210" fill="#60a5fa" fontSize="8" textAnchor="middle" fontFamily="monospace">DNS</text>
                  
                  {/* CloudFlare */}
                  <rect x="200" y="160" width="140" height="120" rx="8" fill="#1a1a2e" stroke="#F6821F" strokeWidth="2"/>
                  <image href="/aws-icons/cloudflare.svg" x="238" y="168" width="32" height="32"/>
                  <text x="270" y="215" fill="#F6821F" fontSize="13" textAnchor="middle" fontWeight="bold" fontFamily="monospace">CloudFlare</text>
                  <text x="270" y="230" fill="#FAAD3F" fontSize="9" textAnchor="middle" fontFamily="monospace">DNS Management</text>
                  <text x="270" y="248" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">example.com</text>
                  <text x="270" y="265" fill="#6ee7b7" fontSize="8" textAnchor="middle" fontFamily="monospace">CNAME → CloudFront</text>
                  
                  {/* Arrow CloudFlare to CloudFront */}
                  <line x1="340" y1="220" x2="425" y2="220" stroke="#F6821F" strokeWidth="2" markerEnd="url(#arrowheadPurpleS3)"/>
                  <text x="383" y="210" fill="#F6821F" fontSize="8" textAnchor="middle" fontFamily="monospace">HTTPS</text>
                  
                  {/* AWS Cloud Border */}
                  <rect x="415" y="50" width="560" height="400" rx="12" fill="none" stroke="#FF9900" strokeWidth="2" strokeDasharray="8,4" opacity="0.5"/>
                  <text x="695" y="75" fill="#FF9900" fontSize="14" fontFamily="monospace" fontWeight="bold">AWS Cloud</text>
                  
                  {/* CloudFront */}
                  <rect x="430" y="140" width="180" height="160" rx="8" fill="#232f3e" stroke="#8B5CF6" strokeWidth="2" filter="url(#glowS3)"/>
                  <image href="/aws-icons/cloudfront.svg" x="488" y="148" width="32" height="32"/>
                  <text x="520" y="195" fill="#8B5CF6" fontSize="14" textAnchor="middle" fontWeight="bold" fontFamily="monospace">CloudFront</text>
                  <text x="520" y="210" fill="#a78bfa" fontSize="9" textAnchor="middle" fontFamily="monospace">CDN Distribution</text>
                  <text x="520" y="228" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">d1234.cloudfront.net</text>
                  <text x="520" y="245" fill="#22d3ee" fontSize="8" textAnchor="middle" fontFamily="monospace">Edge Caching</text>
                  <text x="520" y="260" fill="#22d3ee" fontSize="8" textAnchor="middle" fontFamily="monospace">SSL Termination</text>
                  <text x="520" y="275" fill="#22d3ee" fontSize="8" textAnchor="middle" fontFamily="monospace">Security Headers</text>
                  <text x="520" y="290" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">HTTP/2 + HTTP/3</text>
                  
                  {/* ACM Certificate Badge */}
                  <rect x="575" y="95" width="90" height="65" rx="4" fill="#232f3e" stroke="#DD344C" strokeWidth="2"/>
                  <image href="/aws-icons/acm.svg" x="598" y="102" width="28" height="28"/>
                  <text x="620" y="145" fill="#DD344C" fontSize="9" textAnchor="middle" fontWeight="bold" fontFamily="monospace">ACM</text>
                  <text x="620" y="157" fill="#fbbf24" fontSize="7" textAnchor="middle" fontFamily="monospace">TLS 1.2+</text>
                  
                  {/* Arrow CloudFront to S3 */}
                  <line x1="610" y1="220" x2="695" y2="220" stroke="#8B5CF6" strokeWidth="2" markerEnd="url(#arrowheadGreenS3)"/>
                  <text x="653" y="210" fill="#8B5CF6" fontSize="8" textAnchor="middle" fontFamily="monospace">OAC</text>
                  
                  {/* S3 Bucket */}
                  <rect x="700" y="140" width="180" height="160" rx="8" fill="#232f3e" stroke="#7AA116" strokeWidth="2"/>
                  <image href="/aws-icons/s3.svg" x="758" y="148" width="32" height="32"/>
                  <text x="790" y="195" fill="#7AA116" fontSize="14" textAnchor="middle" fontWeight="bold" fontFamily="monospace">S3 Bucket</text>
                  <text x="790" y="210" fill="#4ade80" fontSize="9" textAnchor="middle" fontFamily="monospace">Static Website Origin</text>
                  <text x="790" y="228" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">website-prod-a1b2c3d4</text>
                  <text x="790" y="245" fill="#22d3ee" fontSize="8" textAnchor="middle" fontFamily="monospace">Private Access Only</text>
                  <text x="790" y="260" fill="#22d3ee" fontSize="8" textAnchor="middle" fontFamily="monospace">Versioning Enabled</text>
                  <text x="790" y="275" fill="#22d3ee" fontSize="8" textAnchor="middle" fontFamily="monospace">AES-256 Encryption</text>
                  <text x="790" y="290" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">30 day version cleanup</text>

                  {/* S3 Contents Preview */}
                  <rect x="730" y="330" width="120" height="80" rx="4" fill="#1e293b" stroke="#374151" strokeWidth="1"/>
                  <text x="790" y="348" fill="#9ca3af" fontSize="8" textAnchor="middle" fontFamily="monospace">📁 Contents</text>
                  <text x="790" y="365" fill="#60a5fa" fontSize="7" textAnchor="middle" fontFamily="monospace">index.html</text>
                  <text x="790" y="378" fill="#60a5fa" fontSize="7" textAnchor="middle" fontFamily="monospace">error.html</text>
                  <text x="790" y="391" fill="#a78bfa" fontSize="7" textAnchor="middle" fontFamily="monospace">/assets/*</text>
                  <text x="790" y="404" fill="#a78bfa" fontSize="7" textAnchor="middle" fontFamily="monospace">/js/* /css/*</text>
                  
                  {/* Edge Locations */}
                  <rect x="450" y="330" width="140" height="60" rx="4" fill="#1e293b" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="4,2"/>
                  <text x="520" y="350" fill="#8B5CF6" fontSize="9" textAnchor="middle" fontWeight="bold" fontFamily="monospace">🌐 Edge Locations</text>
                  <text x="520" y="368" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">PriceClass_100</text>
                  <text x="520" y="382" fill="#6b7280" fontSize="7" textAnchor="middle" fontFamily="monospace">NA, EU (Low Latency)</text>

                                  </svg>
              </div>
              
              <div className="diagram-details">
                <div className="diagram-detail-card">
                  <h4>S3 Configuration</h4>
                  <ul>
                    <li><strong>Access:</strong> Private (OAC only)</li>
                    <li><strong>Versioning:</strong> Enabled</li>
                    <li><strong>Encryption:</strong> AES-256</li>
                    <li><strong>Lifecycle:</strong> 30 day cleanup</li>
                  </ul>
                </div>
                <div className="diagram-detail-card">
                  <h4>CloudFront CDN</h4>
                  <ul>
                    <li><strong>Price Class:</strong> 100 (NA, EU)</li>
                    <li><strong>Protocol:</strong> HTTP/2 + HTTP/3</li>
                    <li><strong>Cache:</strong> Optimized policy</li>
                    <li><strong>SPA:</strong> 404 → index.html</li>
                  </ul>
                </div>
                <div className="diagram-detail-card">
                  <h4>SSL/TLS (ACM)</h4>
                  <ul>
                    <li><strong>Min Version:</strong> TLS 1.2</li>
                    <li><strong>Validation:</strong> DNS (CloudFlare)</li>
                    <li><strong>Region:</strong> us-east-1</li>
                    <li><strong>Auto-renew:</strong> Yes</li>
                  </ul>
                </div>
                <div className="diagram-detail-card">
                  <h4>CloudFlare DNS</h4>
                  <ul>
                    <li><strong>Record:</strong> CNAME → CF</li>
                    <li><strong>Proxy:</strong> Disabled</li>
                    <li><strong>SSL Mode:</strong> Full</li>
                    <li><strong>HTTPS:</strong> Always</li>
                  </ul>
                </div>
                <div className="diagram-detail-card">
                  <h4>Security Headers</h4>
                  <ul>
                    <li><strong>HSTS:</strong> Enabled</li>
                    <li><strong>X-Frame:</strong> DENY</li>
                    <li><strong>XSS:</strong> Protected</li>
                    <li><strong>Referrer:</strong> Strict origin</li>
                  </ul>
                </div>
                <div className="diagram-detail-card">
                  <h4>Estimated Cost</h4>
                  <ul>
                    <li><strong>S3:</strong> ~$0.50/month</li>
                    <li><strong>CloudFront:</strong> ~$1-4/month</li>
                    <li><strong>ACM:</strong> Free</li>
                    <li><strong>Total:</strong> ~$1-5/month</li>
                  </ul>
                </div>
              </div>
              </>
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
            <a href={CONFIG.resumeUrl} download="Wesley_Bey_Resume.pdf" className="btn btn-secondary">
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
      
      {/* Certifications Section - Credly Badges */}
      <section className="section" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="container">
          <div className="section-header">
            <p className="section-label">// Verified Credentials</p>
            <h2 className="section-title">Certifications</h2>
          </div>
          
          {/* Certification Badge Cards with Local Images */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}>
            {[
              { name: "AWS Solutions Architect Professional", img: "/badges/aws-certified-solutions-architect-professional.png" },
              { name: "AWS SysOps Administrator Associate", img: "/badges/aws-certified-sysops-administrator-associate.png" },
              { name: "AWS Solutions Architect Associate", img: "/badges/aws-certified-solutions-architect-associate.png" },
              { name: "CompTIA Security+", img: "/badges/comptia-security-ce-certification.png" },
              { name: "HashiCorp Terraform Associate", img: "/badges/hashicorp-certified-terraform-associate-002.png" },
            ].map((cert, index) => (
              <a
                key={index}
                href={`https://www.credly.com/users/${CONFIG.credlyUsername}/badges`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textDecoration: 'none',
                  padding: '20px',
                  background: 'var(--bg-card)',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  transition: 'all 0.3s ease',
                  width: '160px'
                }}
                className="certification-badge"
              >
                <img 
                  src={cert.img}
                  alt={cert.name}
                  style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                />
                <span style={{ 
                  marginTop: '12px', 
                  fontSize: '12px', 
                  color: 'var(--text-secondary)',
                  textAlign: 'center',
                  lineHeight: '1.4'
                }}>
                  {cert.name}
                </span>
              </a>
            ))}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <a 
              href={`https://www.credly.com/users/${CONFIG.credlyUsername}/badges`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'transparent',
                color: 'var(--accent-blue)',
                borderRadius: '8px',
                border: '1px solid var(--accent-blue)',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
            >
              <span>Verify on Credly</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
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
            {/* CI/CD Pipeline Diagram - Enhanced with AWS Services */}
            <div className="architecture-diagram">
              <h3>CI/CD Pipeline & Infrastructure</h3>
              <div className="arch-x-layout">
                {/* Top Row: Entra ID SSO → VS Code → GitHub */}
                <div className="arch-x-row" style={{ gap: '8px' }}>
                  {/* Entra ID SSO */}
                  <div className="arch-node" style={{ borderColor: '#00A4EF', minWidth: '90px' }}>
                    <span className="arch-node-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="#00A4EF">
                        <path d="M11.5 2L2 7v10l9.5 5 9.5-5V7l-9.5-5zm0 2.18l6.9 3.64v7.36l-6.9 3.64-6.9-3.64V7.82l6.9-3.64z"/>
                        <circle cx="11.5" cy="12" r="3" fill="#00A4EF"/>
                      </svg>
                    </span>
                    <div className="arch-node-info">
                      <h4 style={{ fontSize: '11px' }}>Entra ID</h4>
                      <span style={{ fontSize: '9px' }}>SSO</span>
                    </div>
                  </div>
                  
                  <div className="arch-arrow-h" style={{ fontSize: '14px' }}>→</div>
                  
                  <div className="arch-node" style={{ borderColor: '#007ACC', minWidth: '90px' }}>
                    <span className="arch-node-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="#007ACC">
                        <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/>
                      </svg>
                    </span>
                    <div className="arch-node-info">
                      <h4 style={{ fontSize: '11px' }}>VS Code</h4>
                      <span style={{ fontSize: '9px' }}>Dev</span>
                    </div>
                  </div>
                  
                  <div className="arch-arrow-h" style={{ fontSize: '14px' }}>→</div>
                  
                  <div className="arch-node" style={{ borderColor: '#6e5494', minWidth: '90px' }}>
                    <span className="arch-node-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                    </span>
                    <div className="arch-node-info">
                      <h4 style={{ fontSize: '11px' }}>GitHub</h4>
                      <span style={{ fontSize: '9px' }}>Source</span>
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
                
                {/* Arrows down to providers */}
                <div className="arch-x-arrows-split">
                  <span>↙</span>
                  <span>↓</span>
                  <span>↘</span>
                </div>
                
                {/* Bottom Row: AWS Services + Cloudflare + Azure */}
                <div className="arch-x-row" style={{ gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {/* S3 */}
                  <div className="arch-node" style={{ borderColor: '#569A31', minWidth: '70px' }}>
                    <span className="arch-node-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="#569A31">
                        <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.5L18 8l-6 3.5L6 8l6-3.5zM5 9.5l6 3.5v6.5l-6-3.5V9.5zm14 0v6.5l-6 3.5v-6.5l6-3.5z"/>
                      </svg>
                    </span>
                    <div className="arch-node-info">
                      <h4 style={{ fontSize: '10px' }}>S3</h4>
                      <span style={{ fontSize: '8px' }}>Storage</span>
                    </div>
                  </div>
                  
                  {/* CloudFront */}
                  <div className="arch-node" style={{ borderColor: '#8C4FFF', minWidth: '70px' }}>
                    <span className="arch-node-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="#8C4FFF">
                        <circle cx="12" cy="12" r="10" fill="none" stroke="#8C4FFF" strokeWidth="2"/>
                        <circle cx="12" cy="12" r="4" fill="#8C4FFF"/>
                        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="#8C4FFF" strokeWidth="2"/>
                      </svg>
                    </span>
                    <div className="arch-node-info">
                      <h4 style={{ fontSize: '10px' }}>CloudFront</h4>
                      <span style={{ fontSize: '8px' }}>CDN</span>
                    </div>
                  </div>
                  
                  {/* IAM */}
                  <div className="arch-node" style={{ borderColor: '#DD344C', minWidth: '70px' }}>
                    <span className="arch-node-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="#DD344C">
                        <path d="M12 2C9.24 2 7 4.24 7 7c0 2.76 2.24 5 5 5s5-2.24 5-5c0-2.76-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
                        <path d="M12 14c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4z"/>
                      </svg>
                    </span>
                    <div className="arch-node-info">
                      <h4 style={{ fontSize: '10px' }}>IAM</h4>
                      <span style={{ fontSize: '8px' }}>SAML</span>
                    </div>
                  </div>
                  
                  {/* Cloudflare */}
                  <div className="arch-node" style={{ borderColor: '#F38020', minWidth: '70px' }}>
                    <span className="arch-node-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="#F38020">
                        <path d="M16.5088 16.8447c.1475-.5068.0908-.9707-.1553-1.3154-.2246-.3164-.6045-.499-1.0615-.5205l-8.6592-.1123a.1559.1559 0 0 1-.1333-.0713c-.0283-.042-.0351-.0986-.021-.1553.0278-.084.1123-.1484.2036-.1562l8.7359-.1123c1.0351-.0489 2.1582-.8984 2.5537-1.9336l.499-1.3086c.0215-.0576.0283-.1152.0147-.168-.5625-2.5254-2.8301-4.4062-5.5606-4.4062-2.499 0-4.6289 1.5898-5.4199 3.8086-.4844-.3594-1.0986-.5625-1.7696-.499-1.1953.1191-2.1484 1.0566-2.2891 2.2519-.0352.2871-.0205.5674.0283.8301C1.0273 12.3838 0 13.5918 0 15.0508c0 .1699.0137.3359.0352.499.0146.0918.0908.1602.1826.1602l15.7471.0059c.0283 0 .0566-.0059.0849-.0137.0566-.0205.1054-.0625.1269-.1192l.3321-.7314z"/>
                      </svg>
                    </span>
                    <div className="arch-node-info">
                      <h4 style={{ fontSize: '10px' }}>Cloudflare</h4>
                      <span style={{ fontSize: '8px' }}>DNS</span>
                    </div>
                  </div>
                  
                  {/* Azure/Entra */}
                  <div className="arch-node" style={{ borderColor: '#0078D4', minWidth: '70px' }}>
                    <span className="arch-node-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="#0078D4">
                        <path d="M5.483 21.3H24L14.025 4.013l-3.038 8.347 5.836 6.938L5.483 21.3zM13.23 2.7L6.105 8.677 0 19.253h5.505v.014L13.23 2.7z"/>
                      </svg>
                    </span>
                    <div className="arch-node-info">
                      <h4 style={{ fontSize: '10px' }}>Azure</h4>
                      <span style={{ fontSize: '8px' }}>Entra ID</span>
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
            {CONFIG.career.map((job, i) => {
              const isExpanded = expandedCareerItems.includes(i);
              return (
                <div key={i} className="career-item">
                  <div className="career-marker">{job.icon}</div>
                  <div className="career-card">
                    {/* Clickable Header - Always Visible */}
                    <div 
                      className="career-header-clickable"
                      onClick={() => {
                        setExpandedCareerItems(prev => 
                          prev.includes(i) 
                            ? prev.filter(item => item !== i)
                            : [...prev, i]
                        );
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="career-header">
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <span 
                            className="career-expand-arrow"
                            style={{ 
                              fontSize: '16px', 
                              color: 'var(--accent-cyan)',
                              transition: 'transform 0.3s ease',
                              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                              marginTop: '4px',
                              flexShrink: 0,
                              animation: !isExpanded ? 'pulse-glow 2s ease-in-out infinite' : 'none'
                            }}
                          >
                            ▶
                          </span>
                          <div style={{ flex: 1 }}>
                            <h3 className="career-title">{job.title}</h3>
                            <div className="career-company">{job.company}</div>
                            <div className="career-meta">
                              <span>📍 {job.location}</span>
                              <span>📅 {job.period}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {job.technologies && job.technologies.length > 0 && (
                        <div className="career-technologies">
                          {job.technologies.map((tech, k) => (
                            <span key={k} className="career-tech-tag">{tech}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Collapsible Details */}
                    <div 
                      style={{ 
                        maxHeight: isExpanded ? '1000px' : '0',
                        overflow: 'hidden',
                        transition: 'max-height 0.4s ease-in-out',
                        opacity: isExpanded ? 1 : 0,
                      }}
                    >
                      <ul className="career-highlights" style={{ marginTop: '16px' }}>
                        {job.highlights.map((highlight, j) => (
                          <li key={j}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
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
                      {loading ? '...' : (linesOfCode?.added?.toLocaleString() || '—')}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Lines Added</div>
                  </div>
                </div>
                <div className="github-stat-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '32px', color: '#ef4444' }}>--</div>
                  <div>
                    <div style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'var(--font-mono)', background: 'linear-gradient(135deg, #ef4444, #f87171)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {loading ? '...' : (linesOfCode?.deleted?.toLocaleString() || '—')}
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
          <p className="footer-tech">
            <span className="footer-item">
              Built with React
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#61DAFB" style={{ marginLeft: '6px', verticalAlign: 'middle' }}>
                <path d="M12 9.861a2.139 2.139 0 1 0 0 4.278 2.139 2.139 0 1 0 0-4.278zm-5.992 6.394l-.472-.12C2.018 15.246 0 13.737 0 11.996s2.018-3.25 5.536-4.139l.472-.119.133.468a23.53 23.53 0 0 0 1.363 3.578l.101.213-.101.213a23.307 23.307 0 0 0-1.363 3.578l-.133.467zM5.317 8.95c-2.674.751-4.315 1.9-4.315 3.046 0 1.145 1.641 2.294 4.315 3.046a24.95 24.95 0 0 1 1.182-3.046A24.752 24.752 0 0 1 5.317 8.95zm12.675 7.305l-.133-.469a23.357 23.357 0 0 0-1.364-3.577l-.101-.213.101-.213a23.42 23.42 0 0 0 1.364-3.578l.133-.468.473.119c3.517.889 5.535 2.398 5.535 4.14s-2.018 3.25-5.535 4.139l-.473.12zm-.491-4.259c.48 1.039.877 2.06 1.182 3.046 2.675-.752 4.315-1.901 4.315-3.046 0-1.146-1.641-2.294-4.315-3.046a24.788 24.788 0 0 1-1.182 3.046zM5.31 8.945l-.133-.467C4.188 4.992 4.488 2.494 6 1.622c1.483-.856 3.864.155 6.359 2.716l.34.349-.34.349a23.552 23.552 0 0 0-2.422 2.967l-.135.193-.235.02a23.657 23.657 0 0 0-3.785.61l-.472.119zm1.896-6.63c-.268 0-.505.058-.705.173-.994.573-1.17 2.565-.485 5.253a25.122 25.122 0 0 1 3.233-.501 24.847 24.847 0 0 1 2.052-2.544c-1.56-1.519-3.037-2.381-4.095-2.381zm9.589 20.362c-.001 0-.001 0 0 0-1.425 0-3.255-1.073-5.154-3.023l-.34-.349.34-.349a23.53 23.53 0 0 0 2.421-2.968l.135-.193.234-.02a23.63 23.63 0 0 0 3.787-.609l.472-.119.134.468c.987 3.484.688 5.983-.824 6.854a2.38 2.38 0 0 1-1.205.308zm-4.096-3.381c1.56 1.519 3.037 2.381 4.095 2.381h.001c.267 0 .505-.058.704-.173.994-.573 1.171-2.566.485-5.254a25.02 25.02 0 0 1-3.234.501 24.674 24.674 0 0 1-2.051 2.545zM18.69 8.945l-.472-.119a23.479 23.479 0 0 0-3.787-.61l-.234-.02-.135-.193a23.414 23.414 0 0 0-2.421-2.967l-.34-.349.34-.349C14.135 1.778 16.515.767 18 1.622c1.512.872 1.812 3.37.824 6.855l-.134.468zM14.75 7.24c1.142.104 2.227.273 3.234.501.686-2.688.509-4.68-.485-5.253-.988-.571-2.845.304-4.8 2.208A24.849 24.849 0 0 1 14.75 7.24zM7.206 22.677A2.38 2.38 0 0 1 6 22.369c-1.512-.871-1.812-3.369-.823-6.854l.132-.468.472.119c1.155.291 2.429.496 3.785.609l.235.02.134.193a23.596 23.596 0 0 0 2.422 2.968l.34.349-.34.349c-1.898 1.95-3.728 3.023-5.151 3.023zm-1.19-6.427c-.686 2.688-.509 4.681.485 5.254.987.563 2.843-.305 4.8-2.208a24.998 24.998 0 0 1-2.052-2.545 24.976 24.976 0 0 1-3.233-.501zm5.984.628c-.823 0-1.669-.036-2.516-.106l-.235-.02-.135-.193a30.388 30.388 0 0 1-1.35-2.122 30.354 30.354 0 0 1-1.166-2.228l-.1-.213.1-.213a30.3 30.3 0 0 1 1.166-2.228c.414-.716.869-1.43 1.35-2.122l.135-.193.235-.02a29.785 29.785 0 0 1 5.033 0l.234.02.134.193a30.006 30.006 0 0 1 2.517 4.35l.101.213-.101.213a29.6 29.6 0 0 1-2.517 4.35l-.134.193-.234.02c-.847.07-1.694.106-2.517.106zm-2.197-1.084c1.48.111 2.914.111 4.395 0a29.006 29.006 0 0 0 2.196-3.798 28.585 28.585 0 0 0-2.197-3.798 29.031 29.031 0 0 0-4.394 0 28.477 28.477 0 0 0-2.197 3.798 29.114 29.114 0 0 0 2.197 3.798z"/>
              </svg>
            </span>
            <span className="footer-separator">•</span>
            <span className="footer-item">
              Deployed with Terraform
              <svg width="18" height="18" viewBox="0 0 128 128" fill="#7B42BC" style={{ marginLeft: '6px', verticalAlign: 'middle' }}>
                <path d="M77.941 44.5v36.836L46.324 62.918V26.082zm0 42.138L46.324 105.3V68.464l31.617-18.662zM81.41 81.336l31.633-18.662V25.838L81.41 44.5zm0-62.838L49.793 0v36.836l31.617 18.662z"/>
              </svg>
            </span>
            <span className="footer-separator">•</span>
            <span className="footer-item">
              Hosted on AWS
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF9900" style={{ marginLeft: '6px', verticalAlign: 'middle' }}>
                <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103a6.4 6.4 0 0 0-.862.272 2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.264-.168.312a.549.549 0 0 1-.32.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.415-.287-.806-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167zM21.698 16.207c-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.27-.351 3.384 1.963 7.559 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.439-.2.814.287.385.607zM22.792 14.961c-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399.287.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151.32-.79 1.03-2.57.695-2.994z"/>
              </svg>
            </span>
          </p>
        </div>
      </footer>
      </>
      )}
      </div>
    </>
  );
}
