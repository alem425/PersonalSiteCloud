#Main file for a bunch of configs

provider "aws"{
  project = "cloud-site-challenge"
  region = "us-east-1"
}

resource "aws_s3_bucket""portfolio_data"{
  bucket = "my-portfolio-data"
  acl = "public-read"
}

resource "aws_s3_object" "projects_json"{
  bucket = aws_s3_bucket.portfolio_data.id
  key = "projects.json"
  content = jsonencode([
    {
      "id": "1",
      "title": "Morgstock Full Stack Application",
      "link": "https://github.com/user/portfolio",
      "image": "https://my-portfolio-data.s3.amazonaws.com/project1.png"
    }
  ])
  content_type = "application/json"
}


