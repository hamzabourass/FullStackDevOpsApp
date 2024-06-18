resource "aws_instance" "tools" {
  ami                    = "ami-04b70fa74e45c3917"   #change ami id for different region
  instance_type          = "t2.medium"
  key_name               = "keys"
  vpc_security_group_ids = [aws_security_group.app-sg.id]
  user_data              = templatefile("./install.sh", {})

  tags = {
    Name = "web-app"
  }

  root_block_device {
    volume_size = 30
    encrypted = true
  }
}

resource "aws_security_group" "app-sg" {
  name        = "app-sg"
  description = "Allow TLS inbound traffic"

  ingress = [
    for port in [22, 80, 443, 8080, 9000] : {
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
