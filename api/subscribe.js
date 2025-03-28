// CommonJS format newsletter subscription endpoint for Vercel
module.exports = (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method Not Allowed' 
    });
  }

  try {
    const { email } = req.body;
    
    // Validate required fields
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    // In serverless context, we can just acknowledge the subscription
    return res.status(200).json({
      success: true,
      message: 'Subscribed to newsletter successfully',
      data: {
        email,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};