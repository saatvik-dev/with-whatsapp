import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertNewsletterSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Contact form submission endpoint
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      console.log("Contact form submission received:", req.body);
      
      const contactData = insertContactSchema.parse({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        kitchenSize: req.body.kitchenSize || undefined,
        message: req.body.message || undefined,
      });

      console.log("Validated contact data:", contactData);
      
      const submission = await storage.createContactSubmission(contactData);
      console.log("Contact submission created:", submission);
      
      // In a real app, we would send an email notification here
      
      return res.status(201).json({
        success: true,
        message: "Contact form submitted successfully",
        data: submission,
      });
    } catch (error) {
      console.error("Contact form submission error:", error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        console.error("Validation error:", validationError.message);
        
        return res.status(400).json({
          success: false,
          message: validationError.message,
        });
      }
      
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Newsletter subscription endpoint
  app.post("/api/subscribe", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }
      
      const newsletterData = insertNewsletterSchema.parse({ email });
      
      // Check if email is already subscribed
      const isSubscribed = await storage.isEmailSubscribed(email);
      
      if (isSubscribed) {
        return res.status(200).json({
          success: true,
          message: "Email is already subscribed",
        });
      }
      
      const subscription = await storage.subscribeToNewsletter(newsletterData);
      
      // In a real app, we would send a confirmation email here
      
      return res.status(201).json({
        success: true,
        message: "Subscribed to newsletter successfully",
        data: subscription,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          success: false,
          message: validationError.message,
        });
      }
      
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  // Get all contact submissions (for admin purposes)
  app.get("/api/admin/contacts", async (req: Request, res: Response) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      
      return res.status(200).json({
        success: true,
        data: submissions,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  // Get all newsletter subscriptions (for admin purposes)
  app.get("/api/admin/newsletters", async (req: Request, res: Response) => {
    try {
      const subscriptions = await storage.getAllNewsletterSubscriptions();
      
      return res.status(200).json({
        success: true,
        data: subscriptions,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });
  
  // Database health check endpoint
  app.get("/api/db-health", async (_req: Request, res: Response) => {
    try {
      // Try to query the database by accessing a simple count
      const contacts = await storage.getAllContactSubmissions();
      const newsletters = await storage.getAllNewsletterSubscriptions();
      
      return res.status(200).json({
        success: true,
        message: 'Database connection is healthy',
        timestamp: new Date().toISOString(),
        details: {
          contactCount: contacts.length,
          newsletterCount: newsletters.length,
          dbType: process.env.DATABASE_URL ? 'NeonDB' : 'In-Memory'
        }
      });
    } catch (error: any) {
      console.error("Database health check failed:", error);
      
      return res.status(500).json({
        success: false,
        message: 'Database connection failed',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
