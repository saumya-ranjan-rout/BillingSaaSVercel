terraform {
  required_version = ">= 1.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  backend "s3" {
    bucket = "your-terraform-state-bucket"
    key    = "billing-saas/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "billing-saas-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
  enable_vpn_gateway = true

  tags = {
    Terraform   = "true"
    Environment = var.environment
    Application = "billing-saas"
  }
}

# RDS PostgreSQL
module "db" {
  source = "terraform-aws-modules/rds/aws"

  identifier = "billing-saas-db"

  engine               = "postgres"
  engine_version       = "14.5"
  family               = "postgres14"
  major_engine_version = "14"
  instance_class       = "db.t3.micro"

  allocated_storage     = 20
  max_allocated_storage = 100

  db_name  = "billing_saas"
  username = var.db_username
  password = var.db_password
  port     = 5432

  multi_az               = false
  subnet_ids             = module.vpc.private_subnets
  vpc_security_group_ids = [module.vpc.default_security_group_id]

  maintenance_window = "Mon:00:00-Mon:03:00"
  backup_window      = "03:00-06:00"

  backup_retention_period = 7
  skip_final_snapshot     = true
  deletion_protection     = false

  performance_insights_enabled = true

  tags = {
    Environment = var.environment
    Application = "billing-saas"
  }
}

# Elasticache Redis
resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "billing-saas-redis"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis6.x"
  engine_version       = "6.x"
  port                 = 6379

  subnet_group_name  = aws_elasticache_subnet_group.redis.name
  security_group_ids = [module.vpc.default_security_group_id]

  tags = {
    Environment = var.environment
    Application = "billing-saas"
  }
}

resource "aws_elasticache_subnet_group" "redis" {
  name       = "billing-saas-redis-subnet-group"
  subnet_ids = module.vpc.private_subnets
}

# S3 Bucket for file storage
resource "aws_s3_bucket" "app_storage" {
  bucket = "billing-saas-${var.environment}-storage"

  tags = {
    Environment = var.environment
    Application = "billing-saas"
  }
}

resource "aws_s3_bucket_acl" "app_storage_acl" {
  bucket = aws_s3_bucket.app_storage.id
  acl    = "private"
}

# ECR Repositories
resource "aws_ecr_repository" "backend" {
  name                 = "billing-saas/backend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Environment = var.environment
    Application = "billing-saas"
  }
}

resource "aws_ecr_repository" "frontend" {
  name                 = "billing-saas/frontend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Environment = var.environment
    Application = "billing-saas"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "billing-saas-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Environment = var.environment
    Application = "billing-saas"
  }
}
