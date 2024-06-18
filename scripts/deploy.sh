#!/bin/bash



ENVIRONMENT=$1
IMAGE_TAG=$2

# Set environment variables (adjust with your actual image tags)
export BACKEND_IMAGE_TAG=714714593268.dkr.ecr.us-east-1.amazonaws.com/backend:latest
export FRONTEND_IMAGE_TAG=${IMAGE_TAG}

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
  scp -i "${SSH_PRIVATE_KEY_FILE}" docker-compose.yml ec2-user@ec2-54-224-29-112.compute-1.amazonaws.com:/home/ec2-user/docker-compose.yml
  ssh -i "${SSH_PRIVATE_KEY_FILE}" ec2-user@<staging-ec2-instance-public-dns> 'cd /home/ec2-user && docker-compose up -d'
elif [ "$ENVIRONMENT" = "production" ]; then
  echo "Deploying to production environment..."
  scp -i "${SSH_PRIVATE_KEY_FILE}" docker-compose.yml ec2-user@ec2-54-224-29-112.compute-1.amazonaws.com:/home/ec2-user/docker-compose.yml
  ssh -i "${SSH_PRIVATE_KEY_FILE}" ec2-user@<production-ec2-instance-public-dns> 'cd /home/ec2-user && docker-compose up -d'
elif [ "$ENVIRONMENT" = "development" ]; then
  echo "Deploying to development environment..."
  scp -i "${SSH_PRIVATE_KEY_FILE}" docker-compose.yml ec2-user@ec2-54-224-29-112.compute-1.amazonaws.com:/home/ec2-user/docker-compose.yml
  ssh -i "${SSH_PRIVATE_KEY_FILE}" ec2-user@<development-ec2-instance-public-dns> 'cd /home/ec2-user && docker-compose up -d'
else
  echo "Unknown environment: $ENVIRONMENT"
  exit 1
fi
