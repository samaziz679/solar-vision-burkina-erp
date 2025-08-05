#!/bin/bash

# This script is for deploying the application to Vercel.
# It assumes you have the Vercel CLI installed and configured.

echo "Deploying Solar Vision ERP to Vercel..."

# Build the project
echo "Building the project..."
npm run build

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo "Deployment complete!"
