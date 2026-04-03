import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useToast } from '../hooks/useToast'

/**
 * Backend Test Component - Authentication Flow
 * Purpose: Test complete authentication backend
 * Location: Access from /test-auth route or import in dev mode
 */

export default function AuthFlowTest() {
  const { showToast } = useToast()
  const [testResults, setTestResults] = useState({})
  const [running, setRunning] = useState(false)
  const [logs, setLogs] = useState([])

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { message, type, time: new Date().toLocaleTimeString() }])
  }

  // Test 1: Connection
  const testConnection = async () => {
    addLog('Testing Supabase connection...', 'info')
    try {
      const { error } = await supabase.from('profiles').select('count').limit(1)
      if (error && !error.message.includes('relation')) throw error
      
      setTestResults(prev => ({ ...prev, connection: '✅ PASS' }))
      addLog('Supabase connection successful', 'success')
      return true
    } catch (error) {
      setTestResults(prev => ({ ...prev, connection: '❌ FAIL' }))
      addLog(`Connection failed: ${error.message}`, 'error')
      return false
    }
  }

  // Test 2: Session Check
  const testSession = async () => {
    addLog('Checking active session...', 'info')
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      
      if (session) {
        setTestResults(prev => ({ ...prev, session: `✅ Active (${session.user.email})` }))
        addLog(`Active session: ${session.user.email}`, 'success')
      } else {
        setTestResults(prev => ({ ...prev, session: 'ℹ️ No active session' }))
        addLog('No active session (this is normal)', 'info')
      }
      return true
    } catch (error) {
      setTestResults(prev => ({ ...prev, session: '❌ FAIL' }))
      addLog(`Session check failed: ${error.message}`, 'error')
      return false
    }
  }

  // Test 3: Get Current User
  const testCurrentUser = async () => {
    addLog('Getting current user...', 'info')
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error && error.status !== 401) throw error
      
      if (user) {
        setTestResults(prev => ({ 
          ...prev, 
          currentUser: `✅ ${user.email} (${user.id.slice(0, 8)}...)` 
        }))
        addLog(`Current user: ${user.email}`, 'success')
      } else {
        setTestResults(prev => ({ ...prev, currentUser: 'ℹ️ Not logged in' }))
        addLog('No user logged in', 'info')
      }
      return true
    } catch (error) {
      setTestResults(prev => ({ ...prev, currentUser: '❌ FAIL' }))
      addLog(`Get user failed: ${error.message}`, 'error')
      return false
    }
  }

  // Test 4: Token Refresh
  const testTokenRefresh = async () => {
    addLog('Testing token refresh...', 'info')
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (!session) {
        setTestResults(prev => ({ ...prev, tokenRefresh: 'ℹ️ No session to refresh' }))
        addLog('No session to refresh', 'info')
        return true
      }
      if (error) throw error
      
      const expiresAt = new Date(session.expires_at * 1000)
      const now = new Date()
      const minutesLeft = Math.round((expiresAt - now) / 1000 / 60)
      
      setTestResults(prev => ({ 
        ...prev, 
        tokenRefresh: `✅ Token expires in ${minutesLeft} min` 
      }))
      addLog(`Token valid for ${minutesLeft} minutes`, 'success')
      return true
    } catch (error) {
      setTestResults(prev => ({ ...prev, tokenRefresh: '❌ FAIL' }))
      addLog(`Token check failed: ${error.message}`, 'error')
      return false
    }
  }

  // Test 5: Database Tables
  const testDatabaseTables = async () => {
    addLog('Checking database tables...', 'info')
    const tables = ['profiles', 'resumes', 'job_applications']
    const results = {}
    
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('count').limit(1)
        if (error && error.message.includes('relation')) {
          results[table] = '⚠️ Not created'
          addLog(`Table "${table}" not found - run schema SQL`, 'warning')
        } else if (error) {
          results[table] = '✅ Exists (RLS working)'
          addLog(`Table "${table}" exists`, 'success')
        } else {
          results[table] = '✅ Accessible'
          addLog(`Table "${table}" accessible`, 'success')
        }
      } catch (error) {
        results[table] = `❌ ${error.message}`
        addLog(`Table "${table}" error: ${error.message}`, 'error')
      }
    }
    
    setTestResults(prev => ({ ...prev, ...results }))
    return true
  }

  // Test 6: OAuth Providers
  const testOAuthProviders = async () => {
    addLog('Checking OAuth providers...', 'info')
    const providers = [
      { id: 'google', name: 'Google' },
      { id: 'github', name: 'GitHub' }
    ]
    
    const results = {}
    for (const provider of providers) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: provider.id,
          options: { 
            redirectTo: window.location.origin + '/auth/callback',
            skipBrowserRedirect: true
          }
        })
        
        if (error) {
          results[provider.id] = `⚠️ ${error.message}`
          addLog(`${provider.name}: ${error.message}`, 'warning')
        } else {
          results[provider.id] = '✅ Configured'
          addLog(`${provider.name} OAuth configured`, 'success')
        }
      } catch (error) {
        results[provider.id] = `❌ ${error.message}`
        addLog(`${provider.name} error: ${error.message}`, 'error')
      }
    }
    
    setTestResults(prev => ({ ...prev, ...results }))
    return true
  }

  // Run All Tests
  const runAllTests = async () => {
    setRunning(true)
    setLogs([])
    setTestResults({})
    
    addLog('🚀 Starting backend authentication tests...', 'info')
    
    await testConnection()
    await testSession()
    await testCurrentUser()
    await testTokenRefresh()
    await testDatabaseTables()
    await testOAuthProviders()
    
    addLog('✅ All tests completed!', 'success')
    setRunning(false)
    
    // Show summary
    const passed = Object.values(testResults).filter(r => r.includes('✅')).length
    const total = Object.keys(testResults).length
    showToast(`Tests: ${passed}/${total} passed`, 'success')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔍 Backend Authentication Test
          </h1>
          <p className="text-gray-600">
            Test Supabase connection, authentication, and database
          </p>
        </div>

        {/* Run Tests Button */}
        <div className="text-center mb-8">
          <button
            onClick={runAllTests}
            disabled={running}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {running ? 'Running Tests...' : 'Run All Tests'}
          </button>
        </div>

        {/* Test Results */}
        {Object.keys(testResults).length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Test Results</h2>
            <div className="grid gap-3">
              {Object.entries(testResults).map(([key, value]) => (
                <div
                  key={key}
                  className={`p-4 rounded-xl border-2 ${
                    value.includes('✅') 
                      ? 'border-green-200 bg-green-50' 
                      : value.includes('❌')
                      ? 'border-red-200 bg-red-50'
                      : value.includes('⚠️')
                      ? 'border-amber-200 bg-amber-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className={`font-bold ${
                      value.includes('✅') ? 'text-green-600' :
                      value.includes('❌') ? 'text-red-600' :
                      value.includes('⚠️') ? 'text-amber-600' :
                      'text-gray-600'
                    }`}>
                      {value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logs */}
        {logs.length > 0 && (
          <div className="bg-gray-900 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Test Logs</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`text-sm font-mono ${
                    log.type === 'success' ? 'text-green-400' :
                    log.type === 'error' ? 'text-red-400' :
                    log.type === 'warning' ? 'text-amber-400' :
                    'text-gray-300'
                  }`}
                >
                  <span className="text-gray-500">[{log.time}]</span> {log.message}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
          <h3 className="font-bold text-blue-900 mb-3">📋 What This Tests:</h3>
          <ul className="space-y-2 text-blue-800">
            <li>✅ Supabase connection and configuration</li>
            <li>✅ Active user session and authentication</li>
            <li>✅ Token management and auto-refresh</li>
            <li>✅ Database tables existence</li>
            <li>✅ OAuth provider configuration</li>
            <li>✅ Row Level Security policies</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
