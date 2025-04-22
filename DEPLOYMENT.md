# M-Kite Kitchen: Netlify Deployment Guide

This guide will walk you through deploying both the frontend and backend of your M-Kite Kitchen application on Netlify, using Netlify Functions for the backend API.

## Prerequisites

1. A GitHub, GitLab, or Bitbucket account to host your repository
2. A Netlify account (sign up at [netlify.com](https://netlify.com))
3. A PostgreSQL database (from services like [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Render](https://render.com))

## Setup Overview

Your application is already configured for Netlify deployment with:

- Frontend: React/Vite in the `client` directory
- Backend API: Netlify Functions in the `netlify/functions` directory
- Database: PostgreSQL (requires external hosting)

## Step 1: Set Up Your PostgreSQL Database

1. Sign up for a PostgreSQL database service like Neon, Supabase, or Render
2. Create a new PostgreSQL database
3. Get your connection string, which will look like:
   ```
   postgresql://username:password@hostname:port/database
   ```
4. Keep this connection string secure - you'll need it for Netlify environment variables

## Step 2: Prepare Your Repository

1. Make sure your code is in a Git repository
2. Push your repository to GitHub, GitLab, or Bitbucket
3. Ensure all changes are committed and pushed

## Step 3: Deploy to Netlify

### Deployment Option 1: Netlify Dashboard (Recommended)

1. Log in to [Netlify](https://app.netlify.com/)
2. Click "Add new site" > "Import an existing project"
3. Connect to your Git provider (GitHub, GitLab, or Bitbucket)
4. Select your repository

5. Configure build settings:
   - Build command: `node netlify-build.js`
   - Publish directory: `dist/public`

6. Environment variables - Click "Advanced" and add:
   - `DATABASE_URL`: Your PostgreSQL connection string

7. Click "Deploy site"

### Deployment Option 2: Netlify CLI

If you prefer using the command line:

1. Install Netlify CLI:
   ```bash
   npm install netlify-cli -g
   ```

2. Log in to Netlify:
   ```bash
   netlify login
   ```

3. Initialize your site:
   ```bash
   netlify init
   ```
   - Select "Create & configure a new site"

4. Set environment variables:
   ```bash
   netlify env:set DATABASE_URL your-database-connection-string
   ```

5. Deploy your site:
   ```bash
   netlify deploy --build
   ```

## Step 4: Test Your Deployment

After deployment is complete:

1. Visit your Netlify site URL (e.g., `https://your-site-name.netlify.app`)
2. Test the contact form submission
3. Test the newsletter subscription

If everything works correctly, your frontend and backend are successfully deployed on Netlify!

## Troubleshooting

### Database Connection Issues

If your Netlify Functions can't connect to the database:

1. Check that your `DATABASE_URL` environment variable is set correctly
2. Ensure your database allows connections from Netlify's IP addresses
3. Check your database provider's security settings (some require whitelisting IPs)
4. Enable SSL if your database provider requires it, by setting `ssl: { rejectUnauthorized: false }` in the Netlify function

### API Endpoint Issues

If your API endpoints return 404 errors:

1. Check the Netlify Functions logs in your Netlify dashboard
2. Verify the API paths match what your frontend is expecting (`/api/contact`, `/api/subscribe`, etc.)
3. Ensure the `netlify.toml` file has the correct redirects configuration

## Monitoring and Maintenance

### Logs and Debugging

1. Access function logs in the Netlify dashboard:
   - Go to your site > Functions > Select the function > View logs

### Updating Your Site

To update your site after making changes:

1. Commit and push changes to your repository
2. Netlify will automatically rebuild and deploy your site

## Additional Resources

- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)