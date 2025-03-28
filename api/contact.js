// CommonJS format contact endpoint for Vercel
module.exports = (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method Not Allowed' 
    });
  }

  try {
    const { name, email, phone, kitchenSize, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and phone are required fields'
      });
    }
    
    // In serverless context, we can just acknowledge the submission
    return res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: {
        name,
        email,
        phone,
        kitchenSize: kitchenSize || null,
        message: message || null,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};