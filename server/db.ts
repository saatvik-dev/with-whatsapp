import { createClient } from '@supabase/supabase-js';
import * as schema from "@shared/schema";

// Initialize Supabase client
// Get Supabase credentials from environment variables
let supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
let supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// Function to detect if values might be swapped
const mightBeSwapped = () => {
  return (
    supabaseUrl && 
    supabaseKey && 
    supabaseUrl.startsWith('ey') && 
    supabaseKey.startsWith('http')
  );
};

// Check if credentials are swapped and correct them
if (mightBeSwapped()) {
  console.warn("WARNING: Supabase URL and key appear to be swapped!");
  console.warn("VITE_SUPABASE_URL should be a URL (https://...) and VITE_SUPABASE_ANON_KEY should be a token");
  
  // Swap the values
  const temp = supabaseUrl;
  supabaseUrl = supabaseKey;
  supabaseKey = temp;
  
  console.log("Values corrected. Using swapped credentials.");
}

// Create the Supabase client
let db = null;
if (supabaseUrl?.startsWith('http') && supabaseKey?.startsWith('ey')) {
  try {
    console.log("Creating Supabase client with provided credentials");
    db = createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error("Error creating Supabase client:", error);
    throw new Error("Failed to initialize Supabase client");
  }
} else {
  console.error("No valid Supabase credentials found");
  throw new Error(
    "No database connection available. Please provide valid Supabase credentials.",
  );
}

export { db };
