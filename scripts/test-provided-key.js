const { createClient } = require('@supabase/supabase-js');

// Test the provided anon key
const supabaseUrl = 'https://cyiacmjrqdrbkxnafikp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5aWFjbWpycWRyYmt4bmFmaWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMjEwMTcsImV4cCI6MjA3Mjc5NzAxN30.dYDmOXt8ltZECBqCLFVEyvAQPTs6iEn1XEsyVSCVWlk';

console.log('Testing the provided anon key...');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key (first 10 chars):', supabaseAnonKey.substring(0, 10) + '...');

// Validate the key format (JWT tokens have 3 parts separated by dots)
const keyParts = supabaseAnonKey.split('.');
console.log('Key parts:', keyParts.length);

if (keyParts.length !== 3) {
  console.log('❌ Invalid key format - JWT should have 3 parts');
  process.exit(1);
}

console.log('✅ Key format is valid (JWT with 3 parts)');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('\n--- Testing connection ---');
    // Test with a simple query that should work if the key is valid
    const { data, error } = await supabase
      .from('Client Table')
      .select('id')
      .limit(1);

    if (error) {
      console.log('❌ Error accessing Supabase:', error.message);
      if (error.message.includes('Invalid API key')) {
        console.log('❌ The provided key is not valid');
      }
    } else {
      console.log('✅ Connected to Supabase successfully!');
      console.log('Query successful');
    }
  } catch (err) {
    console.log('❌ Unexpected error:', err.message);
  }
  
  try {
    // Test 2: Try to insert a test record
    console.log('\n--- Testing insert ---');
    const testRecord = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message from provided key test script',
      notify: false
    };
    
    const { error: insertError } = await supabase
      .from('Client Table')
      .insert(testRecord);
      
    if (insertError) {
      console.log('❌ Insert failed:', insertError.message);
      if (insertError.message.includes('Invalid API key')) {
        console.log('❌ The provided key is not valid for insert operations');
      }
    } else {
      console.log('✅ Record inserted successfully!');
    }
  } catch (err) {
    console.log('❌ Unexpected error during insert:', err.message);
  }
}

testConnection();