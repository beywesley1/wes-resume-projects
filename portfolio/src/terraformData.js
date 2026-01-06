// ============================================================================
// TERRAFORM MODULES DATA
// ============================================================================

export const TERRAFORM_MODULES = [
  // AWS - EC2
  {
    id: "tf-aws-ec2-001",
    title: "EC2 Instance with EBS",
    description: "Launch an EC2 instance with attached EBS volume",
    provider: "aws",
    subcategory: "EC2",
    tags: ["ec2", "ebs", "compute"],
    dateAdded: "2025-01-01",
    code: `# EC2 Instance with EBS Volume
# Creates an EC2 instance with a separate EBS volume attached
# Includes security group for SSH access

resource "aws_instance" "main" {
  ami           = var.ami_id
  instance_type = var.instance_type
  key_name      = var.key_name

  vpc_security_group_ids = [aws_security_group.main.id]

  tags = {
    Name        = var.instance_name
    Environment = var.environment
  }
}

resource "aws_ebs_volume" "data" {
  availability_zone = aws_instance.main.availability_zone
  size              = var.volume_size
  type              = "gp3"

  tags = {
    Name = "\${var.instance_name}-data"
  }
}

resource "aws_volume_attachment" "data" {
  device_name = "/dev/xvdf"
  volume_id   = aws_ebs_volume.data.id
  instance_id = aws_instance.main.id
}`,
  },
  {
    id: "tf-aws-ec2-002",
    title: "Auto Scaling Group",
    description: "EC2 Auto Scaling Group with Launch Template",
    provider: "aws",
    subcategory: "EC2",
    tags: ["ec2", "asg", "auto-scaling"],
    dateAdded: "2025-01-02",
    code: `# Auto Scaling Group with Launch Template
# Creates an ASG with configurable capacity
# Uses launch template for instance configuration

resource "aws_launch_template" "main" {
  name_prefix   = var.name_prefix
  image_id      = var.ami_id
  instance_type = var.instance_type

  network_interfaces {
    associate_public_ip_address = true
    security_groups             = [aws_security_group.main.id]
  }
}

resource "aws_autoscaling_group" "main" {
  name                = "\${var.name_prefix}-asg"
  vpc_zone_identifier = var.subnet_ids
  desired_capacity    = var.desired_capacity
  max_size            = var.max_size
  min_size            = var.min_size

  launch_template {
    id      = aws_launch_template.main.id
    version = "$Latest"
  }
}`,
  },
  // AWS - S3
  {
    id: "tf-aws-s3-001",
    title: "S3 Bucket with Versioning",
    description: "S3 bucket with versioning and encryption enabled",
    provider: "aws",
    subcategory: "S3",
    tags: ["s3", "storage", "encryption"],
    dateAdded: "2025-01-01",
    code: `# S3 Bucket with Versioning and Encryption
# Creates a secure S3 bucket with versioning enabled
# Server-side encryption using AWS managed keys

resource "aws_s3_bucket" "main" {
  bucket = var.bucket_name

  tags = {
    Name        = var.bucket_name
    Environment = var.environment
  }
}

resource "aws_s3_bucket_versioning" "main" {
  bucket = aws_s3_bucket.main.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "main" {
  bucket = aws_s3_bucket.main.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "main" {
  bucket = aws_s3_bucket.main.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}`,
  },
  // AWS - VPC
  {
    id: "tf-aws-vpc-001",
    title: "VPC with Public/Private Subnets",
    description: "Complete VPC setup with public and private subnets",
    provider: "aws",
    subcategory: "VPC",
    tags: ["vpc", "networking", "subnets"],
    dateAdded: "2025-01-01",
    code: `# VPC with Public and Private Subnets
# Creates a VPC with 2 public and 2 private subnets
# Includes Internet Gateway for public access

resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "\${var.name}-vpc"
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "\${var.name}-igw"
  }
}

resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "\${var.name}-public-\${count.index + 1}"
  }
}

resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index + 2)
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "\${var.name}-private-\${count.index + 1}"
  }
}`,
  },
  // AWS - IAM
  {
    id: "tf-aws-iam-001",
    title: "IAM Role with Policy",
    description: "IAM role with custom policy for EC2 instances",
    provider: "aws",
    subcategory: "IAM",
    tags: ["iam", "security", "roles"],
    dateAdded: "2025-01-02",
    code: `# IAM Role with Custom Policy
# Creates an IAM role for EC2 instances
# Includes instance profile for EC2 attachment

resource "aws_iam_role" "ec2_role" {
  name = "\${var.name}-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy" "ec2_policy" {
  name = "\${var.name}-ec2-policy"
  role = aws_iam_role.ec2_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = ["s3:GetObject", "s3:PutObject"]
        Resource = "\${var.s3_bucket_arn}/*"
      }
    ]
  })
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "\${var.name}-ec2-profile"
  role = aws_iam_role.ec2_role.name
}`,
  },
  // AWS - RDS
  {
    id: "tf-aws-rds-001",
    title: "RDS PostgreSQL Instance",
    description: "RDS PostgreSQL database with Multi-AZ",
    provider: "aws",
    subcategory: "RDS",
    tags: ["rds", "database", "postgresql"],
    dateAdded: "2025-01-03",
    code: `# RDS PostgreSQL Instance
# Creates a PostgreSQL RDS instance with Multi-AZ
# Automated backups enabled with 7-day retention

resource "aws_db_subnet_group" "main" {
  name       = "\${var.name}-db-subnet"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name = "\${var.name}-db-subnet"
  }
}

resource "aws_db_instance" "main" {
  identifier           = "\${var.name}-postgres"
  engine               = "postgres"
  engine_version       = "15.4"
  instance_class       = var.instance_class
  allocated_storage    = var.allocated_storage
  
  db_name              = var.db_name
  username             = var.db_username
  password             = var.db_password
  
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.db.id]
  
  multi_az             = true
  publicly_accessible  = false
  backup_retention_period = 7

  tags = {
    Name = "\${var.name}-postgres"
  }
}`,
  },
  // AWS - Lambda
  {
    id: "tf-aws-lambda-001",
    title: "Lambda with API Gateway",
    description: "Serverless Lambda function with HTTP API",
    provider: "aws",
    subcategory: "Lambda",
    tags: ["lambda", "serverless", "api-gateway"],
    dateAdded: "2025-01-03",
    code: `# Lambda Function with API Gateway
# Creates a Lambda function with HTTP API trigger
# Includes IAM role with CloudWatch logging

resource "aws_lambda_function" "main" {
  filename         = var.lambda_zip_path
  function_name    = var.function_name
  role             = aws_iam_role.lambda.arn
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  source_code_hash = filebase64sha256(var.lambda_zip_path)

  environment {
    variables = var.environment_variables
  }
}

resource "aws_apigatewayv2_api" "main" {
  name          = "\${var.function_name}-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "main" {
  api_id             = aws_apigatewayv2_api.main.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.main.invoke_arn
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.main.function_name
  principal     = "apigateway.amazonaws.com"
}`,
  },
  // Azure - Virtual Machine
  {
    id: "tf-azure-vm-001",
    title: "Azure Linux VM",
    description: "Azure Linux virtual machine with managed disk",
    provider: "azure",
    subcategory: "Virtual Machines",
    tags: ["vm", "linux", "compute"],
    dateAdded: "2025-01-01",
    code: `# Azure Linux Virtual Machine
# Creates a Linux VM with managed OS disk
# SSH key authentication enabled

resource "azurerm_linux_virtual_machine" "main" {
  name                = var.vm_name
  resource_group_name = var.resource_group_name
  location            = var.location
  size                = var.vm_size
  admin_username      = var.admin_username

  network_interface_ids = [
    azurerm_network_interface.main.id,
  ]

  admin_ssh_key {
    username   = var.admin_username
    public_key = file(var.ssh_public_key_path)
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Premium_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts"
    version   = "latest"
  }

  tags = var.tags
}`,
  },
  // Azure - Storage
  {
    id: "tf-azure-storage-001",
    title: "Azure Storage Account",
    description: "Storage account with blob container",
    provider: "azure",
    subcategory: "Storage",
    tags: ["storage", "blob", "containers"],
    dateAdded: "2025-01-02",
    code: `# Azure Storage Account with Blob Container
# Creates a storage account with blob container
# Configures versioning and retention

resource "azurerm_storage_account" "main" {
  name                     = var.storage_account_name
  resource_group_name      = var.resource_group_name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  blob_properties {
    versioning_enabled = true
    
    delete_retention_policy {
      days = 7
    }
  }

  tags = var.tags
}

resource "azurerm_storage_container" "main" {
  name                  = var.container_name
  storage_account_name  = azurerm_storage_account.main.name
  container_access_type = "private"
}`,
  },
  // Azure - AKS
  {
    id: "tf-azure-aks-001",
    title: "Azure Kubernetes Service",
    description: "AKS cluster with node pool",
    provider: "azure",
    subcategory: "AKS",
    tags: ["aks", "kubernetes", "containers"],
    dateAdded: "2025-01-03",
    code: `# Azure Kubernetes Service (AKS)
# Creates an AKS cluster with system node pool
# Azure CNI networking with managed identity

resource "azurerm_kubernetes_cluster" "main" {
  name                = var.cluster_name
  location            = var.location
  resource_group_name = var.resource_group_name
  dns_prefix          = var.dns_prefix
  kubernetes_version  = var.kubernetes_version

  default_node_pool {
    name                = "system"
    node_count          = var.node_count
    vm_size             = var.vm_size
    vnet_subnet_id      = var.subnet_id
    enable_auto_scaling = true
    min_count           = var.min_node_count
    max_count           = var.max_node_count
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin    = "azure"
    load_balancer_sku = "standard"
  }

  tags = var.tags
}`,
  },
  // Cloudflare - DNS
  {
    id: "tf-cf-dns-001",
    title: "Cloudflare DNS Records",
    description: "DNS records with proxied traffic",
    provider: "cloudflare",
    subcategory: "DNS",
    tags: ["dns", "records", "proxy"],
    dateAdded: "2025-01-01",
    code: `# Cloudflare DNS Records
# Creates A, CNAME, and MX records
# Proxied records for CDN and security

resource "cloudflare_record" "root" {
  zone_id = var.zone_id
  name    = "@"
  value   = var.origin_ip
  type    = "A"
  proxied = true
}

resource "cloudflare_record" "www" {
  zone_id = var.zone_id
  name    = "www"
  value   = var.domain
  type    = "CNAME"
  proxied = true
}

resource "cloudflare_record" "api" {
  zone_id = var.zone_id
  name    = "api"
  value   = var.api_origin
  type    = "CNAME"
  proxied = true
}`,
  },
  // Cloudflare - Page Rules
  {
    id: "tf-cf-rules-001",
    title: "Cloudflare Page Rules",
    description: "Page rules for caching and redirects",
    provider: "cloudflare",
    subcategory: "Page Rules",
    tags: ["page-rules", "caching", "redirects"],
    dateAdded: "2025-01-02",
    code: `# Cloudflare Page Rules
# Configures caching and redirect rules
# Forces HTTPS and www redirect

resource "cloudflare_page_rule" "https_redirect" {
  zone_id  = var.zone_id
  target   = "http://*.\${var.domain}/*"
  priority = 1

  actions {
    always_use_https = true
  }
}

resource "cloudflare_page_rule" "cache_static" {
  zone_id  = var.zone_id
  target   = "*.\${var.domain}/*.{js,css,png,jpg}"
  priority = 2

  actions {
    cache_level = "cache_everything"
    edge_cache_ttl = 86400
  }
}`,
  },
  // Docker - Container
  {
    id: "tf-docker-001",
    title: "Docker Container",
    description: "Docker container with volume mounts",
    provider: "docker",
    subcategory: "Containers",
    tags: ["container", "volumes", "networking"],
    dateAdded: "2025-01-01",
    code: `# Docker Container with Volumes
# Creates a container with persistent storage
# Configures port mappings and environment

resource "docker_container" "app" {
  name  = var.container_name
  image = docker_image.app.image_id

  ports {
    internal = var.internal_port
    external = var.external_port
  }

  volumes {
    host_path      = var.data_volume_path
    container_path = "/data"
  }

  env = [
    "NODE_ENV=\${var.environment}",
    "DATABASE_URL=\${var.database_url}"
  ]

  networks_advanced {
    name = docker_network.main.name
  }

  restart = "unless-stopped"
}

resource "docker_image" "app" {
  name = "\${var.image_name}:\${var.image_tag}"
}

resource "docker_network" "main" {
  name   = "\${var.container_name}-network"
  driver = "bridge"
}`,
  },
  // Docker - Compose
  {
    id: "tf-docker-002",
    title: "Docker Compose Stack",
    description: "Multi-container application stack",
    provider: "docker",
    subcategory: "Compose",
    tags: ["compose", "multi-container", "stack"],
    dateAdded: "2025-01-02",
    code: `# Docker Compose Stack
# Deploys a multi-container application
# Web app with Redis cache and PostgreSQL

resource "docker_network" "app_network" {
  name = "app-network"
}

resource "docker_container" "web" {
  name  = "web-app"
  image = docker_image.web.image_id

  ports {
    internal = 3000
    external = 80
  }

  env = [
    "REDIS_URL=redis://redis:6379",
    "DATABASE_URL=postgresql://postgres:5432/app"
  ]

  networks_advanced {
    name = docker_network.app_network.name
  }
}

resource "docker_container" "redis" {
  name  = "redis"
  image = "redis:alpine"

  networks_advanced {
    name = docker_network.app_network.name
  }
}`,
  },
  // Kubernetes - Deployment
  {
    id: "tf-k8s-001",
    title: "Kubernetes Deployment",
    description: "Deployment with service and ingress",
    provider: "kubernetes",
    subcategory: "Deployments",
    tags: ["deployment", "service", "ingress"],
    dateAdded: "2025-01-01",
    code: `# Kubernetes Deployment with Service
# Creates a deployment with replicas
# Includes resource limits and probes

resource "kubernetes_deployment" "app" {
  metadata {
    name      = var.app_name
    namespace = var.namespace
  }

  spec {
    replicas = var.replicas

    selector {
      match_labels = {
        app = var.app_name
      }
    }

    template {
      metadata {
        labels = {
          app = var.app_name
        }
      }

      spec {
        container {
          name  = var.app_name
          image = "\${var.image}:\${var.tag}"

          port {
            container_port = var.container_port
          }

          resources {
            limits = {
              cpu    = var.cpu_limit
              memory = var.memory_limit
            }
          }

          liveness_probe {
            http_get {
              path = "/health"
              port = var.container_port
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "app" {
  metadata {
    name      = var.app_name
    namespace = var.namespace
  }

  spec {
    selector = {
      app = var.app_name
    }

    port {
      port        = 80
      target_port = var.container_port
    }

    type = "ClusterIP"
  }
}`,
  },
  // Kubernetes - ConfigMap
  {
    id: "tf-k8s-002",
    title: "ConfigMap and Secret",
    description: "Configuration and secrets management",
    provider: "kubernetes",
    subcategory: "Config",
    tags: ["configmap", "secret", "configuration"],
    dateAdded: "2025-01-02",
    code: `# Kubernetes ConfigMap and Secret
# Manages application configuration
# Secrets for sensitive data

resource "kubernetes_config_map" "app" {
  metadata {
    name      = "\${var.app_name}-config"
    namespace = var.namespace
  }

  data = {
    APP_ENV      = var.environment
    LOG_LEVEL    = var.log_level
    API_ENDPOINT = var.api_endpoint
  }
}

resource "kubernetes_secret" "app" {
  metadata {
    name      = "\${var.app_name}-secrets"
    namespace = var.namespace
  }

  type = "Opaque"

  data = {
    DATABASE_URL = base64encode(var.database_url)
    API_KEY      = base64encode(var.api_key)
  }
}`,
  },
  // Kubernetes - RBAC
  {
    id: "tf-k8s-003",
    title: "Namespace with RBAC",
    description: "Namespace with role-based access control",
    provider: "kubernetes",
    subcategory: "RBAC",
    tags: ["namespace", "rbac", "security"],
    dateAdded: "2025-01-03",
    code: `# Kubernetes Namespace with RBAC
# Creates isolated namespace
# Service account with limited permissions

resource "kubernetes_namespace" "app" {
  metadata {
    name = var.namespace

    labels = {
      environment = var.environment
    }
  }
}

resource "kubernetes_service_account" "app" {
  metadata {
    name      = "\${var.app_name}-sa"
    namespace = kubernetes_namespace.app.metadata[0].name
  }
}

resource "kubernetes_role" "app" {
  metadata {
    name      = "\${var.app_name}-role"
    namespace = kubernetes_namespace.app.metadata[0].name
  }

  rule {
    api_groups = [""]
    resources  = ["pods", "services", "configmaps"]
    verbs      = ["get", "list", "watch"]
  }
}

resource "kubernetes_role_binding" "app" {
  metadata {
    name      = "\${var.app_name}-binding"
    namespace = kubernetes_namespace.app.metadata[0].name
  }

  role_ref {
    api_group = "rbac.authorization.k8s.io"
    kind      = "Role"
    name      = kubernetes_role.app.metadata[0].name
  }

  subject {
    kind      = "ServiceAccount"
    name      = kubernetes_service_account.app.metadata[0].name
    namespace = kubernetes_namespace.app.metadata[0].name
  }
}`,
  },
];

