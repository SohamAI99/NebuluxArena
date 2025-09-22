const { createClient } = require('@supabase/supabase-js');

// Use the service role key for server-side operations
const supabaseUrl = 'https://cyiacmjrqdrbkxnafikp.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5aWFjbWpycWRyYmt4bmFmaWtwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzIyMTAxNywiZXhwIjoyMDcyNzk3MDE3fQ.g4E0V9mkVZzI-oA4SntKKQs7g8Tnj5uJ0BEtjsdAGzg';

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