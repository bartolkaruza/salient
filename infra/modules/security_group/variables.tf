variable "vpc_id" {
  description = "VPC ID to associate"
  type        = string
}

variable "from_port" {
  description = "Start of port range for inbound traffic"
  type        = number
}

variable "to_port" {
  description = "End of port range for inbound traffic"
  type        = number
}

variable "protocol" {
  description = "Protocol to allow for inbound traffic"
  type        = string
}

variable "cidr_blocks" {
  description = "List of CIDR blocks to allow in security group"
  type        = list
}

output "security_group_id" {
  value = aws_security_group.sg.id
}