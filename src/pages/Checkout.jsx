import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  ShieldCheck,
  Lock,
  ArrowLeft,
  CreditCard,
  Smartphone,
  Globe,
  Wallet,
  Zap,
  Info
} from 'lucide-react'
import { useSubscriptionStore } from '../store/subscriptionStore'
import { useAuthStore } from '../store/authStore'

const Checkout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { plan, billingCycle, amount: rawAmount } = location.state || {}
  const upgradePlan = useSubscriptionStore((state) => state.upgradePlan)
  const loading = useSubscriptionStore((state) => state.loading)
  const error = useSubscriptionStore((state) => state.error)
  const user = useAuthStore((state) => state.user)

  // Redirect if no plan selected
  useEffect(() => {
    if (!plan || !rawAmount) {
      navigate('/subscription');
      return;
    }
    // Dynamically load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [plan, rawAmount, navigate])

  const handlePay = async () => {
    try {
      const success = await upgradePlan(plan.name, rawAmount)
      if (success) {
        // Handled by store/subscription state, user will be redirected via store logic if needed
        // or we can navigate to dashboard here
        setTimeout(() => navigate('/dashboard'), 1500)
      }
    } catch (err) {
      console.error('Payment error:', err)
      // Error is already handled by subscriptionStore state and displayed in UI
    }
  }

  if (!plan) return null

  return (
    <div className="min-h-screen bg-[#070d1f] text-white flex flex-col font-sans selection:bg-[#69f6b8] selection:text-[#002919]">
      <style>{`
        @keyframes subtle-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-subtle { animation: subtle-float 6s ease-in-out infinite; }
        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .gradient-text {
          background: linear-gradient(135deg, #fff 0%, #69f6b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* Header */}
      <header className="h-20 border-b border-white/5 flex items-center px-10 relative z-20">
        <button 
          onClick={() => navigate('/subscription')}
          className="flex items-center gap-2 text-[#a5aac2] hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Back to Plans</span>
        </button>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-[#69f6b8] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(105,246,184,0.3)]">
                <svg className="w-5 h-5 text-[#002919]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-lg font-black tracking-tighter uppercase">Kayaka-AI Checkout</span>
          </div>
        </div>
        <div className="w-32 flex justify-end">
           <ShieldCheck className="w-5 h-5 text-[#69f6b8]/50" />
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 py-16 px-10 relative z-10">
        {/* Left Section: Order Summary */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-10"
        >
          <div>
            <span className="text-[#69f6b8] text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Secure Checkout</span>
            <h1 className="text-5xl font-black gradient-text leading-tight mb-6">
              Complete Your <br />Subscription.
            </h1>
            <p className="text-[#a5aac2] font-bold">
              Join thousands of professionals accelerating their careers with Kayaka-AI. 
              Unlock premium tools and reach your potential.
            </p>
          </div>

          <div className="glass-panel rounded-[2rem] p-8 space-y-6">
            <div className="flex items-center justify-between pb-6 border-b border-white/5">
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">{plan.name} Plan</h3>
                <p className="text-[#a5aac2] text-xs font-bold uppercase tracking-widest opacity-60">Billed {billingCycle}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-[#69f6b8]">₹{rawAmount}</p>
                <p className="text-[#a5aac2] text-[10px] font-black uppercase tracking-tighter">Total Due Today</p>
              </div>
            </div>

            <ul className="space-y-4">
              {plan.features.slice(0, 4).map(feature => (
                 <li key={feature} className="flex items-center gap-3 text-[#a5aac2] text-sm font-bold">
                    <div className="w-5 h-5 rounded-full bg-[#69f6b8]/10 flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-[#69f6b8]" />
                    </div>
                    {feature}
                 </li>
              ))}
            </ul>

            <div className="pt-6 border-t border-white/5 flex items-center justify-between text-xs font-black uppercase tracking-[0.2em] text-[#a5aac2]/50">
              <span>Satisfaction Guaranteed</span>
              <div className="flex gap-4">
                 <span>24/7 Support</span>
                 <span>Secure 256-bit SSL</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Section: Payment Details */}
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="flex flex-col gap-8"
        >
          <div className="glass-panel rounded-[2rem] p-10 flex flex-col gap-8 h-full">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Account Details</h2>
              <p className="text-[#a5aac2] text-sm font-bold">Logged in as <span className="text-white">{user?.email}</span></p>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-[0.1em] text-[#a5aac2]">Official Partner</span>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" className="h-4 opacity-70 grayscale brightness-200" alt="Razorpay" />
                </div>
                <p className="text-[11px] text-[#a5aac2]/70 font-bold leading-relaxed">
                  Payments are securely processed via Razorpay. Supported methods include Cards, UPI (GPay, PhonePe, etc), Netbanking, and Wallets.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-center gap-3 grayscale opacity-30">
                    <CreditCard className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Cards</span>
                 </div>
                 <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-center gap-3 grayscale opacity-30">
                    <Smartphone className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">UPI / Phone</span>
                 </div>
              </div>
            </div>

            <div className="mt-auto pt-8">
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold leading-relaxed">
                  {error}
                </div>
              )}

              <button
                onClick={handlePay}
                disabled={loading}
                className="w-full bg-[#69f6b8] hover:bg-[#58e2a3] text-[#002919] py-6 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-[0_20px_40px_-15px_rgba(105,246,184,0.3)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 relative overflow-hidden group"
              >
                <span className={loading ? 'opacity-0' : 'opacity-100 group-hover:tracking-[0.3em] transition-all'}>
                  {loading ? '' : 'Connect to Razorpay'}
                </span>
                {loading && (
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-[#002919]/30 border-t-[#002919] rounded-full animate-spin" />
                   </div>
                )}
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/40 opacity-40 group-hover:animate-[shimmer_2s_infinite]" />
              </button>
              
              <div className="flex items-center justify-center gap-2 mt-6 opacity-40">
                <Lock className="w-3 h-3" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Encrypted Handshake</span>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Decorative Blur */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[180px] pointer-events-none"></div>
    </div>
  )
}
export default Checkout
