#!/usr/bin/env node

// Script to create the contacts table in Supabase
const { createClient } = require('@supabase/supabase-js');

// Use environment variables or fallback to hardcoded values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cyiacmjrqdrbkxnafikp.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5aWFjbWpycWRyYmt4bmFmaWtwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzIyMTAxNywiZXhwIjoyMDcyNzk3MDE3fQ.IoU38QrbD8zLW2oVrpA3jJkZZfTz8N7bX4nIh5b5J5Y';

const sql = `
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

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert contact forms
CREATE POLICY "Anyone can submit contact forms" ON contacts
  FOR INSERT WITH CHECK (true);

-- Create a policy that allows reading for authenticated users only (optional)
CREATE POLICY "Authenticated users can read contacts" ON contacts
  FOR SELECT USING (auth.role() = 'authenticated');
`;

async function createTable() {
  console.log('🔧 Creating contacts table in Supabase...');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Try direct table creation first
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error('❌ Error creating table:', error);
      // Try alternative method using direct query
      console.log('🔄 Trying alternative method...');
      
      const { data: testData, error: testError } = await supabase
        .from('contacts')
        .select('count(*)')
        .limit(1);
        
      if (testError && testError.code === '42P01') {
        console.log('⚠️  Table does not exist. Please create it manually in Supabase dashboard.');
        console.log('📝 SQL to run:');
        console.log(sql);
      } else {
        console.log('✅ Table might already exist or was created successfully!');
      }
    } else {
      console.log('✅ Contacts table created successfully!');
    }
  } catch (err) {
    console.error('❌ Script error:', err.message);
    console.log('📝 Please create the table manually using this SQL:');
    console.log(sql);
  }
}

createTable();