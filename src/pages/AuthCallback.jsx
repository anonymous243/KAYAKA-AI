import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useToast } from '../hooks/useToast'

// Handles OAuth redirects from both Google and GitHub via Supabase
export default function AuthCallback() {
  const navigate = useNavigate()
  const { handleOAuthCallback } = useAuthStore()
  const { showToast } = useToast()
  const [error, setError] = useState('')

  useEffect(() => {
    const process = async () => {
      try {
        // Supabase detects the session from the URL hash/params automatically
        const session = await handleOAuthCallback()
        if (session) {
          showToast('Welcome!', 'success')
          navigate('/dashboard', { replace: true })
        } else {
          // No session yet — wait a moment and retry (Supabase may still be processing)
          setTimeout(async () => {
            try {
              const retrySession = await handleOAuthCallback()
              if (retrySession) {
                showToast('Welcome!', 'success')
                navigate('/dashboard', { replace: true })
              } else {
                setError('Authentication failed. No session received.')
                setTimeout(() => navigate('/login', { replace: true }), 3000)
              }
            } catch (err) {
              setError(err.message || 'Authentication failed')
              setTimeout(() => navigate('/login', { replace: true }), 3000)
            }
          }, 1500)
        }
      } catch (err) {
        console.error('OAuth callback error:', err)
        setError(err.message || 'Authentication failed')
        setTimeout(() => navigate('/login', { replace: true }), 3000)
      }
    }

    process()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="text-center max-w-md mx-auto px-4">
        {error ? (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-red-600 font-medium mb-2">Authentication Failed</p>
            <p className="text-gray-500 text-sm mb-4">{error}</p>
            <p className="text-gray-400 text-sm">Redirecting to login...</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Completing sign in...</p>
            <p className="text-gray-400 text-sm mt-2">Please wait</p>
          </>
        )}
      </div>
    </div>
  )
}
