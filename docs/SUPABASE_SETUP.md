# Supabase Database Setup

This document explains how to set up the database tables in Supabase for the M-Kite Kitchen application.

## Option 1: Using the SQL Editor in Supabase Dashboard

1. Log in to your Supabase account and select your project
2. Go to the "SQL Editor" section
3. Create a new query
4. Copy the contents of `scripts/create-tables.sql` file into the editor
5. Click "Run" to execute the SQL statements
6. Verify the tables were created by going to the "Table Editor" section

## Option 2: Using the Helper Script (Requires Service Role Key)

> Note: This method requires a service role key with permissions to execute raw SQL statements

1. Make sure you have Supabase credentials (URL and anon key) in your environment variables.
   You can set them in `.env.local` file:

   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_key
   ```

2. Create a function in Supabase that allows executing SQL:
   - Go to the SQL Editor in Supabase dashboard
   - Execute this SQL:

   ```sql
   CREATE OR REPLACE FUNCTION exec_sql(query text)
   RETURNS void
   LANGUAGE plpgsql
   SECURITY DEFINER
   AS $$
   BEGIN
     EXECUTE query;
   END;
   $$;
   ```

3. Run the helper script:

   ```
   node scripts/execute-sql-in-supabase.js
   ```

## Tables Schema

The application requires the following tables:

### Users Table

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);
```

### Contact Submissions Table

```sql
CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  kitchen_size TEXT,
  message TEXT,
  budget TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Newsletter Subscriptions Table

```sql
CREATE TABLE IF NOT EXISTS newsletters (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Troubleshooting

- If you encounter permission issues, make sure your Supabase user has the necessary privileges.
- For the helper script, you may need to use a service role key instead of the anon key.
- If tables aren't created properly, check the Supabase logs for details.
- The application includes a fallback to in-memory storage if the Supabase tables don't exist, so it will still work for development purposes.