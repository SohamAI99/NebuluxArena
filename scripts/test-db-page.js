const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing test-db page functionality...');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key (first 10 chars):', supabaseAnonKey?.substring(0, 10) + '...');

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDBPage() {
  try {
    console.log('\n--- Testing database connection ---');
    
    // Test 1: Check if we can connect to Supabase and access the table
    const { data, error } = await supabase
      .from('Client Table')
      .select('id')
      .limit(1);

    if (error) {
      console.log('❌ Error accessing Supabase:', error.message);
      return false;
    } else {
      console.log('✅ Connected to Supabase successfully!');
    }
  } catch (err) {
    console.log('❌ Unexpected error:', err.message);
    return false;
  }
  
  try {
    console.log('\n--- Testing insert functionality ---');
    
    // Test 2: Try to insert a test record (like the test-db page does)
    const testRecord = {
      name: 'Test DB Page User',
      email: 'test-db@example.com',
      message: 'Test message from test-db page verification script',
      notify: false
    };
    
    const { error: insertError } = await supabase
      .from('Client Table')
      .insert(testRecord);
      
    if (insertError) {
      console.log('❌ Insert failed:', insertError.message);
      return false;
    } else {
      console.log('✅ Record inserted successfully!');
    }
  } catch (err) {
    console.log('❌ Unexpected error during insert:', err.message);
    return false;
  }
  
  try {
    console.log('\n--- Testing data retrieval ---');
    
    // Test 3: Try to retrieve recent records (like the test-db page does)
    const { data, error } = await supabase
      .from('Client Table')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);
      
    if (error) {
      console.log('❌ Error fetching records:', error.message);
      return false;
    } else {
      console.log('✅ Successfully retrieved records!');
      console.log(`Retrieved ${data.length} records`);
    }
  } catch (err) {
    console.log('❌ Unexpected error during data retrieval:', err.message);
    return false;
  }
  
  return true;
}

// Run the test
testDBPage().then(success => {
  if (success) {
    console.log('\n🎉 All tests passed! Your test-db page should now work correctly.');
  } else {
    console.log('\n❌ Tests failed. Please check your configuration.');
  }
});