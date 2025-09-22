#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Script to test form submission with anon key
const { createClient } = require('@supabase/supabase-js');

// Use the anon key for client-side operations
const supabaseUrl = 'https://cyiacmjrqdrbkxnafikp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5aWFjbWpycWRyYkt4bmFmaWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMjEwMTcsImV4cCI6MjA3Mjc5NzAxN30.dYDmOXt8ltZECBqCLFVEyvAQPTs6iEn1XEsyVSCVWlk';

console.log('Testing Supabase connection with anon key...');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key (first 10 chars):', supabaseAnonKey.substring(0, 10) + '...');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    // Test 1: Check if we can connect to Supabase
    console.log('\n--- Testing connection ---');
    const { data, error } = await supabase
      .from('Client Table')
      .select('count(*)')
      .limit(1);

    if (error) {
      console.log('❌ Error accessing Supabase:', error);
      if (error.code === '42P01') {
        console.log('Table does not exist');
      }
    } else {
      console.log('✅ Connected to Supabase successfully!');
      console.log('Data:', data);
    }
  } catch (err) {
    console.log('❌ Unexpected error:', err);
  }
  
  try {
    // Test 2: Try to insert a test record
    console.log('\n--- Testing insert ---');
    const testRecord = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message from anon key test script',
      notify: false
    };
    
    const { error: insertError } = await supabase
      .from('Client Table')
      .insert(testRecord);
      
    if (insertError) {
      console.log('❌ Insert failed:', insertError);
    } else {
      console.log('✅ Record inserted successfully!');
    }
  } catch (err) {
    console.log('❌ Unexpected error during insert:', err);
  }
}

testConnection();