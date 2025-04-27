import { createClient } from '@supabase/supabase-js';

// Check if we have valid Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only create the client if we have valid credentials
let supabaseClient = null;

if (supabaseUrl && supabaseKey) {
  try {
    // Create a single supabase client for interacting with your database
    supabaseClient = createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
  }
}

export const supabase = supabaseClient;