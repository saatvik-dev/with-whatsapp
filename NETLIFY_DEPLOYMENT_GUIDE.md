# M-Kite Kitchen Netlify Deployment Guide

This guide will help you deploy your M-Kite Kitchen application to Netlify. Both the frontend and backend will be hosted on Netlify using the serverless functions approach.

## Architecture Overview

- **Frontend**: React (Vite) - hosted on Netlify
- **Backend API**: Netlify Functions - serverless functions hosted on Netlify
- **Database**: PostgreSQL (external provider required)

## Prerequisites

1. A Netlify account (sign up at [netlify.com](https://netlify.com))
2. A PostgreSQL database (from providers like Neon, Supabase, or Render)
3. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Setting Up Your Database

Before deploying to Netlify, you need a PostgreSQL database:

1. Sign up for a database service like [Neon](https://neon.tech/) (recommended), [Supabase](https://supabase.com/), or [Render](https://render.com/)
2. Create a new PostgreSQL database
3. Get your connection string, which should look like:
   ```
   postgresql://username:password@hostname:port/database
   ```
4. Make sure your database provider allows connections from Netlify's IP addresses
5. Keep this connection string secure - you'll need it for Netlify environment variables

## Deploying to Netlify

### Option 1: Deploy via Netlify UI (Recommended)

1. **Push your code to a Git repository**
   - Make sure your repository is public or Netlify has access to it

2. **Log in to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com/)
   - Sign in with your account

3. **Create a new site**
   - Click "Add new site" and select "Import an existing project"
   - Connect to your Git provider
   - Select your repository

4. **Configure build settings**
   - Build command: `node netlify-build.js`
   - Publish directory: `dist/public`

5. **Set environment variables**
   - Click "Site settings" > "Environment variables"
   - Add the following variables:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - Any other API keys or secrets your application needs

6. **Deploy your site**
   - Click "Deploy site"
   - Wait for the build to complete

7. **Check your deployment**
   - Once deployed, Netlify will provide a URL to access your site
   - Test both the frontend and API endpoints

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

4. **Set Environment Variables**:
   ```bash
   netlify env:set DATABASE_URL your-database-connection-string
   ```
   - Add any other environment variables your application needs

5. **Deploy Your Site**:
   ```bash
   netlify deploy --build
   ```

## Troubleshooting

### Database Connection Issues

If your API functions can't connect to the database:

1. Verify the `DATABASE_URL` environment variable is set correctly in Netlify
2. Ensure your database provider allows connections from Netlify's IP addresses
3. Check if your database requires SSL connections
4. Look at Netlify Function logs in the Netlify dashboard

### API Not Working

If your API endpoints return 404 errors:

1. Ensure the path matches what your frontend is expecting
2. Check Netlify redirects are configured correctly in both netlify.toml and the generated _redirects file
3. Verify Netlify Functions are deployed correctly

If you encounter the "API endpoint not found" error when submitting forms:

1. Check the Netlify Function logs in the Netlify dashboard (Functions tab) to see the exact path being requested
2. Make sure the environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are set correctly
3. Try deploying again after making changes to the redirects rules
4. For manual testing, try calling your API endpoints directly via curl or Postman to see the raw response:
   ```
   curl -X POST https://your-netlify-site.netlify.app/.netlify/functions/api/subscribe -H "Content-Type: application/json" -d '{"email":"test@example.com"}'
   ```

### Frontend Not Finding API

If your frontend can't connect to your API:

1. Make sure API calls are directed to `/api/*` and not directly to Netlify Functions
2. Verify that your frontend is using relative URLs for API calls
3. Check browser console for CORS errors

## Maintenance and Updates

### Updating Your Site

To update your site after making changes:

1. Push changes to your Git repository
2. Netlify will automatically rebuild and deploy (if you set up continuous deployment)

### Monitoring

1. Use Netlify's built-in analytics to monitor site performance
2. Check function logs in the Netlify dashboard under "Functions"

## Additional Resources

- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Netlify Environment Variables](https://docs.netlify.com/configure-builds/environment-variables/)
- [Netlify Redirects](https://docs.netlify.com/routing/redirects/)