#Main file for a bunch of configs
terraform {
  required_version = ">= 0.12"

  provider "aws" {
    project = "cloud-site-challenge"
    region  = "us-east-1"
  }

  resource "aws_s3_bucket" "portfolio_data" {
    bucket = "my-portfolio-data"
    acl    = "public-read"
  }

  resource "aws_s3_object" "projects_json" {
    bucket = aws_s3_bucket.portfolio_data.id
    key    = "projects.json"
    content = jsonencode([
      {
        "id" : "1",
        "title" : "Morgstock Full Stack Application",
        "link" : "https://github.com/user/portfolio",
        "image" : "https://my-portfolio-data.s3.amazonaws.com/project1.png"
      }
    ])
    content_type = "application/json"
  }

  resource "aws_lambda_function" "portfolio_lambda"{
    function_name  = "portfolioLambda"
    runtime = "python3.9"
    handler = "lambda_function.lambda_handler"
    filename = "backend/lambda_function.zip"
    source_code_hash = filebase64sha256("backend/lambda_function.zip")
    role = aws_iam_role.lambda_exec.arn
  }

  resource "aws_iam_role" "lambda_exec" {
    name = "lambda_exec_role"
    assume_role_policy = jsonencode({
      Version = "2012-10-17"
      Statement = [{
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {Service = "lambda.amazonaws.com"}
      }]
    })
  }
}
