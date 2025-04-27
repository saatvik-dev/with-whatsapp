// Netlify serverless function that handles API requests
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
let supabase;

function initializeDatabase() {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      console.error('Supabase environment variables are not set');
      return false;
    }

    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
    
    return true;
  } catch (error) {
    console.error('Failed to initialize Supabase connection:', error);
    return false;
  }
}

// Contact form submission handler
async function handleContactSubmission(body) {
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

    const { name, email, phone, message, kitchenSize, budget } = body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: 'Name, email, and message are required fields'
        })
      };
    }

    // Create new contact submission using Supabase
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([{
        name,
        email,
        phone: phone || null,
        message,
        kitchen_size: kitchenSize || null,
        budget: budget || null,
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      throw error;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Contact form submission successful',
        data: data[0] || { id: Date.now() } // Fallback ID if no result returned
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
    if (!db) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message: 'Database connection not available'
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
    const existingSubscriptions = await db.select().from('newsletters').where('email', '=', email);
    
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
    await db.insert('newsletters').values({
      email,
      subscribedAt: new Date().toISOString()
    });

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
    if (!db) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message: 'Database connection not available'
        })
      };
    }

    const contacts = await db.select().from('contactSubmissions').orderBy('createdAt desc');

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
    if (!db) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message: 'Database connection not available'
        })
      };
    }

    const newsletters = await db.select().from('newsletters').orderBy('subscribedAt desc');

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

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }
  
  // Extract path and method
  const path = event.path.replace('/.netlify/functions/api', '');
  const method = event.httpMethod;
  
  // Initialize database connection on first request
  const dbInitialized = initializeDatabase();
  if (!dbInitialized && path !== '/health') {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Failed to initialize database connection'
      })
    };
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
    
    if (path === '/contact' && method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      response = await handleContactSubmission(body);
    } 
    else if (path === '/subscribe' && method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      response = await handleNewsletterSubscription(body);
    }
    else if (path === '/admin/contacts' && method === 'GET') {
      response = await getAllContacts();
    }
    else if (path === '/admin/newsletters' && method === 'GET') {
      response = await getAllNewsletters();
    }
    else {
      response = {
        statusCode: 404,
        body: JSON.stringify({
          success: false,
          message: 'API endpoint not found'
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