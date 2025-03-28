// Simple serverless API handler for Vercel
// This file uses CommonJS syntax which is more compatible with Vercel

const express = require('express');
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    environment: 'vercel',
    message: 'M-Kite Kitchen API is running in serverless mode'
  });
});

// Contact form submission endpoint - placeholder for serverless
app.post('/api/contact', (req, res) => {
  try {
    // When in serverless mode, we'll just acknowledge the request
    // In production, you would connect to your real database
    res.status(200).json({
      success: true,
      message: 'Contact form submission received',
      data: {
        name: req.body.name,
        email: req.body.email,
        createdAt: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing request',
      error: error.message
    });
  }
});

// Newsletter subscription endpoint - placeholder for serverless
app.post('/api/subscribe', (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    // When in serverless mode, we'll just acknowledge the request
    res.status(200).json({
      success: true,
      message: 'Email subscription received',
      data: {
        email: email,
        createdAt: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing request',
      error: error.message
    });
  }
});

// Fallback route
app.all('*', (req, res) => {
  res.status(200).json({
    message: 'M-Kite Kitchen API is running. Please use a specific endpoint.'
  });
});

// Export for serverless use
module.exports = app;