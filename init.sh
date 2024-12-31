#!/bin/bash

# Step 1: Update the package list
echo "Updating package list..."
sudo apt update -y

# Step 2: Install Docker
echo "Installing Docker..."
sudo apt install -y docker.io

# Step 3: Install Docker Compose
echo "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Step 4: Move docker-compose.yml and dataset.sql to the upper directory
echo "Moving docker-compose.yml and dataset.sql to the upper directory..."
mv docker-compose.yml ../
mv development_bookbee_dataset.sql ../

# Step 5: Notify the user to create .env files
echo "You need to create .env files for backend and frontend code!"

# Script completed
echo "Initialization complete!"
