#!/bin/bash

# Update package lists
sudo apt update -y

# Install Docker
sudo apt-get install docker.io -y

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add the current user to the Docker group
sudo usermod -aG docker $USER

# Refresh the group membership
newgrp docker

# Set Docker socket permissions
sudo chmod 777 /var/run/docker.sock

# Print Docker and Docker Compose versions
docker --version
docker-compose --version

# Install AWS CLI
sudo apt-get install unzip -y
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Verify AWS CLI installation
aws --version

# Configure AWS CLI using environment variables from Terraform
aws configure set aws_access_key_id "${AWS_ACCESS_KEY_ID}"
aws configure set aws_secret_access_key "${AWS_SECRET_ACCESS_KEY}"
aws configure set default.region "${AWS_DEFAULT_REGION}"

# Log in to Amazon ECR
aws ecr get-login-password --region "${AWS_DEFAULT_REGION}" | docker login --username AWS --password-stdin "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com"

echo "AWS CLI and ECR login complete"
