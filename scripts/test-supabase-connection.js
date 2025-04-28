import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local file');
  console.error('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  console.log(`URL: ${supabaseUrl}`);
  
  try {
    // Try to get the server version to verify connection
    const { data, error } = await supabase.rpc('get_server_version');
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Connected to Supabase successfully!');
    console.log('Server version:', data);
    return true;
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    return false;
  }
}

async function checkTables() {
  console.log('\nChecking required tables...');
  const requiredTables = ['users', 'contact_submissions', 'newsletters'];
  const results = {};
  
  for (const table of requiredTables) {
    try {
      const { data, error } = await supabase.from(table).select('count(*)', { count: 'exact' }).limit(0);
      
      if (error) {
        if (error.code === '42P01') { // Table doesn't exist
          console.error(`❌ Table "${table}" doesn't exist`);
          results[table] = false;
        } else {
          console.error(`❌ Error checking table "${table}":`, error.message);
          results[table] = false;
        }
      } else {
        console.log(`✅ Table "${table}" exists with ${data.length} records`);
        results[table] = true;
      }
    } catch (err) {
      console.error(`❌ Error checking table "${table}":`, err.message);
      results[table] = false;
    }
  }
  
  return results;
}

async function main() {
  const connected = await testConnection();
  if (!connected) {
    process.exit(1);
  }
  
  const tableResults = await checkTables();
  const allTablesExist = Object.values(tableResults).every(Boolean);
  
  if (!allTablesExist) {
    console.log('\n❌ Some required tables are missing in your Supabase database');
    console.log('Please create the missing tables using the SQL script in scripts/create-tables.sql');
  } else {
    console.log('\n✅ All required tables exist in your Supabase database');
  }
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});