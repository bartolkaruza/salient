resource "aws_wafv2_web_acl" "waf_acl" {
  name        = "rate-limit-acl"
  description = "Rate limit requests to protect the ALB"
  scope       = "REGIONAL"

  default_action {
    allow {}
  }

  rule {
    name     = "ratelimit"
    priority = 0

    action {
      block {}
    }

    statement {
      rate_based_statement {
        limit              = var.request_limit
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = false
      metric_name                = "rateLimitRule"
      sampled_requests_enabled   = false
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = false
    metric_name                = "rateLimitACL"
    sampled_requests_enabled   = false
  }
}

resource "aws_wafv2_web_acl_association" "association" {
  resource_arn = var.load_balancer_arn
  web_acl_arn  = aws_wafv2_web_acl.waf_acl.arn
}