// Supabase Client Configuration
// Security: Uses anon key (safe for frontend) - RLS protects data

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase not configured!')
  console.error('📝 Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env')
}

// Create Supabase client with safety check
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      },
      global: {
        headers: {
          'X-Client-Info': 'kayaka-ai'
        }
      }
    })
  : {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: async () => {}
      },
      from: () => ({
        select: () => ({ limit: () => ({ maybeSingle: async () => ({ data: null, error: null }) }) }),
        upsert: () => ({ select: () => ({ maybeSingle: async () => ({ data: null, error: null }) }) })
      })
    }

// Helper: Check if user is authenticated
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return !!session
}

// Helper: Get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Helper: Sign out
export const signOut = async () => {
  await supabase.auth.signOut()
}
