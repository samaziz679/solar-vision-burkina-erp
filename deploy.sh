#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# This script is for deploying the Solar Vision Burkina ERP application.
# It assumes you have Vercel CLI installed and configured.

echo "Starting deployment process for Solar Vision Burkina ERP..."

# Check if VERCEL_ORG_ID and VERCEL_PROJECT_ID are set
if [ -z "$VERCEL_ORG_ID" ] || [ -z "$VERCEL_PROJECT_ID" ]; then
  echo "Error: VERCEL_ORG_ID and VERCEL_PROJECT_ID must be set as environment variables."
  exit 1
fi

echo "Vercel Org ID: $VERCEL_ORG_ID"
echo "Vercel Project ID: $VERCEL_PROJECT_ID"

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the Next.js application
echo "Building the Next.js application..."
npm run build

if [ $? -ne 0 ]; then
  echo "Build failed. Exiting deployment."
  exit 1
fi

echo "Build successful."

# Deploy to Vercel
echo "Deploying to Vercel..."
# Use `vercel --prod` for production deployments
# Use `vercel` for preview deployments
vercel --prod

if [ $? -ne 0 ]; then
  echo "Vercel deployment failed. Exiting."
  exit 1
fi

echo "Deployment complete!"
echo "Your application should now be live on Vercel."

# Optional: Add any post-deployment steps here, e.g.,
# - Running database migrations (if not handled by Vercel's build process)
# - Notifying a Slack channel
# - Running end-to-end tests
