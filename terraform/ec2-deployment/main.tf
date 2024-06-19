# terraform apply -var "aws_account_id=your-account-id" -var "aws_region=your-region" -var "access_key=your-access-key" -var "secret_key=your-secret-key"


variable "aws_account_id" {
  description = "AWS Account ID"
  type        = string
}

variable "aws_region" {
  description = "AWS Region"
  type        = string
  default     = "us-east-1"
}

variable "access_key" {
  description = "AWS Access Key"
  type        = string
  sensitive   = true
}

variable "secret_key" {
  description = "AWS Secret Key"
  type        = string
  sensitive   = true
}

resource "aws_instance" "tools" {
  ami                    = "ami-04b70fa74e45c3917"  # Change AMI ID for different region
  instance_type          = "t2.medium"
  key_name               = "keys"
  vpc_security_group_ids = [aws_security_group.app-sg.id]
  user_data              = templatefile(
    "./install.sh",
    {
      AWS_ACCOUNT_ID       = var.aws_account_id,
      AWS_DEFAULT_REGION   = var.aws_region,
      AWS_ACCESS_KEY_ID    = var.access_key,
      AWS_SECRET_ACCESS_KEY = var.secret_key
    }
  )

  tags = {
    Name = "web-app"
  }

  root_block_device {
    volume_size = 30
    encrypted   = true
  }
}

resource "aws_security_group" "app-sg" {
  name        = "app-sg"
  description = "Allow TLS inbound traffic"

  ingress = [
    for port in [22, 80, 443, 8787, 4200] : {
      description      = "inbound rules"
      from_port        = port
      to_port          = port
      protocol         = "tcp"
      cidr_blocks      = ["0.0.0.0/0"]
      ipv6_cidr_blocks = []
      prefix_list_ids  = []
      security_groups  = []
      self             = false
    }
  ]

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "app-sg"
  }
}

