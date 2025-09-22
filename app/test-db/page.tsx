"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestDBPage() {
  const [status, setStatus] = useState('Testing...')
  const [tableExists, setTableExists] = useState(false)
  const [insertWorks, setInsertWorks] = useState(false)

  useEffect(() => {
    async function testConnection() {
      try {
        // Test 1: Check if we can connect to Supabase
        const { data, error } = await supabase
          .from('contacts')
          .select('count(*)')
          .limit(1)

        if (error) {
          if (error.code === '42P01') {
            setStatus(`❌ Table 'contacts' does not exist: ${error.message}`)
            setTableExists(false)
          } else {
            setStatus(`❌ Error accessing Supabase: ${error.message}`)
          }
        } else {
          setStatus('✅ Connected to Supabase successfully!')
          setTableExists(true)
          
          // Test 2: Try to insert a test record
          const testRecord = {
            name: 'Test User',
            email: 'test@example.com',
            message: 'Test message from database test page',
            notify: false
          }
          
          const { error: insertError } = await supabase
            .from('contacts')
            .insert(testRecord)
            
          if (insertError) {
            setStatus(`❌ Table exists but insert failed: ${insertError.message}`)
            setInsertWorks(false)
          } else {
            setStatus('✅ Connected to Supabase and insert works!')
            setInsertWorks(true)
          }
        }
      } catch (err) {
        if (err instanceof Error) {
          setStatus(`❌ Unexpected error: ${err.message}`)
        } else {
          setStatus(`❌ Unexpected error: ${String(err)}`)
        }
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Database Connection Test</h1>
        
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <p className={`text-lg ${status.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
            {status}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`bg-gray-900 rounded-lg p-6 ${tableExists ? 'border border-green-500' : 'border border-red-500'}`}>
            <h3 className="text-lg font-semibold mb-2">Table Status</h3>
            <p>{tableExists ? '✅ Contacts table exists' : '❌ Contacts table missing'}</p>
          </div>
          
          <div className={`bg-gray-900 rounded-lg p-6 ${insertWorks ? 'border border-green-500' : 'border border-red-500'}`}>
            <h3 className="text-lg font-semibold mb-2">Insert Permission</h3>
            <p>{insertWorks ? '✅ Can insert records' : '❌ Cannot insert records'}</p>
          </div>
        </div>
        
        <div className="mt-8 bg-gray-900 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
          <ul className="list-disc pl-5 space-y-2">
            {tableExists ? (
              <li className="text-green-400">✅ Contacts table exists</li>
            ) : (
              <li className="text-red-400">❌ Create the contacts table using the SQL from DATABASE_SETUP.md</li>
            )}
            
            {insertWorks ? (
              <li className="text-green-400">✅ Insert permissions working</li>
            ) : (
              <li className="text-red-400">❌ Check Row Level Security policies in Supabase</li>
            )}
            
            <li>Check your <code className="bg-gray-800 px-2 py-1 rounded">.env.local</code> file has correct credentials</li>
            <li>Restart your development server after any environment variable changes</li>
          </ul>
        </div>
      </div>
    </div>
  )
}