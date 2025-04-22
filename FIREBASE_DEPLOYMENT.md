# Deploying M-Kite Kitchen to Firebase

This guide walks you through the steps to deploy the M-Kite Kitchen application to Firebase.

## Prerequisites

1. A [Firebase](https://firebase.google.com/) account
2. Firebase project created in the Firebase Console
3. Firebase CLI installed globally (already included in this project's dependencies)

## Setup

### Step 1: Update Firebase Configuration

1. In the Firebase Console, go to Project settings and scroll down to "Your apps"
2. If you haven't already, add a web app to your Firebase project
3. Copy the Firebase configuration object
4. Create a `.env.local` file in the project root with the following variables:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Step 2: Update .firebaserc

1. Edit the `.firebaserc` file to use your Firebase project ID:

```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

## Database Setup

### Step 1: Set up Firestore or Firebase Realtime Database

For this application, we'll use a database to store contact submissions and newsletter subscribers.

1. In the Firebase Console, go to Firestore Database or Realtime Database
2. Create a new database
3. Start in production mode
4. Choose a database location that's closest to your users

### Step 2: Set up Database Security Rules

For Firestore, configure security rules to control access:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contact_submissions/{document=**} {
      allow read: if request.auth != null;
      allow write: if true; // Allow anonymous writes for the contact form
    }
    match /newsletters/{document=**} {
      allow read: if request.auth != null;
      allow write: if true; // Allow anonymous writes for newsletter subscriptions
    }
  }
}
```

## Build and Deploy

### Step 1: Authentication with Firebase

Run the following command to log in to Firebase:

```bash
npx firebase login
```

### Step 2: Build the Application

Run the custom build script to prepare your application for deployment:

```bash
node build-deploy.js
```

This script:
1. Builds the React frontend
2. Copies the built files to the appropriate Firebase hosting directory
3. Builds the Express backend for Firebase Functions

### Step 3: Deploy to Firebase

Deploy your application with:

```bash
npx firebase deploy
```

This will deploy:
- Your frontend to Firebase Hosting
- Your API server to Firebase Functions

### Step 4: Access Your Deployed Application

Once deployment is complete, Firebase will provide URLs for your application:
- Hosting URL: Your frontend application
- Functions URL: Your backend API

## Environment Variables for Production

For production deployment, you'll need to set up environment variables in Firebase:

```bash
npx firebase functions:config:set database.url="your_database_connection_string"
```

## Troubleshooting

If you encounter any issues during deployment:

1. Check Firebase deployment logs in the Firebase Console
2. Verify that all environment variables are correctly set
3. Ensure your Firebase project has the appropriate billing plan for the features you're using

## Maintenance

To update your deployed application:

1. Make changes to your codebase
2. Run the build and deploy steps again