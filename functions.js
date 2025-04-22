import { onRequest } from 'firebase-functions/v2/https';
import { app } from './dist/index.js';

// Create a Firebase Function that will serve our Express app
export const api = onRequest(
  { 
    cors: true,
    // You can adjust memory, timeout, etc. as needed
    memory: '1GiB',
    timeoutSeconds: 60,
    region: 'us-central1',
  }, 
  app
);