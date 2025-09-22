# Nebulux Arena

Something new is almost here.

## Deployment Status

Last deployed: Fixed CSS optimization issues by removing experimental.optimizeCss and critters dependency

## Getting Started

1. Copy `.env.example` to `.env.local`
2. Update the Supabase credentials in `.env.local`
3. Install dependencies: `pnpm install`
4. Run the development server: `pnpm dev`

## Supabase Setup

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Copy your project URL and **anon key** (not service role key) from Settings > API
3. Update `.env.local` with your credentials
4. Create the Client Table using the SQL from `DATABASE_SETUP.md`

## API Key Information

**Important**: There are two different keys in Supabase:
- **Anon Key**: Used for client-side operations (public access) - this is what your website uses
- **Service Role Key**: Used for server-side operations (admin access) - more powerful but should not be exposed

Make sure you're using the **anon key** in your `.env.local` file for `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Testing

- Visit `/test-db` to test database connectivity
- Submit the contact form on the main page to test data insertion
- Use the scripts in the `scripts/` directory to test your keys:
  - `node scripts/test-anon-key.js` - Tests the current anon key
  - `node scripts/test-service-role-key.js` - Tests the service role key
  - `node scripts/test-anon-key-manual.js` - Manual test with instructions