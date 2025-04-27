// Netlify function to create database tables on deployment
const { createClient } = require('@supabase/supabase-js');

// Handler for the Netlify function
exports.handler = async function(event, context) {
  console.log('Starting Supabase migration function...');
  
  try {
    // Get Supabase credentials from environment
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('ERROR: Supabase credentials not found in environment variables');
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message: 'Supabase credentials not found in environment variables'
        })
      };
    }
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Create tables
    console.log('Creating database tables...');
    const tablesCreated = await createTables(supabase);
    
    if (!tablesCreated) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message: 'Failed to create one or more database tables'
        })
      };
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Database migration completed successfully'
      })
    };
    
  } catch (error) {
    console.error('Migration function failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Migration function failed with error: ' + error.message
      })
    };
  }
};

// Create tables using the Supabase API
async function createTables(supabase) {
  try {
    // Test connection
    console.log('Testing Supabase connection...');
    const { error: connectionError } = await supabase.auth.getSession();
    
    if (connectionError) {
      console.error('Failed to connect to Supabase:', connectionError);
      return false;
    }
    
    console.log('Supabase connection successful!');
    
    // Create users table
    console.log('Creating users table...');
    try {
      await supabase.from('users').select('id').limit(1);
      console.log('Users table exists');
    } catch (error) {
      if (error.code === '42P01') { // Table doesn't exist
        try {
          // Try direct SQL execution for creating tables
          await supabase.rpc('create_users_table');
          console.log('Users table created successfully');
        } catch (sqlError) {
          console.error('Failed to create users table:', sqlError);
          return false;
        }
      }
    }
    
    // Create contact_submissions table
    console.log('Creating contact_submissions table...');
    try {
      await supabase.from('contact_submissions').select('id').limit(1);
      console.log('Contact submissions table exists');
    } catch (error) {
      if (error.code === '42P01') { // Table doesn't exist
        try {
          await supabase.rpc('create_contact_submissions_table');
          console.log('Contact submissions table created successfully');
        } catch (sqlError) {
          console.error('Failed to create contact_submissions table:', sqlError);
          return false;
        }
      }
    }
    
    // Create newsletters table
    console.log('Creating newsletters table...');
    try {
      await supabase.from('newsletters').select('id').limit(1);
      console.log('Newsletters table exists');
    } catch (error) {
      if (error.code === '42P01') { // Table doesn't exist
        try {
          await supabase.rpc('create_newsletters_table');
          console.log('Newsletters table created successfully');
        } catch (sqlError) {
          console.error('Failed to create newsletters table:', sqlError);
          return false;
        }
      }
    }
    
    console.log('Database migration completed successfully!');
    return true;
  } catch (error) {
    console.error('Error creating tables:', error);
    return false;
  }
}