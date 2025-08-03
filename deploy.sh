#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Starting Vercel deployment script..."

# Install Vercel CLI globally
echo "Installing Vercel CLI..."
npm install --global vercel@latest

# Pull environment variables for the preview environment
echo "Pulling environment variables for preview environment..."
vercel pull --yes --environment=preview --token=${VERCEL_TOKEN}

# Build the project
echo "Building the project..."
vercel build

# Deploy the prebuilt project
echo "Deploying the prebuilt project..."
vercel deploy --prebuilt

echo "Vercel deployment script finished."
