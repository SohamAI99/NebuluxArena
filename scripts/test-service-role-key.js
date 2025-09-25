const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Use environment variables instead of hardcoded keys
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY_HERE';

// Security check - ensure we're not using default keys in production
if (supabaseServiceRoleKey === 'YOUR_SERVICE_ROLE_KEY_HERE') {
  console.error('❌ ERROR: Supabase service role key not configured!');
  console.error('Please set your Supabase keys in .env.local file');
  console.error('Copy .env.example to .env.local and update the values');
  process.exit(1);
}

console.log('Testing Supabase connection with service role key...');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Service Role Key (first 10 chars):', supabaseServiceRoleKey.substring(0, 10) + '...');

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

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
      message: 'Test message from service role key test script',
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