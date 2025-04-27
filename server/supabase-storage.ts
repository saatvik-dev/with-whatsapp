import { supabase } from './supabase';
import { 
  type User, type InsertUser,
  type Contact, type InsertContact,
  type Newsletter, type InsertNewsletter
} from "@shared/schema";
import { IStorage } from './storage';

// Supabase-specific storage implementation
export class SupabaseStorage implements IStorage {
  // Initialize database tables
  async initializeDatabase(): Promise<void> {
    try {
      if (!supabase) {
        throw new Error("Supabase client not initialized");
      }
      
      console.log("Database initialized successfully");
    } catch (error) {
      console.error("Error initializing database:", error);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      if (!supabase) throw new Error("Supabase client not initialized");
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as User;
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      if (!supabase) throw new Error("Supabase client not initialized");
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
      return data as User;
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async createUser(userData: InsertUser): Promise<User> {
    try {
      if (!supabase) throw new Error("Supabase client not initialized");
      
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single();
      
      if (error) throw error;
      return data as User;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // Contact methods
  async createContactSubmission(contactData: InsertContact): Promise<Contact> {
    try {
      if (!supabase) throw new Error("Supabase client not initialized");
      
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
      
      if (error) throw error;
      
      // Convert snake_case back to camelCase for the frontend
      return {
        ...data,
        kitchenSize: data.kitchen_size,
        createdAt: data.created_at
      } as Contact;
    } catch (error) {
      console.error("Error creating contact submission:", error);
      throw error;
    }
  }

  async getAllContactSubmissions(): Promise<Contact[]> {
    try {
      if (!supabase) throw new Error("Supabase client not initialized");
      
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Convert snake_case to camelCase
      return data.map(item => ({
        ...item,
        kitchenSize: item.kitchen_size,
        createdAt: item.created_at
      })) as Contact[];
    } catch (error) {
      console.error("Error getting all contact submissions:", error);
      return [];
    }
  }

  // Newsletter methods
  async subscribeToNewsletter(newsletterData: InsertNewsletter): Promise<Newsletter> {
    try {
      if (!supabase) throw new Error("Supabase client not initialized");
      
      const { data, error } = await supabase
        .from('newsletters')
        .insert({
          ...newsletterData,
          created_at: new Date()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        createdAt: data.created_at
      } as Newsletter;
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      throw error;
    }
  }

  async isEmailSubscribed(email: string): Promise<boolean> {
    try {
      if (!supabase) throw new Error("Supabase client not initialized");
      
      const { data, error } = await supabase
        .from('newsletters')
        .select('id')
        .eq('email', email);
      
      if (error) throw error;
      
      return data.length > 0;
    } catch (error) {
      console.error("Error checking if email is subscribed:", error);
      return false;
    }
  }
  
  async getAllNewsletterSubscriptions(): Promise<Newsletter[]> {
    try {
      if (!supabase) throw new Error("Supabase client not initialized");
      
      const { data, error } = await supabase
        .from('newsletters')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(item => ({
        ...item,
        createdAt: item.created_at
      })) as Newsletter[];
    } catch (error) {
      console.error("Error getting all newsletter subscriptions:", error);
      return [];
    }
  }
}