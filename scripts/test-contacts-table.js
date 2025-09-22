#!/usr/bin/env node

// Script to test if the contacts table exists in Supabase
const { createClient } = require('@supabase/supabase-js');

// Use environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cyiacmjrqdrbkxnafikp.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5aWFjbWpycWRyYkt4bmFmaWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMjEwMTcsImV4cCI6MjA3Mjc5NzAxN30.dYDmOXt8ltZECBqCLFVEyvAQPTs6iEn1XEsyVSCVWlk';

async function testTable() {
  console.log('🔍 Testing if contacts table exists...');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Try to select from the contacts table
    const { data, error } = await supabase
      .from('contacts')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      console.error('❌ Error accessing contacts table:', error.message);
      if (error.code === '42P01') {
        console.log('🚨 Table "contacts" does not exist!');
        console.log('💡 Please create it using the SQL from DATABASE_SETUP.md');
      }
    } else {
      console.log('✅ Contacts table exists and is accessible!');
      console.log('📊 Found', data?.length || 0, 'records');
    }
  } catch (err) {
    console.error('❌ Script error:', err.message);
  }
}

testTable();