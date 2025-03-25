terraform {
  required_version = ">= 0.12"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# 🚀 Create an S3 Bucket for Project Data
resource "aws_s3_bucket" "portfolio_data" {
  bucket = "my-portfolio-data"
}

# 🚀 Bucket Policy to Allow Public Access to JSON File (Recommended Approach)
resource "aws_s3_bucket_policy" "public_access" {
  bucket = aws_s3_bucket.portfolio_data.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect    = "Allow",
      Principal = "*",
      Action    = "s3:GetObject",
      Resource  = "${aws_s3_bucket.portfolio_data.arn}/*"
    }]
  })
}

# 🚀 Upload JSON File to S3
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

# 🚀 Create IAM Role for Lambda
resource "aws_iam_role" "lambda_exec" {
  name = "lambda_exec_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect    = "Allow",
      Principal = { Service = "lambda.amazonaws.com" },
      Action    = "sts:AssumeRole"
    }]
  })
}

# 🚀 Attach Policies for Lambda to Access DynamoDB & Logs
resource "aws_iam_policy_attachment" "lambda_policy" {
  name       = "lambda_policy_attachment"
  roles      = [aws_iam_role.lambda_exec.name]
  policy_arn = "arn:aws:iam::aws:policy/AWSLambdaBasicExecutionRole"
}

# 🚀 Create AWS Lambda Function (Python)
resource "aws_lambda_function" "portfolio_lambda" {
  function_name    = "portfolioLambda"
  runtime          = "python3.9"
  handler          = "lambda_function.lambda_handler"
  filename         = "backend/lambda_function.zip"
  source_code_hash = filebase64sha256("../backend/lambda_function.zip")
  role             = aws_iam_role.lambda_exec.arn
}

# 🚀 Create API Gateway to Expose Lambda
resource "aws_apigatewayv2_api" "portfolio_api" {
  name          = "PortfolioAPI"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id           = aws_apigatewayv2_api.portfolio_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.portfolio_lambda.invoke_arn
}

resource "aws_apigatewayv2_route" "get_projects" {
  api_id    = aws_apigatewayv2_api.portfolio_api.id
  route_key = "GET /projects"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_lambda_permission" "apigw_lambda" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.portfolio_lambda.function_name
  principal     = "apigateway.amazonaws.com"
}
