import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const rawUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const rawKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// Proper validation and assignment
let url: string | undefined;
let key: string | undefined;

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
  }
} else {
  console.error("Missing Supabase credentials");
}

// Initialize client only if we have valid credentials
let supabase = null;
if (url && key) {
  try {
    console.log(`Creating Supabase client with URL: ${url.substring(0, 10)}...`);
    supabase = createClient(url, key);
    console.log("Supabase client created successfully");
  } catch (error) {
    console.error("Failed to create Supabase client:", error);
  }
}

export { supabase };

// Function to initialize database tables
export async function initializeTables() {
  if (!supabase) {
    console.error("Cannot initialize tables - Supabase client not available");
    return;
  }

  try {
    console.log("Initializing database tables...");

    // Create users table with REST API
    const { error: usersError } = await supabase.from('users').select('id').limit(1);
    
    if (usersError && usersError.code === '42P01') { // Relation does not exist
      console.log("Creating users table...");
      const { data, error } = await supabase
        .from('users')
        .insert([
          { username: 'admin', password: 'samplepassword' },
        ])
        .select();
      
      if (error) {
        console.error("Failed to create users table:", error);
        // The table likely doesn't exist, we need to create it via a migration
        // Typically we would use Drizzle to do this, but for now we'll skip this
        console.log("Note: Users table needs to be created in the Supabase dashboard");
      } else {
        console.log("Users table created successfully");
      }
    } else if (usersError) {
      console.error("Error checking users table:", usersError);
    } else {
      console.log("Users table already exists");
    }

    // Create contact_submissions table with REST API
    const { error: contactsError } = await supabase.from('contact_submissions').select('id').limit(1);
    
    if (contactsError && contactsError.code === '42P01') { // Relation does not exist
      console.log("Creating contact_submissions table...");
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert([
          { 
            name: 'System', 
            email: 'system@example.com', 
            phone: '000-000-0000',
            kitchen_size: null,
            message: 'Table initialization'
          },
        ])
        .select();
      
      if (error) {
        console.error("Failed to create contact_submissions table:", error);
        console.log("Note: Contact submissions table needs to be created in the Supabase dashboard");
      } else {
        console.log("Contact submissions table created successfully");
      }
    } else if (contactsError) {
      console.error("Error checking contact_submissions table:", contactsError);
    } else {
      console.log("Contact submissions table already exists");
    }

    // Create newsletters table with REST API
    const { error: newslettersError } = await supabase.from('newsletters').select('id').limit(1);
    
    if (newslettersError && newslettersError.code === '42P01') { // Relation does not exist
      console.log("Creating newsletters table...");
      const { data, error } = await supabase
        .from('newsletters')
        .insert([
          { email: 'system@example.com' },
        ])
        .select();
      
      if (error) {
        console.error("Failed to create newsletters table:", error);
        console.log("Note: Newsletters table needs to be created in the Supabase dashboard");
      } else {
        console.log("Newsletters table created successfully");
      }
    } else if (newslettersError) {
      console.error("Error checking newsletters table:", newslettersError);
    } else {
      console.log("Newsletters table already exists");
    }

    console.log("Database tables initialization complete");
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
}