# Database Setup for Contact Form

The contact form has been updated to save submissions to Supabase, but you need to create the `Client Table` table first.

## 🔧 Environment Setup

Before creating the table, you need to set up your Supabase credentials:

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Get your Supabase credentials:
   - Go to your Supabase project: https://supabase.com/dashboard/project/cyiacmjrqdrbkxnafikp
   - Navigate to **Settings > API**
   - Copy the **Project URL**, **anon key**, and **service role key**

3. Update `.env.local` with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key
   ```

4. **Important Key Differences**:
   - **Anon Key**: Used for client-side operations (public access). Labeled as "Project API Keys" with role "anon" in your dashboard.
   - **Service Role Key**: Used for server-side operations (admin access). Labeled as "Service Role Secret" in your dashboard.

5. Restart your development server:
   ```bash
   pnpm dev
   ```

## 🗄️ Create the Client Table

### Method 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project: https://supabase.com/dashboard/project/cyiacmjrqdrbkxnafikp
2. Navigate to **SQL Editor** in the left sidebar
3. Click **"New query"**
4. Copy and paste this SQL:

```sql
-- Create Client Table for form submissions
CREATE TABLE IF NOT EXISTS "Client Table" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  notify BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_client_email ON "Client Table"(email);
CREATE INDEX IF NOT EXISTS idx_client_created_at ON "Client Table"(created_at DESC);

-- Enable Row Level Security
ALTER TABLE "Client Table" ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contact forms (public submissions)
CREATE POLICY "Anyone can submit contact forms" ON "Client Table"
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read contacts (for admin access)
CREATE POLICY "Authenticated users can read contacts" ON "Client Table"
  FOR SELECT USING (auth.role() = 'authenticated');
```

5. Click **"Run"** to execute the SQL
6. You should see "Success. No rows returned" message

### Method 2: Using Table Editor

1. Go to **Table Editor** in your Supabase dashboard
2. Click **"Create a new table"**
3. Set table name: `Client Table`
4. Add these columns:
   - `id` (uuid, primary key, default: `gen_random_uuid()`)
   - `name` (text, not null)
   - `email` (text, not null) 
   - `message` (text, not null)
   - `notify` (boolean, default: false)
   - `created_at` (timestamptz, default: `now()`)
   - `updated_at` (timestamptz, default: `now()`)

## ✅ Test the Contact Form

1. Go to your website: http://localhost:3001
2. Scroll down to the "Contact Us" section
3. Fill out the form and submit
4. You should see "Thanks! We'll be in touch." message
5. Check your Supabase dashboard under **Table Editor > Client Table** to see the submission

## 🔍 View Submissions

To view all contact form submissions:

1. Go to **Table Editor** in Supabase dashboard
2. Click on **Client Table** table
3. You'll see all submissions with timestamps
4. You can export data, edit entries, or delete spam

## 🛡️ Security Features

- **Row Level Security (RLS)**: Enabled to control data access
- **Public Insert Policy**: Anyone can submit forms (needed for contact forms)
- **Authenticated Read Policy**: Only authenticated users can view submissions
- **Honeypot Protection**: Built-in spam protection in the form

## 🚀 Next Steps

Once the table is created, your contact form will automatically:
- ✅ Save all form submissions to Supabase
- ✅ Show real success/error messages
- ✅ Clear the form after successful submission
- ✅ Handle network errors gracefully
- ✅ Provide spam protection

## 🧪 Testing Database Connection

Visit `/test-db` in your application to verify:
- Database connection
- Table existence
- Insert permissions
- Manual data insertion and viewing

## 🔑 Troubleshooting API Keys

If you're getting "Invalid API key" errors:

1. Double-check that you're using the correct **anon key** (not the service role key) for client-side operations
2. Ensure your anon key is from the "Project API Keys" section with role "anon"
3. Make sure there are no extra spaces or characters in your keys
4. Restart your development server after updating keys
5. Test with the scripts in the `scripts/` directory:
   ```bash
   node scripts/test-anon-key.js
   node scripts/test-service-role-key.js
   ```