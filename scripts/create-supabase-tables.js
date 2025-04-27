require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

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

// Create Supabase client
const supabase = createClient(url, key);

// Create tables using PostgreSQL SQL statements
async function createTables() {
  console.log("Creating tables in Supabase database...");

  try {
    // Create users table
    console.log("Creating users table...");
    const { error: usersError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'users',
      column_defs: `
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      `
    }).catch(err => {
      if (err.message.includes("function \"create_table_if_not_exists\" does not exist")) {
        console.log("The RPC function create_table_if_not_exists is not available. Please use the Supabase dashboard to create tables.");
        return { error: new Error("RPC function not available") };
      }
      throw err;
    });

    if (usersError) {
      console.error("Failed to create users table:", usersError);
    } else {
      console.log("Users table created successfully");
    }

    // Create contact_submissions table
    console.log("Creating contact_submissions table...");
    const { error: contactsError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'contact_submissions',
      column_defs: `
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        kitchen_size TEXT,
        message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      `
    }).catch(err => {
      if (err.message.includes("function \"create_table_if_not_exists\" does not exist")) {
        return { error: new Error("RPC function not available") };
      }
      throw err;
    });

    if (contactsError) {
      console.error("Failed to create contact_submissions table:", contactsError);
    } else {
      console.log("Contact submissions table created successfully");
    }

    // Create newsletters table
    console.log("Creating newsletters table...");
    const { error: newslettersError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'newsletters',
      column_defs: `
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      `
    }).catch(err => {
      if (err.message.includes("function \"create_table_if_not_exists\" does not exist")) {
        return { error: new Error("RPC function not available") };
      }
      throw err;
    });

    if (newslettersError) {
      console.error("Failed to create newsletters table:", newslettersError);
    } else {
      console.log("Newsletters table created successfully");
    }

    console.log("\nIMPORTANT: If the tables couldn't be created via RPC, you need to create them manually in the Supabase dashboard:");
    console.log("1. Go to https://supabase.com and sign in");
    console.log("2. Select your project");
    console.log("3. Go to SQL Editor and run the following SQL:");
    console.log(`
    -- Create users table
    CREATE TABLE IF NOT EXISTS public.users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );

    -- Create contact_submissions table
    CREATE TABLE IF NOT EXISTS public.contact_submissions (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      kitchen_size TEXT,
      message TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
    );

    -- Create newsletters table
    CREATE TABLE IF NOT EXISTS public.newsletters (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
    `);

    console.log("\nDatabase tables initialization script completed");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
}

// Run the function
createTables();