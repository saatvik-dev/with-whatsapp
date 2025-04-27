require('dotenv').config({ path: '.env.local' });
const { exec } = require('child_process');
const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials from environment variables
const rawUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const rawKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

let url;
let key;

console.log("Checking Supabase credentials...");

// Validate and potentially fix swapped credentials
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

// Create Supabase client
const supabase = createClient(url, key);

// Manual table creation SQL
async function createTables() {
  console.log("Creating tables in Supabase database...");

  try {
    // Create contact_submissions table
    console.log("Creating contact_submissions table...");
    const { data: contact, error: contactError } = await supabase.from('contact_submissions').select('id').limit(1);

    if (contactError && contactError.code === '42P01') {
      console.log("Table doesn't exist, creating contact_submissions table...");
      
      // We can't use SQL execution directly through the Supabase JS client
      // Instead, we'll show the SQL that needs to be run in the Supabase dashboard
      console.log(`
      CREATE TABLE IF NOT EXISTS public.contact_submissions (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        kitchen_size TEXT,
        message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
      `);
    } else if (contactError) {
      console.error("Error checking contact_submissions table:", contactError);
    } else {
      console.log("Contact submissions table already exists");
    }

    // Create newsletters table
    console.log("Creating newsletters table...");
    const { data: newsletter, error: newsletterError } = await supabase.from('newsletters').select('id').limit(1);

    if (newsletterError && newsletterError.code === '42P01') {
      console.log("Table doesn't exist, creating newsletters table...");
      
      console.log(`
      CREATE TABLE IF NOT EXISTS public.newsletters (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
      `);
    } else if (newsletterError) {
      console.error("Error checking newsletters table:", newsletterError);
    } else {
      console.log("Newsletters table already exists");
    }

    // Create users table
    console.log("Creating users table...");
    const { data: user, error: userError } = await supabase.from('users').select('id').limit(1);

    if (userError && userError.code === '42P01') {
      console.log("Table doesn't exist, creating users table...");
      
      console.log(`
      CREATE TABLE IF NOT EXISTS public.users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
      `);
    } else if (userError) {
      console.error("Error checking users table:", userError);
    } else {
      console.log("Users table already exists");
    }

    console.log("\nIMPORTANT: You need to run the SQL statements above in the Supabase dashboard SQL Editor:");
    console.log("1. Go to https://supabase.com and sign in");
    console.log("2. Select your project");
    console.log("3. Go to SQL Editor and run the SQL statements above");
    
  } catch (error) {
    console.error("Error creating tables:", error);
  }
}

// Run the table creation function
createTables();