resource "aws_ecr_repository" "repository" {
  name = var.name
}

resource "aws_ecr_lifecycle_policy" "policy" {
  repository = aws_ecr_repository.repository.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Expire images older than 30 days"
      selection = {
        tagStatus     = "untagged"
        countType     = "sinceImagePushed"
        countUnit     = "days"
        countNumber   = 30
      }
      action = {
        type = "expire"
      }
    }]
  })
}
