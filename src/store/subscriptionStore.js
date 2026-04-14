import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './authStore'
import axios from 'axios'

// Smart API URL detection (same logic as api.js)
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl
  }
  return 'https://kayaka-ai.anonymous24tr.workers.dev/api'
}

const API_BASE_URL = getApiUrl()

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

  // Fetch current subscription status from Supabase profile
  fetchSubscription: async () => {
    const user = useAuthStore.getState().user
    if (!user) {
      set({ loading: false })
      return
    }

    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('plan, subscription_status, current_period_end')
        .eq('id', user.id)
        .maybeSingle()

      if (error) {
        console.error('Supabase fetch error:', error)
        // Don't throw, just default to free
        set({
          plan: 'free',
          status: 'inactive',
          loading: false,
          error: null
        })
        return
      }

      if (data) {
        set({
          plan: data.plan || 'free',
          status: data.subscription_status || 'inactive',
          loading: false,
          error: null
        })
      } else {
        // Profile doesn't exist yet, default to free
        set({
          plan: 'free',
          status: 'inactive',
          loading: false,
          error: null
        })
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
      set({ error: null, loading: false }) // Don't show error, just default to free
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
      // 1. Create order on backend
      const response = await axios.post(`${API_BASE_URL}/create-order`, {
        amount,
        currency: 'INR',
        planName,
        userId: user.id
      }, {
        timeout: 15000 // 15 second timeout
      })

      const order = response.data

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: order.amount,
        currency: order.currency,
        name: 'Kayaka-AI',
        description: `Upgrade to ${planName} Plan`,
        order_id: order.id,
        handler: async (response) => {
          try {
            // 3. Verify payment on backend
            const verificationResponse = await axios.post(`${API_BASE_URL}/verify-payment`, {
              ...response,
              userId: user.id,
              planName,
              amount
            }, {
              timeout: 15000
            })

            if (verificationResponse.data.status === 'success') {
              // 4. Update Supabase profile (use upsert to handle missing profiles)
              const { error: updateError } = await supabase
                .from('profiles')
                .upsert({
                  id: user.id,
                  plan: planName.toLowerCase(),
                  subscription_status: 'active',
                  subscription_id: order.id,
                  updated_at: new Date().toISOString()
                })

              if (updateError) {
                console.error('Supabase update error:', updateError)
                // Don't fail the whole upgrade if Supabase fails
              }

              set({ plan: planName.toLowerCase(), status: 'active', loading: false, error: null })
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
          name: user.user_metadata?.full_name || '',
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
