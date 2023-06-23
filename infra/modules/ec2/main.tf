data "aws_ami" "docker" {
  most_recent = true

  filter {
    name   = "name"
    values = ["al2023-*-x86_64"]
  }

  owners = ["amazon"]
}

resource "aws_instance" "instance" {
  ami             = data.aws_ami.docker.id
  instance_type   = var.instance_type
  key_name        = var.key_name
  subnet_id       = var.subnet_id
  security_groups = [var.security_group]

  user_data = <<-EOF
              #!/bin/bash
              sudo yum update
              sudo yum install docker
              sudo usermod -a -G docker ec2-user
              id ec2-user
              sudo systemctl enable docker.service
              sudo systemctl start docker.service
              sudo systemctl status docker.service
              sudo service docker start
              sudo docker pull ${var.ecr_repository}:latest
              sudo docker run -d -p 80:80 ${var.ecr_repository}:latest
              EOF

  tags = {
    Name = var.instance_name
  }
}
