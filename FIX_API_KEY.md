# Fixing the "Invalid API key" Error

## Problem
The contact form is showing "Invalid API key" errors because the anon key in your `.env.local` file is incorrect.

## Solution Steps

1. **Get the correct anon key from your Supabase dashboard:**
   - Go to: https://app.supabase.com/project/cyiacmjrqdrbkxnafikp/settings/api
   - Find the "Project API Keys" section
   - Copy the key with role "anon" (NOT the service role key)

2. **Update your `.env.local` file:**
   - Replace the current `NEXT_PUBLIC_SUPABASE_ANON_KEY` value with the correct anon key
   - Keep the service role key as is (it's working correctly)

3. **Restart your development server:**
   ```bash
   pnpm dev
   ```

4. **Test the connection:**
   - Visit http://localhost:3001/test-db to verify the connection
   - Try submitting the contact form on the main page

## Verification Scripts

You can use these scripts to test your keys:
- `node scripts/test-anon-key.js` - Tests the current anon key
- `node scripts/test-service-role-key.js` - Tests the service role key
- `node scripts/test-anon-key-manual.js` - Manual test with instructions

## Important Notes

- The anon key is for client-side/public access
- The service role key is for server-side/admin access
- Never expose the service role key in client-side code
- The anon key should have RLS policies to control access