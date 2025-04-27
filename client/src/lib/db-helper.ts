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

// Check whether we're using Netlify deployment
export const isNetlifyDeployment = (): boolean => {
  // Check for Netlify environment variable or URL pattern
  return Boolean(
    import.meta.env.NETLIFY || 
    window.location.hostname.includes('netlify.app')
  );
};

// For backward compatibility with existing code
export const hasSupabaseCredentials = (): boolean => {
  return false; // We're using NeonDB directly now
};

// Determine if we should use Netlify functions or direct API
export const useSupabaseBackend = (): boolean => {
  return isNetlifyDeployment(); // If we're on Netlify, use Netlify functions
};