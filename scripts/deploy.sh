#!/bin/bash

ENVIRONMENT=$1
IMAGE_TAG=$2

echo "Environment received: $ENVIRONMENT"
echo "Image tag received: $IMAGE_TAG"

# Set environment variables (adjust with your actual image tags)
export BACKEND_IMAGE_TAG=714714593268.dkr.ecr.us-east-1.amazonaws.com/spring-angular:backend_latest
export FRONTEND_IMAGE_TAG=714714593268.dkr.ecr.us-east-1.amazonaws.com/spring-angular:frontend_latest

# AWS ECR login
aws_region="us-east-1"
aws_account_id="714714593268"
ecr_repo_name="spring-angular"

echo "Logging into Amazon ECR..."
aws ecr get-login-password --region $aws_region | docker login --username AWS --password-stdin ${aws_account_id}.dkr.ecr.${aws_region}.amazonaws.com/${ecr_repo_name}

# shellcheck disable=SC2181
if [ $? -ne 0 ]; then
  echo "ECR login failed"
  exit 1
fi

# Pull images
echo "Pulling backend image..."
docker pull $BACKEND_IMAGE_TAG

echo "Pulling frontend image..."
docker pull $FRONTEND_IMAGE_TAG

# Load the SSH private key from file
if [ -f "${SSH_PRIVATE_KEY_FILE}" ]; then
  echo "Using SSH private key from file: ${SSH_PRIVATE_KEY_FILE}"
  chmod 600 "${SSH_PRIVATE_KEY_FILE}"
  eval "$(ssh-agent -s)"
  ssh-add "${SSH_PRIVATE_KEY_FILE}"
else
  echo "SSH private key file not found: ${SSH_PRIVATE_KEY_FILE}"
  exit 1
fi

if [ "$ENVIRONMENT" = "staging" ]; then
  echo "Deploying to staging environment..."
  scp -o StrictHostKeyChecking=no -i "${SSH_PRIVATE_KEY_FILE}" ./scripts/docker-compose.yml ubuntu@ec2-100-25-16-179.compute-1.amazonaws.com:/home/ubuntu/docker-compose.yml
  ssh -o StrictHostKeyChecking=no -i "${SSH_PRIVATE_KEY_FILE}" ubuntu@ec2-100-25-16-179.compute-1.amazonaws.com '
  aws ecr get-login-password --region $aws_region | docker login --username AWS --password-stdin ${aws_account_id}.dkr.ecr.${aws_region}.amazonaws.com/${ecr_repo_name}
  cd /home/ubuntu && docker-compose up -d'
elif [ "$ENVIRONMENT" = "production" ]; then
  echo "Deploying to production environment..."
  scp -o StrictHostKeyChecking=no -i "${SSH_PRIVATE_KEY_FILE}" docker-compose.yml ec2-user@ec2-54-224-29-112.compute-1.amazonaws.com:/home/docker-compose.yml
  ssh -o StrictHostKeyChecking=no -i "${SSH_PRIVATE_KEY_FILE}" ec2-user@<production-ec2-instance-public-dns> 'cd /home/ubuntu && docker-compose up -d'
elif [ "$ENVIRONMENT" = "development" ]; then
  echo "Deploying to development environment..."
  scp -o StrictHostKeyChecking=no -i "${SSH_PRIVATE_KEY_FILE}" docker-compose.yml ec2-user@ec2-54-224-29-112.compute-1.amazonaws.com:/home/docker-compose.yml
  ssh -o StrictHostKeyChecking=no -i "${SSH_PRIVATE_KEY_FILE}" ec2-user@<development-ec2-instance-public-dns> 'cd /home && docker-compose up -d'
else
  echo "Unknown environment: $ENVIRONMENT"
  exit 1
fi