// Terraform provider configuration with icons
export const TF_PROVIDERS = {
  aws: {
    label: "AWS",
    icon: `<svg width="24" height="24" viewBox="0 0 304 182" fill="#FF9900"><path d="M86.4 66.4c0 3.7.4 6.7 1.1 8.9.8 2.2 1.8 4.6 3.2 7.2.5.8.7 1.6.7 2.3 0 1-.6 2-1.9 3l-6.3 4.2c-.9.6-1.8.9-2.6.9-1 0-2-.5-3-1.4-1.4-1.5-2.6-3.1-3.6-4.7-1-1.7-2-3.6-3.1-5.9-7.8 9.2-17.6 13.8-29.4 13.8-8.4 0-15.1-2.4-20-7.2-4.9-4.8-7.4-11.2-7.4-19.2 0-8.5 3-15.4 9.1-20.6s14.2-7.8 24.5-7.8c3.4 0 6.9.3 10.6.8s7.5 1.3 11.5 2.2v-7.3c0-7.6-1.6-12.9-4.7-16-3.2-3.1-8.6-4.6-16.3-4.6-3.5 0-7.1.4-10.8 1.3s-7.3 2-10.8 3.4c-1.6.7-2.8 1.1-3.5 1.3s-1.2.3-1.5.3c-1.3 0-2-.9-2-2.8v-4.9c0-1.5.2-2.6.7-3.3s1.4-1.4 2.8-2.1c3.5-1.8 7.7-3.3 12.6-4.5C41 1 46.4.3 52.2.3c11.9 0 20.6 2.7 26.2 8.1 5.5 5.4 8.3 13.6 8.3 24.6v32.4h-.3zM45.8 81.6c3.3 0 6.7-.6 10.3-1.8 3.6-1.2 6.8-3.4 9.5-6.4 1.6-1.9 2.8-4 3.4-6.4s1-5.3 1-8.7v-4.2c-2.9-.7-6-1.3-9.2-1.7s-6.3-.6-9.4-.6c-6.7 0-11.6 1.3-14.9 4s-4.9 6.5-4.9 11.5c0 4.7 1.2 8.2 3.7 10.6 2.4 2.5 5.9 3.7 10.5 3.7zm80.3 10.8c-1.7 0-2.9-.3-3.7-1-.8-.6-1.5-2-2.1-3.9L96.7 10.2c-.6-2-.9-3.3-.9-4 0-1.6.8-2.5 2.4-2.5h9.8c1.8 0 3.1.3 3.8 1 .8.6 1.4 2 2 3.9l16.8 66.2 15.6-66.2c.5-2 1.1-3.3 1.9-3.9.8-.6 2.1-1 3.9-1h8c1.8 0 3.1.3 3.9 1 .8.6 1.5 2 1.9 3.9l15.8 67 17.3-67c.6-2 1.3-3.3 2-3.9.8-.6 2.1-1 3.8-1h9.3c1.6 0 2.5.8 2.5 2.5 0 .5-.1 1-.2 1.6s-.3 1.4-.7 2.5l-24.1 77.3c-.6 2-1.3 3.3-2.1 3.9-.8.6-2.1 1-3.7 1h-8.5c-1.8 0-3.1-.3-3.9-1-.8-.7-1.5-2-1.9-4L156 23l-15.4 64.4c-.5 2-1.1 3.3-1.9 4-.8.7-2.2 1-3.9 1h-8.7zm128.5 2.7c-5.2 0-10.4-.6-15.4-1.8-5-1.2-8.9-2.5-11.5-4-1.6-.9-2.7-1.9-3.1-2.8-.4-.9-.6-1.9-.6-2.8v-5.1c0-1.9.7-2.8 2.1-2.8.5 0 1.1.1 1.6.2.5.1 1.3.4 2.1.7 2.8 1.3 5.9 2.3 9.2 3 3.4.7 6.7 1 10.1 1 5.4 0 9.5-.9 12.4-2.8 2.9-1.9 4.4-4.6 4.4-8.2 0-2.4-.8-4.4-2.3-6.1-1.5-1.7-4.4-3.2-8.6-4.7l-12.3-3.8c-6.2-2-10.8-4.9-13.7-8.8-2.9-3.9-4.3-8.2-4.3-12.9 0-3.7.8-7 2.4-9.8s3.7-5.3 6.4-7.3c2.7-2 5.8-3.6 9.3-4.6 3.5-1.1 7.2-1.6 11.2-1.6 2 0 4.1.1 6.1.4 2.1.3 4 .6 5.9 1.1 1.8.5 3.5 1 5.1 1.6 1.6.6 2.8 1.2 3.7 1.8 1.2.8 2.1 1.6 2.6 2.4.5.8.7 1.8.7 3.1v4.7c0 1.9-.7 2.9-2.1 2.9-.7 0-1.9-.3-3.4-1-5-2.3-10.6-3.4-16.8-3.4-4.9 0-8.7.7-11.4 2.2-2.7 1.5-4.1 3.8-4.1 7 0 2.4.9 4.5 2.6 6.2s5 3.4 9.7 5l12 3.8c6.1 1.9 10.5 4.7 13.2 8.2 2.7 3.5 4 7.6 4 12.1 0 3.8-.8 7.3-2.3 10.3-1.6 3.1-3.7 5.7-6.4 8-2.7 2.3-6 4-9.8 5.2-4 1.4-8.2 2-12.8 2z"/></svg>`,
  },
  azure: {
    label: "Azure",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#0078D4"><path d="M13.05 4.24L6.56 18.05a.5.5 0 0 1-.47.31H2.85a.5.5 0 0 1-.44-.75l6.37-11.3a.5.5 0 0 0 0-.5L6.23 2.69a.5.5 0 0 1 .44-.75h4.19a.5.5 0 0 1 .44.26l1.75 3.04zm8.1 13.81l-6.37-11.3a.5.5 0 0 0-.44-.26h-4.19a.5.5 0 0 0-.44.75l6.37 11.3a.5.5 0 0 0 .44.26h4.19a.5.5 0 0 0 .44-.75z"/></svg>`,
  },
  cloudflare: {
    label: "Cloudflare",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#F38020"><path d="M16.5088 16.8447c.1475-.5068.0908-.9707-.1553-1.3154-.2246-.3164-.6045-.499-1.0615-.5205l-8.6592-.1123a.1559.1559 0 0 1-.1333-.0713c-.0283-.042-.0351-.0986-.021-.1553.0278-.084.1123-.1484.2036-.1562l8.7359-.1123c1.0351-.0489 2.1582-.8984 2.5537-1.9336l.499-1.3086c.0215-.0576.0283-.1152.0147-.168-.5625-2.5254-2.8301-4.4062-5.5606-4.4062-2.499 0-4.6289 1.5898-5.4199 3.8086-.4844-.3594-1.0986-.5625-1.7696-.499-1.1953.1191-2.1484 1.0566-2.2891 2.2519-.0352.2871-.0205.5674.0283.8301C1.0273 12.3838 0 13.5918 0 15.0508c0 .1699.0137.3359.0352.499.0146.0918.0908.1602.1826.1602l15.7471.0059c.0283 0 .0566-.0059.0849-.0137.0566-.0205.1054-.0625.1269-.1192l.3321-.7314z"/></svg>`,
  },
  docker: {
    label: "Docker",
    icon: `<svg width="24" height="24" viewBox="0 0 640 512" fill="#2496ED"><path d="M349.9 236.3h-66.1v-59.4h66.1v59.4zm0-204.3h-66.1v60.7h66.1V32zm78.2 144.8H362v59.4h66.1v-59.4zm-156.3-72.1h-66.1v60.1h66.1v-60.1zm78.1 0h-66.1v60.1h66.1v-60.1zm276.8 100c-14.4-9.7-47.6-13.2-73.1-8.4-3.3-24-16.7-44.9-41.1-63.7l-14-9.3-9.3 14c-18.4 27.8-23.4 73.6-3.7 103.8-8.7 4.7-25.8 11.1-48.4 10.7H2.4c-8.7 50.8 5.8 116.8 44 162.1 37.1 43.9 92.7 66.2 165.4 66.2 157.4 0 273.9-72.5 328.4-204.2 21.4.4 67.6.1 91.3-45.2 1.5-2.5 6.6-13.2 8.5-17.1l-13.3-8.9zm-511.1-27.9h-66v59.4h66.1v-59.4zm78.1 0h-66.1v59.4h66.1v-59.4zm78.1 0h-66.1v59.4h66.1v-59.4zm-78.1-72.1h-66.1v60.1h66.1v-60.1z"/></svg>`,
  },
  kubernetes: {
    label: "Kubernetes",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#326CE5"><path d="M10.204 14.35l.007.01-.999 2.413a5.171 5.171 0 0 1-2.075-2.597l2.578-.437.004.005a.44.44 0 0 1 .484.606zm-.833-2.129a.44.44 0 0 0 .173-.756l.002-.011L7.585 9.7a5.143 5.143 0 0 0-.73 3.255l2.514-.725.002-.009zm1.145-1.98a.44.44 0 0 0 .699-.337l.01-.005.15-2.62a5.144 5.144 0 0 0-3.01 1.442l2.147 1.523.004-.002zm.76 2.75l.723.349.722-.347.18-.78-.5-.623h-.804l-.5.623.179.778zm1.5-2.095a.44.44 0 0 0 .7.336l.008.003 2.134-1.513a5.188 5.188 0 0 0-2.992-1.442l.148 2.615.002.001zm10.876 5.97l-5.773 7.181a1.6 1.6 0 0 1-1.248.594H6.789a1.6 1.6 0 0 1-1.247-.594l-5.773-7.181a1.583 1.583 0 0 1-.307-1.34L1.659 5.8a1.6 1.6 0 0 1 .94-1.084L11.239.19a1.6 1.6 0 0 1 1.168 0l8.64 4.526a1.6 1.6 0 0 1 .94 1.084l2.198 10.13a1.592 1.592 0 0 1-.307 1.34zm-7.263-3.268a.997.997 0 0 0-.292-.77 1.07 1.07 0 0 0-.752-.323l-.004.01a.882.882 0 0 0-.106-.065l-.005-.005a.97.97 0 0 0-.2-.07l-.01-.002a.97.97 0 0 0-.18-.025l-.009-.002a.97.97 0 0 0-.18.012l-.012.001a.97.97 0 0 0-.19.05l-.01.004a.97.97 0 0 0-.17.09l-.01.006a.97.97 0 0 0-.15.12l-.006.007-.002.002-.003.002a.97.97 0 0 0-.11.15l-.004.008a.97.97 0 0 0-.07.17l-.003.01a.97.97 0 0 0-.04.18l-.001.012a.97.97 0 0 0 0 .18l.002.012a.97.97 0 0 0 .04.18l.004.01a.97.97 0 0 0 .08.17l.005.008a.97.97 0 0 0 .12.15l.007.006a.97.97 0 0 0 .15.11l.009.006a.97.97 0 0 0 .17.08l.01.003a.97.97 0 0 0 .18.04l.012.001a.97.97 0 0 0 .18 0l.012-.002a.97.97 0 0 0 .18-.04l.01-.004a.97.97 0 0 0 .17-.09l.008-.005a.97.97 0 0 0 .15-.12l.006-.007.003-.003.002-.002a.97.97 0 0 0 .11-.15l.004-.008a.97.97 0 0 0 .07-.17l.003-.01a.97.97 0 0 0 .04-.18l.001-.012a.97.97 0 0 0 0-.09l.004-.01a1.07 1.07 0 0 0-.323-.752zm-4.16.266a.44.44 0 0 0 .167.757l-.001.009 2.514.725a5.18 5.18 0 0 0-.73-3.255l-1.96 1.756.01.008zm3.627 1.49a.44.44 0 0 0-.484.607l-.006.003.004.006 2.578.437a5.18 5.18 0 0 0-2.075-2.597l-.999 2.413-.018.13z"/></svg>`,
  },
  microsoft: {
    label: "Microsoft",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#00A4EF"><path d="M11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4zM11.4 24H0V12.6h11.4V24zm12.6 0H12.6V12.6H24V24z"/></svg>`,
  },
};

