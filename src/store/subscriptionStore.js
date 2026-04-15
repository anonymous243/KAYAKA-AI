import { create } from 'zustand'
import { db } from '../lib/cloudflare'
import { useAuthStore } from './authStore'
import axios from 'axios'

// Smart API URL detection for Razorpay (backend service)
const getBackendUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl
  }
  return 'https://kayaka-ai.anonymous24tr.workers.dev/api'
}

const BACKEND_API_URL = getBackendUrl()

export const useSubscriptionStore = create((set, get) => ({
  plan: 'free',
  status: 'inactive',
  loading: false,
  error: null,
  initialized: false,

  hasAccess: (requiredPlan) => {
    const currentPlan = get().plan
    if (!requiredPlan || requiredPlan === 'free') return true
    if (currentPlan === 'elite') return true
    if (currentPlan === 'pro' && requiredPlan === 'pro') return true
    return false
  },

  // Initialize store on first load
  initialize: () => {
    if (get().initialized) return
    get().fetchSubscription()
    set({ initialized: true })
  },

  // Fetch current subscription status from Cloudflare
  fetchSubscription: async () => {
    const user = useAuthStore.getState().user
    if (!user) {
      set({ loading: false })
      return
    }

    set({ loading: true, error: null })
    try {
      const profile = await db.getProfile()

      if (profile) {
        set({
          plan: profile.plan || 'free',
          status: profile.status || 'inactive',
          loading: false,
          error: null
        })
      } else {
        set({
          plan: 'free',
          status: 'inactive',
          loading: false,
          error: null
        })
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
      set({ error: null, loading: false })
    }
  },

  // Initialize Razorpay payment
  upgradePlan: async (planName, amount) => {
    const user = useAuthStore.getState().user
    if (!user) {
      set({ error: 'User must be logged in to upgrade' })
      return false
    }

    set({ loading: true, error: null })
    try {
      // Create order via Cloudflare Worker
      const order = await db.createOrder({
        amount,
        currency: 'INR',
        planName
      })

      // Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: order.amount,
        currency: order.currency,
        name: 'Kayaka-AI',
        description: `Upgrade to ${planName} Plan`,
        order_id: order.id,
        handler: async (response) => {
          try {
            // Verify payment via Cloudflare Worker
            const verificationResponse = await db.verifyPayment({
              ...response,
              planName,
              amount
            })

            if (verificationResponse.status === 'success') {
              set({ 
                plan: planName.toLowerCase(), 
                status: 'active', 
                loading: false, 
                error: null 
              })
              return true
            } else {
              set({ error: 'Payment verification failed', loading: false })
              return false
            }
          } catch (err) {
            console.error('Payment verification failed:', err)
            set({ error: 'Payment verification failed. Please contact support.', loading: false })
            return false
          }
        },
        prefill: {
          name: user.name || user.user_metadata?.full_name || '',
          email: user.email || '',
          contact: user.user_metadata?.phone || '',
        },
        theme: {
          color: '#6C5CE7'
        },
        modal: {
          ondismiss: function() {
            set({ loading: false, error: 'Payment cancelled' })
          }
        }
      }

      // Check if Razorpay SDK is loaded
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK could not be loaded. Please check your internet connection or disable ad-blockers.')
      }

      const rzp = new window.Razorpay(options)
      
      rzp.on('payment.failed', (response) => {
        const errorMsg = response.error?.description || 'Payment failed. Please try again.'
        set({ error: errorMsg, loading: false })
      })
      
      rzp.open()

    } catch (error) {
      console.error('Error starting upgrade:', error)
      const errorMsg = error.response?.data?.error || error.message || 'Failed to initiate upgrade'
      set({ error: errorMsg, loading: false })
      return false
    }
  }
}))
