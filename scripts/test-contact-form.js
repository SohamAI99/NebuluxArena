const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing contact form submission with environment variables...');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key (first 10 chars):', supabaseAnonKey?.substring(0, 10) + '...');

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testContactFormSubmission() {
  try {
    console.log('\n--- Testing contact form submission ---');
    
    // Test data similar to what the form would submit
    const formData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message from contact form test script',
      notify: true
    };
    
    const { error } = await supabase
      .from('Client Table')
      .insert(formData);
      
    if (error) {
      console.log('❌ Form submission failed:', error.message);
      return false;
    } else {
      console.log('✅ Contact form submission successful!');
      return true;
    }
  } catch (err) {
    console.log('❌ Unexpected error during form submission:', err.message);
    return false;
  }
}

// Run the test
testContactFormSubmission().then(success => {
  if (success) {
    console.log('\n🎉 All tests passed! Your contact form should now work correctly.');
  } else {
    console.log('\n❌ Tests failed. Please check your configuration.');
  }
});