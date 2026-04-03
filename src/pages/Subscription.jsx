import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useSubscriptionStore } from '../store/subscriptionStore'
import { useAuthStore } from '../store/authStore'
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '0',
    description: 'Perfect for getting started',
    features: [
      '21 Premium Templates',
      'Basic AI Resume Analysis',
      '1 AI Resume Generation',
      'PDF Exports (Watermarked)',
      'Job Tracker (Basic)'
    ],
    buttonText: 'Current Plan',
    buttonClass: 'bg-white/5 text-white/50 cursor-default',
    highlight: false
  },
  {
    name: 'Pro',
    price: '149',
    oldPrice: '299',
    period: '/mo',
    description: 'Most popular for job seekers',
    features: [
      'Everything in Free',
      'Unlimited AI Generation',
      'No Watermarks on PDF',
      'Full ATS Optimization',
      'Priority Email Support',
      'Smart Keyword Suggestions'
    ],
    buttonText: 'Upgrade to Pro',
    buttonClass: 'bg-[#69f6b8] text-[#002919] shadow-[0_0_20px_rgba(105,246,184,0.3)]',
    highlight: true,
    tag: 'Best Value'
  },
  {
    name: 'Elite',
    price: '299',
    oldPrice: '599',
    period: '/mo',
    description: 'Power tools for serious careers',
    features: [
      'Everything in Pro',
      'Smart Apply Engine',
      'LinkedIn DM Generator',
      'Interview Prep Bot',
      'Cover Letter Generator',
      'Dedicated Career Coach AI'
    ],
    buttonText: 'Go Elite',
    buttonClass: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]',
    highlight: false
  }
]

export default function Subscription() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { plan: currentPlan, upgradePlan, fetchSubscription, loading, error } = useSubscriptionStore()
  const [billingCycle, setBillingCycle] = useState('monthly')

  useEffect(() => {
    fetchSubscription()
  }, [])

  const handleUpgrade = (plan) => {
    if (plan.name.toLowerCase() === currentPlan) return
    
    const amount = billingCycle === 'yearly' 
      ? Math.floor(parseInt(plan.price) * 0.67) 
      : parseInt(plan.price)
    
    if (amount === 0) return

    navigate('/checkout', { state: { plan, amount, billingCycle } })
  }

  return (
    <div className="min-h-screen bg-[#070d1f] relative overflow-hidden font-sans">
      <style>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        .bg-animated-grid {
          background-image: 
            linear-gradient(rgba(105, 246, 184, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(105, 246, 184, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: grid-move 20s linear infinite;
        }
        .obsidian-glow {
          box-shadow: 0 0 50px -12px rgba(105, 246, 184, 0.2);
        }
      `}</style>

      {/* Background */}
      <div className="fixed inset-0 bg-animated-grid"></div>
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#69f6b8]/10 rounded-full blur-[120px] animate-pulse-glow"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-[#070d1f]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-[#69f6b8] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(105,246,184,0.3)]">
                <svg className="w-6 h-6 text-[#002919]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-black text-white tracking-tighter uppercase">Kayaka-AI</span>
            </button>
            <button onClick={() => navigate('/dashboard')} className="text-[#a5aac2] font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">
              Close
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h1 className="text-6xl font-black text-white mb-6 uppercase tracking-tighter">
              Upgrade Your <span className="text-[#69f6b8]">Career Speed</span>
            </h1>
            <p className="text-[#a5aac2] text-xl font-medium max-w-2xl mx-auto">
              Join 10,000+ ambitious professionals using Kayaka-AI to land their dream roles.
            </p>

            {/* Billing Toggle */}
            <div className="mt-12 flex items-center justify-center gap-4">
              <span className={`text-[10px] font-black uppercase tracking-widest ${billingCycle === 'monthly' ? 'text-white' : 'text-[#a5aac2] opacity-50'}`}>Monthly</span>
              <button 
                onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                className="w-14 h-8 bg-white/5 rounded-full p-1 relative flex items-center"
              >
                <motion.div 
                  className="w-6 h-6 bg-[#69f6b8] rounded-full shadow-[0_0_10px_rgba(105,246,184,0.5)]"
                  animate={{ x: billingCycle === 'monthly' ? 0 : 24 }}
                />
              </button>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-widest ${billingCycle === 'yearly' ? 'text-white' : 'text-[#a5aac2] opacity-50'}`}>Yearly</span>
                <span className="bg-[#69f6b8]/10 text-[#69f6b8] text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-tight">Save 33%</span>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {plans.map((plan, idx) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-10 rounded-[2.5rem] border ${plan.highlight ? 'border-[#69f6b8]/30 bg-[#11192e] relative obsidian-glow' : 'border-white/5 bg-white/[0.02]'} group hover:scale-[1.02] transition-all`}
              >
                {plan.tag && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#69f6b8] text-[#002919] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                    {plan.tag}
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-sm font-black text-[#a5aac2] uppercase tracking-[0.2em] mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-2xl font-black text-white">₹</span>
                    <span className="text-6xl font-black text-white">
                      {billingCycle === 'yearly' ? Math.floor(parseInt(plan.price) * 0.67) : plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-[#a5aac2] font-bold text-sm">{plan.period}</span>
                    )}
                  </div>
                  {plan.oldPrice && (
                    <p className="text-[#a5aac2]/30 text-xs font-bold line-through mt-1">Originally ₹{plan.oldPrice}</p>
                  )}
                </div>

                <ul className="space-y-4 mb-10 text-left">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex items-center gap-3 text-[#a5aac2] text-sm font-bold">
                      <svg className="w-5 h-5 text-[#69f6b8] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handleUpgrade(plan)}
                  disabled={loading || plan.name.toLowerCase() === currentPlan}
                  className={`w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 ${
                    plan.name.toLowerCase() === currentPlan 
                      ? 'bg-white/5 text-white/40 cursor-default' 
                      : plan.buttonClass
                  } ${loading ? 'opacity-50 cursor-wait' : ''}`}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : plan.name.toLowerCase() === currentPlan ? (
                    <>Current Plan <CheckCircle2 className="w-4 h-4" /></>
                  ) : (
                    plan.buttonText
                  )}
                </button>

                {error && plan.highlight && (
                  <p className="text-red-400 text-[10px] font-bold mt-4 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {error}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Trusted By */}
          <div className="pt-20 border-t border-white/5">
            <p className="text-[10px] font-black text-[#a5aac2] uppercase tracking-[0.3em] mb-12 opacity-50">Trusted by pros at</p>
            <div className="flex flex-wrap justify-center items-center gap-12 grayscale opacity-40">
              {['Google', 'Netflix', 'Tesla', 'Amazon', 'Microsoft'].map(brand => (
                <span key={brand} className="text-2xl font-black text-white">{brand}</span>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
