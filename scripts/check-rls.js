#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Script to check RLS policies
const { createClient } = require('@supabase/supabase-js');

// Use the service role key to check policies
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cyiacmjrqdrbkxnafikp.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5aWFjbWpycWRyYmt4bmFmaWtwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzIyMTAxNywiZXhwIjoyMDcyNzk3MDE3fQ.g4E0V9mkVZzI-oA4SntKKQs7g8Tnj5uJ0BEtjsdAGzg';

console.log('🔍 Supabase URL:', supabaseUrl);

async function checkRLS() {
  console.log('\n🔍 Checking RLS policies for Client Table...');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Try to get table info
    const { data, error } = await supabase
      .from('Client Table')
      .select('*', { count: 'exact' })
      .limit(5);
    
    if (error) {
      console.error('❌ Error accessing Client Table:', error.message);
      console.error('🔍 Error details:', error);
    } else {
      console.log('✅ Successfully accessed Client Table with service role key');
      console.log('📊 Found', data?.length || 0, 'records');
      
      if (data && data.length > 0) {
        console.log('📋 Sample record:', data[0]);
      }
    }
  } catch (err) {
    console.error('❌ Script error:', err.message);
  }
}

checkRLS();