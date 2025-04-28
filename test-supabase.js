import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jjwbqqtehbvbenyligow.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqd2JxcXRlaGJ2YmVueWxpZ293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NjMwMDYsImV4cCI6MjA2MTQzOTAwNn0.fXlexhnkJ64Fbt9oFqR8QlJCDMAitZRpBbDGxESIv94';

console.log('Testing Supabase connection...');
console.log('URL:', SUPABASE_URL);
console.log('Key:', SUPABASE_ANON_KEY.substring(0, 15) + '...');

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test connection by fetching data from a simple table
async function testConnection() {
  try {
    console.log('Trying to connect to Supabase...');
    
    // First try to get users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);
    
    if (usersError) {
      if (usersError.code === '42P01') {
        console.log('Users table does not exist, will need to be created');
      } else {
        console.error('Error fetching users:', usersError.message);
      }
    } else {
      console.log('Successfully connected to users table');
      console.log('Users found:', users.length);
    }
    
    // Then try to get contact submissions
    const { data: contacts, error: contactsError } = await supabase
      .from('contact_submissions')
      .select('*')
      .limit(5);
      
    if (contactsError) {
      if (contactsError.code === '42P01') {
        console.log('Contact submissions table does not exist, will need to be created');
      } else {
        console.error('Error fetching contact submissions:', contactsError.message);
      }
    } else {
      console.log('Successfully connected to contact_submissions table');
      console.log('Contact submissions found:', contacts.length);
    }
    
    // Finally try to get newsletters
    const { data: newsletters, error: newslettersError } = await supabase
      .from('newsletters')
      .select('*')
      .limit(5);
      
    if (newslettersError) {
      if (newslettersError.code === '42P01') {
        console.log('Newsletters table does not exist, will need to be created');
      } else {
        console.error('Error fetching newsletters:', newslettersError.message);
      }
    } else {
      console.log('Successfully connected to newsletters table');
      console.log('Newsletter subscriptions found:', newsletters.length);
    }
    
    console.log('Connection test complete!');
  } catch (error) {
    console.error('Unexpected error during connection test:', error);
  }
}

testConnection();