// Vercel serverless entry point
import express from "express";
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

// For Vercel serverless environment
export default app;