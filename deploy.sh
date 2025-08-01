#!/bin/bash
# Deployment script for Solar Vision Burkina ERP

echo "🚀 Deploying Solar Vision Burkina ERP..."

# Install Vercel CLI if not installed
npm install -g vercel

# Deploy to Vercel
vercel --prod

echo "✅ Deployment complete!"
echo "📝 Don't forget to add your Supabase environment variables in Vercel dashboard"
