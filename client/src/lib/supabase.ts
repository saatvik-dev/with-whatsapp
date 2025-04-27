import { createClient } from '@supabase/supabase-js';
import { hasSupabaseCredentials, isNetlifyDeployment } from './db-helper';

// Try to create a Supabase client in a way that handles both local and Netlify environments
let supabaseClient = null;

// Check if we have valid Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check for valid URLs to avoid client-side errors
const isValidUrl = (urlString: string): boolean => {
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
};

// Only create the client if we have valid credentials AND we're in a Netlify environment
// OR if we explicitly need to use Supabase locally for testing
if (supabaseUrl && supabaseKey && isValidUrl(supabaseUrl)) {
  try {
    // Create a single supabase client for interacting with your database
    supabaseClient = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
  }
} else {
  console.log('Using local development environment with direct database connection');
}

export const supabase = supabaseClient;