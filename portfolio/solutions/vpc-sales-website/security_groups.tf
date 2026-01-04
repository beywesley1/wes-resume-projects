# =============================================================================
# Security Groups - Network access control
# =============================================================================

# -----------------------------------------------------------------------------
# ALB Security Group
# Controls inbound/outbound traffic for the Application Load Balancer
# -----------------------------------------------------------------------------
resource "aws_security_group" "alb" {
  name        = "sales-website-alb-sg"
  description = "Security group for Application Load Balancer"
  vpc_id      = aws_vpc.main.id

  # Allow HTTPS from anywhere
  ingress {
    description = "HTTPS from internet"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow HTTP from anywhere (redirects to HTTPS)
  ingress {
    description = "HTTP from internet"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic
  egress {
    description = "All outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "sales-website-alb-sg" }
}

# -----------------------------------------------------------------------------
# Web Server Security Group
# Controls traffic to EC2 instances in the Auto Scaling Group
# -----------------------------------------------------------------------------
resource "aws_security_group" "web" {
  name        = "sales-website-web-sg"
  description = "Security group for web servers"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "HTTP from ALB"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    description = "All outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "sales-website-web-sg" }
}

# -----------------------------------------------------------------------------
# RDS Security Group
# Controls database access - only allows traffic from web servers
# -----------------------------------------------------------------------------
resource "aws_security_group" "rds" {
  name        = "sales-website-rds-sg"
  description = "Security group for RDS database"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "PostgreSQL from web servers"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.web.id]
  }

  tags = { Name = "sales-website-rds-sg" }
}
