# =============================================================================
# RDS - Database resources
# =============================================================================

# -----------------------------------------------------------------------------
# RDS PostgreSQL - Primary Database
# Multi-AZ deployment for high availability and automatic failover
# -----------------------------------------------------------------------------
resource "aws_db_instance" "primary" {
  identifier     = "sales-website-db"
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = "db.r5.large"

  allocated_storage     = 100
  max_allocated_storage = 500
  storage_type          = "gp3"
  storage_encrypted     = true

  db_name  = "salesdb"
  username = "admin"
  password = var.db_password

  multi_az               = true
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  backup_retention_period   = 7
  skip_final_snapshot       = false
  final_snapshot_identifier = "sales-website-db-final"

  tags = { Name = "sales-website-db" }
}

# -----------------------------------------------------------------------------
# RDS Subnet Group
# Defines which subnets the RDS instance can use
# -----------------------------------------------------------------------------
resource "aws_db_subnet_group" "main" {
  name       = "sales-website-db-subnet-group"
  subnet_ids = aws_subnet.private[*].id

  tags = { Name = "sales-website-db-subnet-group" }
}
