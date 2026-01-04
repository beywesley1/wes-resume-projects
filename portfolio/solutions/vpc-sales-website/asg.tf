# =============================================================================
# Auto Scaling Group - Compute resources
# =============================================================================

# -----------------------------------------------------------------------------
# Auto Scaling Group
# Automatically scales EC2 instances based on demand
# -----------------------------------------------------------------------------
resource "aws_autoscaling_group" "web" {
  name                = "sales-website-asg"
  desired_capacity    = 3
  max_size            = 9
  min_size            = 3
  vpc_zone_identifier = aws_subnet.public[*].id
  health_check_type   = "ELB"

  launch_template {
    id      = aws_launch_template.web.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "sales-website-web"
    propagate_at_launch = true
  }
}

# -----------------------------------------------------------------------------
# Launch Template
# Defines the EC2 instance configuration for the Auto Scaling Group
# -----------------------------------------------------------------------------
resource "aws_launch_template" "web" {
  name          = "sales-website-lt"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = "t3.medium"

  network_interfaces {
    associate_public_ip_address = true
    security_groups             = [aws_security_group.web.id]
  }

  tag_specifications {
    resource_type = "instance"
    tags = { Name = "sales-website-web" }
  }
}
