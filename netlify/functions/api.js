// Netlify serverless function that handles API requests
const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/pg-core');

// Initialize database connection
let pool;
let db;

function initializeDatabase() {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable is not set');
      return false;
    }

    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false } // Required for some PostgreSQL providers
    });
    
    // We'll initialize schema manually here since we can't import from shared/schema
    const schema = {
      users: {
        $inferSelect: {}
      },
      contactSubmissions: {
        $inferSelect: {}
      },
      newsletters: {
        $inferSelect: {}
      }
    };
    
    db = drizzle({ client: pool, schema });
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return false;
  }
}

// Contact form submission handler
async function handleContactSubmission(body) {
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

    // Create new contact submission
    const result = await db.insert('contactSubmissions').values({
      name,
      email,
      phone: phone || null,
      message,
      kitchenSize: kitchenSize || null,
      budget: budget || null,
      createdAt: new Date().toISOString()
    }).returning();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Contact form submission successful',
        data: result[0] || { id: Date.now() } // Fallback ID if no result returned
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