// Netlify serverless function that handles API requests
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
let supabase;

async function initializeDatabase() {
  try {
    // Check first if we already have a connection
    if (supabase) {
      return true;
    }
    
    // Log all environment variables for debugging (without sensitive values)
    console.log('Environment variables available:', 
      Object.keys(process.env)
        .filter(key => key.includes('SUPABASE') || key.includes('DATABASE'))
        .map(key => key + '=' + (key.includes('KEY') ? '[REDACTED]' : process.env[key].substring(0,10) + '...'))
    );
    
    // Check for environment variables - support both VITE_ prefixed and non-prefixed versions
    // This helps with different Netlify environment variable naming conventions
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase environment variables are not set: ' + 
                   (!supabaseUrl ? 'URL missing' : 'ANON_KEY missing'));
      return false;
    }

    // Mask URL for logging
    const maskedUrl = supabaseUrl ? 
      `${supabaseUrl.substring(0, 15)}...${supabaseUrl.substring(supabaseUrl.length - 5)}` : 
      'undefined';
    
    console.log('Initializing Supabase client with URL:', maskedUrl);
    
    // Create Supabase client
    supabase = createClient(supabaseUrl, supabaseKey);
    
    if (!supabase) {
      console.error('Failed to create Supabase client');
      return false;
    }
    
    console.log('Supabase client initialized successfully');
    
    // Create tables if they don't exist
    try {
      console.log('Checking if tables exist...');
      
      // Check users table
      const { error: usersError } = await supabase.from('users').select('id').limit(1);
      if (usersError && usersError.code === '42P01') {
        console.log('Creating users table...');
        await supabase.sql`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
          )
        `;
      }
      
      // Check contact_submissions table
      const { error: contactsError } = await supabase.from('contact_submissions').select('id').limit(1);
      if (contactsError && contactsError.code === '42P01') {
        console.log('Creating contact_submissions table...');
        await supabase.sql`
          CREATE TABLE IF NOT EXISTS contact_submissions (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            kitchen_size TEXT,
            message TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
          )
        `;
      }
      
      // Check newsletters table
      const { error: newslettersError } = await supabase.from('newsletters').select('id').limit(1);
      if (newslettersError && newslettersError.code === '42P01') {
        console.log('Creating newsletters table...');
        await supabase.sql`
          CREATE TABLE IF NOT EXISTS newsletters (
            id SERIAL PRIMARY KEY,
            email TEXT NOT NULL UNIQUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
          )
        `;
      }
      
      console.log('Database tables checked/created successfully');
    } catch (error) {
      // Just log the error but continue - we'll try to use the database anyway
      console.error('Error checking/creating tables:', error);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to initialize Supabase connection:', error);
    console.error('Error details:', error.message);
    return false;
  }
}

// Contact form submission handler
async function handleContactSubmission(body) {
  try {
    console.log("Contact submission handler - START");
    console.log("Body received:", JSON.stringify(body));
    
    if (!supabase) {
      console.error("Supabase client is not available");
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message: 'Supabase connection not available'
        })
      };
    }

    // Extract fields - keep it simple
    const { name, email, phone } = body;
    let kitchenSize = body.kitchenSize || body.kitchen_size;
    let message = body.message;
    
    // Validate required fields
    if (!name || !email || !phone) {
      console.error("Missing required fields");
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: 'Name, email, and phone are required fields'
        })
      };
    }
    
    console.log("Contact form data validated successfully");
    console.log("Inserting into contact_submissions table...");
    
    // Simplified insertion with minimal fields
    const insertData = {
      name,
      email,
      phone,
      kitchen_size: kitchenSize || null,
      message: message || null,
      created_at: new Date().toISOString()
    };
    
    console.log("Preparing to insert:", JSON.stringify(insertData));
    
    // Try to insert the data
    let insertResult;
    try {
      insertResult = await supabase
        .from('contact_submissions')
        .insert([insertData]);
      
      if (insertResult.error) {
        console.error("Supabase insert error:", insertResult.error);
        throw insertResult.error;
      }
      
      console.log("Insert successful, no error reported");
    } catch (insertError) {
      console.error("Insert operation failed:", insertError);
      throw insertError;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Contact form submission successful', 
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error handling contact submission:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Failed to process contact form submission',
        error: error.message
      })
    };
  }
}

