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

// Function to check if credentials might be swapped
const mightBeSwapped = (): boolean => {
  return (
    supabaseUrl && 
    supabaseKey && 
    supabaseUrl.startsWith('ey') && 
    supabaseKey.startsWith('http')
  );
};

// Check for potentially swapped credentials
if (mightBeSwapped()) {
  console.warn("⚠️ WARNING: Supabase URL and key appear to be swapped!");
  console.warn("VITE_SUPABASE_URL should be a URL (https://...) and VITE_SUPABASE_ANON_KEY should be a token");
  console.log('Using local development environment with direct database connection');
} 
// Create the client if we have valid credentials
else if (supabaseUrl && supabaseKey && isValidUrl(supabaseUrl)) {
  try {
    // Create a single supabase client for interacting with your database
    supabaseClient = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized successfully with URL:', supabaseUrl);
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
  }
} else {
  console.log('Using local development environment with direct database connection');
}

export const supabase = supabaseClient;