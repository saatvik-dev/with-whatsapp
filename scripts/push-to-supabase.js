// Script to create tables in Supabase
import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema.js';

async function main() {
  try {
    // Get Supabase URL and key from environment variables
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Error: Missing Supabase environment variables');
      console.error('Please make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are properly set');
      process.exit(1);
    }
    
    console.log('Creating tables in Supabase...');
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test the connection
    const { data, error } = await supabase.from('users').select('*').limit(1).catch(err => {
      // This will likely fail if the table doesn't exist, which is expected
      return { error: err };
    });
    
    // Execute SQL directly to create tables
    // Users table
    console.log('Creating users table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
        );
      `
    }).catch(err => {
      console.error('Error creating users table:', err.message);
    });
    
    // Contact submissions table
    console.log('Creating contact_submissions table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS contact_submissions (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          kitchen_size TEXT,
          message TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );
      `
    }).catch(err => {
      console.error('Error creating contact_submissions table:', err.message);
    });
    
    // Newsletters table
    console.log('Creating newsletters table...');
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS newsletters (
          id SERIAL PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );
      `
    }).catch(err => {
      console.error('Error creating newsletters table:', err.message);
    });
    
    console.log('Tables creation completed!');
    
    // Verify that the tables were created
    console.log('Verifying tables...');
    
    try {
      const { data: usersCheck, error: usersError } = await supabase.from('users').select('*').limit(1);
      if (!usersError) {
        console.log('✓ Users table created successfully');
      } else {
        console.error('Error verifying users table:', usersError.message);
      }
    } catch (error) {
      console.error('Failed to verify users table:', error.message);
    }
    
    try {
      const { data: contactsCheck, error: contactsError } = await supabase.from('contact_submissions').select('*').limit(1);
      if (!contactsError) {
        console.log('✓ Contact submissions table created successfully');
      } else {
        console.error('Error verifying contact_submissions table:', contactsError.message);
      }
    } catch (error) {
      console.error('Failed to verify contact_submissions table:', error.message);
    }
    
    try {
      const { data: newslettersCheck, error: newslettersError } = await supabase.from('newsletters').select('*').limit(1);
      if (!newslettersError) {
        console.log('✓ Newsletters table created successfully');
      } else {
        console.error('Error verifying newsletters table:', newslettersError.message);
      }
    } catch (error) {
      console.error('Failed to verify newsletters table:', error.message);
    }
    
    console.log('Database setup completed!');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();