#!/bin/bash

# Ensure we have the right Supabase credentials
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
  echo "❌ Error: Supabase environment variables are not set"
  echo "Please make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set"
  echo "Example: VITE_SUPABASE_URL=https://your-project-id.supabase.co"
  exit 1
fi

# Create an SQL file for direct upload
cat > scripts/create-tables.sql << EOF
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  kitchen_size TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create newsletters table
CREATE TABLE IF NOT EXISTS newsletters (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
EOF

echo "📝 Created SQL file with table definitions"

# Create a temporary script to execute SQL in Supabase
cat > scripts/supabase-execute.js << EOF
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Read SQL file
const sql = fs.readFileSync('scripts/create-tables.sql', 'utf8');

// Split the SQL file into separate statements
const statements = sql.split(';').filter(stmt => stmt.trim());

async function executeStatements() {
  try {
    console.log('Executing SQL statements...');
    
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i].trim();
      if (!stmt) continue;
      
      console.log(\`Executing statement \${i + 1}...\`);
      
      const { error } = await supabase.rpc('exec_sql', { sql: stmt });
      
      if (error) {
        console.error(\`Error executing statement \${i + 1}: \${error.message}\`);
        // Continue with other statements
      }
    }
    
    console.log('All statements executed');
    
    // Verify tables
    await verifyTables();
  } catch (error) {
    console.error('Error:', error);
  }
}

async function verifyTables() {
  try {
    console.log('Verifying tables...');
    
    const tables = ['users', 'contact_submissions', 'newsletters'];
    
    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      
      if (error) {
        console.error(\`Error verifying \${table} table: \${error.message}\`);
      } else {
        console.log(\`✓ \${table} table verified\`);
      }
    }
  } catch (error) {
    console.error('Verification error:', error);
  }
}

executeStatements();
EOF

echo "📝 Created execution script"

# Run the script
echo "🚀 Executing SQL to create tables in Supabase..."
node --experimental-modules scripts/supabase-execute.js

# Clean up
rm scripts/create-tables.sql
rm scripts/supabase-execute.js

echo "✅ Database setup process completed"