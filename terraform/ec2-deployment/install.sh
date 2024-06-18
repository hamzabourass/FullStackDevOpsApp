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
