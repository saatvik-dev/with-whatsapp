// Firebase configuration
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Function to check if we have all required Firebase config values
const hasRequiredFirebaseConfig = () => {
  return !!import.meta.env.VITE_FIREBASE_API_KEY && 
         !!import.meta.env.VITE_FIREBASE_PROJECT_ID;
};

// Firebase configuration object
// These values will need to be replaced with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project-id',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcd1234',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-ABCD1234'
};

// Only initialize Firebase if we have the required config or are in production
let app;
let analytics;

if (hasRequiredFirebaseConfig() || import.meta.env.PROD) {
  try {
    app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
} else {
  console.log('Firebase not initialized: Missing configuration values');
}

export { app, analytics };
export default app;