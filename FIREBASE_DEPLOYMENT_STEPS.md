# Step-by-Step Firebase Deployment Guide for M-Kite Kitchen

This guide provides detailed instructions for deploying the M-Kite Kitchen application on Firebase.

## Prerequisites

1. A Firebase account (create one at [firebase.google.com](https://firebase.google.com/) if you don't already have one)
2. A Firebase project created in the Firebase Console

## Step 1: Obtain Firebase Configuration

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on the gear icon ⚙️ (Project Settings) in the top left
4. Scroll down to "Your apps" section
5. If you haven't already added a web app:
   - Click the "</>" (Web) icon
   - Register the app with a nickname (e.g., "M-Kite Kitchen")
   - Click "Register app"
6. Copy the Firebase configuration object (the `firebaseConfig` object)

## Step 2: Configure Environment Variables

1. Create a `.env.local` file in the project root directory with the following variables:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

DATABASE_URL=your_database_url
```

2. Update the `.firebaserc` file with your Firebase project ID:

```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

## Step 3: Build the Application

Run the build script to prepare your application for deployment:

```bash
node build-deploy.js
```

This script:
1. Builds the React frontend
2. Builds the Express backend for Firebase Functions
3. Copies necessary files to the correct locations

## Step 4: Set Up Firebase CLI

1. Login to Firebase CLI:

```bash
npx firebase login
```

2. Initialize Firebase in your project (if not already done):

```bash
npx firebase init
```

3. Select the following Firebase features:
   - Hosting
   - Functions
   - (Optional) Firestore or Realtime Database

4. Use the existing Firebase project you created
5. Accept the default Functions settings
6. For Hosting configuration:
   - Use `dist/public` as the public directory
   - Configure as a single-page app: Yes
   - Set up automatic builds and deploys with GitHub: No (or Yes if desired)

## Step 5: Set Up Environment Variables in Firebase

1. Set your database connection string as a Firebase Function configuration variable:

```bash
npx firebase functions:config:set database.url="your_database_connection_string"
```

## Step 6: Deploy to Firebase

1. Deploy the entire application:

```bash
npx firebase deploy
```

2. Or deploy individual components:

```bash
npx firebase deploy --only hosting
npx firebase deploy --only functions
```

## Step 7: Access Your Deployed Application

After deployment is complete, you can access your application at:

- **Hosting URL**: https://your-project-id.web.app or https://your-project-id.firebaseapp.com
- **Functions URL**: https://us-central1-your-project-id.cloudfunctions.net/api

## Troubleshooting

### Firebase Deployment Issues

1. **Authentication Issues**:
   - Run `npx firebase logout` then `npx firebase login` to re-authenticate

2. **Deployment Failures**:
   - Check the Firebase deployment logs in the console
   - Verify your `.firebaserc` has the correct project ID
   - Check that all environment variables are set correctly

3. **Function Errors**:
   - Check the Firebase Functions logs in the Firebase Console
   - Ensure your database connection string is correctly set
   - Review the Functions deployment logs for any errors

### Database Connection Issues

1. **PostgreSQL on Firebase**:
   - Firebase doesn't provide built-in PostgreSQL. You'll need to use an external PostgreSQL provider (like Neon, Supabase, or Render)
   - Update your code to use the external database connection string
   - Ensure your database connection string is set in Firebase Functions configuration

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)