// Script to check and log Supabase environment variables
import { config } from 'dotenv';
config({ path: '.env.local' });

// Check Supabase credentials
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Checking Supabase environment variables:');
console.log('----------------------------------------');
console.log(`VITE_SUPABASE_URL exists: ${!!supabaseUrl}`);
console.log(`VITE_SUPABASE_ANON_KEY exists: ${!!supabaseKey}`);

if (supabaseUrl && supabaseKey) {
  console.log('\nSupabase credentials are correctly set.');
  console.log('----------------------------------------');
  
  // Mask the actual key values for security
  const maskedUrl = supabaseUrl ? 
    `${supabaseUrl.substring(0, 15)}...${supabaseUrl.substring(supabaseUrl.length - 10)}` : 
    'undefined';
  
  const maskedKey = supabaseKey ? 
    `${supabaseKey.substring(0, 5)}...${supabaseKey.substring(supabaseKey.length - 5)}` : 
    'undefined';
  
  console.log(`VITE_SUPABASE_URL: ${maskedUrl}`);
  console.log(`VITE_SUPABASE_ANON_KEY: ${maskedKey}`);
  
  // Check if values are swapped
  if (supabaseUrl && supabaseUrl.startsWith('ey')) {
    console.log('\n⚠️ WARNING: VITE_SUPABASE_URL appears to be a token, not a URL!');
    console.log('The URL and key values might be swapped.');
  }
  
  if (supabaseKey && supabaseKey.startsWith('http')) {
    console.log('\n⚠️ WARNING: VITE_SUPABASE_ANON_KEY appears to be a URL, not a token!');
    console.log('The URL and key values might be swapped.');
  }
} else {
  console.log('\n❌ Missing Supabase credentials!');
  if (!supabaseUrl) console.log('VITE_SUPABASE_URL is missing');
  if (!supabaseKey) console.log('VITE_SUPABASE_ANON_KEY is missing');
}

// Check DATABASE_URL
const databaseUrl = process.env.DATABASE_URL;
console.log('\nChecking PostgreSQL connection:');
console.log('----------------------------------------');
console.log(`DATABASE_URL exists: ${!!databaseUrl}`);

if (databaseUrl) {
  const maskedDbUrl = databaseUrl ? 
    `${databaseUrl.substring(0, 15)}...${databaseUrl.substring(databaseUrl.length - 10)}` : 
    'undefined';
  
  console.log(`DATABASE_URL: ${maskedDbUrl}`);
} else {
  console.log('❌ DATABASE_URL is missing!');
}