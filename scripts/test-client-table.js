#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Script to test the Client Table in Supabase
const { createClient } = require('@supabase/supabase-js');

// Use environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cyiacmjrqdrbkxnafikp.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5aWFjbWpycWRyYkt4bmFmaWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMjEwMTcsImV4cCI6MjA3Mjc5NzAxN30.dYDmOXt8ltZECBqCLFVEyvAQPTs6iEn1XEsyVSCVWlk';

console.log('🔍 Supabase URL:', supabaseUrl);
console.log('🔍 Supabase Key (first 10 chars):', supabaseKey.substring(0, 10) + '...');

async function testClientTable() {
  console.log('\n🔍 Testing Client Table...');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Test 1: Try to select from Client Table
    console.log('📊 Testing SELECT from Client Table...');
    const { data: selectData, error: selectError } = await supabase
      .from('Client Table')
      .select('*')
      .limit(5);
    
    if (selectError) {
      console.error('❌ SELECT Error:', selectError.message);
      if (selectError.code === '42P01') {
        console.log('🚨 Table "Client Table" does not exist!');
      }
    } else {
      console.log('✅ SELECT Success! Found', selectData?.length || 0, 'records');
      if (selectData && selectData.length > 0) {
        console.log('📋 Sample data:', selectData[0]);
      }
    }
    
    // Test 2: Try to insert a test record (we'll delete it immediately)
    console.log('\n🔬 Testing INSERT to Client Table...');
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message - will be deleted',
      notify: true
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('Client Table')
      .insert(testData)
      .select();
    
    if (insertError) {
      console.error('❌ INSERT Error:', insertError.message);
      console.log('🔍 Error details:', insertError);
    } else {
      console.log('✅ INSERT Success!');
      console.log('📝 Inserted record:', insertData);
      
      // Clean up: delete the test record
      if (insertData && insertData[0] && insertData[0].id) {
        const { error: deleteError } = await supabase
          .from('Client Table')
          .delete()
          .eq('id', insertData[0].id);
        
        if (deleteError) {
          console.log('⚠️  Could not delete test record:', deleteError.message);
        } else {
          console.log('🗑️  Test record cleaned up successfully');
        }
      }
    }
    
  } catch (err) {
    console.error('❌ Script error:', err.message);
  }
  
  console.log('\n📝 If you see errors above, you may need to:');
  console.log('1. Create the "Client Table" table in your Supabase dashboard');
  console.log('2. Check the table name spelling (case-sensitive)');
  console.log('3. Verify RLS policies allow public access');
}

testClientTable();