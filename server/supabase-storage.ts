import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { 
  type User, type InsertUser,
  type Contact, type InsertContact,
  type Newsletter, type InsertNewsletter
} from "@shared/schema";
import { IStorage } from './storage';

// Fallback in-memory storage for development when tables don't exist
class InMemoryFallback {
  private users: Map<number, User> = new Map();
  private contacts: Map<number, Contact> = new Map();
  private newsletters: Map<number, Newsletter> = new Map();
  private userIdCounter = 1;
  private contactIdCounter = 1;
  private newsletterIdCounter = 1;

  // User methods
  addUser(user: User): User {
    const id = user.id || this.userIdCounter++;
    const newUser = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  getUsers(): User[] {
    return Array.from(this.users.values());
  }

  // Contact methods
  addContact(contact: Contact): Contact {
    const id = contact.id || this.contactIdCounter++;
    const newContact = { ...contact, id };
    this.contacts.set(id, newContact);
    return newContact;
  }

  getContacts(): Contact[] {
    return Array.from(this.contacts.values());
  }

  // Newsletter methods
  addNewsletter(newsletter: Newsletter): Newsletter {
    const id = newsletter.id || this.newsletterIdCounter++;
    const newNewsletter = { ...newsletter, id };
    this.newsletters.set(id, newNewsletter);
    return newNewsletter;
  }

  getNewsletters(): Newsletter[] {
    return Array.from(this.newsletters.values());
  }

  findNewsletterByEmail(email: string): Newsletter | undefined {
    return Array.from(this.newsletters.values()).find(
      newsletter => newsletter.email === email
    );
  }
}

// Supabase-specific storage implementation
export class SupabaseStorage implements IStorage {
  private fallback: InMemoryFallback;
  private useInMemoryFallback: boolean = false;
  private supabaseClient: SupabaseClient | null = null;
  
  constructor() {
    this.fallback = new InMemoryFallback();
    // We'll determine if we need to use fallback storage during initialization
    this.supabaseClient = supabase as SupabaseClient;
  }
  