// Newsletter subscription handler
async function handleNewsletterSubscription(body) {
  try {
    if (!supabase) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message: 'Supabase connection not available'
        })
      };
    }

    const { email } = body;
    
    // Validate email
    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: 'Email is required'
        })
      };
    }

    // Check if email already subscribed
    const { data: existingSubscriptions, error: selectError } = await supabase
      .from('newsletters')
      .select('*')
      .eq('email', email);
    
    if (selectError) {
      throw selectError;
    }
    
    if (existingSubscriptions && existingSubscriptions.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: 'Email already subscribed'
        })
      };
    }

    // Create new subscription
    const { error: insertError } = await supabase
      .from('newsletters')
      .insert([{
        email,
        created_at: new Date().toISOString()
      }]);

    if (insertError) {
      throw insertError;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Newsletter subscription successful'
      })
    };
  } catch (error) {
    console.error('Error handling newsletter subscription:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Failed to process newsletter subscription',
        error: error.message
      })
    };
  }
}

// Retrieve all contact submissions
async function getAllContacts() {
  try {
    if (!supabase) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message: 'Supabase connection not available'
        })
      };
    }

    const { data: contacts, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: contacts
      })
    };
  } catch (error) {
    console.error('Error retrieving contacts:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Failed to retrieve contact submissions',
        error: error.message
      })
    };
  }
}

// Retrieve all newsletter subscriptions
async function getAllNewsletters() {
  try {
    if (!supabase) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message: 'Supabase connection not available'
        })
      };
    }

    const { data: newsletters, error } = await supabase
      .from('newsletters')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: newsletters
      })
    };
  } catch (error) {
    console.error('Error retrieving newsletters:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Failed to retrieve newsletter subscriptions',
        error: error.message
      })
    };
  }
}

