# Deploying M-Kite Kitchen to Netlify

This guide provides step-by-step instructions for deploying the M-Kite Kitchen application on Netlify.

## Overview

For the Netlify deployment, we'll:
1. Deploy the frontend on Netlify
2. Deploy the backend separately (options include Render, Heroku, or Firebase Functions)
3. Configure the frontend to communicate with the backend

## Prerequisites

1. A [Netlify](https://www.netlify.com/) account
2. Your project code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. A separate deployment for your backend API

## Frontend Deployment to Netlify

### Option 1: Deploy via Netlify UI (Recommended for beginners)

1. **Login to Netlify**:
   - Go to [app.netlify.com](https://app.netlify.com/) and log in or sign up

2. **Create a New Site**:
   - Click "Add new site" > "Import an existing project"
   - Connect to your Git provider (GitHub, GitLab, or Bitbucket)
   - Select your M-Kite Kitchen repository

3. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist/public`
   - Click "Deploy site"

4. **Set Environment Variables**:
   - In your site's dashboard, go to Site settings > Build & deploy > Environment
   - Add the following variables:
     - `VITE_API_BASE_URL`: URL of your backend API (e.g., https://your-backend-api.com)
     - Any Firebase configuration variables if you're using Firebase services

5. **Trigger a New Deploy**:
   - Go to the "Deploys" tab
   - Click "Trigger deploy" > "Deploy site"

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI** (if not already installed):
   ```bash
   npm install netlify-cli -g
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Initialize Your Site**:
   ```bash
   netlify init
   ```
   - Choose "Create & configure a new site"
   - Follow the prompts to select your team and set a site name

4. **Deploy Your Site**:
   ```bash
   netlify deploy --build
   ```

5. **Set Environment Variables**:
   ```bash
   netlify env:set VITE_API_BASE_URL https://your-backend-api.com
   ```

## Backend Options

### Option 1: Deploy Backend to Render

Follow the instructions in the main `DEPLOYMENT.md` file to deploy your Express backend to Render.

### Option 2: Deploy Backend to Firebase Functions

Follow the instructions in the `FIREBASE_DEPLOYMENT_STEPS.md` file to deploy your Express backend as Firebase Functions.

### Option 3: Use Netlify Functions (for simple backends)

For simpler APIs, you can use Netlify Functions:

1. **Create Netlify Functions**:
   - Place your function files in the `netlify/functions` directory
   - Each function exports a handler:
     ```javascript
     exports.handler = async (event, context) => {
       return {
         statusCode: 200,
         body: JSON.stringify({ message: "Hello from Netlify Functions" })
       };
     };
     ```

2. **Access Your Functions**:
   - Functions are available at `/.netlify/functions/[function-name]`
   - For example: `https://your-site.netlify.app/.netlify/functions/api`

## Connecting Frontend to Backend

### Using Environment Variables

1. **For local development**:
   - Create a `.env.local` file with:
     ```
     VITE_API_BASE_URL=http://localhost:5000
     ```

2. **For production**:
   - Set in Netlify dashboard:
     ```
     VITE_API_BASE_URL=https://your-backend-api.com
     ```

### Using Netlify Redirects (API Proxying)

For better security and to avoid CORS issues, you can use Netlify redirects:

1. **Create a `_redirects` file in the `dist/public` directory**:
   ```
   /api/*  https://your-backend-api.com/:splat  200
   /*      /index.html                          200
   ```
   
   This is created automatically by the netlify-build.js script.

2. **Update your frontend code to use relative URLs**:
   - Instead of `fetch('https://your-backend-api.com/api/data')`
   - Use `fetch('/api/data')`

## Custom Domain Configuration

1. **Add Custom Domain**:
   - In your site's dashboard, go to Site settings > Domain management
   - Click "Add custom domain"
   - Enter your domain name and follow the verification steps

2. **Configure DNS**:
   - Set up your DNS records as instructed by Netlify
   - For apex domains, set an A record pointing to Netlify's load balancer
   - For subdomains, set a CNAME record pointing to your Netlify site

3. **Enable HTTPS**:
   - Netlify automatically provisions SSL certificates via Let's Encrypt
   - Ensure "HTTPS" is enabled in your site settings

## Testing Your Deployment

1. **Verify Frontend**:
   - Visit your Netlify URL (e.g., https://your-site.netlify.app)
   - Ensure all pages load correctly
   - Check for any console errors

2. **Verify API Connection**:
   - Test API endpoints through the frontend
   - Check Network tab in browser DevTools for successful API requests

## Troubleshooting

### Build Failures

1. **Check Build Logs**:
   - Examine the detailed build logs in Netlify dashboard
   - Look for specific error messages

2. **Local Build Test**:
   - Run `npm run build` locally to verify build success
   - Fix any errors that occur

### API Connection Issues

1. **CORS Errors**:
   - Ensure your backend has proper CORS headers
   - Add your Netlify domain to allowed origins in your backend

2. **Redirect Issues**:
   - Check your `_redirects` file syntax
   - Verify that the redirects are being applied (in Netlify's deploy logs)

### Environment Variables

1. **Missing Variables**:
   - Verify all required environment variables are set in Netlify dashboard
   - Check that your code correctly references these variables using `import.meta.env.VITE_*`

## Continuous Deployment

Netlify automatically deploys when you push to your connected repository. To control this:

1. **Branch Deploys**:
   - Configure specific branches for deployment
   - Setup preview deployments for feature branches

2. **Build Hooks**:
   - Create build hooks for triggering deploys via webhook
   - Useful for integrating with external services

## Need Help?

If you encounter issues with your Netlify deployment:
- Check [Netlify's Documentation](https://docs.netlify.com/)
- Visit [Netlify's Support Forums](https://answers.netlify.com/)
- Contact Netlify Support from your dashboard