// Vercel API entry point without spaces in path
// Use dynamic import to avoid ESM issues in Vercel's serverless environment
export default async function handler(req, res) {
  // Import app dynamically
  try {
    const appModule = await import('./api/index.js');
    const app = appModule.default;
    
    // Forward the request to the express app
    return new Promise((resolve, reject) => {
      const mockRes = {
        ...res,
        end: (chunk) => {
          res.end(chunk);
          resolve();
          return mockRes;
        }
      };
      
      app(req, mockRes);
    });
  } catch (error) {
    console.error('Error loading API handler:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Failed to load API handler'
    });
  }
}