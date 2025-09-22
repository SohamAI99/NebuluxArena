#!/usr/bin/env node

// Script to verify that we can insert and retrieve data from the Client table
const { createClient } = require('@supabase/supabase-js');

// Use environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cyiacmjrqdrbkxnafikp.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5aWFjbWpycWRyYkt4bmFmaWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMjEwMTcsImV4cCI6MjA3Mjc5NzAxN30.dYDmOXt8ltZECBqCLFVEyvAQPTs6iEn1XEsyVSCVWlk';

console.log('🔍 Supabase URL:', supabaseUrl);
console.log('🔍 Supabase Key (first 10 chars):', supabaseKey.substring(0, 10) + '...');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log('⚠️  Warning: Environment variables not set. Using default values which may not work.');
  console.log('📝 Please create a .env.local file with your Supabase credentials.');
}

async function verifyContacts() {
  console.log('\n🔍 Verifying Client table insertion and retrieval...');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Test data
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    message: 'Test message from verification script',
    notify: true
  };
  
  try {
    console.log('\n📝 Inserting test record...');
    
    // Insert a test record
    const { data: insertData, error: insertError } = await supabase
      .from('Client')
      .insert(testData)
      .select();
    
    if (insertError) {
      console.error('❌ Insert Error:', insertError.message);
      console.error('🔍 Error details:', insertError);
      
      if (insertError.code === '42501') {
        console.log('🔐 This might be a permissions issue. Check your Row Level Security policies.');
      }
      
      return;
    }
    
    console.log('✅ Insert Success!');
    console.log('📄 Inserted record ID:', insertData[0]?.id);
    
    // Retrieve the inserted record
    console.log('\n🔍 Retrieving inserted record...');
    const { data: selectData, error: selectError } = await supabase
      .from('Client')
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
      .from('Client')
      .delete()
      .eq('id', insertData[0].id);
    
    if (deleteError) {
      console.log('⚠️ Could not delete test record:', deleteError.message);
    } else {
      console.log('✅ Test record cleaned up successfully');
    }
    
    console.log('\n🎉 All tests passed! The Client table is working correctly.');
    
  } catch (err) {
    console.error('❌ Script error:', err.message);
  }
}

verifyContacts();