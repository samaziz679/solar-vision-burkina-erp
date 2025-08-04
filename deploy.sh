#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Starting deployment script..."

# Install dependencies
echo "Installing dependencies..."
npm install --prefer-offline --no-audit --progress=false || { echo "npm install failed"; exit 1; }

# Run build
echo "Running build..."
npm run build || { echo "npm run build failed"; exit 1; }

# Install Vercel CLI globally
echo "Installing Vercel CLI..."
npm install --global vercel@latest

# Pull environment variables for the preview environment
echo "Pulling environment variables for preview environment..."
vercel pull --yes --environment=preview --token=${VERCEL_TOKEN}

# Deploy the prebuilt project
echo "Deploying the prebuilt project..."
vercel deploy --prebuilt

echo "Deployment script finished successfully."
