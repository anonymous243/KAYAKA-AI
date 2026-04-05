import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import { useToast } from '../hooks/useToast'
import { AlertCircle, Eye, EyeOff, Check, X } from 'lucide-react'

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' }
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' }
  if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' }
  if (score === 3) return { score: 3, label: 'Strong', color: 'bg-[#A29BFE] shadow-[0_0_10px_rgba(162,155,254,0.5)]' }
  return { score: 4, label: 'Very Strong', color: 'bg-[#6C5CE7] shadow-[0_0_10px_rgba(108,92,231,0.5)]' }
}

export default function AuthPage({ defaultTab = 'login' }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(defaultTab)

  const handleLogoClick = () => {
    navigate('/')
  }

  // Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn, signUp, signInWithGoogle, signInWithGitHub, isAuthenticated, loading: authLoading } = useAuthStore()
  const { showToast } = useToast()
  const strength = getPasswordStrength(password)

  // Sync URL with active tab
  useEffect(() => {
    setActiveTab(defaultTab)
  }, [defaultTab])

  // Redirect if authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, authLoading, navigate])

  const handleTabSwitch = (tab) => {
    setError('')
    setActiveTab(tab)
    window.history.replaceState({}, '', `/${tab}`)
  }

  const validateForm = () => {
    if (activeTab === 'signup') {
      if (!name.trim()) { setError('Full name is required'); return false; }
      if (name.trim().length < 2) { setError('Name must be at least 2 characters'); return false; }
    }
    if (!email.trim()) { setError('Email address is required'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email address'); return false; }
    if (!password) { setError('Password is required'); return false; }
    if (password.length < 6 && activeTab === 'login') { setError('Password must be at least 6 characters'); return false; }
    
    if (activeTab === 'signup') {
      if (password.length < 8) { setError('Password must be at least 8 characters'); return false; }
      if (password !== confirmPassword) { setError('Passwords do not match'); return false; }
      if (!acceptedTerms) { setError('You must accept the Terms of Service to continue'); return false; }
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!validateForm()) return

    setLoading(true)
    try {
      if (activeTab === 'login') {
        await signIn(email, password)
        showToast('Welcome back 👋', 'success')
      } else {
        const { data } = await signUp(email, password, { name })
        showToast('Workspace created! Please check your email.', 'success')
        if (!data.session) {
          setError('Verification link sent. Please verify your email before entering the workspace.')
        } else {
          navigate('/dashboard', { replace: true })
        }
      }
    } catch (err) {
      setError(err.message || `${activeTab === 'login' ? 'Login' : 'Signup'} failed`)
      showToast(err.message || 'Authentication issue', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider) => {
    if (activeTab === 'signup' && !acceptedTerms) {
      setError('Please accept Terms & Privacy Policy to continue')
      return
    }
    try {
      if (provider === 'google') await signInWithGoogle()
      else if (provider === 'github') await signInWithGitHub()
    } catch (err) {
      showToast(`${provider} auth failed: ${err.message}`, 'error')
    }
  }

  return (
    <div className="min-h-screen flex bg-[#0B0F1A] text-[#E5E7EB] font-sans selection:bg-[#6C5CE7]/30">
      
      {/* ── Left Panel (Branding / Linear-style Layout) ── */}
      <div className="hidden lg:flex lg:w-[45%] relative border-r border-white/5 overflow-hidden">
        {/* Deep navy to purple gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B0F1A] via-[#111827] to-[#0B0F1A]"></div>
        
        {/* Animated Purple Glow Mesh */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-[#6C5CE7]/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-150px] right-[-50px] w-[600px] h-[600px] bg-indigo-900/30 rounded-full blur-[150px]" 
        />

        {/* Content */}
        <div className="relative z-10 p-16 flex flex-col h-full w-full justify-between">
          <div>
            <div onClick={handleLogoClick} className="flex items-center gap-3 w-max group cursor-pointer">
              <div className="w-10 h-10 bg-[#6C5CE7] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(108,92,231,0.4)] group-hover:shadow-[0_0_30px_rgba(108,92,231,0.6)] transition-all">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">KAYAKA-AI</span>
            </div>

            <div className="mt-28">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight"
              >
                Land your dream <br/> job faster.
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                className="text-[#9CA3AF] text-lg leading-relaxed max-w-md"
              >
                AI-powered resume optimization that tailors your core competencies to any job description in seconds.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-12 space-y-5"
              >
                {[
                  { title: 'Instantly bypass ATS systems', icon: 'M5 13l4 4L19 7' },
                  { title: 'Data-driven gap analysis', icon: 'M5 13l4 4L19 7' },
                  { title: 'Auto-rewrite impact bullets', icon: 'M5 13l4 4L19 7' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-7 h-7 bg-[#6C5CE7]/10 border border-[#6C5CE7]/30 rounded-full flex items-center justify-center group-hover:bg-[#6C5CE7]/20 transition-colors">
                      <svg className="w-4 h-4 text-[#A29BFE]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon}/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-[#E5E7EB]">{item.title}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Social Proof Footer */}
          <div className="border-t border-white/5 pt-8 grid grid-cols-2 gap-8">
            <div>
              <div className="text-3xl font-extrabold text-white">50K+</div>
              <div className="text-[#9CA3AF] text-sm mt-1">Resumes optimized</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#A29BFE] shadow-glow">4.9★</div>
              <div className="text-[#9CA3AF] text-sm mt-1">Average rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel (Auth Form) ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        {/* Mobile Background Elements */}
        <div className="lg:hidden absolute top-[-50px] left-[-50px] w-[300px] h-[300px] bg-[#6C5CE7]/20 rounded-full blur-[100px]" />
        
        <div className="w-full max-w-[420px] relative z-10">
          
          {/* Mobile Header Branding */}
          <div onClick={handleLogoClick} className="lg:hidden flex items-center justify-center gap-3 mb-10 cursor-pointer">
            <div className="w-10 h-10 bg-[#6C5CE7] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(108,92,231,0.4)]">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">KAYAKA-AI</span>
          </div>

          {/* Glassmorphism Auth Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative"
          >
            {/* Header Text */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                {activeTab === 'login' ? 'Welcome back 👋' : 'Create workspace'}
              </h2>
              <p className="text-[#9CA3AF] text-sm">
                {activeTab === 'login' ? 'Continue to your KAYAKA-AI workspace' : 'Begin optimizing your career matrix instantly'}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-1 bg-[#0B0F1A] border border-white/5 rounded-xl mb-8 relative">
              <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#1F2937] rounded-lg transition-transform duration-300 ease-out shadow-sm ${activeTab === 'signup' ? 'translate-x-full' : 'translate-x-0'}`} 
              />
              <button 
                onClick={() => handleTabSwitch('login')}
                className={`flex-1 py-2 text-sm font-semibold relative z-10 transition-colors duration-200 ${activeTab === 'login' ? 'text-white' : 'text-[#9CA3AF] hover:text-white'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => handleTabSwitch('signup')}
                className={`flex-1 py-2 text-sm font-semibold relative z-10 transition-colors duration-200 ${activeTab === 'signup' ? 'text-white' : 'text-[#9CA3AF] hover:text-white'}`}
              >
                Sign Up
              </button>
            </div>

            {/* Social Auth */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button onClick={() => handleSocialLogin('google')} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-transparent border border-white/10 hover:bg-white/5 hover:border-white/20 rounded-xl text-sm font-medium text-white transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </button>
              <button onClick={() => handleSocialLogin('github')} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-transparent border border-white/10 hover:bg-white/5 hover:border-white/20 rounded-xl text-sm font-medium text-white transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                GitHub
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest"><span className="px-3 bg-[#111827] text-[#9CA3AF]">Or continue with email</span></div>
            </div>

            {/* Email / Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="popLayout">
                {activeTab === 'signup' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pt-[18px]">
                        <svg className="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                      </div>
                      <input
                        type="text" value={name} onChange={(e) => setName(e.target.value)}
                        className="peer w-full px-10 pt-5 pb-2 bg-[#0B0F1A] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7]/50 transition-all placeholder-transparent"
                        placeholder="Full Name" required={activeTab === 'signup'}
                      />
                      <label className="absolute left-10 top-2 text-[10px] uppercase font-bold tracking-wider text-[#9CA3AF] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#9CA3AF]/60 peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-[#6C5CE7] peer-focus:uppercase peer-focus:font-bold pointer-events-none">
                        Full Name
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pt-[18px]">
                  <svg className="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="peer w-full px-10 pt-5 pb-2 bg-[#0B0F1A] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7]/50 transition-all placeholder-transparent"
                  placeholder="name@company.com" required
                />
                <label className="absolute left-10 top-2 text-[10px] uppercase font-bold tracking-wider text-[#9CA3AF] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#9CA3AF]/60 peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-[#6C5CE7] peer-focus:uppercase peer-focus:font-bold pointer-events-none">
                  Email Address
                </label>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pt-[18px]">
                  <svg className="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="peer w-full pl-10 pr-12 pt-5 pb-2 bg-[#0B0F1A] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7]/50 transition-all placeholder-transparent"
                  placeholder="Password" required minLength={activeTab === 'signup' ? 8 : 6}
                />
                <label className="absolute left-10 top-2 text-[10px] uppercase font-bold tracking-wider text-[#9CA3AF] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#9CA3AF]/60 peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-[#6C5CE7] peer-focus:uppercase peer-focus:font-bold pointer-events-none">
                  Password
                </label>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-4 text-[#9CA3AF] hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <AnimatePresence mode="popLayout">
                {activeTab === 'signup' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    {/* Password Strength */}
                    {password.length > 0 && (
                      <div className="mb-4 mt-2">
                        <div className="flex gap-1.5 mb-1.5 h-1">
                          {[1, 2, 3, 4].map((seg) => (
                            <div key={seg} className={`flex-1 rounded-full transition-all duration-300 ${strength.score >= seg ? strength.color : 'bg-white/10'}`} />
                          ))}
                        </div>
                        <p className="text-[10px] uppercase tracking-wide font-bold text-[#9CA3AF] flex items-center justify-between">
                          <span>{strength.label}</span>
                          <span className="opacity-50 font-normal normal-case">Min 8 chars, 1 number</span>
                        </p>
                      </div>
                    )}

                    <div className="relative mt-4">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pt-[18px]">
                        <svg className="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                      </div>
                      <input
                        type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`peer w-full px-10 pt-5 pb-2 bg-[#0B0F1A] border rounded-xl text-white text-sm focus:outline-none focus:ring-1 transition-all placeholder-transparent ${confirmPassword && confirmPassword !== password ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50' : 'border-white/10 focus:border-[#6C5CE7] focus:ring-[#6C5CE7]/50'}`}
                        placeholder="Confirm Password" required={activeTab === 'signup'}
                      />
                      <label className={`absolute left-10 top-2 text-[10px] uppercase font-bold tracking-wider transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:font-bold pointer-events-none ${confirmPassword && confirmPassword !== password ? 'text-red-400 peer-focus:text-red-400 peer-placeholder-shown:text-red-400/60' : 'text-[#9CA3AF] peer-focus:text-[#6C5CE7] peer-placeholder-shown:text-[#9CA3AF]/60'}`}>
                        Confirm Password
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Sub-actions */}
              <AnimatePresence>
                {activeTab === 'login' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-wrap items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="w-4 h-4 rounded border border-white/20 bg-[#0B0F1A] flex items-center justify-center group-hover:border-[#6C5CE7]/50 transition-colors">
                         <div className="w-2.5 h-2.5 rounded-[2px] bg-[#6C5CE7] scale-0" />
                      </div>
                      <input type="checkbox" className="hidden" />
                      <span className="text-sm text-[#9CA3AF] group-hover:text-white transition-colors">Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="text-sm font-medium text-[#A29BFE] hover:text-white transition-colors">
                      Forgot password?
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Signup Terms */}
              <AnimatePresence>
                {activeTab === 'signup' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-start gap-3 pt-2">
                    <button type="button" onClick={() => setAcceptedTerms(!acceptedTerms)} className={`w-5 h-5 mt-0.5 rounded flex items-center justify-center border transition-colors flex-shrink-0 ${acceptedTerms ? 'bg-[#6C5CE7] border-[#6C5CE7]' : 'bg-[#0B0F1A] border-white/20 hover:border-[#6C5CE7]/50'}`}>
                      {acceptedTerms && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                    </button>
                    <span className="text-xs text-[#9CA3AF] leading-relaxed">
                      By creating an account, you agree to our{' '}
                      <Link to="/terms" className="text-[#A29BFE] hover:text-white transition-colors font-medium">Terms of Service</Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-[#A29BFE] hover:text-white transition-colors font-medium">Privacy Policy</Link>
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-red-400 font-medium leading-snug">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || (activeTab === 'signup' && (!acceptedTerms || password !== confirmPassword))}
                className="w-full py-3.5 mt-2 bg-[#6C5CE7] hover:bg-[#5a4bce] text-white rounded-xl font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(108,92,231,0.2)] hover:shadow-[0_0_30px_rgba(108,92,231,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {activeTab === 'login' ? 'Authenticating...' : 'Provisioning workspace...'}
                  </span>
                ) : (
                  activeTab === 'login' ? 'Continue to your workspace' : 'Create workspace'
                )}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
