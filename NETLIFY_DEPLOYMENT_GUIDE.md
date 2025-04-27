# Netlify Deployment Guide for M-Kite Kitchen

This guide provides step-by-step instructions for deploying the M-Kite Kitchen website to Netlify with proper database configuration.

## Prerequisites

1. A Netlify account
2. A PostgreSQL database (either through Heroku, Neon, Railway, or similar services)

## Environment Variables

The following environment variables must be set in your Netlify deployment settings:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Your PostgreSQL connection string with SSL enabled |
| `NODE_VERSION` | Set to `20` for compatibility |

### Optional Environment Variables

If you want to use Supabase instead of direct PostgreSQL connection:

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL (e.g., https://your-project-id.supabase.co) |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous/public API key |

## Deployment Steps

1. **Connect your repository to Netlify**
   - Sign in to Netlify
   - Click "New site from Git"
   - Select your Git provider and repository
   - Configure build settings:
     - Build command: `node netlify-build.js`
     - Publish directory: `dist/public`

2. **Set environment variables**
   - Go to Site settings > Environment variables
   - Add all required environment variables mentioned above

3. **Configure database**
   - Ensure your PostgreSQL database is accessible from Netlify
   - If using Heroku or similar services, make sure SSL is enabled

4. **Deploy the site**
   - Trigger a new deployment from the Netlify dashboard
   - The first deployment will automatically create the necessary database tables

## Database Migration

The application will automatically create the required database tables on first deployment. If you need to manually create the tables, you can use the following SQL:

```sql
CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  kitchen_size TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS newsletters (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

## Troubleshooting

### Contact Form Not Working

If the contact form submissions are failing:

1. **Check database connection**
   - Verify the `DATABASE_URL` environment variable is correct
   - Ensure the database is accessible from Netlify (check firewall rules)
   - Test the connection by visiting `/api/db-health` endpoint

2. **Check Netlify Function logs**
   - Go to Netlify dashboard > Functions
   - View the logs for the `postgres-api` function
   - Look for any connection errors or SQL errors

3. **SSL Issues**
   - Make sure your database connection string includes SSL parameters
   - For Heroku/Neon: Add `?sslmode=require` to your connection string

### Database Tables Not Created

If the tables aren't being created automatically:

1. Run the SQL commands manually using your database client
2. Check the Netlify function logs for errors during table creation

## Support

If you encounter any issues with the deployment, please reach out to the development team for assistance.