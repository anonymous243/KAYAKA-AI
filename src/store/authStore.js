import { create } from 'zustand'
import { auth } from '../lib/cloudflare'

const USER_KEY = 'kayaka_ai_user_cache'
const TOKEN_KEY = 'kayaka_auth_token'

export const useAuthStore = create((set, get) => ({
  user: (() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || 'null')
    } catch {
      return null
    }
  })(),
  session: null,
  isAuthenticated: false,
  loading: true,

  // Initialize auth state on app load
  initAuth: async () => {
    try {
      const { data: { session } } = await auth.getSession()

      if (session) {
        set({
          user: session.user,
          session,
          isAuthenticated: true,
          loading: false
        })
      } else {
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          loading: false
        })
        localStorage.removeItem(USER_KEY)
        localStorage.removeItem(TOKEN_KEY)
      }
    } catch (error) {
      console.error('Auth init error:', error)
      set({
        loading: false,
        user: null,
        session: null,
        isAuthenticated: false
      })
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(TOKEN_KEY)
    }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
    const redirectUri = `${window.location.origin}/auth/callback`
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=email profile&` +
      `access_type=offline&` +
      `prompt=consent`
    
    window.location.href = authUrl
  },

  // Sign in with GitHub
  signInWithGitHub: async () => {
    const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID
    const redirectUri = `${window.location.origin}/auth/github/callback`
    
    const authUrl = `https://github.com/login/oauth/authorize?` +
      `client_id=${GITHUB_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=user:email`
    
    window.location.href = authUrl
  },

  // Handle OAuth callback
  handleOAuthCallback: async (provider, code) => {
    const { user, profile, token } = await auth.handleOAuthCallback(provider, code)
    
    set({
      user,
      session: { user, token },
      isAuthenticated: true,
      loading: false
    })
    
    return { user, profile }
  },

  // Update user profile
  updateProfile: async (updates) => {
    const { db } = await import('../lib/cloudflare')
    const data = await db.updateProfile(updates)
    
    const updatedUser = { ...get().user, ...updates }
    set({ user: updatedUser })
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser))
    
    return data
  },

  // Sign out
  signOut: async () => {
    await auth.signOut()
    set({
      user: null,
      session: null,
      isAuthenticated: false,
      loading: false
    })
  },

  // Listen to auth changes
  subscribeToAuthChanges: (callback) => {
    return auth.onAuthStateChange(callback)
  }
}))
