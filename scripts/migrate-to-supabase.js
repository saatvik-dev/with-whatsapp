// This script migrates the database schema to Supabase
import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: Supabase credentials not found in environment variables');
  console.error('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Create tables using the Supabase SQL API
async function createTables() {
  console.log('Creating tables in Supabase...');
  
  try {
    // Create users table
    console.log('Creating users table...');
    const { error: usersError } = await supabase.from('users').select('id').limit(1);
    
    if (usersError && usersError.code === '42P01') { // Table doesn't exist
      const { error } = await supabase
        .from('_exec_sql')
        .select('*')
        .eq('query', `
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
          );
        `);
      
      if (error) {
        console.error('Failed to create users table:', error);
        return false;
      }
      console.log('✓ Users table created successfully');
    } else {
      console.log('✓ Users table already exists');
    }
    
    // Create contact_submissions table
    console.log('Creating contact_submissions table...');
    const { error: contactsError } = await supabase.from('contact_submissions').select('id').limit(1);
    
    if (contactsError && contactsError.code === '42P01') { // Table doesn't exist
      const { error } = await supabase
        .from('_exec_sql')
        .select('*')
        .eq('query', `
          CREATE TABLE IF NOT EXISTS contact_submissions (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            kitchen_size TEXT,
            message TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
          );
        `);
      
      if (error) {
        console.error('Failed to create contact_submissions table:', error);
        return false;
      }
      console.log('✓ Contact submissions table created successfully');
    } else {
      console.log('✓ Contact submissions table already exists');
    }
    
    // Create newsletters table
    console.log('Creating newsletters table...');
    const { error: newslettersError } = await supabase.from('newsletters').select('id').limit(1);
    
    if (newslettersError && newslettersError.code === '42P01') { // Table doesn't exist
      const { error } = await supabase
        .from('_exec_sql')
        .select('*')
        .eq('query', `
          CREATE TABLE IF NOT EXISTS newsletters (
            id SERIAL PRIMARY KEY,
            email TEXT NOT NULL UNIQUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
          );
        `);
      
      if (error) {
        console.error('Failed to create newsletters table:', error);
        return false;
      }
      console.log('✓ Newsletters table created successfully');
    } else {
      console.log('✓ Newsletters table already exists');
    }
    
    return true;
  } catch (error) {
    console.error('Error creating tables:', error);
    return false;
  }
}

// Main migration function
async function migrateToSupabase() {
  console.log('Starting migration to Supabase...');
  
  try {
    // Test the connection
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Failed to connect to Supabase:', error);
      process.exit(1);
    }
    
    console.log('Supabase connection successful!');
    
    // Create tables
    const tablesCreated = await createTables();
    
    if (!tablesCreated) {
      console.error('\n❌ Migration failed! Could not create the necessary tables.');
      console.error('Please check your Supabase permissions or contact support.');
      process.exit(1);
    }
    
    console.log('\n✅ Migration completed successfully!');
    console.log('Your Supabase database is now ready to use with the application.');
    
    // Verify tables exist
    console.log('\nVerifying database tables...');
    
    try {
      const { data: usersData, error: usersError } = await supabase.from('users').select('count').single();
      const { data: contactsData, error: contactsError } = await supabase.from('contact_submissions').select('count').single();
      const { data: newslettersData, error: newslettersError } = await supabase.from('newsletters').select('count').single();
      
      if (!usersError && !contactsError && !newslettersError) {
        console.log('✓ All tables verified successfully');
        console.log('✓ Ready to accept form submissions!');
      } else {
        console.warn('⚠️ Some tables may not be accessible. Please check permissions.');
      }
    } catch (error) {
      console.warn('⚠️ Could not verify all tables:', error.message);
    }
    
  } catch (error) {
    console.error('Migration failed with an unexpected error:', error);
    process.exit(1);
  }
}

// Execute the migration
migrateToSupabase();