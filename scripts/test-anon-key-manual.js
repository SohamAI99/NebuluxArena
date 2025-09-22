// Helper script to test your Supabase anon key
// Replace 'YOUR_ACTUAL_ANON_KEY_HERE' with the anon key from your Supabase dashboard

const { createClient } = require('@supabase/supabase-js');

// Configuration - Update these with your actual values
const SUPABASE_URL = 'https://cyiacmjrqdrbkxnafikp.supabase.co';
const ANON_KEY = 'YOUR_ACTUAL_ANON_KEY_HERE'; // ← Replace this with your actual anon key

console.log('Testing Supabase Anon Key');
console.log('========================');
console.log('Project URL:', SUPABASE_URL);
console.log('Anon Key (first 10 chars):', ANON_KEY.substring(0, 10) + '...');

if (ANON_KEY === 'YOUR_ACTUAL_ANON_KEY_HERE') {
  console.log('\n❌ ERROR: You need to replace YOUR_ACTUAL_ANON_KEY_HERE with your actual anon key');
  console.log('\nTo get your anon key:');
  console.log('1. Go to https://app.supabase.com/project/cyiacmjrqdrbkxnafikp/settings/api');
  console.log('2. Find the "Project API Keys" section');
  console.log('3. Copy the key with role "anon"');
  console.log('4. Replace YOUR_ACTUAL_ANON_KEY_HERE with that key in this file');
  console.log('5. Run this script again: node scripts/test-anon-key-manual.js');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, ANON_KEY);

async function testAnonKey() {
  console.log('\n--- Testing Anon Key ---');
  
  try {
    // Simple test to verify the key works
    const { data, error } = await supabase
      .from('Client Table')
      .select('count(*)')
      .limit(1);

    if (error) {
      console.log('❌ Error:', error.message);
      if (error.message.includes('Invalid API key')) {
        console.log('\n🔑 The key you provided is not valid. Please double-check:');
        console.log('1. You\'re using the "anon" key, not the "service_role" key');
        console.log('2. The key is copied correctly without extra spaces');
        console.log('3. The key is from the correct project');
      }
    } else {
      console.log('✅ Anon key is valid!');
      console.log('Connection successful');
    }
  } catch (err) {
    console.log('❌ Unexpected error:', err.message);
  }
}

testAnonKey();