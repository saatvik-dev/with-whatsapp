// Vercel serverless entry point
import express, { Request, Response, NextFunction } from "express";
import { storage } from "../server/storage";
import { registerRoutes } from "../server/routes";

// Create Express app
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup database connection - will be run once during cold start
let dbInitialized = false;
const initDb = async () => {
  if (dbInitialized) return;
  
  try {
    await storage.initializeDatabase();
    console.log("Database initialized successfully");
    dbInitialized = true;
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error; // Re-throw to be caught by error handler
  }
};

// Middleware to ensure DB is initialized before processing requests
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await initDb();
    next();
  } catch (error) {
    next(error);
  }
});

// Register all routes
registerRoutes(app);

// Add a simple health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ 
    status: "ok", 
    environment: process.env.VERCEL ? "vercel" : "node",
    timestamp: new Date().toISOString()
  });
});

// Fallback route for serverless - helps catch issues
app.all('*', (req: Request, res: Response) => {
  res.status(200).json({
    message: "M-Kite Kitchen API is running. Please use a specific endpoint."
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("API Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// For Vercel serverless environment
export default app;