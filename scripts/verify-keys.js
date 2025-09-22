// Script to verify Supabase keys
console.log('Supabase Key Verification Script');
console.log('==============================');

console.log('\n1. Check your Supabase project dashboard at:');
console.log('   https://app.supabase.com/project/cyiacmjrqdrbkxnafikp/settings/api');

console.log('\n2. In your .env.local file, ensure you have:');
console.log('   NEXT_PUBLIC_SUPABASE_URL=https://cyiacmjrqdrbkxnafikp.supabase.co');
console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here');
console.log('   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here');

console.log('\n3. The anon key should be labeled as "anon" key in your Supabase dashboard');
console.log('   The service role key should be labeled as "service_role" key');

console.log('\n4. After updating your keys:');
console.log('   - Restart your development server');
console.log('   - Test the connection again');

console.log('\nCurrent keys in .env.local:');
require('dotenv').config({ path: '.env.local' });

console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY (first 10 chars):', 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10) + '...' : 
  'NOT SET');
console.log('SUPABASE_SERVICE_ROLE_KEY (first 10 chars):', 
  process.env.SUPABASE_SERVICE_ROLE_KEY ? 
  process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 10) + '...' : 
  'NOT SET');