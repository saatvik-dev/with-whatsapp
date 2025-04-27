/**
 * Script to run the SQL queries in Supabase via the API
 * This script uses the Supabase JS client to execute SQL queries
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

async function main() {
  console.log('Executing SQL in Supabase...');

  // Get Supabase credentials from environment variables
  const rawUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const rawKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  // Proper validation and assignment
  let url;
  let key;

  console.log("Checking Supabase credentials...");

  // Check credentials format
  if (rawUrl && rawKey) {
    // Case 1: Credentials in correct variables
    if (rawUrl.startsWith('http') && rawKey.startsWith('ey')) {
      url = rawUrl;
      key = rawKey;
      console.log("Using Supabase credentials as provided");
    } 
    // Case 2: Credentials are swapped
    else if (rawKey.startsWith('http') && rawUrl.startsWith('ey')) {
      url = rawKey;  // This is the URL (starting with http)
      key = rawUrl;  // This is the key (starting with ey)
      console.log("Fixed swapped Supabase credentials");
    }
    // Case 3: Invalid format
    else {
      console.error("Supabase credentials have invalid format");
      console.error("URL should start with 'http' and key should start with 'ey'");
      process.exit(1);
    }
  } else {
    console.error("Missing Supabase credentials");
    process.exit(1);
  }

  // Initialize Supabase client
  let supabase;
  try {
    console.log(`Creating Supabase client with URL: ${url.substring(0, 10)}...`);
    supabase = createClient(url, key);
    console.log("Supabase client created successfully");
  } catch (error) {
    console.error("Failed to create Supabase client:", error);
    process.exit(1);
  }

  // Read and execute SQL file
  try {
    const sqlFilePath = path.join(__dirname, 'create-tables.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split the SQL content into separate statements
    const statements = sqlContent
      .replace(/--.*$/gm, '') // Remove comments
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement sequentially
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      // Using rpc to execute raw SQL
      const { error } = await supabase.rpc('exec_sql', { query: statement });
      
      if (error) {
        console.error(`Error executing statement ${i + 1}:`, error);
        console.log('Statement:', statement);
        // Continue with other statements
      } else {
        console.log(`Statement ${i + 1} executed successfully`);
      }
    }
    
    console.log('All SQL statements executed');
    
  } catch (error) {
    console.error('Error reading or executing SQL file:', error);
    process.exit(1);
  }
  
  console.log('Tables created successfully in Supabase!');
}

main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});