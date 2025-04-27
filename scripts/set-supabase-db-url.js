// This script creates a DATABASE_URL from Supabase credentials
import * as dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('Converting Supabase credentials to DATABASE_URL format...');

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials. Please check your environment variables.');
  process.exit(1);
}

try {
  // Extract the hostname from the Supabase URL
  const url = new URL(supabaseUrl);
  const hostname = url.hostname;
  
  // Create a PostgreSQL connection string
  const connectionString = `postgres://postgres:${supabaseKey}@${hostname}:5432/postgres`;
  
  console.log(`✅ Successfully created DATABASE_URL: ${connectionString.substring(0, 30)}...`);
  
  // Update the .env.local file with the new DATABASE_URL
  let envContent = '';
  
  if (fs.existsSync('.env.local')) {
    envContent = fs.readFileSync('.env.local', 'utf8');
    
    // Check if DATABASE_URL already exists
    if (envContent.includes('DATABASE_URL=')) {
      // Replace existing DATABASE_URL
      envContent = envContent.replace(/DATABASE_URL=.*(\r?\n|$)/g, `DATABASE_URL=${connectionString}\n`);
    } else {
      // Add DATABASE_URL to the end
      envContent += `\nDATABASE_URL=${connectionString}\n`;
    }
  } else {
    // Create a new .env.local file
    envContent = `DATABASE_URL=${connectionString}\n`;
  }
  
  // Write back to .env.local
  fs.writeFileSync('.env.local', envContent);
  
  console.log('✅ Updated .env.local file with DATABASE_URL.');
  console.log('✅ You can now run "npm run db:push" to push the schema to Supabase.');
  
} catch (error) {
  console.error('❌ Error creating DATABASE_URL:', error.message);
  process.exit(1);
}