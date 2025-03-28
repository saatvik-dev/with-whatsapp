// CommonJS format health endpoint for Vercel
module.exports = (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    environment: 'vercel',
    timestamp: new Date().toISOString(),
    message: 'M-Kite Kitchen API health check successful'
  });
};