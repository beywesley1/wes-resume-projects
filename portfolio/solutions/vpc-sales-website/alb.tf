# =============================================================================
# Application Load Balancer - Traffic distribution
# =============================================================================

# -----------------------------------------------------------------------------
# Application Load Balancer
# Distributes incoming traffic across multiple EC2 instances
# -----------------------------------------------------------------------------
resource "aws_lb" "main" {
  name               = "sales-website-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id

  enable_deletion_protection = true

  tags = { Name = "sales-website-alb" }
}
