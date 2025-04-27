// Script to check if Supabase environment variables are correctly set
require('dotenv').config({ path: '.env.local' });

console.log('Checking Supabase environment variables:');

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

console.log('VITE_SUPABASE_URL:', supabaseUrl ? 'Set ✓' : 'NOT SET ✗');
console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'Set ✓' : 'NOT SET ✗');

if (!supabaseUrl || !supabaseKey) {
  console.log('\n⚠️ WARNING: Supabase credentials are not properly set!');
  console.log('Please make sure both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env.local file.');
  console.log('This is required for the application to connect to your Supabase database.\n');
  process.exit(1);
} else {
  try {
    // Try to parse the URL to ensure it's valid
    const url = new URL(supabaseUrl);
    console.log('\n✅ Supabase environment variables are correctly set!');
    console.log(`Host: ${url.hostname}`);
    console.log('Connection string format: postgres://postgres:[PASSWORD]@host:5432/postgres\n');
  } catch (error) {
    console.log('\n⚠️ ERROR: Supabase URL is not a valid URL!');
    console.log('Please check the value of VITE_SUPABASE_URL in your .env.local file.\n');
    process.exit(1);
  }
}