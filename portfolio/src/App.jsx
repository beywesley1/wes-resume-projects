import React, { useState, useEffect } from 'react';

// ============================================================================
// CONFIGURATION - Edit these values
// ============================================================================
const CONFIG = {
  name: "Wes",
  title: "Cloud Engineer / DevOps Specialist",
  subtitle: "AWS | Azure | Terraform | Infrastructure as Code",
  github: "beywesley1",
  workGithub: "", // Add your work GitHub username here to show work account stats
  email: "your.email@example.com", // Update with your email
  linkedin: "https://linkedin.com/in/yourprofile", // Update with your LinkedIn
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
const SCRIPTS = {
  powershell: [
    {
      title: "Get AD User Details",
      description: "Retrieve detailed Active Directory user information",
      code: `# Get AD User with all properties
$username = Read-Host "Enter username"
Get-ADUser -Identity $username -Properties * | 
    Select-Object Name, EmailAddress, Department, Title, Manager, 
                  Created, LastLogonDate, PasswordLastSet |
    Format-List`,
    },
    {
      title: "Check MFA Status",
      description: "Check MFA registration status for Azure AD users",
      code: `# Requires Microsoft.Graph module
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
      title: "AWS SSM Session",
      description: "Start SSM session to EC2 instance",
      code: `# Start SSM session with AWS CLI
$instanceId = Read-Host "Enter Instance ID"
$profile = Read-Host "Enter AWS Profile (default: default)"
if ([string]::IsNullOrEmpty($profile)) { $profile = "default" }

aws ssm start-session \`
    --target $instanceId \`
    --profile $profile`,
    },
  ],
  bash: [
    {
      title: "EC2 Instance Report",
      description: "List all EC2 instances across regions",
      code: `#!/bin/bash
# List EC2 instances across all regions

for region in $(aws ec2 describe-regions --query 'Regions[].RegionName' --output text); do
    echo "=== Region: $region ==="
    aws ec2 describe-instances \\
        --region "$region" \\
        --query 'Reservations[].Instances[].[InstanceId,State.Name,InstanceType,Tags[?Key==\`Name\`].Value|[0]]' \\
        --output table
done`,
    },
    {
      title: "Terraform Init with Backend",
      description: "Initialize Terraform with S3 backend configuration",
      code: `#!/bin/bash
# Initialize Terraform with S3 backend

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
    {
      title: "Docker Cleanup",
      description: "Clean up unused Docker resources",
      code: `#!/bin/bash
# Docker system cleanup

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
  ],
  terraform: [
    {
      title: "S3 Static Website",
      description: "S3 bucket configured for static website hosting",
      code: `resource "aws_s3_bucket" "website" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_website_configuration" "website" {
  bucket = aws_s3_bucket.website.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_public_access_block" "website" {
  bucket = aws_s3_bucket.website.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "website" {
  bucket = aws_s3_bucket.website.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "PublicReadGetObject"
      Effect    = "Allow"
      Principal = "*"
      Action    = "s3:GetObject"
      Resource  = "\${aws_s3_bucket.website.arn}/*"
    }]
  })
}`,
    },
    {
      title: "CloudFront Distribution",
      description: "CloudFront CDN for S3 static website",
      code: `resource "aws_cloudfront_distribution" "website" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  aliases             = [var.domain_name]
  
  origin {
    domain_name = aws_s3_bucket.website.bucket_regional_domain_name
    origin_id   = "S3-\${var.bucket_name}"
    
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.website.cloudfront_access_identity_path
    }
  }
  
  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-\${var.bucket_name}"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }
  
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  
  viewer_certificate {
    acm_certificate_arn      = var.acm_certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}`,
    },
  ],
};

// ============================================================================
// STYLES
// ============================================================================
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
  
  :root {
    --bg-primary: #050508;
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
  
  .hero-cta {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }
  
  .btn {
    display: inline-flex;
    align-items: center;
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
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    padding: 60px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
  
  .stat-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px;
    transition: all 0.2s ease;
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
  
  .stat-label {
    font-size: 14px;
    color: var(--text-muted);
    margin-top: 4px;
  }
  
  /* Section Styles */
  .section {
    padding: 100px 0;
  }
  
  .section-header {
    margin-bottom: 48px;
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
  
  .career-timeline::before {
    content: '';
    position: absolute;
    left: 12px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, var(--accent-blue), var(--accent-cyan), var(--accent-purple));
  }
  
  .career-item {
    position: relative;
    margin-bottom: 48px;
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
  
  .career-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px;
    transition: all 0.3s ease;
  }
  
  .career-card:hover {
    border-color: var(--accent-blue);
    transform: translateX(4px);
  }
  
  .career-header {
    margin-bottom: 20px;
  }
  
  .career-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 8px;
  }
  
  .career-company {
    font-size: 16px;
    color: var(--accent-cyan);
    font-weight: 500;
    margin-bottom: 4px;
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
  
  /* Contact Section */
  .contact-links {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
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
  
  .contact-link:hover {
    border-color: var(--accent-blue);
    transform: translateY(-2px);
  }
  
  .contact-link svg {
    width: 20px;
    height: 20px;
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
        
        // Fetch lines of code from repo languages (approximation based on repo sizes)
        let totalAdded = 0;
        let totalDeleted = 0;
        
        // Fetch contributor stats for each repo to get lines added/deleted
        const statsPromises = allReposData.slice(0, 10).map(async (repo) => {
          try {
            const statsRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/stats/contributors`);
            if (statsRes.ok) {
              const statsData = await statsRes.json();
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
// MAIN APP
// ============================================================================

export default function App() {
  const [activeTab, setActiveTab] = useState('powershell');
  const { stats, repos, loading, linesOfCode } = useGitHubStats(CONFIG.github);
  const { copiedId, copy } = useCopyToClipboard();
  
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
      
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">Available for opportunities</div>
          <h1>
            Hi, I'm <span>{CONFIG.name}</span>
          </h1>
          <p className="hero-title">{CONFIG.title}</p>
          <p className="hero-subtitle">{CONFIG.subtitle}</p>
          
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
          
          {/* Certifications */}
          <div className="certs-grid">
            {CONFIG.certifications.map((cert, i) => (
              <div key={i} className={`cert-badge ${cert.status}`}>
                <span className="cert-icon">{cert.icon}</span>
                <div className="cert-info">
                  <h4>{cert.name}</h4>
                  <span className="cert-status">
                    {cert.status === 'certified' ? '✓ Certified' : '◐ In Progress'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats Bar */}
      <section className="container">
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-value">{CONFIG.yearsExperience}+</div>
            <div className="stat-label">Years Experience</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">200+</div>
            <div className="stat-label">GitHub Repos Managed</div>
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
      
      {/* Credly Certifications Section */}
      <section className="credly-section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">// Verified Credentials</p>
            <h2 className="section-title">Certifications</h2>
          </div>
          
          {CONFIG.credlyBadges.length > 0 ? (
            <div className="credly-grid">
              {CONFIG.credlyBadges.map((badge, i) => (
                <div key={i} className="credly-badge-wrapper">
                  <div 
                    data-iframe-width="150" 
                    data-iframe-height="270" 
                    data-share-badge-id={badge.id}
                    data-share-badge-host="https://www.credly.com"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="credly-placeholder">
              <h4>🏆 Add Your Credly Badges</h4>
              <p>
                To display your certifications, add your Credly badge IDs to the <code>credlyBadges</code> array in the CONFIG section.
                <br /><br />
                <strong>How to find your badge ID:</strong><br />
                1. Go to your Credly profile<br />
                2. Click on a badge → Share → Get embed code<br />
                3. Copy the <code>data-share-badge-id</code> value
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* GitHub Repos Section */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <p className="section-label">// Open Source</p>
            <h2 className="section-title">GitHub Projects</h2>
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
      
      {/* Scripts Library Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">// Toolbox</p>
            <h2 className="section-title">Scripts Library</h2>
          </div>
          
          <div className="scripts-tabs">
            <button
              className={`tab-btn ${activeTab === 'powershell' ? 'active' : ''}`}
              onClick={() => setActiveTab('powershell')}
            >
              PowerShell
            </button>
            <button
              className={`tab-btn ${activeTab === 'bash' ? 'active' : ''}`}
              onClick={() => setActiveTab('bash')}
            >
              Bash
            </button>
            <button
              className={`tab-btn ${activeTab === 'terraform' ? 'active' : ''}`}
              onClick={() => setActiveTab('terraform')}
            >
              Terraform
            </button>
          </div>
          
          <div className="scripts-grid">
            {SCRIPTS[activeTab].map((script, index) => {
              const scriptId = `${activeTab}-${index}`;
              return (
                <div key={scriptId} className="script-card">
                  <div className="script-header">
                    <div>
                      <h3 className="script-title">{script.title}</h3>
                      <p className="script-description">{script.description}</p>
                    </div>
                    <button
                      className={`copy-btn ${copiedId === scriptId ? 'copied' : ''}`}
                      onClick={() => copy(script.code, scriptId)}
                    >
                      {copiedId === scriptId ? (
                        <>✓ Copied</>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div className="script-code">
                    <pre>{script.code}</pre>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <p className="section-label">// Get in touch</p>
            <h2 className="section-title">Let's Connect</h2>
          </div>
          
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
      </section>
      
      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>Built with React • Deployed with Terraform • Hosted on AWS</p>
        </div>
      </footer>
    </>
  );
}
