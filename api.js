// Super simple API handler for Vercel that doesn't use imports
// This is deliberately minimal to avoid any module loading issues

module.exports = (req, res) => {
  // Basic CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Simple response for all requests
  return res.status(200).json({
    message: 'M-Kite Kitchen API is responding',
    timestamp: new Date().toISOString(),
    note: 'For specific endpoints, use /api/health, /api/contact, or /api/subscribe'
  });
};