#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Script to test form submission
const { createClient } = require('@supabase/supabase-js');

// Use environment variables - same as the web app
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cyiacmjrqdrbkxnafikp.supabase.co';
// Use the same key that the web app is using
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5aWFjbWpycWRyYkt4bmFmaWtwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzIyMTAxNywiZXhwIjoyMDcyNzk3MDE3fQ.g4E0V9mkVZzI-oA4SntKKQs7g8Tnj5uJ0BEtjsdAGzg';

console.log('🔍 Supabase URL:', supabaseUrl);
console.log('🔍 Supabase Key (first 10 chars):', supabaseKey.substring(0, 10) + '...');

async function testFormSubmission() {
  console.log('\n🔍 Testing form submission to Client Table...');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Test data - same as the web form
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    message: 'Test message from form submission test',
    notify: true
  };
  
  try {
    console.log('\n📝 Inserting test record...');
    
    // Insert a test record - same as the web form
    const { data: insertData, error: insertError } = await supabase
      .from('Client Table')
      .insert(testData)
      .select();
    
    if (insertError) {
      console.error('❌ Insert Error:', insertError.message);
      console.error('🔍 Error details:', insertError);
      return;
    }
    
    console.log('✅ Insert Success!');
    console.log('📄 Inserted record ID:', insertData[0]?.id);
    
    // Retrieve the inserted record
    console.log('\n🔍 Retrieving inserted record...');
    const { data: selectData, error: selectError } = await supabase
      .from('Client Table')
      .select('*')
      .eq('id', insertData[0].id)
      .single();
    
    if (selectError) {
      console.error('❌ Select Error:', selectError.message);
      return;
    }
    
    console.log('✅ Select Success!');
    console.log('📄 Retrieved record:', {
      id: selectData.id,
      name: selectData.name,
      email: selectData.email,
      message: selectData.message,
      notify: selectData.notify,
      created_at: selectData.created_at
    });
    
    // Clean up: delete the test record
    console.log('\n🗑️ Cleaning up test record...');
    const { error: deleteError } = await supabase
      .from('Client Table')
      .delete()
      .eq('id', insertData[0].id);
    
    if (deleteError) {
      console.log('⚠️ Could not delete test record:', deleteError.message);
    } else {
      console.log('✅ Test record cleaned up successfully');
    }
    
    console.log('\n🎉 All tests passed! Form submission should work correctly.');
    
  } catch (err) {
    console.error('❌ Script error:', err.message);
  }
}

testFormSubmission();