# =============================================================================
# VPC - Network Infrastructure
# =============================================================================

# -----------------------------------------------------------------------------
# VPC - Virtual Private Cloud
# Isolated network environment for all resources
# -----------------------------------------------------------------------------
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = { Name = "sales-website-vpc" }
}

# -----------------------------------------------------------------------------
# Internet Gateway
# Enables internet access for resources in public subnets
# -----------------------------------------------------------------------------
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = { Name = "sales-website-igw" }
}

# -----------------------------------------------------------------------------
# Public Subnets
# Host web servers and load balancers with direct internet access
# -----------------------------------------------------------------------------
resource "aws_subnet" "public" {
  count = length(local.public_subnets)

  vpc_id                  = aws_vpc.main.id
  cidr_block              = local.public_subnets[count.index]
  availability_zone       = local.azs[count.index]
  map_public_ip_on_launch = true

  tags = { Name = "sales-website-public-${local.azs[count.index]}" }
}

# -----------------------------------------------------------------------------
# Private Subnets
# Host databases and internal services, no direct internet access
# -----------------------------------------------------------------------------
resource "aws_subnet" "private" {
  count = length(local.private_subnets)

  vpc_id            = aws_vpc.main.id
  cidr_block        = local.private_subnets[count.index]
  availability_zone = local.azs[count.index]

  tags = { Name = "sales-website-private-${local.azs[count.index]}" }
}
