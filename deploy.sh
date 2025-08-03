#!/bin/bash
# Deployment script for Solar Vision Burkina ERP

echo "🚀 Deploying Solar Vision Burkina ERP..."

# Deploy to Vercel
# The --prod flag deploys to the production environment
# The --confirm flag bypasses the confirmation prompt
vercel --prod --confirm

if [ $? -eq 0 ]; then
  echo "Deployment successful!"
else
  echo "Deployment failed. Please check the Vercel logs for more details."
  exit 1
fi

echo "✅ Deployment complete!"
echo "📝 Don't forget to add your Supabase environment variables in Vercel dashboard"
