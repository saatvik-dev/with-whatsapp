// Netlify serverless function for handling API requests using direct PostgreSQL connection
const { Client } = require('pg');
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();

// Set up middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize PostgreSQL client
let pgClient;
let dbInitialized = false;

// Connect to the database
async function connectToDatabase() {
  if (dbInitialized) return true;
  
  try {
    console.log('Connecting to PostgreSQL database...');
    
    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable is missing');
      return false;
    }
    
    // Create a new client
    pgClient = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false // Required for Netlify
      }
    });
    
    // Connect to the database
    await pgClient.connect();
    console.log('Connected to PostgreSQL database successfully');
    
    // Create tables if they don't exist
    await createTablesIfNotExist();
    
    dbInitialized = true;
    return true;
  } catch (error) {
    console.error('Failed to connect to PostgreSQL database:', error);
    return false;
  }
}

// Create necessary tables if they don't exist
async function createTablesIfNotExist() {
  try {
    // Create contact_submissions table
    await pgClient.query(`
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
    
    // Create newsletters table
    await pgClient.query(`
      CREATE TABLE IF NOT EXISTS newsletters (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);
    
    console.log('Database tables created/verified successfully');
  } catch (error) {
    console.error('Error creating database tables:', error);
    throw error;
  }
}

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const connected = await connectToDatabase();
    
    if (!connected) {
      return res.status(500).json({
        success: false,
        message: 'Database connection not established'
      });
    }
    
    // Test database query
    const result = await pgClient.query('SELECT NOW() as time');
    
    return res.status(200).json({
      success: true,
      message: 'API is healthy',
      database: 'connected',
      timestamp: result.rows[0].time
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message
    });
  }
});

// Contact form submission endpoint
app.post('/contact', async (req, res) => {
  try {
    const connected = await connectToDatabase();
    
    if (!connected) {
      return res.status(500).json({
        success: false,
        message: 'Database connection not established'
      });
    }
    
    const { name, email, phone, message, kitchenSize, budget } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone are required fields'
      });
    }
    
    console.log('Processing contact form submission:', req.body);
    
    // Insert the contact submission into the database
    const query = `
      INSERT INTO contact_submissions (name, email, phone, message, kitchen_size, budget, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *;
    `;
    
    const values = [name, email, phone, message || null, kitchenSize || null, budget || null];
    const result = await pgClient.query(query, values);
    
    if (result.rows.length === 0) {
      throw new Error('Failed to insert contact submission');
    }
    
    return res.status(200).json({
      success: true,
      message: 'Contact form submission successful',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error handling contact submission:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process contact form submission',
      error: error.message
    });
  }
});

// Newsletter subscription endpoint
app.post('/subscribe', async (req, res) => {
  try {
    const connected = await connectToDatabase();
    
    if (!connected) {
      return res.status(500).json({
        success: false,
        message: 'Database connection not established'
      });
    }
    
    const { email } = req.body;
    
    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    // Check if email is already subscribed
    const checkQuery = 'SELECT id FROM newsletters WHERE email = $1;';
    const checkResult = await pgClient.query(checkQuery, [email]);
    
    if (checkResult.rows.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Email already subscribed'
      });
    }
    
    // Insert the newsletter subscription
    const insertQuery = 'INSERT INTO newsletters (email, created_at) VALUES ($1, NOW()) RETURNING id;';
    const insertResult = await pgClient.query(insertQuery, [email]);
    
    if (insertResult.rows.length === 0) {
      throw new Error('Failed to insert newsletter subscription');
    }
    
    return res.status(200).json({
      success: true,
      message: 'Newsletter subscription successful'
    });
  } catch (error) {
    console.error('Error handling newsletter subscription:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process newsletter subscription',
      error: error.message
    });
  }
});

// Get all contact submissions (admin only)
app.get('/admin/contacts', async (req, res) => {
  try {
    const connected = await connectToDatabase();
    
    if (!connected) {
      return res.status(500).json({
        success: false,
        message: 'Database connection not established'
      });
    }
    
    const query = 'SELECT * FROM contact_submissions ORDER BY created_at DESC;';
    const result = await pgClient.query(query);
    
    return res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error retrieving contacts:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve contact submissions',
      error: error.message
    });
  }
});

// Get all newsletter subscriptions (admin only)
app.get('/admin/newsletters', async (req, res) => {
  try {
    const connected = await connectToDatabase();
    
    if (!connected) {
      return res.status(500).json({
        success: false,
        message: 'Database connection not established'
      });
    }
    
    const query = 'SELECT * FROM newsletters ORDER BY created_at DESC;';
    const result = await pgClient.query(query);
    
    return res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error retrieving newsletters:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve newsletter subscriptions',
      error: error.message
    });
  }
});

// Database health check endpoint
app.get('/db-health', async (req, res) => {
  try {
    const connected = await connectToDatabase();
    
    if (!connected) {
      return res.status(500).json({
        success: false,
        message: 'Database connection not established'
      });
    }
    
    // Get counts from tables
    const contactsQuery = 'SELECT COUNT(*) FROM contact_submissions;';
    const newslettersQuery = 'SELECT COUNT(*) FROM newsletters;';
    
    const contactsResult = await pgClient.query(contactsQuery);
    const newslettersResult = await pgClient.query(newslettersQuery);
    
    const contactCount = contactsResult.rows[0].count;
    const newsletterCount = newslettersResult.rows[0].count;
    
    return res.status(200).json({
      success: true,
      message: 'Database connection is healthy',
      timestamp: new Date().toISOString(),
      details: {
        contactCount: parseInt(contactCount, 10),
        newsletterCount: parseInt(newsletterCount, 10),
        dbType: 'PostgreSQL'
      }
    });
  } catch (error) {
    console.error('Database health check failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Not found handler
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Export the serverless handler
exports.handler = serverless(app, {
  basePath: '/api'
});