#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Starting Vercel deployment..."

# Link the project to Vercel (if not already linked)
# This command will prompt you to select an existing project or create a new one.
# It will also set up the .vercel directory with project metadata.
echo "Linking project to Vercel..."
vercel link --yes

# Pull environment variables from Vercel
# This ensures that local builds use the same environment variables as production.
echo "Pulling environment variables from Vercel..."
vercel env pull .env.local

# Build the Next.js application
# This command runs the 'build' script defined in package.json.
echo "Building the Next.js application..."
npm run build

# Deploy the application to Vercel
# The --prod flag deploys to the production environment.
# The --prebuilt flag tells Vercel to use the already built output.
echo "Deploying to Vercel production..."
vercel --prod --prebuilt

echo "Deployment complete!"
