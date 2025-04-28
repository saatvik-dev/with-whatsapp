import dotenv from 'dotenv';
// Load environment variables from .env file
dotenv.config();

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { createClient } from '@supabase/supabase-js';

// Configure WebSocket for Neon database
neonConfig.webSocketConstructor = ws;

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl ? `${supabaseUrl.substring(0, 15)}...` : "Not found");
console.log("Supabase Key:", supabaseKey ? `${supabaseKey.substring(0, 15)}...` : "Not found");

// Create a Supabase client for direct API access
let supabaseClient = null;
if (supabaseUrl?.startsWith('http') && supabaseKey?.startsWith('ey')) {
  try {
    console.log("Creating Supabase client with provided credentials");
    supabaseClient = createClient(supabaseUrl, supabaseKey);
    console.log("Supabase client created successfully");
  } catch (error) {
    console.error("Error creating Supabase client:", error);
  }
}

// Setup Drizzle with the direct PostgreSQL connection
let pool;
let db;

// First check if we have a DATABASE_URL environment variable
if (process.env.DATABASE_URL) {
  try {
    console.log("Setting up PostgreSQL connection using DATABASE_URL");
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle(pool, { schema });
    console.log("PostgreSQL connection established successfully with Drizzle");
  } catch (error) {
    console.error("Error setting up PostgreSQL connection:", error);
  }
} else {
  console.warn("No DATABASE_URL found in environment variables.");
}

export { db, supabaseClient };
