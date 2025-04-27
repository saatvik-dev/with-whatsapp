// This is a stub file to maintain import compatibility
// We're using a dual-database approach:
// - In development: PostgreSQL database
// - In Netlify production: Supabase

import { isNetlifyDeployment } from './db-helper';

// Direct import of supabase, which will be null if validation fails in supabase.ts
import { supabase } from './supabase';

// Create dummy exports to avoid breaking existing imports
const app = null;
const analytics = null;

// Log deployment environment information
if (supabase) {
  console.log('Using Supabase integration for data storage');
} else if (isNetlifyDeployment()) {
  console.log('Using Netlify deployment with direct database connection');
} else {
  console.log('Using local development environment with direct database connection');
}

// Export all necessary variables
export { app, analytics, supabase };
export default app;