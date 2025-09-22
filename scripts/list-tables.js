#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Script to check if Client Table exists
const { createClient } = require('@supabase/supabase-js');

// Use environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cyiacmjrqdrbkxnafikp.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5aWFjbWpycWRyYkt4bmFmaWtwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzIyMTAxNywiZXhwIjoyMDcyNzk3MDE3fQ.g4E0V9mkVZzI-oA4SntKKQs7g8Tnj5uJ0BEtjsdAGzg';

console.log('🔍 Supabase URL:', supabaseUrl);
console.log('🔍 Using Service Role Key:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkClientTable() {
  console.log('\n🔍 Checking if Client Table exists...');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Try to select from Client Table
    const { data, error } = await supabase
      .from('Client Table')
      .select('*', { count: 'exact' })
      .limit(1);
    
    if (error) {
      console.error('❌ Error accessing Client Table:', error.message);
      if (error.code === '42P01') {
        console.log('🚨 Table "Client Table" does not exist!');
      } else {
        console.log('🔍 Error code:', error.code);
        console.log('🔍 Error details:', error);
      }
    } else {
      console.log('✅ Client Table exists and is accessible!');
      console.log('📊 Found', data?.length || 0, 'records');
    }
  } catch (err) {
    console.error('❌ Script error:', err.message);
  }
}

checkClientTable();