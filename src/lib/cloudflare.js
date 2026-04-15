/**
 * Cloudflare API Client
 * Replaces Supabase client with Cloudflare Worker API calls
 */

import axios from 'axios'

// Smart API URL detection
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_CLOUDFLARE_WORKER_URL
  if (envUrl) return envUrl
  // Fallback to localhost for development
  if (import.meta.env.DEV) return 'http://localhost:8787'
  // Production fallback - update this after deployment
  return 'https://kayaka-ai-api.your-subdomain.workers.dev'
}

const API_BASE = getApiUrl()

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000
})

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kayaka_auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('kayaka_auth_token')
      localStorage.removeItem('kayaka_ai_user_cache')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ==========================================
// AUTH FUNCTIONS
// ==========================================

export const auth = {
  // Handle OAuth callback from Google/GitHub
  async handleOAuthCallback(provider, code) {
    const response = await api.post('/api/auth/callback', { provider, code })
    const { user, profile, token } = response.data
    
    // Store token
    localStorage.setItem('kayaka_auth_token', token)
    localStorage.setItem('kayaka_ai_user_cache', JSON.stringify(user))
    
    return { user, profile, token }
  },

  // Get current session
  async getSession() {
    const token = localStorage.getItem('kayaka_auth_token')
    if (!token) {
      return { data: { session: null } }
    }
    
    try {
      const user = JSON.parse(localStorage.getItem('kayaka_ai_user_cache') || 'null')
      return { data: { session: { user, token } } }
    } catch {
      return { data: { session: null } }
    }
  },

  // Get current user
  async getUser() {
    const user = JSON.parse(localStorage.getItem('kayaka_ai_user_cache') || 'null')
    return { data: { user } }
  },

  // Sign out
  async signOut() {
    localStorage.removeItem('kayaka_auth_token')
    localStorage.removeItem('kayaka_ai_user_cache')
  },

  // Listen to auth changes (simplified for JWT)
  onAuthStateChange(callback) {
    // For JWT, we just notify on initial load
    const session = localStorage.getItem('kayaka_auth_token')
    if (session) {
      callback('SIGNED_IN', { user: JSON.parse(localStorage.getItem('kayaka_ai_user_cache')) })
    } else {
      callback('SIGNED_OUT', null)
    }
    
    return {
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    }
  }
}

// ==========================================
// DATABASE FUNCTIONS
// ==========================================

export const db = {
  // Get user profile
  async getProfile() {
    const response = await api.get('/api/profile')
    return response.data
  },

  // Update user profile
  async updateProfile(updates) {
    const response = await api.put('/api/profile', updates)
    return response.data
  },

  // Save encrypted resume data
  async saveResume(encryptedData) {
    const response = await api.post('/api/resume', { encryptedData })
    return response.data
  },

  // Get encrypted resume data
  async getResume(resumeId = null) {
    const params = resumeId ? { params: { id: resumeId } } : {}
    const response = await api.get('/api/resume', params)
    return response.data
  },

  // Create payment order
  async createOrder({ amount, currency, planName }) {
    const response = await api.post('/api/create-order', { amount, currency, planName })
    return response.data
  },

  // Verify payment
  async verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature, planName, amount }) {
    const response = await api.post('/api/verify-payment', {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planName,
      amount
    })
    return response.data
  }
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export const isAuthenticated = async () => {
  return !!localStorage.getItem('kayaka_auth_token')
}

export const getCurrentUser = async () => {
  const user = JSON.parse(localStorage.getItem('kayaka_ai_user_cache') || 'null')
  return user
}

export const signOut = async () => {
  await auth.signOut()
}

// Export as default object for compatibility
export default {
  auth,
  db,
  isAuthenticated,
  getCurrentUser,
  signOut
}
