variable "request_limit" {
  description = "The limit of requests for the rate-based rule"
  type        = number
  default     = 2000
}

variable "load_balancer_arn" {
  description = "The ARN of the load balancer to associate the ACL with"
  type        = string
}