  // Initialize database tables
  async initializeDatabase(): Promise<void> {
    try {
      if (!this.supabaseClient) {
        throw new Error("Supabase client not initialized");
      }
      
      // Check if tables exist
      const { error: usersError } = await this.supabaseClient.from('users').select('id').limit(1);
      const { error: contactsError } = await this.supabaseClient.from('contact_submissions').select('id').limit(1);
      const { error: newslettersError } = await this.supabaseClient.from('newsletters').select('id').limit(1);
      
      // If any tables don't exist, use in-memory fallback
      if (
        (usersError && usersError.code === '42P01') || 
        (contactsError && contactsError.code === '42P01') || 
        (newslettersError && newslettersError.code === '42P01')
      ) {
        console.warn("Some required tables don't exist in Supabase. Using in-memory fallback for development.");
        console.warn("To create the tables, use the SQL in scripts/create-tables.sql");
        this.useInMemoryFallback = true;
      } else {
        console.log("All required tables exist in Supabase database.");
      }
      
      console.log("Database initialized successfully");
    } catch (error) {
      console.error("Error initializing database:", error);
      console.warn("Using in-memory fallback due to database initialization error");
      this.useInMemoryFallback = true;
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    // If using fallback, check in-memory data
    if (this.useInMemoryFallback) {
      console.log("Using in-memory fallback for getting user");
      const users = this.fallback.getUsers();
      return users.find(user => user.id === id);
    }
    
    try {
      if (!supabase) throw new Error("Supabase client not initialized");
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        // If the table doesn't exist, use fallback
        if (error.code === '42P01') {
          console.warn("users table doesn't exist, using in-memory fallback");
          this.useInMemoryFallback = true;
          return this.getUser(id);
        }
        // PGRST116 is "no rows returned"
        if (error.code !== 'PGRST116') throw error;
      }
      return data as User;
    } catch (error) {
      console.error("Error getting user:", error);
      // On error, switch to fallback
      this.useInMemoryFallback = true;
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // If using fallback, check in-memory data
    if (this.useInMemoryFallback) {
      console.log("Using in-memory fallback for getting user by username");
      const users = this.fallback.getUsers();
      return users.find(user => user.username === username);
    }
    
    try {
      if (!supabase) throw new Error("Supabase client not initialized");
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
      
      if (error) {
        // If the table doesn't exist, use fallback
        if (error.code === '42P01') {
          console.warn("users table doesn't exist, using in-memory fallback");
          this.useInMemoryFallback = true;
          return this.getUserByUsername(username);
        }
        // PGRST116 is "no rows returned"
        if (error.code !== 'PGRST116') throw error;
      }
      return data as User;
    } catch (error) {
      console.error("Error getting user by username:", error);
      // On error, switch to fallback
      this.useInMemoryFallback = true;
      return undefined;
    }
  }

  async createUser(userData: InsertUser): Promise<User> {
    try {
      // If using fallback, use in-memory storage
      if (this.useInMemoryFallback || !supabase) {
        console.log("Using in-memory fallback for creating user");
        const user: User = {
          id: 1, // Will be updated by addUser
          ...userData
        };
        return this.fallback.addUser(user);
      }
      
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single();
      
      if (error) {
        // If the table doesn't exist, use fallback
        if (error.code === '42P01') {
          console.warn("users table doesn't exist, using in-memory fallback");
          this.useInMemoryFallback = true;
          return this.createUser(userData);
        }
        throw error;
      }
      return data as User;
    } catch (error) {
      // If there's an error and we're not already using fallback, try to use it
      if (!this.useInMemoryFallback) {
        console.error("Error creating user:", error);
        console.warn("Switching to in-memory fallback for future operations");
        this.useInMemoryFallback = true;
        return this.createUser(userData);
      }
      
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // Contact methods
  async createContactSubmission(contactData: InsertContact): Promise<Contact> {
    try {
      // If using fallback or the tables don't exist, use in-memory storage
      if (this.useInMemoryFallback || !supabase) {
        console.log("Using in-memory fallback for contact submission");
        const now = new Date();
        const contact: Contact = {
          id: 1, // Will be updated by addContact
          name: contactData.name,
          email: contactData.email,
          phone: contactData.phone,
          kitchenSize: contactData.kitchenSize || null,
          message: contactData.message || null,
          createdAt: now
        };
        return this.fallback.addContact(contact);
      }
      
      // Add created_at timestamp
      const dataWithTimestamp = {
        ...contactData,
        kitchen_size: contactData.kitchenSize,
        created_at: new Date()
      };
      
      // Remove kitchenSize as we're using snake_case in the database
      delete (dataWithTimestamp as any).kitchenSize;
      
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert(dataWithTimestamp)
        .select()
        .single();
      
      if (error) {
        // If the table doesn't exist, use fallback
        if (error.code === '42P01') {
          console.warn("contact_submissions table doesn't exist, using in-memory fallback");
          this.useInMemoryFallback = true;
          return this.createContactSubmission(contactData);
        }
        throw error;
      }
      
      // Convert snake_case back to camelCase for the frontend
      return {
        ...data,
        kitchenSize: data.kitchen_size,
        createdAt: data.created_at
      } as Contact;
    } catch (error) {
      // If there's an error and we're not already using fallback, try to use it
      if (!this.useInMemoryFallback) {
        console.error("Error creating contact submission:", error);
        console.warn("Switching to in-memory fallback for future operations");
        this.useInMemoryFallback = true;
        return this.createContactSubmission(contactData);
      }
      
      console.error("Error creating contact submission:", error);
      throw error;
    }
  }

  async getAllContactSubmissions(): Promise<Contact[]> {
    // If using fallback, return in-memory data
    if (this.useInMemoryFallback) {
      console.log("Using in-memory fallback for getting contact submissions");
      return this.fallback.getContacts();
    }
    
    try {
      if (!supabase) throw new Error("Supabase client not initialized");
      
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        // If the table doesn't exist, use fallback
        if (error.code === '42P01') {
          console.warn("contact_submissions table doesn't exist, using in-memory fallback");
          this.useInMemoryFallback = true;
          return this.fallback.getContacts();
        }
        throw error;
      }
      
      // Convert snake_case to camelCase
      return data.map((item: any) => ({
        ...item,
        kitchenSize: item.kitchen_size,
        createdAt: item.created_at
      })) as Contact[];
    } catch (error) {
      console.error("Error getting all contact submissions:", error);
      // On error, use fallback and return empty array
      this.useInMemoryFallback = true;
      return this.fallback.getContacts();
    }
  }

  // Newsletter methods
  async subscribeToNewsletter(newsletterData: InsertNewsletter): Promise<Newsletter> {
    try {
      // If using fallback, use in-memory storage
      if (this.useInMemoryFallback || !supabase) {
        console.log("Using in-memory fallback for newsletter subscription");
        const now = new Date();
        const newsletter: Newsletter = {
          id: 1, // Will be updated by addNewsletter
          email: newsletterData.email,
          createdAt: now
        };
        return this.fallback.addNewsletter(newsletter);
      }
      
      const { data, error } = await supabase
        .from('newsletters')
        .insert({
          ...newsletterData,
          created_at: new Date()
        })
        .select()
        .single();
      
      if (error) {
        // If the table doesn't exist, use fallback
        if (error.code === '42P01') {
          console.warn("newsletters table doesn't exist, using in-memory fallback");
          this.useInMemoryFallback = true;
          return this.subscribeToNewsletter(newsletterData);
        }
        throw error;
      }
      
      return {
        ...data,
        createdAt: data.created_at
      } as Newsletter;
    } catch (error) {
      // If there's an error and we're not already using fallback, try to use it
      if (!this.useInMemoryFallback) {
        console.error("Error subscribing to newsletter:", error);
        console.warn("Switching to in-memory fallback for future operations");
        this.useInMemoryFallback = true;
        return this.subscribeToNewsletter(newsletterData);
      }
      
      console.error("Error subscribing to newsletter:", error);
      throw error;
    }
  }

  async isEmailSubscribed(email: string): Promise<boolean> {
    // If using fallback, check in-memory data
    if (this.useInMemoryFallback) {
      console.log("Using in-memory fallback for checking if email is subscribed");
      return !!this.fallback.findNewsletterByEmail(email);
    }
    
    try {
      if (!supabase) throw new Error("Supabase client not initialized");
      
      const { data, error } = await supabase
        .from('newsletters')
        .select('id')
        .eq('email', email);
      
      if (error) {
        // If the table doesn't exist, use fallback
        if (error.code === '42P01') {
          console.warn("newsletters table doesn't exist, using in-memory fallback");
          this.useInMemoryFallback = true;
          return this.isEmailSubscribed(email);
        }
        throw error;
      }
      
      return data.length > 0;
    } catch (error) {
      console.error("Error checking if email is subscribed:", error);
      // On error, switch to fallback
      this.useInMemoryFallback = true;
      return this.isEmailSubscribed(email);
    }
  }
  
  async getAllNewsletterSubscriptions(): Promise<Newsletter[]> {
    // If using fallback, return in-memory data
    if (this.useInMemoryFallback) {
      console.log("Using in-memory fallback for getting newsletter subscriptions");
      return this.fallback.getNewsletters();
    }
    
    try {
      if (!supabase) throw new Error("Supabase client not initialized");
      
      const { data, error } = await supabase
        .from('newsletters')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        // If the table doesn't exist, use fallback
        if (error.code === '42P01') {
          console.warn("newsletters table doesn't exist, using in-memory fallback");
          this.useInMemoryFallback = true;
          return this.fallback.getNewsletters();
        }
        throw error;
      }
      
      return data.map((item: any) => ({
        ...item,
        createdAt: item.created_at
      })) as Newsletter[];
    } catch (error) {
      console.error("Error getting all newsletter subscriptions:", error);
      // On error, switch to fallback and return empty array
      this.useInMemoryFallback = true;
      return this.fallback.getNewsletters();
    }
  }
}