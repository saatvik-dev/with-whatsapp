// Simple health check endpoint for Vercel
export default function handler(req, res) {
  res.status(200).json({ 
    status: 'ok', 
    environment: 'vercel',
    timestamp: new Date().toISOString(),
    message: 'M-Kite Kitchen API health check successful'
  });
}