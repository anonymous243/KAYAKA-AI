import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './authStore'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://kayaka-ai.anonymous24tr.workers.dev/api'

export const useSubscriptionStore = create((set, get) => ({
  plan: 'free',
  status: 'inactive',
  loading: false,
  error: null,

  hasAccess: (requiredPlan) => {
    const currentPlan = get().plan
    if (!requiredPlan || requiredPlan === 'free') return true
    if (currentPlan === 'elite') return true
    if (currentPlan === 'pro' && requiredPlan === 'pro') return true
    return false
  },

  // Fetch current subscription status from Supabase profile
  fetchSubscription: async () => {
    const user = useAuthStore.getState().user
    if (!user) return

    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('plan, subscription_status, current_period_end')
        .eq('id', user.id)
        .maybeSingle()

      if (error) throw error

      if (data) {
        set({ 
          plan: data.plan || 'free',
          status: data.subscription_status || 'inactive',
          loading: false 
        })
      } else {
        // Profile doesn't exist yet, default to free
        set({ 
          plan: 'free',
          status: 'inactive',
          loading: false 
        })
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
      set({ error: error.message, loading: false })
    }
  },

  // Initialize Razorpay payment
  upgradePlan: async (planName, amount) => {
    const user = useAuthStore.getState().user
    if (!user) {
      set({ error: 'User must be logged in to upgrade' })
      return
    }

    set({ loading: true, error: null })
    try {
      // 1. Create order on backend
      const response = await axios.post(`${API_BASE_URL}/create-order`, {
        amount,
        currency: 'INR',
        planName,
        userId: user.id
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
          // 3. Verify payment on backend
          try {
            const verificationResponse = await axios.post(`${API_BASE_URL}/verify-payment`, {
              ...response,
              userId: user.id,
              planName,
              amount
            })

            if (verificationResponse.data.status === 'success') {
              // 4. Update Supabase profile (use upsert to handle missing profiles)
              const { error: updateError } = await supabase
                .from('profiles')
                .upsert({
                  id: user.id,
                  plan: planName.toLowerCase(),
                  subscription_status: 'active',
                  subscription_id: order.id, // Using order ID as subscription ID for now
                  updated_at: new Date().toISOString()
                })

              if (updateError) throw updateError

              set({ plan: planName.toLowerCase(), status: 'active', loading: false })
              return true
            }
          } catch (err) {
            console.error('Payment verification failed:', err)
            set({ error: 'Payment verification failed', loading: false })
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
        }
      }

      if (!window.Razorpay) {
        throw new Error('Razorpay SDK could not be loaded. Please check your internet connection or disable ad-blockers.')
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (response) => {
        set({ error: response.error.description, loading: false })
      })
      rzp.open()

    } catch (error) {
      console.error('Error starting upgrade:', error)
      set({ error: error.message, loading: false })
    }
  }
}))
