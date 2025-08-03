#!/bin/bash
# Deployment script for Solar Vision Burkina ERP

echo "🚀 Deploying Solar Vision Burkina ERP..."

# Exit immediately if a command exits with a non-zero status.
set -e

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "npm could not be found, please install Node.js and npm."
    exit 1
fi

# Install Vercel CLI if not installed
npm install -g vercel

echo "Installing dependencies..."
npm install

echo "Running build process..."
npm run build

# Deploy to Vercel
vercel --prod

echo "✅ Deployment complete!"
echo "📝 Don't forget to add your Supabase environment variables in Vercel dashboard"
