import React, { useState, useEffect } from 'react';

// ============================================================================
// CONFIGURATION - Edit these values
// ============================================================================
const CONFIG = {
  name: "Wes",
  title: "Cloud Engineer",
  subtitle: "AWS | Azure | Terraform | Infrastructure as Code",
  github: "YOUR_GITHUB_USERNAME", // Replace with your GitHub username
  email: "your.email@example.com",
  linkedin: "https://linkedin.com/in/yourprofile",
  yearsExperience: 5, // Adjust to your actual years
  resumeUrl: "/resume.pdf",
  
  certifications: [
    { name: "AWS SAP-C02", icon: "☁️", status: "certified" },
    { name: "AZ-104", icon: "🔷", status: "in-progress" },
  ],
  
  skills: {
    cloud: ["AWS", "Azure", "CloudFormation", "ARM Templates"],
    iac: ["Terraform", "Terragrunt", "Pulumi"],
    automation: ["PowerShell", "Bash", "Python", "GitHub Actions"],
    platforms: ["Windows Server", "Linux", "Active Directory", "Entra ID"],
  },
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
    --bg-primary: #0a0a0f;
    --bg-secondary: #12121a;
    --bg-tertiary: #1a1a24;
    --bg-card: #16161f;
    --border: #2a2a3a;
    --border-hover: #3a3a4a;
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
  
  /* Grid Background */
  .grid-bg {
    position: fixed;
    inset: 0;
    background-image: 
      linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    pointer-events: none;
    z-index: 0;
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
  
  useEffect(() => {
    if (!username || username === 'YOUR_GITHUB_USERNAME') {
      setLoading(false);
      return;
    }
    
    async function fetchData() {
      try {
        // Fetch user data
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        const userData = await userRes.json();
        
        // Fetch repos
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        const reposData = await reposRes.json();
        
        setStats({
          publicRepos: userData.public_repos,
          followers: userData.followers,
        });
        setRepos(reposData);
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [username]);
  
  return { stats, repos, loading };
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
  const { stats, repos, loading } = useGitHubStats(CONFIG.github);
  const { copiedId, copy } = useCopyToClipboard();
  
  return (
    <>
      <style>{styles}</style>
      <div className="grid-bg" />
      
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
            <div className="stat-value">
              {loading ? '...' : stats?.publicRepos || '—'}
            </div>
            <div className="stat-label">GitHub Repos</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {CONFIG.certifications.filter(c => c.status === 'certified').length}
            </div>
            <div className="stat-label">Certifications</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">∞</div>
            <div className="stat-label">Terraform Plans</div>
          </div>
        </div>
      </section>
      
      {/* Skills Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">// Expertise</p>
            <h2 className="section-title">Skills & Technologies</h2>
          </div>
          
          <div className="skills-grid">
            <div className="skill-category">
              <h3><span>☁️</span> Cloud Platforms</h3>
              <div className="skill-tags">
                {CONFIG.skills.cloud.map((skill, i) => (
                  <span key={i} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
            <div className="skill-category">
              <h3><span>🏗️</span> Infrastructure as Code</h3>
              <div className="skill-tags">
                {CONFIG.skills.iac.map((skill, i) => (
                  <span key={i} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
            <div className="skill-category">
              <h3><span>⚙️</span> Automation</h3>
              <div className="skill-tags">
                {CONFIG.skills.automation.map((skill, i) => (
                  <span key={i} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
            <div className="skill-category">
              <h3><span>🖥️</span> Platforms</h3>
              <div className="skill-tags">
                {CONFIG.skills.platforms.map((skill, i) => (
                  <span key={i} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          </div>
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
                    {repo.language && (
                      <span className="repo-language">
                        <span
                          className="language-dot"
                          style={{ background: languageColors[repo.language] || languageColors.default }}
                        />
                        {repo.language}
                      </span>
                    )}
                    <span className="repo-stat">⭐ {repo.stargazers_count}</span>
                    <span className="repo-stat">🔀 {repo.forks_count}</span>
                  </div>
                </a>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>
                Configure your GitHub username in CONFIG to display repos
              </p>
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
