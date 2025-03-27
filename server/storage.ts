import { 
  users, type User, type InsertUser,
  contactSubmissions, type Contact, type InsertContact,
  newsletters, type Newsletter, type InsertNewsletter
} from "@shared/schema";

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
}

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
}

export const storage = new MemStorage();
