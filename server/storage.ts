import { 
  users, type User, type InsertUser,
  contactSubmissions, type Contact, type InsertContact,
  newsletters, type Newsletter, type InsertNewsletter
} from "@shared/schema";
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';

const { Pool } = pg;

// modify the interface with any CRUD methods
// you might need

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

// PostgreSQL storage implementation
export class PostgresStorage implements IStorage {
  private _db: any = null;
  private dbPromise: Promise<any>;

  constructor() {
    // Use a promise to load the db module
    this.dbPromise = this.initDb();
  }

  private async initDb() {
    try {
      const module = await import('./db');
      this._db = module.db;
      return module.db;
    } catch (error) {
      console.error("Error importing db module:", error);
      throw error;
    }
  }

  // Getter to ensure db is available
  private async getDb() {
    if (!this._db) {
      this._db = await this.dbPromise;
    }
    return this._db;
  }

  // Initialize database by creating tables
  async initializeDatabase(): Promise<void> {
    try {
      // For Drizzle ORM, we can use the db directly
      // The tables are defined in the schema already
      // Just importing the schema is enough for Drizzle to know about the tables

      // We can run a simple query to test the connection
      const dbModule = await import('./db');
      
      // Run simple query to check connection
      await dbModule.pool.query('SELECT NOW()');
      
      console.log("Database connection tested successfully");
    } catch (error) {
      console.error("Error initializing database connection:", error);
      throw error;
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const db = await this.getDb();
      const result = await db.select().from(users).where(eq(users.id, id));
      return result[0];
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const db = await this.getDb();
      const result = await db.select().from(users).where(eq(users.username, username));
      return result[0];
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async createUser(userData: InsertUser): Promise<User> {
    try {
      const db = await this.getDb();
      const result = await db.insert(users).values(userData).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // Contact methods
  async createContactSubmission(contactData: InsertContact): Promise<Contact> {
    try {
      const db = await this.getDb();
      const result = await db.insert(contactSubmissions).values({
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
      const db = await this.getDb();
      return await db.select().from(contactSubmissions).orderBy(contactSubmissions.createdAt);
    } catch (error) {
      console.error("Error getting all contact submissions:", error);
      return [];
    }
  }

  // Newsletter methods
  async subscribeToNewsletter(newsletterData: InsertNewsletter): Promise<Newsletter> {
    try {
      const db = await this.getDb();
      const result = await db.insert(newsletters).values({
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
      const db = await this.getDb();
      const result = await db.select().from(newsletters).where(eq(newsletters.email, email));
      return result.length > 0;
    } catch (error) {
      console.error("Error checking if email is subscribed:", error);
      return false;
    }
  }
  
  async getAllNewsletterSubscriptions(): Promise<Newsletter[]> {
    try {
      const db = await this.getDb();
      return await db.select().from(newsletters).orderBy(newsletters.createdAt);
    } catch (error) {
      console.error("Error getting all newsletter subscriptions:", error);
      return [];
    }
  }
}

// Choose which storage implementation to use
// Use PostgreSQL by default, fallback to in-memory if there's no DATABASE_URL
let storageImplementation: IStorage;

if (process.env.DATABASE_URL) {
  console.log("Using PostgreSQL storage implementation");
  storageImplementation = new PostgresStorage();
} else {
  console.log("Using in-memory storage implementation");
  storageImplementation = new MemStorage();
}

export const storage = storageImplementation;
