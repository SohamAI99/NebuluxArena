"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestDBPage() {
  const [status, setStatus] = useState('Testing...')
  const [tableExists, setTableExists] = useState(false)
  const [insertWorks, setInsertWorks] = useState(false)
  const [testData, setTestData] = useState({
    name: 'Test User',
    email: 'test@example.com',
    message: 'Test message from database test page',
    notify: false
  })
  const [insertStatus, setInsertStatus] = useState('')
  const [recentRecords, setRecentRecords] = useState<any[]>([])

  useEffect(() => {
    async function testConnection() {
      try {
        // Test 1: Check if we can connect to Supabase
        const { data, error } = await (supabase as any)
          .from('Client Table')
          .select('count(*)')
          .limit(1)

        if (error) {
          if (error.code === '42P01') {
            setStatus(`❌ Table 'Client Table' does not exist: ${error.message}`)
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
          
          const { error: insertError } = await (supabase as any)
            .from('Client Table')
            .insert(testRecord)
            
          if (insertError) {
            setStatus(`❌ Table exists but insert failed: ${insertError.message}`)
            setInsertWorks(false)
          } else {
            setStatus('✅ Connected to Supabase and insert works!')
            setInsertWorks(true)
            fetchRecentRecords()
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

  const handleInsertTest = async (e: React.FormEvent) => {
    e.preventDefault()
    setInsertStatus('Inserting...')
    
    try {
      const { error } = await (supabase as any)
        .from('Client Table')
        .insert(testData)
        
      if (error) {
        setInsertStatus(`❌ Insert failed: ${error.message}`)
      } else {
        setInsertStatus('✅ Record inserted successfully!')
        fetchRecentRecords()
        
        // Reset form
        setTestData({
          name: '',
          email: '',
          message: '',
          notify: false
        })
      }
    } catch (err) {
      if (err instanceof Error) {
        setInsertStatus(`❌ Unexpected error: ${err.message}`)
      } else {
        setInsertStatus(`❌ Unexpected error: ${String(err)}`)
      }
    }
  }

  const fetchRecentRecords = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('Client Table')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
        
      if (error) {
        console.error('Error fetching records:', error)
      } else {
        setRecentRecords(data || [])
      }
    } catch (err) {
      console.error('Error fetching records:', err)
    }
  }

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
            <p>{tableExists ? '✅ Client table exists' : '❌ Client table missing'}</p>
          </div>
          
          <div className={`bg-gray-900 rounded-lg p-6 ${insertWorks ? 'border border-green-500' : 'border border-red-500'}`}>
            <h3 className="text-lg font-semibold mb-2">Insert Permission</h3>
            <p>{insertWorks ? '✅ Can insert records' : '❌ Cannot insert records'}</p>
          </div>
        </div>
        
        {tableExists && insertWorks && (
          <div className="mt-8 bg-gray-900 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Test Data Insertion</h3>
            <form onSubmit={handleInsertTest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={testData.name}
                  onChange={(e) => setTestData({...testData, name: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={testData.email}
                  onChange={(e) => setTestData({...testData, email: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  value={testData.message}
                  onChange={(e) => setTestData({...testData, message: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                  rows={3}
                  required
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notify"
                  checked={testData.notify}
                  onChange={(e) => setTestData({...testData, notify: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="notify" className="text-sm">Notify me</label>
              </div>
              
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
              >
                Insert Test Record
              </button>
              
              {insertStatus && (
                <div className={`mt-2 p-2 rounded ${insertStatus.includes('✅') ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                  {insertStatus}
                </div>
              )}
            </form>
          </div>
        )}
        
        {recentRecords.length > 0 && (
          <div className="mt-8 bg-gray-900 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Records</h3>
            <div className="space-y-3">
              {recentRecords.map((record) => (
                <div key={record.id} className="border border-gray-700 rounded p-3">
                  <p><strong>Name:</strong> {record.name}</p>
                  <p><strong>Email:</strong> {record.email}</p>
                  <p><strong>Message:</strong> {record.message}</p>
                  <p><strong>Notify:</strong> {record.notify ? 'Yes' : 'No'}</p>
                  <p className="text-xs text-gray-400">
                    <strong>Created:</strong> {new Date(record.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={fetchRecentRecords}
              className="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
            >
              Refresh Records
            </button>
          </div>
        )}
        
        <div className="mt-8 bg-gray-900 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
          <ul className="list-disc pl-5 space-y-2">
            {tableExists ? (
              <li className="text-green-400">✅ Client table exists</li>
            ) : (
              <li className="text-red-400">❌ Create the Client table in your Supabase dashboard</li>
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