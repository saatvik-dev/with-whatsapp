# Supabase Database Setup

To ensure the application works properly in the Netlify deployment, you need to create the database tables in Supabase. This guide provides instructions for setting up the required tables.

## Required Tables

The application needs the following tables in Supabase:

1. `users` - For user authentication
2. `contact_submissions` - For storing contact form submissions
3. `newsletters` - For storing newsletter subscriptions

## Option 1: Manual Setup via Supabase Dashboard

1. Log in to your [Supabase Dashboard](https://app.supabase.com/)
2. Navigate to your project
3. Go to the "SQL Editor" section
4. Create a "New Query"
5. Copy and paste the following SQL:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  kitchen_size TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create newsletters table
CREATE TABLE IF NOT EXISTS newsletters (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

6. Click "Run" to execute the query and create the tables

## Option 2: Automatic Setup via API

The application is configured to automatically create the necessary tables in Supabase when it's deployed to Netlify. The tables will be created on the first API request if they don't already exist.

To verify the tables were created:

1. Deploy your application to Netlify
2. Make sure you've set the Supabase environment variables in Netlify:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
3. After deployment, visit your site and submit the contact form
4. Check your Supabase dashboard to confirm the tables were created

## Checking Table Structure

To verify the correct table structure:

1. Go to the "Table Editor" in your Supabase dashboard
2. Check that all three tables (`users`, `contact_submissions`, and `newsletters`) exist
3. Verify that each table has the correct columns as defined in the SQL above

If you encounter any issues with the Netlify deployment, make sure your Supabase credentials are correctly set in the Netlify environment variables settings.