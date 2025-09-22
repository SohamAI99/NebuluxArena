#!/usr/bin/env node

// Script to test the Client table in Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cyiacmjrqdrbkxnafikp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5aWFjbWpycWRyYkt4bmFmaWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMjEwMTcsImV4cCI6MjA3Mjc5NzAxN30.dYDmOXt8ltZECBqCLFVEyvAQPTs6iEn1XEsyVSCVWlk';

async function testClientTable() {
  console.log('🔍 Testing Client table...');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Test 1: Try to select from Client table
    console.log('📊 Testing SELECT from Client table...');
    const { data: selectData, error: selectError } = await supabase
      .from('Client')
      .select('*')
      .limit(5);
    
    if (selectError) {
      console.error('❌ SELECT Error:', selectError.message);
      if (selectError.code === '42P01') {
        console.log('🚨 Table "Client" does not exist!');
      }
    } else {
      console.log('✅ SELECT Success! Found', selectData?.length || 0, 'records');
      if (selectData && selectData.length > 0) {
        console.log('📋 Sample data:', selectData[0]);
      }
    }
    
    // Test 2: Try to insert a test record (we'll delete it immediately)
    console.log('\n🔬 Testing INSERT to Client table...');
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message - will be deleted',
      notify: true
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('Client')
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
          .from('Client')
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
  console.log('1. Create the "Client" table in your Supabase dashboard');
  console.log('2. Check the table name spelling (case-sensitive)');
  console.log('3. Verify RLS policies allow public access');
}

testClientTable();