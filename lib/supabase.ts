import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// Use the anon key for client-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cyiacmjrqdrbkxnafikp.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5aWFjbWpycWRyYkt4bmFmaWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMjEwMTcsImV4cCI6MjA3Mjc5NzAxN30.dYDmOXt8ltZECBqCLFVEyvAQPTs6iEn1XEsyVSCVWlk'

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Anon Key (first 10 chars):', supabaseAnonKey.substring(0, 10) + '...')

if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  console.warn('Missing or invalid env.NEXT_PUBLIC_SUPABASE_URL')
}

if (!supabaseAnonKey) {
  console.warn('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Validate the anon key format (JWT tokens have 3 parts separated by dots)
const keyParts = supabaseAnonKey.split('.')
if (keyParts.length !== 3) {
  console.warn('Invalid Supabase anon key format - should be a JWT token with 3 parts')
}

// Create client with additional options for better error handling
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'nebulux-arena',
    },
  },
  // Add error handling for database operations
  db: {
    schema: 'public',
  }
})