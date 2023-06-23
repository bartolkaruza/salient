variable "certificate_arn" {
  description = "The ARN of the SSL certificate"
  type        = string
}

variable "instances" {
  description = "List of instances to attach to the ELB"
  type        = list(string)
}

variable "security_group" {
  description = "The security group to associate with the ELB"
  type        = string
}

variable "subnets" {
  description = "List of subnets to associate with the ELB"
  type        = list(string)
}