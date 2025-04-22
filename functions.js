const { onRequest } = require('firebase-functions/v2/https');
const { app } = require('./dist/index.js');

// Create a Firebase Function that will serve our Express app
exports.api = onRequest(
  { 
    cors: true,
    // You can adjust memory, timeout, etc. as needed
    memory: '1GiB',
    timeoutSeconds: 60,
    region: 'us-central1',
  }, 
  app
);