#!/bin/bash

# Script to set up Supabase tables
echo "🔄 Setting up Supabase tables..."

# Check for required environment variables
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
  echo "❌ Error: Supabase environment variables are not set"
  echo "Please make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set"
  exit 1
fi

echo "✓ Supabase environment variables are set"

# Run the migration script directly using Node.js with ESM support
echo "📊 Running migration script..."
NODE_OPTIONS="--no-warnings" node --experimental-modules scripts/migrate-to-supabase.js

# Check if the script executed successfully
if [ $? -eq 0 ]; then
  echo "✅ Supabase setup completed successfully!"
else
  echo "❌ Supabase setup failed. Please check the error messages above."
  exit 1
fi