const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔧 Final Verification of Supabase Integration');
console.log('==========================================');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key (first 10 chars):', supabaseAnonKey?.substring(0, 10) + '...');

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function finalVerification() {
  console.log('\n🚀 Starting final verification...\n');
  
  // Test 1: Contact form submission
  try {
    console.log('1. Testing contact form submission...');
    const contactData = {
      name: 'Final Verification User',
      email: 'verify@example.com',
      message: 'Final verification test message',
      notify: true
    };
    
    const { error: contactError } = await supabase
      .from('Client Table')
      .insert(contactData);
      
    if (contactError) {
      console.log('❌ Contact form submission failed:', contactError.message);
      return false;
    } else {
      console.log('✅ Contact form submission successful!');
    }
  } catch (err) {
    console.log('❌ Error during contact form test:', err.message);
    return false;
  }
  
  // Test 2: Test-db page functionality
  try {
    console.log('\n2. Testing test-db page functionality...');
    
    // Check connection
    const { data: checkData, error: checkError } = await supabase
      .from('Client Table')
      .select('id')
      .limit(1);

    if (checkError) {
      console.log('❌ Database connection failed:', checkError.message);
      return false;
    } else {
      console.log('✅ Database connection successful!');
    }
    
    // Test insert
    const testData = {
      name: 'Test-DB Verification User',
      email: 'test-db-verify@example.com',
      message: 'Test-db verification test message',
      notify: false
    };
    
    const { error: insertError } = await supabase
      .from('Client Table')
      .insert(testData);
      
    if (insertError) {
      console.log('❌ Test-db insert failed:', insertError.message);
      return false;
    } else {
      console.log('✅ Test-db insert successful!');
    }
    
    // Test data retrieval
    const { data: fetchData, error: fetchError } = await supabase
      .from('Client Table')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (fetchError) {
      console.log('❌ Data retrieval failed:', fetchError.message);
      return false;
    } else {
      console.log('✅ Data retrieval successful!');
      console.log(`   Retrieved ${fetchData.length} recent records`);
    }
  } catch (err) {
    console.log('❌ Error during test-db page test:', err.message);
    return false;
  }
  
  return true;
}

// Run the final verification
finalVerification().then(success => {
  if (success) {
    console.log('\n🎉🎉🎉 SUCCESS! 🎉🎉🎉');
    console.log('==========================================');
    console.log('✅ All tests passed!');
    console.log('✅ Your contact form should now work correctly');
    console.log('✅ Your test-db page should now work correctly');
    console.log('✅ Supabase integration is properly configured');
    console.log('\nNext steps:');
    console.log('1. Restart your development server: pnpm dev');
    console.log('2. Visit http://localhost:3000 to test the contact form');
    console.log('3. Visit http://localhost:3000/test-db to test the database page');
  } else {
    console.log('\n❌ VERIFICATION FAILED');
    console.log('==========================================');
    console.log('Please check your configuration and try again.');
  }
});