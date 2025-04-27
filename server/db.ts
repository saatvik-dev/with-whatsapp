import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { createClient } from '@supabase/supabase-js';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Check if Supabase credentials are present
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

let pool;
let db;

// Function to detect if values might be swapped
const mightBeSwapped = () => {
  return (
    supabaseUrl && 
    supabaseKey && 
    supabaseUrl.startsWith('ey') && 
    supabaseKey.startsWith('http')
  );
};

// Prefer using Supabase if credentials are available
if (supabaseUrl && supabaseKey) {
  // Validate URL format
  try {
    if (mightBeSwapped()) {
      console.warn("WARNING: Supabase URL and key appear to be swapped!");
      console.warn("VITE_SUPABASE_URL should be a URL (https://...) and VITE_SUPABASE_ANON_KEY should be a token");
      console.warn("Attempting to use DATABASE_URL instead...");
    } else {
      console.log("Using Supabase for database connection");
      
      // Ensure URL is valid
      const url = new URL(supabaseUrl);
      const hostname = url.hostname;
      
      // Construct a PostgreSQL connection string for Supabase
      const connectionString = `postgres://postgres:${supabaseKey}@${hostname}:5432/postgres`;
      
      pool = new Pool({ connectionString });
      db = drizzle({ client: pool, schema });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error creating Supabase connection:", errorMessage);
    console.warn("Falling back to DATABASE_URL...");
  }
} else if (process.env.DATABASE_URL) {
  console.log("Using DATABASE_URL for direct Neon database connection");
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
} else {
  throw new Error(
    "No database connection available. Set either DATABASE_URL or SUPABASE credentials.",
  );
}

export { pool, db };
