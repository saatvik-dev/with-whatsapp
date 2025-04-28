/**
 * Database helper utility to determine which database provider is being used
 */

// Check if a string is a valid URL
const isValidUrl = (urlString: string): boolean => {
  try {
    // This will throw if the URL is invalid
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
};

// Check if we have valid Supabase credentials
export const hasSupabaseCredentials = (): boolean => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string || '';
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string || '';
  
  return Boolean(
    supabaseUrl && 
    supabaseKey && 
    isValidUrl(supabaseUrl)
  );
};

// Check whether we're using Netlify deployment
export const isNetlifyDeployment = (): boolean => {
  // Check for Netlify environment variable or URL pattern
  return Boolean(
    import.meta.env.NETLIFY || 
    window.location.hostname.includes('netlify.app')
  );
};

// Determine if we should use Supabase
export const useSupabaseBackend = (): boolean => {
  // Force using Supabase if credentials are available, regardless of whether we're on Netlify
  return hasSupabaseCredentials();
};