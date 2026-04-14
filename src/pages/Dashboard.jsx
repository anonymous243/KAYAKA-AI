import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import { useResumeStore } from '../store/resumeStore'
import { useSubscriptionStore } from '../store/subscriptionStore'
import { useEffect } from 'react'
import { getTrackedApplications } from '../services/jobTargetingService'
import PageWrapper from '../components/PageWrapper'
import {
  Upload, User, Target, Sparkles, Briefcase, BarChart3, Send,
  Bell, ChevronDown, LogOut, Settings, Lock, CheckCircle2,
  ArrowRight, Zap, TrendingUp, ChevronRight
} from 'lucide-react'

// ─── Sub-components ───────────────────────────────────────────

function ProgressTracker({ steps }) {
  return (
    <div className="flex items-start gap-0 overflow-x-auto pb-2">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1
        return (
          <div key={i} className="flex items-center flex-shrink-0">
            <div className={`flex flex-col items-center gap-2 w-24 sm:w-28`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-colors ${
                step.done ? 'bg-[#6C5CE7] border-[#6C5CE7] shadow-[0_0_12px_rgba(108,92,231,0.5)]' :
                step.active ? 'bg-[#6C5CE7]/20 border-[#6C5CE7] shadow-[0_0_12px_rgba(108,92,231,0.3)]' :
                'bg-white/5 border-white/10'
              }`}>
                {step.done
                  ? <CheckCircle2 className="w-5 h-5 text-white" />
                  : step.active
                    ? <ArrowRight className="w-4 h-4 text-[#A29BFE]" />
                    : <Lock className="w-4 h-4 text-white/20" />
                }
              </div>
              <span className={`text-[10px] font-semibold text-center leading-tight ${
                step.done ? 'text-[#A29BFE]' : step.active ? 'text-white' : 'text-white/20'
              }`}>{step.label}</span>
            </div>
            {!isLast && (
              <div className={`w-10 sm:w-14 h-px flex-shrink-0 -mt-4 ${
                steps[i + 1]?.done || steps[i + 1]?.active ? 'bg-[#6C5CE7]/50' : 'bg-white/10'
              }`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function ToolCard({ tool, isLocked, isCompleted, planMismatch }) {
  const card = (
    <motion.div
      whileHover={(!isLocked && !planMismatch) ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={`group relative bg-[#111827]/80 backdrop-blur-sm border rounded-2xl p-6 flex flex-col gap-4 h-full transition-all duration-300 ${
        isLocked || planMismatch
          ? 'border-white/5 opacity-50 cursor-not-allowed'
          : isCompleted
            ? 'border-[#6C5CE7]/30 hover:border-[#6C5CE7]/60 hover:shadow-[0_8px_30px_rgba(108,92,231,0.15)]'
            : 'border-white/10 hover:border-[#6C5CE7]/40 hover:shadow-[0_8px_30px_rgba(108,92,231,0.1)]'
      }`}
    >
      {isLocked && (
        <div className="absolute inset-0 bg-[#0B0F1A]/60 backdrop-blur-[2px] rounded-2xl z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Lock className="w-6 h-6 text-white/20" />
            <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Complete previous steps</span>
          </div>
        </div>
      )}

      {planMismatch && !isLocked && (
        <div className="absolute inset-0 bg-[#0B0F1A]/60 backdrop-blur-[2px] rounded-2xl z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 p-4 text-center">
            <Sparkles className="w-6 h-6 text-[#A29BFE]" />
            <span className="text-[10px] text-white/60 uppercase tracking-widest font-bold">Requires {tool.requiredPlan.toUpperCase()} Plan</span>
            <Link to="/subscription" className="mt-2 text-[10px] bg-[#6C5CE7] hover:bg-[#5a4bce] text-white px-3 py-1.5 rounded-lg font-bold transition-colors">
              Upgrade Now
            </Link>
          </div>
        </div>
      )}

      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
        isCompleted ? 'bg-[#6C5CE7]/20 text-[#A29BFE] group-hover:bg-[#6C5CE7]/30' :
        'bg-white/5 text-white/50 group-hover:bg-white/10 group-hover:text-white'
      }`}>
        <tool.Icon className="w-5 h-5" />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-white text-sm">{tool.title}</h3>
          {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-[#A29BFE]" />}
          {tool.requiredPlan && tool.requiredPlan !== 'free' && (
            <span className="text-[8px] bg-[#6C5CE7]/20 text-[#A29BFE] px-1.5 py-0.5 rounded border border-[#6C5CE7]/30 uppercase font-bold tracking-wider">{tool.requiredPlan}</span>
          )}
        </div>
        <p className="text-xs text-white/40 leading-relaxed">{tool.description}</p>
      </div>

      {!isLocked && !planMismatch && (
        <div className={`flex items-center gap-1.5 text-xs font-bold ${isCompleted ? 'text-[#A29BFE]' : 'text-white/40 group-hover:text-white'} transition-colors`}>
          {tool.cta} <ChevronRight className="w-3.5 h-3.5" />
        </div>
      )}
    </motion.div>
  )

  if (isLocked || planMismatch) return <div>{card}</div>
  return <Link to={tool.link}>{card}</Link>
}

// ─── Main Dashboard ───────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, signOut } = useAuthStore()
  const { parsedData, jdAnalysis } = useResumeStore()
  const { plan: currentPlan, fetchSubscription } = useSubscriptionStore()
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    // Initialize subscription store on dashboard mount
    fetchSubscription()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || 'User'
  const firstName = displayName.split(' ')[0]
  const initial = firstName[0]?.toUpperCase() || 'U'
  const trackedJobs = getTrackedApplications().length

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  // ── Progress Steps ─────────────────────────────────────────
  const hasResume = !!parsedData
  const hasSkills = (parsedData?.skills?.length || 0) > 0
  const hasJDAnalysis = !!jdAnalysis

  const steps = [
    { label: 'Upload Resume', done: hasResume, active: !hasResume },
    { label: 'Edit Profile', done: hasSkills, active: hasResume && !hasSkills },
    { label: 'Analyze JD', done: hasJDAnalysis, active: hasSkills && !hasJDAnalysis },
    { label: 'Generate Resume', done: false, active: hasJDAnalysis },
    { label: 'Smart Apply', done: false, active: false }
  ]

  const completedCount = steps.filter(s => s.done).length
  const progressPct = Math.round((completedCount / steps.length) * 100)

  // ── AI Hero Insight ────────────────────────────────────────
  const heroTitle = !hasResume
    ? `Welcome aboard, ${firstName}! 🚀`
    : progressPct < 60
      ? `You're ${progressPct}% closer to your next role, ${firstName}!`
      : `Almost there, ${firstName} — finish strong! 💪`

  const aiInsight = !hasResume
    ? 'Start by uploading your resume to unlock AI analysis.'
    : !hasJDAnalysis
      ? `Your resume is uploaded. Analyze a JD to unlock gap insights.`
      : 'Resume score: 72/100 — Missing 5 key ATS keywords.'

  // ── Next Best Action ───────────────────────────────────────
  const nextAction = !hasResume
    ? { label: 'Upload Your Resume', sub: 'Step 1 of 5 — Foundation', link: '/upload', icon: Upload }
    : !hasSkills
      ? { label: 'Complete Your Profile', sub: 'Step 2 of 5 — Add skills & experience', link: '/profile', icon: User }
      : !hasJDAnalysis
        ? { label: 'Analyze a Job Description', sub: 'Step 3 of 5 — Calculate your match score', link: '/jd-analyzer', icon: Target }
        : { label: 'Generate Optimized Resume', sub: 'Step 4 of 5 — Tailor for the role', link: '/resume-generator', icon: Sparkles }

  // ── Tool Definitions ───────────────────────────────────────
  const coreTool = [
    { title: 'Upload Resume', description: 'Parse and import your existing resume data.', Icon: Upload, link: '/upload', cta: 'Upload Now', completed: hasResume, locked: false, requiredPlan: 'free' },
    { title: 'Edit Profile', description: 'Edit skills, experience, and project details.', Icon: User, link: '/profile', cta: 'Edit Profile', completed: hasSkills, locked: !hasResume, requiredPlan: 'free' },
    { title: 'JD Analyzer', description: 'Get an AI match score for any job listing.', Icon: Target, link: '/jd-analyzer', cta: 'Analyze Now', completed: hasJDAnalysis, locked: !hasResume, requiredPlan: 'free' },
  ]
  const advancedTools = [
    { title: 'Resume Generator', description: 'Auto-generate a tailored, ATS-optimized resume.', Icon: Sparkles, link: '/resume-generator', cta: 'Generate Resume', completed: false, locked: !hasJDAnalysis, requiredPlan: 'pro' },
    { title: 'Job Targeting', description: 'Target jobs from LinkedIn, Naukri, Glassdoor.', Icon: Briefcase, link: '/job-targeting', cta: 'Target Jobs', completed: false, locked: false, requiredPlan: 'free' },
    { title: 'Smart Apply', description: 'AI cover letters, recruiter DMs, and follow-ups.', Icon: Send, link: '/smart-apply', cta: 'Start Applying', completed: false, locked: !hasJDAnalysis, requiredPlan: 'elite' },
  ]
  const trackingTools = [
    { title: 'Job Tracker', description: 'Track all your applications in one view.', Icon: BarChart3, link: '/job-tracker', cta: 'Track Jobs', completed: trackedJobs > 0, locked: false, requiredPlan: 'free' },
  ]

  const checkPlanMismatch = (requiredPlan) => {
    if (!requiredPlan || requiredPlan === 'free') return false
    if (currentPlan === 'elite') return false // Elite has everything
    if (currentPlan === 'pro' && requiredPlan === 'pro') return false
    return true
  }

  return (
    <PageWrapper className="min-h-screen bg-[#0B0F1A] text-white font-sans selection:bg-[#6C5CE7]/30">
      <style>{`
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes pulse-glow { 0%,100% { opacity: 0.3; } 50% { opacity: 0.55; } }
        .float { animation: float 8s ease-in-out infinite; }
        .pulse-glow { animation: pulse-glow 6s ease-in-out infinite; }
      `}</style>

      {/* Background glows — subtle, not distracting */}
      <div className="fixed top-[-100px] left-[-100px] w-[600px] h-[600px] bg-[#6C5CE7]/10 rounded-full blur-[150px] pulse-glow pointer-events-none" />
      <div className="fixed bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[150px] pulse-glow pointer-events-none" style={{ animationDelay: '3s' }} />

      {/* ── Navbar ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#0B0F1A]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#6C5CE7] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(108,92,231,0.4)]">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">KAYAKA-AI</span>
          </Link>

          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <Bell className="w-4 h-4 text-white/60" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#6C5CE7] rounded-full border border-[#0B0F1A]"></span>
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition-colors"
              >
                <div className="w-7 h-7 bg-[#6C5CE7] rounded-full flex items-center justify-center text-sm font-bold">{initial}</div>
                <span className="text-sm text-white/80 hidden sm:block">{firstName}</span>
                <ChevronDown className="w-4 h-4 text-white/40" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    className="absolute top-12 right-0 w-44 bg-[#111827] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                    onMouseLeave={() => setProfileOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-white/5">
                      <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">Current Plan</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                          currentPlan === 'elite' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' :
                          currentPlan === 'pro' ? 'bg-[#6C5CE7] text-white' :
                          'bg-white/10 text-white/50'
                        }`}>
                          {currentPlan}
                        </span>
                      </div>
                    </div>
                    <Link to="/subscription" className="flex items-center gap-2.5 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                      <Sparkles className="w-4 h-4 text-[#A29BFE]" /> Upgrade Plan
                    </Link>
                    <Link to="/profile" className="flex items-center gap-2.5 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-colors">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">

        {/* ── 1. HERO SECTION ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-br from-[#111827] to-[#0d1424] border border-white/8 rounded-2xl p-6 sm:p-8 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#6C5CE7]/15 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-[#9CA3AF] uppercase tracking-widest font-bold mb-2">Your Progress</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3 leading-tight">{heroTitle}</h1>
              <div className="flex items-center gap-2 text-sm text-[#A29BFE]">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">{aiInsight}</span>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6 w-full max-w-sm">
                <div className="flex justify-between text-[11px] uppercase tracking-wide font-bold text-white/30 mb-2">
                  <span>Journey Progress</span>
                  <span className="text-[#A29BFE]">{progressPct}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-[#6C5CE7] to-[#A29BFE] rounded-full shadow-[0_0_10px_rgba(108,92,231,0.5)]"
                  />
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 flex flex-col gap-3">
              {currentPlan === 'free' ? (
                <Link
                  to="/subscription"
                  className="flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-[#6C5CE7] to-[#A29BFE] hover:shadow-[0_0_30px_rgba(108,92,231,0.5)] text-white font-black rounded-xl transition-all text-sm whitespace-nowrap group"
                >
                  <Zap className="w-4 h-4 fill-white animate-pulse" /> Upgrade to Pro
                </Link>
              ) : (
                <div className="flex items-center gap-2.5 px-6 py-3.5 bg-white/5 border border-white/10 text-white font-bold rounded-xl text-sm whitespace-nowrap">
                  <CheckCircle2 className="w-4 h-4 text-[#69f6b8]" /> {currentPlan.toUpperCase()} Plan Active
                </div>
              )}
              <Link
                to={nextAction.link}
                className="flex items-center gap-2.5 px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all text-sm whitespace-nowrap group"
              >
                Continue optimizing <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2.5 rounded-xl">
                <TrendingUp className="w-4 h-4 text-[#A29BFE]" />
                <span className="text-xs text-white/60">AI Score: <span className="text-[#A29BFE] font-bold">72/100</span></span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── 2. PROGRESS TRACKER ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-[#111827]/80 border border-white/5 rounded-2xl px-6 py-5"
        >
          <p className="text-[11px] uppercase tracking-widest font-bold text-white/30 mb-5">Your journey</p>
          <ProgressTracker steps={steps} />
        </motion.div>

        {/* ── 3. NEXT BEST ACTION ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-[11px] uppercase tracking-widest font-bold text-white/30 mb-4">Your next step</p>
          <Link to={nextAction.link}>
            <motion.div
              whileHover={{ y: -4 }}
              className="relative bg-gradient-to-br from-[#6C5CE7]/15 to-[#A29BFE]/5 border-2 border-[#6C5CE7]/40 hover:border-[#6C5CE7]/70 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all shadow-[0_0_30px_rgba(108,92,231,0.1)] hover:shadow-[0_0_40px_rgba(108,92,231,0.2)]"
            >
              <div className="absolute top-3 right-3 px-2 py-1 bg-[#6C5CE7] rounded-full text-[10px] font-bold uppercase tracking-widest">Recommended</div>
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-[#6C5CE7]/20 border border-[#6C5CE7]/30 flex items-center justify-center text-[#A29BFE] flex-shrink-0 shadow-[0_0_20px_rgba(108,92,231,0.2)]">
                  <nextAction.icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white tracking-tight">{nextAction.label}</h3>
                  <p className="text-sm text-[#9CA3AF] mt-0.5">{nextAction.sub}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-[#6C5CE7] rounded-xl text-white font-bold text-sm flex-shrink-0 group">
                Start now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* ── 4. TOOLS GRID ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Core Tools */}
          <div className="mb-6">
            <p className="text-[11px] uppercase tracking-widest font-bold text-white/30 mb-4">Core Tools</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coreTool.map((tool) => (
                <ToolCard 
                  key={tool.title} 
                  tool={tool} 
                  isLocked={tool.locked} 
                  isCompleted={tool.completed} 
                  planMismatch={checkPlanMismatch(tool.requiredPlan)}
                />
              ))}
            </div>
          </div>

          {/* Advanced Tools */}
          <div className="mb-6">
            <p className="text-[11px] uppercase tracking-widest font-bold text-white/30 mb-4">Advanced AI</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {advancedTools.map((tool) => (
                <ToolCard 
                  key={tool.title} 
                  tool={tool} 
                  isLocked={tool.locked} 
                  isCompleted={tool.completed} 
                  planMismatch={checkPlanMismatch(tool.requiredPlan)}
                />
              ))}
            </div>
          </div>

          {/* Tracking */}
          <div>
            <p className="text-[11px] uppercase tracking-widest font-bold text-white/30 mb-4">Tracking</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trackingTools.map((tool) => (
                <ToolCard 
                  key={tool.title} 
                  tool={tool} 
                  isLocked={tool.locked} 
                  isCompleted={tool.completed} 
                  planMismatch={checkPlanMismatch(tool.requiredPlan)}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── 5. STATS BAR ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { label: 'Resumes Uploaded', value: parsedData ? '1' : '0', Icon: Upload },
            { label: 'Skills Mapped', value: parsedData?.skills?.length || '0', Icon: Zap },
            { label: 'Jobs Tracked', value: trackedJobs.toString(), Icon: BarChart3 },
            { label: 'JD Analyzed', value: jdAnalysis ? '1' : '0', Icon: Target }
          ].map((stat, i) => (
            <div key={i} className="bg-[#111827]/50 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center">
                <stat.Icon className="w-4 h-4 text-[#9CA3AF]" />
              </div>
              <div>
                <p className="text-xl font-extrabold text-white leading-none">{stat.value}</p>
                <p className="text-[11px] text-white/30 uppercase tracking-wide mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

      </main>
    </PageWrapper>
  )
}
