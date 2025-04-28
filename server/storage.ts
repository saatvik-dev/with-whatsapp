import * as schema from "@shared/schema";
import { 
  users, type User, type InsertUser,
  contactSubmissions, type Contact, type InsertContact,
  newsletters, type Newsletter, type InsertNewsletter
} from "@shared/schema";
import { eq } from 'drizzle-orm';
import { db, supabaseClient } from './db';
// Import SupabaseStorage implementation
import { SupabaseStorage } from './supabase-storage';
import { supabase } from './supabase';
import { NeonDatabase } from 'drizzle-orm/neon-serverless';

// Storage interface with CRUD methods
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contact form submissions
  createContactSubmission(contactData: InsertContact): Promise<Contact>;
  getAllContactSubmissions(): Promise<Contact[]>;
  
  // Newsletter subscriptions
  subscribeToNewsletter(newsletterData: InsertNewsletter): Promise<Newsletter>;
  isEmailSubscribed(email: string): Promise<boolean>;
  getAllNewsletterSubscriptions(): Promise<Newsletter[]>;
  
  // Database initialization
  initializeDatabase(): Promise<void>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contacts: Map<number, Contact>;
  private newsletters: Map<number, Newsletter>;
  currentUserId: number;
  currentContactId: number;
  currentNewsletterId: number;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.newsletters = new Map();
    this.currentUserId = 1;
    this.currentContactId = 1;
    this.currentNewsletterId = 1;
  }

  async initializeDatabase(): Promise<void> {
    // No-op for in-memory storage
    return Promise.resolve();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Contact methods
  async createContactSubmission(contactData: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const now = new Date();
    // Create the contact object with properly defined properties
    const contact: Contact = { 
      id,
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone,
      kitchenSize: contactData.kitchenSize || null,
      message: contactData.message || null,
      createdAt: now 
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getAllContactSubmissions(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  // Newsletter methods
  async subscribeToNewsletter(newsletterData: InsertNewsletter): Promise<Newsletter> {
    const id = this.currentNewsletterId++;
    const now = new Date();
    const newsletter: Newsletter = { 
      ...newsletterData, 
      id, 
      createdAt: now 
    };
    this.newsletters.set(id, newsletter);
    return newsletter;
  }

  async isEmailSubscribed(email: string): Promise<boolean> {
    return Array.from(this.newsletters.values()).some(
      (newsletter) => newsletter.email === email
    );
  }
  
  async getAllNewsletterSubscriptions(): Promise<Newsletter[]> {
    return Array.from(this.newsletters.values());
  }
}

// PostgreSQL storage implementation using Neon database
export class PostgresStorage implements IStorage {
  // Helper method to get the db instance - just returns the imported db
  private async getDb() {
    if (!db) {
      throw new Error('Database connection not initialized');
    }
    return db;
  }

  // Initialize database using Drizzle
  async initializeDatabase(): Promise<void> {
    try {
      // We're using Drizzle ORM, which already uses the schema
      // defined in shared/schema.ts. We just need to push the schema
      // using npm run db:push. No manual table creation is needed.
      console.log("Database initialized successfully");
    } catch (error) {
      console.error("Error initializing database:", error);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const database = await this.getDb();
      const result = await database.select().from(users).where(eq(users.id, id));
      return result[0];
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const database = await this.getDb();
      const result = await database.select().from(users).where(eq(users.username, username));
      return result[0];
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async createUser(userData: InsertUser): Promise<User> {
    try {
      const database = await this.getDb();
      const result = await database.insert(users).values(userData).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // Contact methods
  async createContactSubmission(contactData: InsertContact): Promise<Contact> {
    try {
      const database = await this.getDb();
      const result = await database.insert(contactSubmissions).values({
        ...contactData,
        createdAt: new Date()
      }).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating contact submission:", error);
      throw error;
    }
  }

  async getAllContactSubmissions(): Promise<Contact[]> {
    try {
      const database = await this.getDb();
      return await database.select().from(contactSubmissions).orderBy(contactSubmissions.createdAt);
    } catch (error) {
      console.error("Error getting all contact submissions:", error);
      return [];
    }
  }

  // Newsletter methods
  async subscribeToNewsletter(newsletterData: InsertNewsletter): Promise<Newsletter> {
    try {
      const database = await this.getDb();
      const result = await database.insert(newsletters).values({
        ...newsletterData,
        createdAt: new Date()
      }).returning();
      return result[0];
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      throw error;
    }
  }

  async isEmailSubscribed(email: string): Promise<boolean> {
    try {
      const database = await this.getDb();
      const result = await database.select().from(newsletters).where(eq(newsletters.email, email));
      return result.length > 0;
    } catch (error) {
      console.error("Error checking if email is subscribed:", error);
      return false;
    }
  }
  
  async getAllNewsletterSubscriptions(): Promise<Newsletter[]> {
    try {
      const database = await this.getDb();
      return await database.select().from(newsletters).orderBy(newsletters.createdAt);
    } catch (error) {
      console.error("Error getting all newsletter subscriptions:", error);
      return [];
    }
  }
}

// Choose which storage implementation to use
// Prioritize Supabase over direct PostgreSQL
let storageImplementation: IStorage;

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const databaseUrl = process.env.DATABASE_URL;

// First check if we have Supabase credentials available
if (supabaseUrl && supabaseKey) {
  console.log("Using Supabase storage implementation");
  storageImplementation = new SupabaseStorage();
}
// If no Supabase, check if we have a PostgreSQL connection
else if (databaseUrl) {
  console.log("Using PostgreSQL storage implementation with DATABASE_URL");
  storageImplementation = new PostgresStorage();
} 
// If neither are available, fall back to in-memory storage
else {
  console.log("No database configuration found. Using in-memory storage implementation");
  storageImplementation = new MemStorage();
}

export const storage = storageImplementation;