// Terraform subcategory icons
export const TF_SUBCATEGORY_ICONS = {
  "EC2": `<svg width="14" height="14" viewBox="0 0 24 24" fill="#FF9900"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
  "S3": `<svg width="14" height="14" viewBox="0 0 24 24" fill="#569A31"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
  "VPC": `<svg width="14" height="14" viewBox="0 0 24 24" fill="#8C4FFF"><path d="M3 3h18v18H3V3zm2 2v14h14V5H5z"/></svg>`,
  "IAM": `<svg width="14" height="14" viewBox="0 0 24 24" fill="#DD344C"><path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7c0-2.757-2.243-5-5-5z"/></svg>`,
  "RDS": `<svg width="14" height="14" viewBox="0 0 24 24" fill="#3B48CC"><path d="M12 2C6.48 2 2 4.02 2 6.5v11C2 19.98 6.48 22 12 22s10-2.02 10-4.5v-11C22 4.02 17.52 2 12 2z"/></svg>`,
  "Lambda": `<svg width="14" height="14" viewBox="0 0 24 24" fill="#FF9900"><path d="M12 2L2 19h20L12 2z"/></svg>`,
  "Virtual Machines": `<svg width="14" height="14" viewBox="0 0 24 24" fill="#0078D4"><path d="M4 4h16v12H4V4zm2 2v8h12V6H6z"/></svg>`,
  "Storage": `<svg width="14" height="14" viewBox="0 0 24 24" fill="#0078D4"><path d="M2 4c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4z"/></svg>`,
  "AKS": `<svg width="14" height="14" viewBox="0 0 24 24" fill="#326CE5"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>`,
  "DNS": `<svg width="14" height="14" viewBox="0 0 24 24" fill="#F38020"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>`,
  "Page Rules": `<svg width="14" height="14" viewBox="0 0 24 24" fill="#F38020"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z"/></svg>`,
  "Containers": `<svg width="14" height="14" viewBox="0 0 24 24" fill="#2496ED"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>`,
  "Compose": `<svg width="14" height="14" viewBox="0 0 24 24" fill="#2496ED"><path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/></svg>`,
  "Deployments": `<svg width="14" height="14" viewBox="0 0 24 24" fill="#326CE5"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>`,
  "Config": `<svg width="14" height="14" viewBox="0 0 24 24" fill="#326CE5"><path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54A.484.484 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>`,
  "RBAC": `<svg width="14" height="14" viewBox="0 0 24 24" fill="#326CE5"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>`,
  "Entra ID": `<svg width="14" height="14" viewBox="0 0 24 24" fill="#00A4EF"><path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7c0-2.757-2.243-5-5-5z"/></svg>`,
  "Identity": `<svg width="14" height="14" viewBox="0 0 24 24" fill="#00A4EF"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>`,
};

