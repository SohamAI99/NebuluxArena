# Database Setup for Contact Form

The contact form has been updated to save submissions to Supabase, but you need to create the `contacts` table first.

## 🗄️ Create the Contacts Table

### Method 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project: https://supabase.com/dashboard/project/cyiacmjrqdrbkxnafikp
2. Navigate to **SQL Editor** in the left sidebar
3. Click **"New query"**
4. Copy and paste this SQL:

```sql
-- Create contacts table for form submissions
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  notify BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contact forms (public submissions)
CREATE POLICY "Anyone can submit contact forms" ON contacts
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read contacts (for admin access)
CREATE POLICY "Authenticated users can read contacts" ON contacts
  FOR SELECT USING (auth.role() = 'authenticated');
```

5. Click **"Run"** to execute the SQL
6. You should see "Success. No rows returned" message

### Method 2: Using Table Editor

1. Go to **Table Editor** in your Supabase dashboard
2. Click **"Create a new table"**
3. Set table name: `contacts`
4. Add these columns:
   - `id` (uuid, primary key, default: `gen_random_uuid()`)
   - `name` (text, not null)
   - `email` (text, not null) 
   - `message` (text, not null)
   - `notify` (boolean, default: false)
   - `created_at` (timestamptz, default: `now()`)
   - `updated_at` (timestamptz, default: `now()`)

## ✅ Test the Contact Form

1. Go to your website: http://localhost:3002
2. Scroll down to the "Contact Us" section
3. Fill out the form and submit
4. You should see "Thanks! We'll be in touch." message
5. Check your Supabase dashboard under **Table Editor > contacts** to see the submission

## 🔍 View Submissions

To view all contact form submissions:

1. Go to **Table Editor** in Supabase dashboard
2. Click on **contacts** table
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