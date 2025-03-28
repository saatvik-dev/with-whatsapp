// Vercel serverless entry point
import express, { Request, Response } from "express";
import { storage } from "../server/storage";
import { registerRoutes } from "../server/routes";

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database
(async () => {
  try {
    await storage.initializeDatabase();
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
})();

// Register all routes
registerRoutes(app);

// Add a simple health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", environment: "vercel" });
});

// Fallback route for serverless - helps catch issues
app.all('*', (req: Request, res: Response) => {
  res.status(200).json({
    message: "M-Kite Kitchen API is running. Please use a specific endpoint."
  });
});

// For Vercel serverless environment
export default app;