# M-Kite Kitchen Website

A modern, responsive web application for M-Kite Kitchen that provides an immersive digital experience for exploring and customizing aluminum modular kitchen products. The website highlights M-Kite's 25+ years of experience in developing innovative, sustainable aluminum kitchens that outperform traditional wood and MDF options.

## Features

- **Modern Design**: Clean, responsive layout optimized for all devices
- **Interactive Sections**: Hero, Features, Benefits, Gallery, Comparison, Testimonials, and more
- **Contact Form**: User-friendly form for customer inquiries, with data stored in a PostgreSQL database
- **Newsletter Subscription**: Email collection for marketing purposes
- **Admin Dashboard**: Backend access to view submitted contact forms and newsletter subscriptions

## Tech Stack

- **Frontend**: React with TypeScript, TailwindCSS, shadcn/ui components
- **Backend**: Express.js server with REST API endpoints
- **Database**: Supabase & PostgreSQL (with fallback to in-memory storage when unavailable)
- **State Management**: React Query for server state, React Hook Form for forms
- **Deployment**: Configured for deployment on Netlify

## Getting Started

### Prerequisites

- Node.js (v18+)
- Supabase account (recommended for production) or direct PostgreSQL database
- Application will use in-memory fallback storage when no database connection is available

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   - Create a `.env.local` file with the following variables:
     ```
     # For direct PostgreSQL connection
     DATABASE_URL=postgres://username:password@localhost:5432/dbname
     
     # For Supabase connection
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```
4. Start the development server:
   ```
   npm run dev
   ```

## Database Setup

The application supports three storage options:

1. **Supabase** (recommended for production): Set the Supabase environment variables 
2. **Direct PostgreSQL** (alternative): Set the `DATABASE_URL` environment variable
3. **In-memory Storage** (for development): Used automatically as fallback when database tables don't exist

For Supabase setup:
1. Create a Supabase project
2. Set up tables using the SQL in `scripts/create-tables.sql`
3. See [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) for detailed instructions

For direct PostgreSQL:
```
npm run db:push
```

## API Endpoints

- `POST /api/contact` - Submit contact form
- `POST /api/subscribe` - Subscribe to newsletter
- `GET /api/admin/contacts` - Get all contact form submissions
- `GET /api/admin/newsletters` - Get all newsletter subscriptions

## Deployment 

This project is configured for deployment on Netlify:

- **Netlify**: Full-stack deployment using Netlify Functions for the backend API
  - See [NETLIFY_DEPLOYMENT_GUIDE.md](NETLIFY_DEPLOYMENT_GUIDE.md) for detailed instructions

The deployment includes:
- Static hosting for the React frontend
- Serverless Functions for the backend API
- Integration with Supabase for database storage
- Fallback mechanism for database connectivity issues

When deploying to Netlify, you need to set the following environment variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Data Migration

For migrating data between environments, use the provided scripts:

- Export data: `node scripts/export-database.js`
- Import data: `node scripts/import-database.js`

## License

This project is proprietary and confidential.

## About M-Kite Kitchen

M-Kite Kitchen has been revolutionizing modular kitchens with aluminum innovation for over 25 years. The company specializes in creating kitchens that last a lifetime—ones that are waterproof, termite-proof, and maintenance-free. Their premium aluminum modular kitchen cabinets eliminate all traditional kitchen drawbacks while offering unmatched strength, durability, and elegance.