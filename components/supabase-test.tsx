"use client"

import { useEffect, useState } from 'react'
import { useSupabase, useAuth } from '@/hooks/use-supabase'

export default function SupabaseTest() {
  const supabase = useSupabase()
  const { user, session, loading } = useAuth()
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing')

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = (y - centerY) / 12
    const rotateY = (centerX - x) / 12
    
    e.currentTarget.style.setProperty('--tilt-x', `${Math.max(-8, Math.min(8, rotateX))}deg`)
    e.currentTarget.style.setProperty('--tilt-y', `${Math.max(-8, Math.min(8, rotateY))}deg`)
  }
  
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--tilt-x', '0deg')
    e.currentTarget.style.setProperty('--tilt-y', '0deg')
  }

  useEffect(() => {
    // Test Supabase connection
    const testConnection = async () => {
      try {
        // Test basic connectivity by checking auth session
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          throw error
        }
        
        setConnectionStatus('connected')
      } catch (error) {
        console.error('Supabase connection error:', error)
        setConnectionStatus('error')
      }
    }

    testConnection()
  }, [supabase])

  return (
    <div className="p-6 bg-white/5 rounded-lg border border-white/10 card-3d tilt-3d" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <h2 className="text-xl font-bold mb-4">Supabase Connection Test</h2>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Connection Status:</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            connectionStatus === 'connected' 
              ? 'bg-green-500/20 text-green-400' 
              : connectionStatus === 'error'
              ? 'bg-red-500/20 text-red-400'
              : 'bg-yellow-500/20 text-yellow-400'
          }`}>
            {connectionStatus === 'connected' && '✅ Connected'}
            {connectionStatus === 'error' && '❌ Error'}
            {connectionStatus === 'testing' && '⏳ Testing...'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Auth Status:</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            loading 
              ? 'bg-yellow-500/20 text-yellow-400'
              : user 
              ? 'bg-green-500/20 text-green-400'
              : 'bg-gray-500/20 text-gray-400'
          }`}>
            {loading && '⏳ Loading...'}
            {!loading && user && '✅ Authenticated'}
            {!loading && !user && 'ℹ️ Not authenticated'}
          </span>
        </div>

        {user && (
          <div className="text-sm text-gray-300">
            <p>User ID: {user.id}</p>
            <p>Email: {user.email}</p>
          </div>
        )}

        <div className="text-xs text-gray-500 mt-4">
          <p>📝 To complete setup:</p>
          <ol className="list-decimal list-inside space-y-1 mt-2">
            <li>Create a Supabase project at <a href="https://supabase.com" className="text-blue-400 hover:underline">supabase.com</a></li>
            <li>Copy your project URL and anon key</li>
            <li>Update the .env.local file with your credentials</li>
            <li>Restart the development server</li>
          </ol>
        </div>
      </div>
    </div>
  )
}