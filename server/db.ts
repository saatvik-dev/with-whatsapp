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

// Prefer using Supabase if credentials are available
if (supabaseUrl && supabaseKey) {
  console.log("Using Supabase for database connection");
  
  // Convert Supabase URL to PostgreSQL connection string
  // Format: postgres://postgres:[PASSWORD]@[HOST]/postgres
  
  // Extract the password and host from the Supabase URL
  const url = new URL(supabaseUrl);
  const hostname = url.hostname;
  
  // Construct a PostgreSQL connection string for Supabase
  const connectionString = `postgres://postgres:${supabaseKey}@${hostname}:5432/postgres`;
  
  pool = new Pool({ connectionString });
  db = drizzle({ client: pool, schema });
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