// Main handler function
exports.handler = async (event, context) => {
  // Initialize CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Log request details for debugging
  console.log('Netlify Function: Received request', { 
    path: event.path,
    method: event.httpMethod,
    rawPath: event.rawPath,
    rawQuery: event.rawQueryString,
    body: event.body ? 'PRESENT' : 'EMPTY'
  });

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }
  
  // Extract path and method - handle multiple possible path formats
  let path = event.path;
  
  // Remove the Netlify Functions prefix if present
  if (path.startsWith('/.netlify/functions/api')) {
    path = path.replace('/.netlify/functions/api', '');
  }
  
  // If path is now empty, assume it's the root path
  if (!path || path === '') {
    path = '/';
  }
  
  console.log('Processed API path:', path);
  
  const method = event.httpMethod;
  
  // Initialize database connection on first request
  const dbInitialized = await initializeDatabase();
  if (!dbInitialized && path !== '/health') {
    // Use environment variable names that might be used in Netlify
    if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
      console.error('Checking alternative environment variable names...');
      // Some Netlify deployments might use different env variable names
      if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
        // Map to the expected names
        process.env.VITE_SUPABASE_URL = process.env.SUPABASE_URL;
        process.env.VITE_SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
        // Try initialization again
        const reinitialized = await initializeDatabase();
        if (reinitialized) {
          console.log('Successfully initialized with alternative environment variables');
        } else {
          console.error('Failed to initialize even with alternative environment variables');
        }
      }
    }
    
    // If still not initialized, return error
    if (!supabase) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Failed to initialize database connection. Check Supabase credentials.'
        })
      };
    }
  }
  
  try {
    // Health check endpoint doesn't require database connection
    if (path === '/health') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'API is healthy',
          database: dbInitialized ? 'connected' : 'disconnected'
        })
      };
    }
    
    // Handle API routes
    let response;
    console.log('Routing API request to:', path, method);
    
    // Check both exact path match and if path ends with the route
    // This helps handle cases where the path might have additional segments
    const pathMatches = (routePath) => {
      return path === routePath || path.endsWith(routePath);
    };
    
    if ((pathMatches('/contact') || pathMatches('/api/contact')) && method === 'POST') {
      console.log('Processing contact form submission');
      try {
        // Safely parse the body
        let body;
        try {
          body = JSON.parse(event.body || '{}');
          console.log('Parsed contact form body:', JSON.stringify(body));
        } catch (parseError) {
          console.error('Error parsing contact form body:', parseError);
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              message: 'Invalid JSON in request body',
              error: parseError.message
            })
          };
        }
        
        response = await handleContactSubmission(body);
      } catch (err) {
        console.error('Unhandled error in contact submission:', err);
        response = {
          statusCode: 500,
          body: JSON.stringify({
            success: false,
            message: 'Internal server error processing contact form',
            error: err.message
          })
        };
      }
    } 
    else if ((pathMatches('/subscribe') || pathMatches('/api/subscribe')) && method === 'POST') {
      console.log('Processing newsletter subscription');
      try {
        // Safely parse the body
        let body;
        try {
          body = JSON.parse(event.body || '{}');
          console.log('Parsed newsletter body:', JSON.stringify(body));
        } catch (parseError) {
          console.error('Error parsing newsletter body:', parseError);
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              message: 'Invalid JSON in request body',
              error: parseError.message
            })
          };
        }
        
        response = await handleNewsletterSubscription(body);
      } catch (err) {
        console.error('Unhandled error in newsletter subscription:', err);
        response = {
          statusCode: 500,
          body: JSON.stringify({
            success: false,
            message: 'Internal server error processing newsletter',
            error: err.message
          })
        };
      }
    }
    else if ((pathMatches('/admin/contacts') || pathMatches('/api/admin/contacts')) && method === 'GET') {
      console.log('Getting all contacts');
      response = await getAllContacts();
    }
    else if ((pathMatches('/admin/newsletters') || pathMatches('/api/admin/newsletters')) && method === 'GET') {
      console.log('Getting all newsletter subscriptions');
      response = await getAllNewsletters();
    }
    else if (path === '/db-health' && method === 'GET') {
      // Database health check
      try {
        // Try to query the database
        const contacts = await getAllContacts();
        const newsletters = await getAllNewsletters();
        
        response = {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            message: 'Database connection is healthy',
            timestamp: new Date().toISOString(),
            details: {
              contactCount: contacts.data ? contacts.data.length : 0,
              newsletterCount: newsletters.data ? newsletters.data.length : 0,
              dbType: 'Supabase'
            }
          })
        };
      } catch (error) {
        console.error("Database health check failed:", error);
        
        response = {
          statusCode: 500,
          body: JSON.stringify({
            success: false,
            message: 'Database connection failed',
            error: error.message,
            timestamp: new Date().toISOString()
          })
        };
      }
    }
    else {
      console.error('API endpoint not found:', {
        path,
        originalPath: event.path,
        method,
        availableEndpoints: [
          '/contact (POST)',
          '/api/contact (POST)',
          '/subscribe (POST)',
          '/api/subscribe (POST)',
          '/admin/contacts (GET)',
          '/api/admin/contacts (GET)',
          '/admin/newsletters (GET)',
          '/api/admin/newsletters (GET)',
          '/db-health (GET)'
        ]
      });
      
      response = {
        statusCode: 404,
        body: JSON.stringify({
          success: false,
          message: 'API endpoint not found',
          path: path,
          method: method,
          requestedUrl: event.path,
          timestamp: new Date().toISOString()
        })
      };
    }
    
    // Add CORS headers to response
    return {
      ...response,
      headers: { ...headers, ...(response.headers || {}) }
    };
    
  } catch (error) {
    console.error('Error in API function:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: error.message
      })
    };
  }
};