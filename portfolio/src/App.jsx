import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TERRAFORM_MODULES, TF_PROVIDERS, TF_SUBCATEGORY_ICONS, getTfSubcategories, getTfModuleIcon } from './terraformData';
import useGitHubStats from './hooks/useGitHubStats';
import useCopyToClipboard from './hooks/useCopyToClipboard';
import languageColors from './constants/languageColors';
import Hero from './components/Hero';
import CertificationsSection from './components/CertificationsSection';
import ArchitectureSection from './components/ArchitectureSection';
import CareerTimelineSection from './components/CareerTimelineSection';
import SkillsSection from './components/SkillsSection';
import GitHubReposSection from './components/GitHubReposSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import './styles/index.css';

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
// CLOUD PROVIDER DETECTION (for multi-cloud deployment)
// ============================================================================
const CLOUD_PROVIDER = import.meta.env.VITE_CLOUD_PROVIDER || 'aws';
const IS_AZURE = CLOUD_PROVIDER === 'azure';

// Azure theme overrides
const AZURE_THEME = {
  primary: '#0078D4',      // Azure Blue
  secondary: '#50E6FF',    // Azure Cyan
  accent: '#00BCF2',       // Azure Light Blue
};

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
  linkedin: "https://www.linkedin.com/in/wesley-bey/",
  yearsExperience: 16, // Started in IT in 2009 in the Navy
  resumeUrl: "/resume.pdf",

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
        "Own all Terraform infrastructure as code for the organization, developing and maintaining modules for AWS, Azure, Cloudflare, Kubernetes, and Docker",
        "Lead and mentor 1 DevOps engineer, establishing IaC standards and best practices across the team",
        "Architect cloud solutions translating business requirements into scalable, cost-effective infrastructure designs",
        "Build and maintain CI/CD pipelines using GitHub Actions with linting, testing, and automated infrastructure deployments",
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

// ==========================================================================
// COMPONENTS
// ==========================================================================

