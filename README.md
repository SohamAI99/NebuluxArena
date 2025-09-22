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
2. Copy your project URL and anon key from Settings > API
3. Update `.env.local` with your credentials
4. Create the Client table using the SQL from `DATABASE_SETUP.md`

## Testing

- Visit `/test-db` to test database connectivity
- Submit the contact form on the main page to test data insertion