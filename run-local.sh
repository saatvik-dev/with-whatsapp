#!/bin/bash

# Load environment variables from .env.local
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
  echo "Loaded environment variables from .env.local"
else
  echo "Warning: .env.local file not found. Make sure to create it with DATABASE_URL and PORT."
fi

# Check if PORT is set, otherwise use default
if [ -z "$PORT" ]; then
  export PORT=3000
  echo "PORT not set in .env.local, using default: 3000"
fi

echo "Starting development server on port $PORT..."
echo "Press Ctrl+C to stop the server"

# Start the development server
npm run dev