// Get subcategories for a Terraform provider
export const getTfSubcategories = (provider) => {
  const modules = TERRAFORM_MODULES.filter(m => m.provider === provider);
  return [...new Set(modules.map(m => m.subcategory))].sort();
};

// Get icon for a Terraform module
export const getTfModuleIcon = (module) => {
  if (module.provider === 'aws') {
    return `<svg width="22" height="22" viewBox="0 0 304 182" fill="#FF9900"><path d="M86.4 66.4c0 3.7.4 6.7 1.1 8.9.8 2.2 1.8 4.6 3.2 7.2.5.8.7 1.6.7 2.3 0 1-.6 2-1.9 3l-6.3 4.2c-.9.6-1.8.9-2.6.9-1 0-2-.5-3-1.4-1.4-1.5-2.6-3.1-3.6-4.7-1-1.7-2-3.6-3.1-5.9-7.8 9.2-17.6 13.8-29.4 13.8-8.4 0-15.1-2.4-20-7.2-4.9-4.8-7.4-11.2-7.4-19.2 0-8.5 3-15.4 9.1-20.6 6.1-5.2 14.2-7.8 24.5-7.8 3.4 0 6.9.3 10.6.8 3.7.5 7.5 1.3 11.5 2.2v-7.3c0-7.6-1.6-12.9-4.7-16-3.2-3.1-8.6-4.6-16.3-4.6-3.5 0-7.1.4-10.8 1.3-3.7.9-7.3 2-10.8 3.4-1.6.7-2.8 1.1-3.5 1.3-.7.2-1.2.3-1.5.3-1.3 0-2-.9-2-2.8v-4.9c0-1.5.2-2.6.7-3.3.5-.7 1.4-1.4 2.8-2.1 3.5-1.8 7.7-3.3 12.6-4.5 4.9-1.3 10.1-1.9 15.6-1.9 11.9 0 20.6 2.7 26.2 8.1 5.5 5.4 8.3 13.6 8.3 24.6v32.4zM45.8 81.6c3.3 0 6.7-.6 10.3-1.8 3.6-1.2 6.8-3.4 9.5-6.4 1.6-1.9 2.8-4 3.4-6.4.6-2.4 1-5.3 1-8.7v-4.2c-2.9-.7-6-1.3-9.2-1.7-3.2-.4-6.3-.6-9.4-.6-6.7 0-11.6 1.3-14.9 4-3.3 2.7-4.9 6.5-4.9 11.5 0 4.7 1.2 8.2 3.7 10.6 2.4 2.5 5.9 3.7 10.5 3.7zm80.3 10.8c-1.7 0-2.9-.3-3.7-1-.8-.6-1.5-2-2.1-3.9L96.7 10.2c-.6-2-.9-3.3-.9-4 0-1.6.8-2.5 2.4-2.5h9.8c1.8 0 3.1.3 3.8 1 .8.6 1.4 2 2 3.9l16.8 66.2 15.6-66.2c.5-2 1.1-3.3 1.9-3.9.8-.6 2.1-1 3.9-1h8c1.8 0 3.1.3 3.9 1 .8.6 1.5 2 1.9 3.9l15.8 67 17.3-67c.6-2 1.3-3.3 2-3.9.8-.6 2.1-1 3.8-1h9.3c1.6 0 2.5.8 2.5 2.5 0 .5-.1 1-.2 1.6-.1.6-.3 1.4-.7 2.5l-24.1 77.3c-.6 2-1.3 3.3-2.1 3.9-.8.6-2.1 1-3.7 1h-8.5c-1.8 0-3.1-.3-3.9-1-.8-.7-1.5-2-1.9-4L156 23l-15.4 64.4c-.5 2-1.1 3.3-1.9 4-.8.7-2.2 1-3.9 1h-8.7zm128.5 2.7c-5.2 0-10.4-.6-15.4-1.8-5-1.2-8.9-2.5-11.5-4-1.6-.9-2.7-1.9-3.1-2.8-.4-.9-.6-1.9-.6-2.8v-5.1c0-1.9.7-2.8 2.1-2.8.5 0 1.1.1 1.6.2.5.1 1.3.4 2.1.7 2.8 1.3 5.9 2.3 9.2 3 3.4.7 6.7 1 10.1 1 5.4 0 9.5-.9 12.4-2.8 2.9-1.9 4.4-4.6 4.4-8.2 0-2.4-.8-4.4-2.3-6.1-1.5-1.7-4.4-3.2-8.6-4.7l-12.3-3.8c-6.2-2-10.8-4.9-13.7-8.8-2.9-3.9-4.3-8.2-4.3-12.9 0-3.7.8-7 2.4-9.8 1.6-2.8 3.7-5.3 6.4-7.3 2.7-2 5.8-3.6 9.3-4.6 3.5-1.1 7.2-1.6 11.2-1.6 2 0 4.1.1 6.1.4 2.1.3 4 .6 5.9 1.1 1.8.5 3.5 1 5.1 1.6 1.6.6 2.8 1.2 3.7 1.8 1.2.8 2.1 1.6 2.6 2.4.5.8.7 1.8.7 3.1v4.7c0 1.9-.7 2.9-2.1 2.9-.7 0-1.9-.3-3.4-1-5-2.3-10.6-3.4-16.8-3.4-4.9 0-8.7.7-11.4 2.2-2.7 1.5-4.1 3.8-4.1 7 0 2.4.9 4.5 2.6 6.2 1.7 1.7 5 3.4 9.7 5l12 3.8c6.1 1.9 10.5 4.7 13.2 8.2 2.7 3.5 4 7.6 4 12.1 0 3.8-.8 7.3-2.3 10.3-1.6 3.1-3.7 5.7-6.4 8-2.7 2.3-6 4-9.8 5.2-4 1.4-8.2 2-12.8 2z"/></svg>`;
  }
  if (module.provider === 'azure') {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="#0078D4"><path d="M13.05 4.24L6.56 18.05a.5.5 0 0 1-.47.31H2.85a.5.5 0 0 1-.44-.75l6.37-11.3a.5.5 0 0 0 0-.5L6.23 2.69a.5.5 0 0 1 .44-.75h4.19a.5.5 0 0 1 .44.26l1.75 3.04zm8.1 13.81l-6.37-11.3a.5.5 0 0 0-.44-.26h-4.19a.5.5 0 0 0-.44.75l6.37 11.3a.5.5 0 0 0 .44.26h4.19a.5.5 0 0 0 .44-.75z"/></svg>`;
  }
  if (module.provider === 'cloudflare') {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="#F38020"><path d="M16.5088 16.8447c.1475-.5068.0908-.9707-.1553-1.3154-.2246-.3164-.6045-.499-1.0615-.5205l-8.6592-.1123a.1559.1559 0 0 1-.1333-.0713c-.0283-.042-.0351-.0986-.021-.1553.0278-.084.1123-.1484.2036-.1562l8.7359-.1123c1.0351-.0489 2.1582-.8984 2.5537-1.9336l.499-1.3086c.0215-.0576.0283-.1152.0147-.168-.5625-2.5254-2.8301-4.4062-5.5606-4.4062-2.499 0-4.6289 1.5898-5.4199 3.8086-.4844-.3594-1.0986-.5625-1.7696-.499-1.1953.1191-2.1484 1.0566-2.2891 2.2519-.0352.2871-.0205.5674.0283.8301C1.0273 12.3838 0 13.5918 0 15.0508c0 .1699.0137.3359.0352.499.0146.0918.0908.1602.1826.1602l15.7471.0059c.0283 0 .0566-.0059.0849-.0137.0566-.0205.1054-.0625.1269-.1192l.3321-.7314z"/></svg>`;
  }
  if (module.provider === 'docker') {
    return `<svg width="22" height="22" viewBox="0 0 640 512" fill="#2496ED"><path d="M349.9 236.3h-66.1v-59.4h66.1v59.4zm0-204.3h-66.1v60.7h66.1V32zm78.2 144.8H362v59.4h66.1v-59.4zm-156.3-72.1h-66.1v60.1h66.1v-60.1zm78.1 0h-66.1v60.1h66.1v-60.1zm276.8 100c-14.4-9.7-47.6-13.2-73.1-8.4-3.3-24-16.7-44.9-41.1-63.7l-14-9.3-9.3 14c-18.4 27.8-23.4 73.6-3.7 103.8-8.7 4.7-25.8 11.1-48.4 10.7H2.4c-8.7 50.8 5.8 116.8 44 162.1 37.1 43.9 92.7 66.2 165.4 66.2 157.4 0 273.9-72.5 328.4-204.2 21.4.4 67.6.1 91.3-45.2 1.5-2.5 6.6-13.2 8.5-17.1l-13.3-8.9zm-511.1-27.9h-66v59.4h66.1v-59.4zm78.1 0h-66.1v59.4h66.1v-59.4zm78.1 0h-66.1v59.4h66.1v-59.4zm-78.1-72.1h-66.1v60.1h66.1v-60.1z"/></svg>`;
  }
  if (module.provider === 'kubernetes') {
    return `<svg width="22" height="22" viewBox="0 0 32 32" fill="#326CE5"><path d="M15.9.476a2.14 2.14 0 0 0-.823.218L3.932 6.01c-.582.277-1.005.804-1.15 1.432L.054 19.373c-.13.56-.025 1.147.29 1.615l7.25 10.072c.345.48.894.795 1.496.858l12.103 1.26c.604.063 1.206-.14 1.648-.553l9.207-8.6c.46-.43.705-1.05.67-1.687L31.94 9.94c-.036-.604-.347-1.158-.847-1.505L20.47 1.2a2.14 2.14 0 0 0-.996-.399l-.054-.007a2.14 2.14 0 0 0-.238-.013 2.14 2.14 0 0 0-.105 0l-.054.003a2.14 2.14 0 0 0-.105.009l-.054.007a2.14 2.14 0 0 0-.211.04l-.054.012a2.14 2.14 0 0 0-.156.046l-.054.018a2.14 2.14 0 0 0-.15.058l-.053.023a2.14 2.14 0 0 0-.143.07l-.052.028a2.14 2.14 0 0 0-.135.082l-.05.033a2.14 2.14 0 0 0-.127.093l-.048.038a2.14 2.14 0 0 0-.117.103l-.045.043a2.14 2.14 0 0 0-.107.113l-.042.048-.096.122-.038.052-.084.13-.034.056-.071.137-.029.06-.058.143-.024.063-.044.148-.018.066-.03.152-.012.068-.015.155-.006.069.001.156.001.07.018.155.012.07.034.152.023.068.05.147.033.066.065.14.043.063.08.132.052.06.093.122.06.055.106.111.067.05.117.099.074.045.127.085.08.04.135.07.084.033.142.054.088.026.147.038.09.018.15.02.092.01.152.003h.093l.152-.014.093-.018.15-.032.09-.03.146-.05.087-.04.14-.066.082-.05.132-.082.076-.058.122-.096.069-.066.11-.11.062-.073.097-.12.053-.08.082-.13.044-.085.066-.14.034-.088.05-.146.023-.09.032-.15.012-.092.014-.153.001-.093-.012-.153-.013-.092-.03-.15-.024-.09-.047-.146-.035-.087-.063-.14-.045-.082-.078-.132-.054-.076-.093-.122-.063-.069-.106-.11-.07-.062-.118-.097-.078-.053-.128-.083-.084-.044-.137-.068-.088-.035-.144-.052-.091-.027-.148-.037-.093-.018-.15-.02-.094-.01-.152-.002h-.047zm.107 4.444c.058.002.115.014.17.037.147.06.26.187.3.34l.737 2.79c.792.168 1.55.44 2.256.81l2.34-1.638a.46.46 0 0 1 .447-.046c.14.065.243.19.28.34.037.15.003.31-.09.43l-1.63 2.345c.37.706.643 1.463.81 2.255l2.79.738a.46.46 0 0 1 .34.3.46.46 0 0 1-.037.398.46.46 0 0 1-.34.21l-2.79.737c-.168.792-.44 1.55-.81 2.256l1.638 2.34a.46.46 0 0 1 .046.447.46.46 0 0 1-.34.28.46.46 0 0 1-.43-.09l-2.345-1.63c-.706.37-1.463.643-2.255.81l-.738 2.79a.46.46 0 0 1-.3.34.46.46 0 0 1-.398-.037.46.46 0 0 1-.21-.34l-.737-2.79c-.792-.168-1.55-.44-2.256-.81l-2.34 1.638a.46.46 0 0 1-.447.046.46.46 0 0 1-.28-.34.46.46 0 0 1 .09-.43l1.63-2.345c-.37-.706-.643-1.463-.81-2.255l-2.79-.738a.46.46 0 0 1-.34-.3.46.46 0 0 1 .037-.398.46.46 0 0 1 .34-.21l2.79-.737c.168-.792.44-1.55.81-2.256l-1.638-2.34a.46.46 0 0 1-.046-.447.46.46 0 0 1 .34-.28.46.46 0 0 1 .43.09l2.345 1.63c.706-.37 1.463-.643 2.255-.81l.738-2.79a.46.46 0 0 1 .3-.34.46.46 0 0 1 .228-.04zM16 11.167a4.833 4.833 0 1 0 0 9.666 4.833 4.833 0 0 0 0-9.666z"/></svg>`;
  }
  if (module.provider === 'microsoft') {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="#00A4EF"><path d="M11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4zM11.4 24H0V12.6h11.4V24zm12.6 0H12.6V12.6H24V24z"/></svg>`;
  }
  return '';
};

// Syntax highlighting for Terraform code
export const highlightTerraform = (code) => {
  // Comments - gray italic
  let highlighted = code.replace(/(#[^\n]*)/g, '<span class="comment">$1</span>');
  
  // Strings - light blue
  highlighted = highlighted.replace(/("(?:[^"\\]|\\.)*")/g, '<span class="string">$1</span>');
  
  // Variables and interpolation - purple
  highlighted = highlighted.replace(/(\$\{[^}]+\})/g, '<span class="variable">$1</span>');
  highlighted = highlighted.replace(/(var\.[a-zA-Z_][a-zA-Z0-9_]*)/g, '<span class="variable">$1</span>');
  
  // Terraform keywords - red
  const keywords = ['resource', 'data', 'variable', 'output', 'locals', 'module', 'provider', 'terraform'];
  keywords.forEach(kw => {
    const regex = new RegExp(`^(${kw})\\s`, 'gm');
    highlighted = highlighted.replace(regex, '<span class="keyword">$1</span> ');
  });
  
  // Booleans and null - green
  highlighted = highlighted.replace(/\b(true|false|null)\b/g, '<span class="boolean">$1</span>');
  
  // Numbers - orange
  highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="number">$1</span>');
  
  return highlighted;
};
