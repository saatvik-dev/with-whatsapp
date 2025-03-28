// Simple API handler for Vercel - CommonJS format
const express = require('express');
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware for local development
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Simple health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    environment: 'vercel',
    message: 'M-Kite Kitchen API is running in serverless mode'
  });
});

// Catch-all API route for simplicity
app.all('/api/:path*', (req, res) => {
  const path = req.params.path || 'unknown';
  
  // Simple response for any API endpoint
  res.status(200).json({
    message: `M-Kite Kitchen API received request to ${path}`,
    timestamp: new Date(),
    path: req.path,
    method: req.method,
    query: req.query,
    body: req.method === 'GET' ? null : req.body
  });
});

// Export as both CommonJS and ES modules for compatibility
module.exports = app;