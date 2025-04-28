// Direct Supabase configuration to be imported by the server
import { createClient } from '@supabase/supabase-js';

// Hardcoded credentials for testing
const SUPABASE_URL = 'https://jjwbqqtehbvbenyligow.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqd2JxcXRlaGJ2YmVueWxpZ293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NjMwMDYsImV4cCI6MjA2MTQzOTAwNn0.fXlexhnkJ64Fbt9oFqR8QlJCDMAitZRpBbDGxESIv94';

console.log('Creating direct Supabase client connection');
const directSupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export { directSupabaseClient };