// Script to fix swapped Supabase credentials
import fs from 'fs';

// Don't load environment variables from the config, read the file directly
// as the config() has already loaded the incorrect values into process.env

console.log('Fixing swapped Supabase credentials...');

// Get the current values
const currentUrl = process.env.VITE_SUPABASE_URL;
const currentKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!currentUrl || !currentKey) {
  console.error('❌ Missing Supabase credentials. Cannot fix.');
  process.exit(1);
}

// Check if they're swapped
const urlIsToken = currentUrl.startsWith('ey');
const keyIsUrl = currentKey.startsWith('http');

if (urlIsToken && keyIsUrl) {
  console.log('✅ Detected swapped credentials. Fixing...');
  
  // Swap the values
  const correctUrl = currentKey; // The URL value was in the key variable
  const correctKey = currentUrl; // The key value was in the url variable
  
  // Read the .env.local file
  let envContent = '';
  if (fs.existsSync('.env.local')) {
    envContent = fs.readFileSync('.env.local', 'utf8');
    
    // Replace the values
    envContent = envContent.replace(/VITE_SUPABASE_URL=.*(\r?\n|$)/g, `VITE_SUPABASE_URL=${correctUrl}\n`);
    envContent = envContent.replace(/VITE_SUPABASE_ANON_KEY=.*(\r?\n|$)/g, `VITE_SUPABASE_ANON_KEY=${correctKey}\n`);
    
    // Write back to .env.local
    fs.writeFileSync('.env.local', envContent);
    
    console.log('✅ Supabase credentials fixed successfully!');
    console.log('Please restart the server to apply the changes.');
  } else {
    console.error('❌ .env.local file not found.');
  }
} else {
  console.log('ℹ️ Supabase credentials do not appear to be swapped.');
}