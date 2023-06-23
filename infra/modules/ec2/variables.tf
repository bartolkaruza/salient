variable "instance_type" {
  description = "Type of instance"
  type        = string
  default     = "t2.micro"
}

variable "key_name" {
  description = "Name of the SSH key pair"
  type        = string
}

variable "subnet_id" {
  description = "ID of the subnet to launch the instance in"
  type        = string
}

variable "ecr_repository" {
  description = "Name of the ECR repository to pull Docker images from"
  type        = string
}

variable "instance_name" {
  description = "Name to give the EC2 instance (will be set as a tag)"
  type        = string
  default     = "ec2-instance"
}

variable "security_group" {
  description = "instance security group"
  type        = string
  default     = "default"
}
