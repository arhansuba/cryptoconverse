#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Update package lists
echo "Updating package lists..."
sudo apt-get update

# Install Node.js and npm
echo "Installing Node.js and npm..."
sudo apt-get install -y nodejs npm

# Install Yarn
echo "Installing Yarn..."
sudo npm install -g yarn

# Install project dependencies
echo "Installing project dependencies..."
yarn install

# Install Hardhat globally
echo "Installing Hardhat..."
yarn global add hardhat

# Copy sample config files
echo "Copying sample config files..."
cp config/default.json config/default.local.json
cp config/production.json config/production.local.json

echo "Setup complete! Please update the local config files with your specific settings."