function App() {
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
  
  // Set cloud mode body class for banner spacing
  useEffect(() => {
    if (IS_AZURE) {
      document.body.classList.add('azure-mode');
    } else {
      document.body.classList.add('aws-mode');
    }
    return () => {
      document.body.classList.remove('azure-mode');
      document.body.classList.remove('aws-mode');
    };
  }, []);
  
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
      {/* Azure Cloud Banner - only shows on Azure deployment */}
      {IS_AZURE && (
        <div className="azure-banner">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.05 4.24L6.56 18.05a.5.5 0 0 1-.47.31H2.85a.5.5 0 0 1-.44-.75l6.37-11.3a.5.5 0 0 0 0-.5L6.23 2.69a.5.5 0 0 1 .44-.75h4.19a.5.5 0 0 1 .44.26l1.75 3.04zM13.5 5.5l7.25 12.75a.5.5 0 0 1-.44.75H8.85a.5.5 0 0 1-.44-.75L13.5 5.5z"/>
          </svg>
          <span>You are now on <strong>Microsoft Azure</strong> — Static Web App</span>
          <a href="https://beyops.com">← Back to AWS</a>
        </div>
      )}
      
      {/* AWS Cloud Banner - only shows on AWS deployment */}
      {!IS_AZURE && (
        <div className="aws-banner">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.296.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.415-.287-.806-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167z"/>
          </svg>
          <span>This site is <strong>Multi-Cloud</strong> — Also hosted on Azure!</span>
          <a href="https://azure.beyops.com">View on Azure →</a>
        </div>
      )}
      
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
            <span className="nav-logo-typing">&gt; beyops</span><span className="nav-logo-cursor"></span>
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
              <div className="sidebar-header">
                <h2>Terraform Modules</h2>
                <p>{TERRAFORM_MODULES.length} modules available</p>
              </div>
              
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
                    <li><strong>Azure Static Web App:</strong> Free tier ($0/month)</li>
                    <li><strong>Total:</strong> ~$1-5/month (AWS) + $0/month (Azure mirror)</li>
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
      <Hero CONFIG={CONFIG} />
      
      <CertificationsSection CONFIG={CONFIG} />
      
      {/* Architecture Section - How This Site is Built */}
      <ArchitectureSection />
      
      <CareerTimelineSection
        career={CONFIG.career}
        expandedCareerItems={expandedCareerItems}
        setExpandedCareerItems={setExpandedCareerItems}
      />
      
      <SkillsSection skillsWithProgress={CONFIG.skillsWithProgress} />
      
      <GitHubReposSection
        CONFIG={CONFIG}
        repos={repos}
        loading={loading}
        stats={stats}
        linesOfCode={linesOfCode}
        languageColors={languageColors}
        skillsRef={skillsRef}
        skillsVisible={skillsVisible}
      />
      
      <ContactSection
        CONFIG={CONFIG}
        formStatus={formStatus}
        handleSubmit={handleSubmit}
        contactRef={contactRef}
        contactVisible={contactVisible}
      />
      
      {/* Footer */}
      <Footer IS_AZURE={IS_AZURE} />
      
      {/* Footer */}
      {/*
      <footer className="footer">
        <div className="container">
          <p className="footer-tech">
            <span className="footer-item">
              Built with React
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#61DAFB" style={{ marginLeft: '6px', verticalAlign: 'middle' }}>
                <path d="M12 9.861a2.139 2.139 0 1 0 0 4.278 2.139 2.139 0 1 0 0-4.278zm-5.992 6.394l-.472-.12C2.018 15.246 0 13.737 0 11.996s2.018-3.25 5.536-4.139l.472-.119.133.468a23.53 23.53 0 0 0 1.363 3.578l.101.213-.101.213a23.307 23.307 0 0 0-1.363 3.578l-.133.467zM5.317 8.95c-2.674.751-4.315 1.9-4.315 3.046 0 1.145 1.641 2.294 4.315 3.046a24.95 24.95 0 0 1 1.182-3.046A24.752 24.752 0 0 1 5.317 8.95zm12.675 7.305l-.133-.469a23.357 23.357 0 0 0-1.364-3.577l-.101-.213.101-.213a23.42 23.42 0 0 0 1.364-3.578l.133-.468.473.119c3.517.889 5.535 2.398 5.535 4.14s-2.018 3.25-5.535 4.139l-.473.12zm-.491-4.259c.48 1.039.877 2.06 1.182 3.046 2.675-.752 4.315-1.901 4.315-3.046 0-1.146-1.641-2.294-4.315-3.046a24.788 24.788 0 0 1-1.182 3.046zM5.31 8.945l-.133-.467C4.188 4.992 4.488 2.494 6 1.622c1.483-.856 3.864.155 6.359 2.716l.34.349-.34.349a23.552 23.552 0 0 0-2.422 2.967l-.135.193-.235.02a23.657 23.657 0 0 0-3.785.61l-.472.119zm1.896-6.63c-.268 0-.505.058-.705.173-.994.573-1.17 2.565-.485 5.253a25.122 25.122 0 0 1 3.233-.501 24.847 24.847 0 0 1 2.052-2.544c-1.56-1.519-3.037-2.381-4.095-2.381zm9.589 20.362c-.001 0-.001 0 0 0-1.425 0-3.255-1.073-5.154-3.023l-.34-.349.34-.349a23.53 23.53 0 0 0 2.421-2.968l.135-.193.235-.02a23.63 23.63 0 0 0 3.787-.609l.472-.119.134.468c.987 3.484.688 5.983-.824 6.854a2.38 2.38 0 0 1-1.205.308zm-4.096-3.381c1.56 1.519 3.037 2.381 4.095 2.381h.001c.267 0 .505-.058.704-.173.994-.573 1.171-2.566.485-5.254a25.02 25.02 0 0 1-3.234.501 24.674 24.674 0 0 1-2.051 2.545zM18.69 8.945l-.472-.119a23.479 23.479 0 0 0-3.787-.61l-.234-.02-.135-.193a23.414 23.414 0 0 0-2.421-2.967l-.34-.349.34-.349C14.135 1.778 16.515.767 18 1.622c1.512.872 1.812 3.37.824 6.855l-.134.468zM14.75 7.24c1.142.104 2.227.273 3.234.501.686-2.688.509-4.68-.485-5.253-.988-.571-2.845.304-4.8 2.208A24.849 24.849 0 0 1 14.75 7.24zM7.206 22.677A2.38 2.38 0 0 1 6 22.369c-1.512-.871-1.812-3.369-.823-6.854l.132-.468.472.119c1.155.291 2.429.496 3.785.609l.235.02.134.193a23.596 23.596 0 0 0 2.422 2.968l.34.349-.34.349c-1.898 1.95-3.728 3.023-5.151 3.023zm-1.19-6.427c-.686 2.688-.509 4.681.485 5.254.987.563 2.843-.305 4.8-2.208a24.998 24.998 0 0 1-2.052-2.545 24.976 24.976 0 0 1-3.233-.501zm5.984.628c-.823 0-1.669-.036-2.516-.106l-.235-.02-.135-.193a30.388 30.388 0 0 1-1.35-2.122 30.354 30.354 0 0 1-1.166-2.228l-.1-.213.1-.213a30.3 30.3 0 0 1 1.166-2.228c.414-.716.869-1.43 1.35-2.122l.135-.193.235-.02a29.785 29.785 0 0 1 5.033 0l.234.02.134.193a30.006 30.006 0 0 1 2.517 4.35l.101.213-.101.213a29.6 29.6 0 0 1-2.517 4.35l-.134.193-.234.02c-.847.07-1.694.106-2.517.106zm-2.197-1.084c1.48.111 2.914.111 4.395 0a29.006 29.006 0 0 0 2.196-3.798 28.585 28.585 0 0 0-2.197-3.798 29.031 29.031 0 0 0-4.394 0 28.477 28.477 0 0 0-2.197 3.798 29.114 29.114 0 0 0 2.197 3.798z"/>
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
              {IS_AZURE ? 'Hosted on Azure' : 'Hosted on AWS'}
              {IS_AZURE ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#0078D4" style={{ marginLeft: '6px', verticalAlign: 'middle' }}>
                  <path d="M13.05 4.24L6.56 18.05a.5.5 0 0 1-.47.31H2.85a.5.5 0 0 1-.44-.75l6.37-11.3a.5.5 0 0 0 0-.5L6.23 2.69a.5.5 0 0 1 .44-.75h4.19a.5.5 0 0 1 .44.26l1.75 3.04zM13.5 5.5l7.25 12.75a.5.5 0 0 1-.44.75H8.85a.5.5 0 0 1-.44-.75L13.5 5.5z"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF9900" style={{ marginLeft: '6px', verticalAlign: 'middle' }}>
                  <path d="M18.75 11.35a4.32 4.32 0 0 1-.79-.08 3.9 3.9 0 0 1-.73-.23l-.17-.04h-.12q-.15 0-.15.21v.33a.43.43 0 0 0 .05.23.5.5 0 0 0 .18.14 3.5 3.5 0 0 0 .76.27 4.33 4.33 0 0 0 1.02.12 2.47 2.47 0 0 0 1.65-.5 1.7 1.7 0 0 0 .58-1.37 1.42 1.42 0 0 0-.34-.99 2.5 2.5 0 0 0-1.14-.57l-.85-.28a1.3 1.3 0 0 1-.6-.33.67.67 0 0 1-.17-.47.72.72 0 0 1 .3-.6 1.28 1.28 0 0 1 .8-.23 2.35 2.35 0 0 1 1.22.27.4.4 0 0 0 .16.07h.12a.16.16 0 0 0 .14-.08.33.33 0 0 0 .05-.18v-.31a.36.36 0 0 0-.05-.2.45.45 0 0 0-.18-.13 2.6 2.6 0 0 0-.65-.2 4.2 4.2 0 0 0-.82-.08 2.36 2.36 0 0 0-1.57.48 1.59 1.59 0 0 0-.57 1.3 1.5 1.5 0 0 0 .4 1.1 2.54 2.54 0 0 0 1.22.62l.85.27a1.2 1.2 0 0 1 .55.3.64.64 0 0 1 .16.45.76.76 0 0 1-.32.65 1.43 1.43 0 0 1-.87.24zM21.69 14.16A12.57 12.57 0 0 1 12 17.33a12.9 12.9 0 0 1-8.7-3.17c-.18-.16-.02-.38.2-.26a17.46 17.46 0 0 0 8.65 2.33 17.4 17.4 0 0 0 6.6-1.36c.32-.14.6.21.28.43zm.8-.91c-.24-.31-1.6-.15-2.21-.08-.19.02-.21-.14-.05-.26.54-.38 1.43-.27 1.53-.14.1.13-.03.97-.54 1.37-.16.13-.31.06-.24-.1.23-.58.75-1.87.51-2.18z"/>
                </svg>
              )}
            </span>
          </p>
        </div>
      </footer>
      */}
      </>
      )}
      </div>
    </>
  );
}

export default App;
