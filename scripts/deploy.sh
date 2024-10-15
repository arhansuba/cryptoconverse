#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Check if the network argument is provided
if [ -z "$1" ]; then
    echo "Please provide a network name (e.g., mainnet, goerli, polygon)"
    exit 1
fi

NETWORK=$1

# Check if it's a production deployment
if [ "$2" == "production" ]; then
    CONFIG_FILE="config/production.local.json"
    echo "Using production configuration"
else
    CONFIG_FILE="config/default.local.json"
    echo "Using default configuration"
fi

# Check if the config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "Config file $CONFIG_FILE not found. Please run setup.sh first and update the config file."
    exit 1
fi

# Extract RPC URL from the config file
RPC_URL=$(jq -r ".network.$NETWORK.rpcUrl" "$CONFIG_FILE")

if [ "$RPC_URL" == "null" ]; then
    echo "Network $NETWORK not found in the config file."
    exit 1
fi

# Run the Hardhat deployment script
echo "Deploying to $NETWORK..."
npx hardhat run scripts/deploy_wallet.js --network $NETWORK

echo "Deployment complete!"