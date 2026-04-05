import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useResumeStore } from '../store/resumeStore'
import { useSubscriptionStore } from '../store/subscriptionStore'
import { useToast } from '../hooks/useToast'
import { useEffect } from 'react'
import { Lock, Sparkles } from 'lucide-react'
import {
  generateSmartApplyPack,
  formatCoverLetterAsText,
  formatSmartApplyPackAsText,
  saveAppliedJob
} from '../services/smartApplyService'
import { fetchJobDescription } from '../services/jobTargetingService'

export default function SmartApply() {
  const navigate = useNavigate()
  const parsedData = useResumeStore((state) => state.parsedData)
  const jdAnalysis = useResumeStore((state) => state.jdAnalysis)
  const { showToast } = useToast()

  const [jobUrl, setJobUrl] = useState('')
  const [fetching, setFetching] = useState(false)
  const [jobData, setJobData] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [smartPack, setSmartPack] = useState(null)
  const [activeTab, setActiveTab] = useState('cover-letter')
  const [copied, setCopied] = useState(null)
  const [templateStyle, setTemplateStyle] = useState('professional')
  const [saved, setSaved] = useState(false)

  const { hasAccess, fetchSubscription } = useSubscriptionStore()

  useEffect(() => {
    fetchSubscription()
  }, [fetchSubscription])

  if (!hasAccess('elite')) {
    return (
      <div className="min-h-screen bg-[#070d1f] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-[2rem] flex items-center justify-center text-4xl mb-6 shadow-[0_0_50px_rgba(59,130,246,0.2)] border border-white/5">
          <Sparkles className="w-10 h-10 text-blue-400" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight mb-4">Elite Engine Locked</h1>
        <p className="text-[#a5aac2] mb-8 max-w-md mx-auto leading-relaxed">
          The <span className="text-blue-400 font-bold uppercase tracking-widest text-[10px] px-2 py-0.5 bg-blue-400/10 rounded">Smart Apply Engine</span>, including automated cover letters, recruiter hooks, and follow-up loops, is exclusive to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 font-black">ELITE</span> members.
        </p>
        <div className="flex gap-4">
          <Link to="/subscription" className="px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all hover:scale-105 active:scale-95">
            Go Elite
          </Link>
          <button onClick={() => navigate('/dashboard')} className="px-10 py-5 bg-white/5 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5">
            Dashboard
          </button>
        </div>
      </div>
    )
  }

  const handleFetchJob = async (e) => {
    e.preventDefault()
    
    if (!jobUrl.trim()) {
      showToast('Please enter a job URL', 'error')
      return
    }

    if (!parsedData) {
      showToast('Please upload your resume first', 'error')
      navigate('/upload')
      return
    }

    setFetching(true)

    try {
      const data = await fetchJobDescription(jobUrl)
      data.url = jobUrl
      setJobData(data)
      showToast('Job details fetched!', 'success')
    } catch (err) {
      showToast(err.message || 'Failed to fetch job details', 'error')
    } finally {
      setFetching(false)
    }
  }

  const handleGenerate = async () => {
    if (!jobData) {
      showToast('Please fetch job details first', 'error')
      return
    }

    setGenerating(true)

    try {
      const pack = await generateSmartApplyPack(jobData, parsedData, jdAnalysis)
      setSmartPack(pack)
      showToast('Smart Apply Pack generated!', 'success')
    } catch (err) {
      showToast(err.message || 'Failed to generate pack', 'error')
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      showToast('Copied to clipboard!', 'success')
      setTimeout(() => setCopied(null), 2000)
    } catch {
      showToast('Failed to copy', 'error')
    }
  }

  const handleDownloadCoverLetter = () => {
    if (!smartPack?.coverLetter) return

    const text = formatCoverLetterAsText(smartPack.coverLetter)
    downloadText(text, `cover-letter-${Date.now()}.txt`)
  }

  const handleDownloadAll = () => {
    if (!smartPack) return

    const text = formatSmartApplyPackAsText(smartPack)
    downloadText(text, `smart-apply-pack-${Date.now()}.txt`)
    showToast('Complete pack downloaded!', 'success')
  }

  const downloadText = (text, filename) => {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleSaveToTracker = () => {
    if (!jobData || !smartPack) return

    try {
      saveAppliedJob(jobData, parsedData, smartPack)
      setSaved(true)
      showToast('Job saved to tracker!', 'success')
    } catch (err) {
      if (err.message.includes('already')) {
        showToast('Job already in tracker', 'info')
      } else {
        showToast(err.message || 'Failed to save', 'error')
      }
    }
  }

  const handleReset = () => {
    setJobUrl('')
    setJobData(null)
    setSmartPack(null)
    setSaved(false)
    setActiveTab('cover-letter')
  }

  const tabs = [
    { id: 'cover-letter', label: 'Cover Letter', icon: '📝' },
    { id: 'recruiter-dm', label: 'LinkedIn DMs', icon: '💬' },
    { id: 'followup-emails', label: 'Follow-up Emails', icon: '📧' },
    { id: 'checklist', label: 'Checklist', icon: '✅' }
  ]

  // Show initial form
  if (!smartPack) {
    return (
      <div className="min-h-screen bg-[#070d1f] relative overflow-hidden font-sans text-white">
        <style>{`
          @keyframes grid-move { 0% { transform: translate(0, 0); } 100% { transform: translate(50px, 50px); } }
          @keyframes pulse-glow { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.1); } }
          .bg-animated-grid {
            background-image: linear-gradient(rgba(105, 246, 184, 0.05) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(105, 246, 184, 0.05) 1px, transparent 1px);
            background-size: 50px 50px;
            animation: grid-move 20s linear infinite;
          }
          .obsidian-glow { box-shadow: 0 0 50px -12px rgba(105, 246, 184, 0.2); }
        `}</style>

        <div className="fixed inset-0 bg-animated-grid"></div>
        <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#69f6b8]/10 rounded-full blur-[120px] animate-pulse-glow"></div>
        <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10">
          <header className="bg-[#070d1f]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#69f6b8] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(105,246,184,0.3)]">
                  <svg className="w-6 h-6 text-[#002919]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <span className="text-xl font-black tracking-tighter uppercase block leading-none">Smart Apply</span>
                  <span className="text-[10px] font-black text-[#69f6b8] uppercase tracking-widest mt-1 block">AI Application Architect</span>
                </div>
              </div>
              <Link to="/dashboard" className="text-[#a5aac2] font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                ← Dashboard
              </Link>
            </div>
          </header>

          <main className="max-w-4xl mx-auto px-6 py-12">
            <div className="text-center mb-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-[#11192e] rounded-[2rem] border border-white/5 flex items-center justify-center text-5xl shadow-2xl">
                📬
              </div>
              <h1 className="text-4xl font-black uppercase tracking-tight mb-3">Smart Apply Pack</h1>
              <p className="text-[#a5aac2] font-heavy text-xs uppercase tracking-[0.2em] opacity-60">Generate your complete application arsenal in seconds</p>
            </div>

            <div className="bg-[#11192e] rounded-[2.5rem] p-10 mb-8 border border-white/5 shadow-2xl obsidian-glow">
              <h3 className="text-[10px] font-black text-[#69f6b8] uppercase tracking-[0.3em] mb-8 text-center">Package Contents</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: '📝', title: 'Cover Letter', desc: 'SaaS-tailored narrative' },
                  { icon: '💬', title: 'LinkedIn DMs', desc: 'Direct recruiter hooks' },
                  { icon: '📧', title: 'Follow-up Loop', desc: 'Multi-stage email sequence' },
                  { icon: '✅', title: 'Execution List', desc: 'Strategic application steps' }
                ].map((item) => (
                  <div key={item.title} className="flex items-center gap-5 p-5 bg-[#070d1f] rounded-2xl border border-white/5 hover:border-[#69f6b8]/20 transition-all">
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <p className="text-white text-[10px] font-black uppercase tracking-widest">{item.title}</p>
                      <p className="text-[#a5aac2] text-[10px] font-bold uppercase tracking-widest opacity-40 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {!jobData && (
              <form onSubmit={handleFetchJob} className="bg-[#11192e] rounded-[3rem] p-12 border border-white/5 shadow-2xl obsidian-glow">
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Target Job</h2>
                    <p className="text-[#a5aac2] font-bold text-[10px] uppercase tracking-widest opacity-60">Enter job URL to build your customized pack</p>
                  </div>
                  <div className="relative">
                    <input
                      type="url"
                      value={jobUrl}
                      onChange={(e) => setJobUrl(e.target.value)}
                      className="w-full bg-[#070d1f] border border-white/5 rounded-[1.5rem] px-8 py-6 text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-[#69f6b8]/40 transition-all"
                      placeholder="https://www.linkedin.com/jobs/view/..."
                    />
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={fetching || !jobUrl.trim()}
                      className="px-12 py-5 bg-[#69f6b8] text-[#002919] rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(105,246,184,0.3)] transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-3"
                    >
                      {fetching ? 'Syncing...' : 'Build Apply Pack'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {jobData && !smartPack && (
              <div className="space-y-8">
                <div className="bg-[#11192e] rounded-[3rem] p-12 border border-white/5 obsidian-glow lg:relative">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/[0.03] rounded-[1.5rem] flex items-center justify-center text-4xl border border-white/5">
                        {jobData.jobBoard?.icon || '💼'}
                      </div>
                      <div>
                        <h2 className="text-3xl font-black uppercase tracking-tight">{jobData.title}</h2>
                        <p className="text-[#a5aac2] font-heavy text-sm uppercase tracking-widest mt-1">{jobData.company} • {jobData.location || 'Remote'}</p>
                      </div>
                    </div>
                    <button onClick={handleReset} className="text-[#a5aac2] font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                      Change Target
                    </button>
                  </div>

                  <div className="mb-12">
                    <h3 className="text-[10px] font-black text-[#a5aac2] uppercase tracking-[0.3em] mb-6 text-center opacity-60">Narrative Style</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: 'professional', label: 'Pro', icon: '👔' },
                        { id: 'modern', label: 'Bold', icon: '✨' },
                        { id: 'creative', label: 'Story', icon: '🎨' }
                      ].map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setTemplateStyle(style.id)}
                          className={`p-6 rounded-[1.5rem] border transition-all flex flex-col items-center gap-3 ${
                            templateStyle === style.id
                              ? 'bg-[#69f6b8] text-[#002919] border-[#69f6b8]'
                              : 'bg-[#070d1f] border-white/5 text-[#a5aac2] hover:border-white/20'
                          }`}
                        >
                          <span className="text-2xl">{style.icon}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest">{style.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={handleGenerate}
                      disabled={generating}
                      className="px-16 py-6 bg-[#69f6b8] text-[#002919] rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(105,246,184,0.4)] transition-all hover:scale-105 active:scale-95 disabled:opacity-30"
                    >
                      {generating ? 'Architecting Pack...' : 'Establish Narrative'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    )
  }

  // Render Smart Pack
  return (
    <div className="min-h-screen bg-[#070d1f] relative overflow-hidden font-sans text-white">
      <style>{`
        @keyframes grid-move { 0% { transform: translate(0, 0); } 100% { transform: translate(50px, 50px); } }
        .bg-animated-grid {
          background-image: linear-gradient(rgba(105, 246, 184, 0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(105, 246, 184, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: grid-move 20s linear infinite;
        }
        .obsidian-glow { box-shadow: 0 0 50px -12px rgba(105, 246, 184, 0.2); }
      `}</style>

      <div className="fixed inset-0 bg-animated-grid"></div>
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>

      <div className="relative z-10">
        <header className="bg-[#070d1f]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#69f6b8] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(105,246,184,0.3)]">
                <svg className="w-6 h-6 text-[#002919]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-black tracking-tighter uppercase block leading-none">Smart Pack</span>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={handleDownloadAll}
                className="hidden md:flex px-6 py-3 bg-[#69f6b8] text-[#002919] rounded-xl font-black text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(105,246,184,0.2)] transition-all hover:scale-105"
              >
                Download Pack
              </button>
              <Link to="/dashboard" className="text-[#a5aac2] font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                ← Dashboard
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-12">
          <div className="bg-[#11192e] rounded-[2.5rem] p-10 mb-8 border border-white/5 obsidian-glow">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                 <div className="w-14 h-14 bg-[#070d1f] rounded-2xl flex items-center justify-center text-3xl border border-white/5">
                   {smartPack.jobData.jobBoard?.icon || '🏢'}
                 </div>
                 <div>
                   <h2 className="text-2xl font-black uppercase tracking-tight text-white">{smartPack.jobData.title}</h2>
                   <p className="text-[#69f6b8] font-black text-[10px] uppercase tracking-widest mt-1">{smartPack.jobData.company}</p>
                 </div>
              </div>
              <button onClick={handleReset} className="text-[10px] font-black text-[#a5aac2] uppercase tracking-widest hover:text-white pb-1 border-b border-white/10 hover:border-[#69f6b8] transition-all">
                Construct New Pack
              </button>
            </div>
          </div>

          <div className="flex gap-1 p-1.5 bg-[#11192e] rounded-[1.5rem] border border-white/5 mb-10 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-3 ${
                  activeTab === tab.id
                    ? 'bg-[#69f6b8] text-[#002919] shadow-[0_0_20px_rgba(105,246,184,0.2)]'
                    : 'text-[#a5aac2] hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-lg opacity-80">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="bg-[#11192e] rounded-[3rem] p-12 border border-white/5 obsidian-glow">
            {activeTab === 'cover-letter' && smartPack.coverLetter && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <h3 className="text-[10px] font-black text-[#a5aac2] uppercase tracking-[0.3em]">Strategic Cover Narrative</h3>
                    <span className="bg-[#69f6b8]/10 text-[#69f6b8] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{smartPack.coverLetter.style}</span>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleCopy(formatCoverLetterAsText(smartPack.coverLetter), 'cover-letter')}
                      className="px-6 py-3 bg-[#070d1f] hover:bg-white/5 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border border-white/5"
                    >
                      {copied === 'cover-letter' ? '✓ Copied' : 'Copy Text'}
                    </button>
                    <button
                      onClick={handleDownloadCoverLetter}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border border-white/5"
                    >
                      Download .txt
                    </button>
                  </div>
                </div>
                <div className="bg-[#070d1f] rounded-[2rem] p-10 border border-white/5 relative">
                  <textarea
                    readOnly
                    value={formatCoverLetterAsText(smartPack.coverLetter)}
                    className="w-full bg-transparent text-[#a5aac2] text-sm font-bold leading-relaxed focus:outline-none resize-none min-h-[600px] scrollbar-thin scrollbar-thumb-white/10"
                  />
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                     <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16L9.01703 16V13L12.017 13C14.7785 13 17.017 10.7614 17.017 8L17.017 5L20.017 5L20.017 8C20.017 12.4183 16.4353 16 12.017 16L12.017 18L14.017 18V21L14.017 21ZM7.01703 21L7.01703 18C7.01703 16.8954 6.12157 16 5.01703 16L2.01703 16V13L5.01703 13C7.7785 13 10.017 10.7614 10.017 8L10.017 5L13.017 5L13.017 8C13.017 12.4183 9.4353 16 5.01703 16L5.01703 18L7.01703 18V21L7.01703 21Z" /></svg>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'recruiter-dm' && smartPack.recruiterDMs && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                {smartPack.recruiterDMs.map((dm, idx) => (
                  <div key={idx} className="bg-[#070d1f] rounded-[2rem] p-10 border border-white/5 group hover:border-[#69f6b8]/20 transition-all">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">💬</span>
                        <h4 className="text-white text-[10px] font-black uppercase tracking-widest">{dm.type} Precision Hook</h4>
                      </div>
                      <button
                        onClick={() => handleCopy(dm.message, `dm-${idx}`)}
                        className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        {copied === `dm-${idx}` ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                    <div className="space-y-4">
                       <div className="flex items-center gap-3 text-[10px] font-black text-[#69f6b8] uppercase tracking-widest mb-4">
                         <span className="opacity-40 text-white">Subject:</span> {dm.subject}
                       </div>
                       <textarea
                         readOnly
                         value={dm.message}
                         className="w-full bg-[#11192e]/40 border border-white/5 rounded-2xl px-8 py-6 text-[#a5aac2] text-sm font-bold min-h-[180px] focus:outline-none resize-none"
                       />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'followup-emails' && smartPack.followUpEmails && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                {smartPack.followUpEmails.map((email, idx) => (
                  <div key={idx} className="bg-[#070d1f] rounded-[2rem] p-10 border border-white/5">
                    <div className="flex items-center justify-between mb-8">
                       <h4 className="text-white text-[10px] font-black uppercase tracking-widest">{email.type.replace(/-/g, ' ')} Strategy</h4>
                       <button
                         onClick={() => handleCopy(email.body, `email-${idx}`)}
                         className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                       >
                         {copied === `email-${idx}` ? '✓ Copied' : 'Copy'}
                       </button>
                    </div>
                    <div className="space-y-4">
                       <div className="bg-[#11192e] p-4 rounded-xl border border-white/5 text-[10px] font-black text-white uppercase tracking-widest mb-4">
                         <span className="text-[#a5aac2] mr-2">Subject:</span> {email.subject}
                       </div>
                       <textarea
                         readOnly
                         value={email.body}
                         className="w-full bg-transparent text-[#a5aac2] text-sm font-bold leading-relaxed min-h-[300px] focus:outline-none resize-none"
                       />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'checklist' && smartPack.checklist && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="text-[10px] font-black text-[#a5aac2] uppercase tracking-[0.3em] mb-10 text-center">Execution Roadmap</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-12">
                  {smartPack.checklist.map((item, idx) => (
                    <label key={idx} className="flex items-center gap-5 p-6 bg-[#070d1f] rounded-[1.5rem] border border-white/5 cursor-pointer group hover:border-[#69f6b8]/30 transition-all">
                      <div className="relative flex items-center justify-center">
                        <input type="checkbox" className="peer appearance-none w-6 h-6 border-2 border-white/10 rounded-lg checked:bg-[#69f6b8] checked:border-[#69f6b8] transition-all cursor-pointer" />
                        <svg className="absolute w-4 h-4 text-[#002919] hidden peer-checked:block pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="text-[#a5aac2] font-black text-[10px] uppercase tracking-widest group-hover:text-white transition-colors">{item.item}</span>
                    </label>
                  ))}
                </div>

                <div className="bg-[#69f6b8]/5 border border-[#69f6b8]/10 rounded-[2rem] p-10 mb-12">
                  <h4 className="text-[#69f6b8] text-[10px] font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                    <span className="text-xl">💡</span> Strategic Insights
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    {smartPack.tips.map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <span className="w-1.5 h-1.5 bg-[#69f6b8] rounded-full mt-1.5 flex-shrink-0" />
                        <p className="text-[#a5aac2] text-sm font-bold leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleSaveToTracker}
                    disabled={saved}
                    className={`px-16 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all ${
                      saved
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-[#69f6b8] text-[#002919] shadow-[0_0_30px_rgba(105,246,184,0.3)] hover:scale-105 active:scale-95'
                    }`}
                  >
                    {saved ? '✓ Archived in Tracker' : 'Save To Job Tracker'}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
