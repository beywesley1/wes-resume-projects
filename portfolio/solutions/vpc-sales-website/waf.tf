# =============================================================================
# WAF - Web Application Firewall
# =============================================================================

# -----------------------------------------------------------------------------
# AWS WAF - Web Application Firewall
# Protects against common web exploits (SQL injection, XSS, etc.)
# -----------------------------------------------------------------------------
resource "aws_wafv2_web_acl" "main" {
  name        = "sales-website-waf"
  description = "WAF rules for sales website protection"
  scope       = "REGIONAL"

  default_action {
    allow {}
  }

  # AWS Managed Rules - Common Rule Set
  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 1

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "CommonRulesMetric"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "SalesWebsiteWAF"
    sampled_requests_enabled   = true
  }

  tags = { Name = "sales-website-waf" }
}
