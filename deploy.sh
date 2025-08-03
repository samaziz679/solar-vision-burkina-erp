#!/bin/bash

echo "Starting deployment process..."

# Step 1: Install dependencies
echo "Installing dependencies..."
npm install || { echo "npm install failed"; exit 1; }

# Step 2: Run the build process
echo "Running Next.js build..."
npm run build || { echo "Next.js build failed"; exit 1; }

# Step 3: (Optional) Run any database migration scripts if needed
# This assumes you have a way to run SQL scripts against your Supabase database
# For example, using a custom script or a tool like `psql`
# echo "Running database migrations..."
# npm run db:migrate || { echo "Database migration failed"; exit 1; }

echo "Deployment process completed successfully!"
