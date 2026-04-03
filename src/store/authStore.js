import { create } from 'zustand'
import { supabase, signOut } from '../lib/supabase'

const USER_KEY = 'kayaka_ai_user_cache'
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000 // 5 minutes before expiry

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem(USER_KEY) || 'null'),
  session: null,
  isAuthenticated: false,
  loading: true,
  tokenRefreshTimer: null,

  // Initialize auth state on app load
  initAuth: async () => {
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        set({
          user: session.user,
          session,
          isAuthenticated: true,
          loading: false
        })
        localStorage.setItem(USER_KEY, JSON.stringify(session.user))

        // Set up token refresh monitoring
        get().scheduleTokenRefresh(session)
      } else {
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          loading: false,
          tokenRefreshTimer: null
        })
        localStorage.removeItem(USER_KEY)
      }
    } catch (error) {
      console.error('Auth init error:', error)
      set({
        loading: false,
        user: null,
        session: null,
        isAuthenticated: false,
        tokenRefreshTimer: null
      })
      localStorage.removeItem(USER_KEY)
    }
  },

  // Schedule token refresh before expiry
  scheduleTokenRefresh: (session) => {
    // Clear existing timer
    if (get().tokenRefreshTimer) {
      clearTimeout(get().tokenRefreshTimer)
    }

    // Calculate time until token expires (minus buffer)
    const expiresAt = session.expires_at * 1000
    const now = Date.now()
    const timeUntilExpiry = expiresAt - now - TOKEN_REFRESH_THRESHOLD

    if (timeUntilExpiry > 0) {
      console.log(`Token refresh scheduled in ${Math.round(timeUntilExpiry / 1000)}s`)
      
      const timer = setTimeout(async () => {
        try {
          const { data: { session: newSession }, error } = await supabase.auth.refreshSession()
          
          if (error) throw error
          
          if (newSession) {
            set({ session: newSession })
            localStorage.setItem(USER_KEY, JSON.stringify(newSession.user))
            
            // Schedule next refresh
            get().scheduleTokenRefresh(newSession)
          }
        } catch (error) {
          console.error('Token refresh failed:', error)
          // Token refresh failed - user will need to re-authenticate
          get().signOut()
        }
      }, timeUntilExpiry)

      set({ tokenRefreshTimer: timer })
    }
  },

  // Check if token is about to expire
  isTokenExpiring: () => {
    const { session } = get()
    if (!session) return false
    
    const expiresAt = session.expires_at * 1000
    const now = Date.now()
    const timeUntilExpiry = expiresAt - now
    
    return timeUntilExpiry < TOKEN_REFRESH_THRESHOLD
  },

  // Get time until token expires (in seconds)
  getTokenExpiryTime: () => {
    const { session } = get()
    if (!session) return 0
    
    const expiresAt = session.expires_at * 1000
    const now = Date.now()
    return Math.max(0, Math.round((expiresAt - now) / 1000))
  },

  // Sign in with email/password
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    set({
      user: data.user,
      session: data.session,
      isAuthenticated: true
    })
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))

    return data
  },

  // Sign up with email/password
  signUp: async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })

    if (error) throw error

    // Note: User needs to confirm email before session is created
    return data
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error
    return data
  },

  // Sign in with GitHub
  signInWithGitHub: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/github/callback`
      }
    })

    if (error) throw error
    return data
  },

  // Handle OAuth callback
  handleOAuthCallback: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) throw error

    if (session) {
      set({
        user: session.user,
        session,
        isAuthenticated: true
      })
      localStorage.setItem(USER_KEY, JSON.stringify(session.user))
      return session
    }

    return null
  },

  // Update user profile in database
  updateProfile: async (updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: useAuthStore.getState().user?.id, ...updates })
      .select()
      .maybeSingle()

    if (error) throw error

    // Update local state
    const updatedUser = { ...useAuthStore.getState().user, ...updates }
    set({ user: updatedUser })
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser))

    return data
  },

  // Sign out
  signOut: async () => {
    // Clear token refresh timer
    if (get().tokenRefreshTimer) {
      clearTimeout(get().tokenRefreshTimer)
      set({ tokenRefreshTimer: null })
    }
    
    await signOut()
    set({
      user: null,
      session: null,
      isAuthenticated: false,
      tokenRefreshTimer: null
    })
    localStorage.removeItem(USER_KEY)
  },

  // Listen to auth changes
  subscribeToAuthChanges: (callback) => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event)

        if (session) {
          set({
            user: session.user,
            session,
            isAuthenticated: true
          })
          localStorage.setItem(USER_KEY, JSON.stringify(session.user))
        } else {
          set({
            user: null,
            session: null,
            isAuthenticated: false
          })
          localStorage.removeItem(USER_KEY)
        }

        callback(event, session)
      }
    )

    return subscription
  }
}))
