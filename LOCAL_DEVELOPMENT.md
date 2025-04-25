# M-Kite Kitchen Local Development Guide

This guide will help you run the M-Kite Kitchen website locally without port issues.

## Prerequisites

- Node.js (v16+)
- npm or yarn
- PostgreSQL database (local or remote)

## Setup Steps

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <repo-folder>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Database connection string
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Server port (can be any available port)
PORT=3000
```

### 4. Set Up the Database

You have two options:

**Option A: Use a local PostgreSQL database**
1. Create a new PostgreSQL database on your local machine
2. Update the DATABASE_URL in `.env.local` with your local database connection string
3. Run the schema migration: `npm run db:push`

**Option B: Use a remote PostgreSQL database (e.g., Neon)**
1. Create a database on a service like [Neon](https://neon.tech/), [Supabase](https://supabase.com/), or [Render](https://render.com/)
2. Update the DATABASE_URL in `.env.local` with the remote database connection string
3. Run the schema migration: `npm run db:push`

### 5. Start the Development Server

```bash
npm run dev
```

This will start the server on the port you specified in the `.env.local` file (e.g., 3000).

## Accessing the Application

- Frontend: http://localhost:3000 (or whatever port you specified)
- API: http://localhost:3000/api/* (same port as frontend)

## Common Issues and Solutions

### Port Already in Use

If you see an error like "Port XXXX is already in use", try:

1. Change the PORT value in your `.env.local` file to a different port
2. Kill the process using the port:
   ```bash
   # On Linux/Mac
   sudo kill -9 $(lsof -t -i:3000)
   
   # On Windows (using PowerShell)
   Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
   ```

### Database Connection Issues

If you have trouble connecting to the database:

1. Verify your DATABASE_URL is correct
2. Ensure PostgreSQL is running
3. Check firewall settings if using a remote database
4. Try connecting with a PostgreSQL client (like pgAdmin or psql) to verify credentials

### Hot Reloading Not Working

If changes to your code aren't reflected automatically:

1. Restart the development server
2. Clear your browser cache
3. Check for errors in the terminal

## Importing Data

If you have existing data in a production database that you want to import to your local database:

1. Export the data using the export script:
   ```bash
   # Update the DATABASE_URL to point to the source database
   node scripts/export-database.js
   ```

2. Import the data to your local database:
   ```bash
   # Update the DATABASE_URL to point to your local database
   node scripts/import-database.js
   ```

## Debugging

For more detailed logging:

1. Set the NODE_ENV environment variable:
   ```
   NODE_ENV=development
   ```

2. Check the terminal output for errors and information
3. Use browser developer tools to debug frontend issues