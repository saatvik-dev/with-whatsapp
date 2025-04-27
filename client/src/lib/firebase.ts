// This is a stub file to maintain import compatibility
// We're now using Netlify deployment with Supabase database integration

import { useSupabaseBackend } from './db-helper';
import { supabase } from './supabase';

// Create dummy exports to avoid breaking existing imports
const app = null;
const analytics = null;

// Log information about the deployment type
if (useSupabaseBackend()) {
  console.log('Firebase not initialized: Using Netlify deployment with Supabase integration');
} else {
  console.log('Firebase not initialized: Using Netlify deployment with direct PostgreSQL database');
}

// Export dummy values for Firebase compatibility
export { app, analytics };

// Export Supabase client for convenience
export { supabase };

export default app;