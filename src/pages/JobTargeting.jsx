import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useResumeStore } from '../store/resumeStore'
import { useToast } from '../hooks/useToast'
import {
  SUPPORTED_JOB_BOARDS,
  extractJobBoard,
  isValidJobUrl,
  fetchJobDescription,
  generateRecruiterSummary,
  saveJobApplication
} from '../services/jobTargetingService'

export default function JobTargeting() {
  const navigate = useNavigate()
  const parsedData = useResumeStore((state) => state.parsedData)
  const { showToast } = useToast()

  const [jobUrl, setJobUrl] = useState('')
  const [inputMode, setInputMode] = useState('url')
  const [manualJob, setManualJob] = useState({ title: '', company: '', description: '' })
  const [fetching, setFetching] = useState(false)
  const [jobData, setJobData] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const handleFetchJob = async (e) => {
    e.preventDefault()
    setError('')
    setJobData(null)
    setAnalysis(null)
    setSaved(false)

    if (!isValidJobUrl(jobUrl)) {
      setError('Please enter a valid URL')
      showToast('Please enter a valid URL', 'error')
      return
    }

    const jobBoard = extractJobBoard(jobUrl)
    if (!jobBoard) {
      setError('Unable to identify job board from URL')
      return
    }

    if (!parsedData || !parsedData.skills?.length) {
      setError('Please upload your resume first to analyze job match')
      showToast('Please upload your resume first', 'error')
      navigate('/upload')
      return
    }

    setFetching(true)

    try {
      const data = await fetchJobDescription(jobUrl)
      data.url = jobUrl
      data.jobBoard = jobBoard
      setJobData(data)
      showToast('Job description fetched successfully!', 'success')
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch job description'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setFetching(false)
    }
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!manualJob.title.trim() || !manualJob.company.trim() || !manualJob.description.trim()) {
      setError('Please fill in all fields')
      return
    }
    setJobData({
      title: manualJob.title.trim(),
      company: manualJob.company.trim(),
      description: manualJob.description.trim(),
      location: 'Not Specified',
      salary: '',
      type: 'Not Specified',
      url: 'Manual Entry',
      jobBoard: SUPPORTED_JOB_BOARDS.find(b => b.id === 'other'),
      fetchedAt: new Date().toISOString()
    })
    showToast('Job details added successfully!', 'success')
  }

  const handleAnalyze = async () => {
    if (!jobData) return

    setAnalyzing(true)
    setError('')

    try {
      const result = await generateRecruiterSummary(jobData, parsedData.skills || [])
      setAnalysis(result)
      showToast('Analysis complete!', 'success')
    } catch (err) {
      const errorMsg = err.message || 'Analysis failed'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleSaveJob = async () => {
    if (!jobData || !analysis) return

    try {
      await saveJobApplication(jobData, analysis)
      setSaved(true)
      showToast('Job saved to tracker!', 'success')
    } catch {
      showToast('Failed to save job', 'error')
    }
  }

  const handleReset = () => {
    setJobUrl('')
    setJobData(null)
    setAnalysis(null)
    setError('')
    setSaved(false)
  }

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
        {/* Header */}
        <header className="bg-[#070d1f]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#69f6b8] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(105,246,184,0.3)]">
                <svg className="w-6 h-6 text-[#002919]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-black tracking-tighter uppercase block leading-none">Job Targeting</span>
                <span className="text-[10px] font-black text-[#69f6b8] uppercase tracking-widest mt-1 block">Recruiter Intent Engine</span>
              </div>
            </div>
            <Link to="/dashboard" className="text-[#a5aac2] font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
              ← Dashboard
            </Link>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12">
          {/* Supported Job Boards */}
          {!jobData && (
            <div className="bg-[#11192e] rounded-[2rem] p-8 mb-8 border border-white/5">
              <h3 className="text-[10px] font-black text-[#a5aac2] uppercase tracking-[0.2em] mb-6 opacity-60 text-center">Optimized For</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {SUPPORTED_JOB_BOARDS.map((board) => (
                  <div key={board.id} className="flex items-center gap-3 px-5 py-3 bg-white/[0.03] rounded-2xl border border-white/5 group hover:border-[#69f6b8]/30 transition-all">
                    <span className="text-xl grayscale group-hover:grayscale-0 transition-all">{board.icon}</span>
                    <span className="text-[#a5aac2] group-hover:text-white text-xs font-black uppercase tracking-widest">{board.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          {!jobData && (
            <div className="bg-[#11192e] rounded-[3rem] p-12 border border-white/5 shadow-2xl obsidian-glow">
              <div className="flex gap-1 mb-10 bg-[#070d1f] p-1.5 rounded-2xl w-fit mx-auto border border-white/5">
                {[
                  { id: 'url', label: 'Paste URL', icon: '🔗' },
                  { id: 'manual', label: 'Manual Entry', icon: '📝' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => { setInputMode(tab.id); setError(''); }}
                    className={`text-[10px] uppercase tracking-widest font-black px-6 py-3 rounded-xl transition-all ${inputMode === tab.id ? 'bg-[#69f6b8] text-[#002919]' : 'text-[#a5aac2] hover:text-white hover:bg-white/5'}`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              {inputMode === 'url' ? (
                <form onSubmit={handleFetchJob}>
                  <div className="space-y-8">
                    <div className="text-center">
                      <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Target Job URL</h2>
                      <p className="text-[#a5aac2] font-bold text-xs uppercase tracking-widest opacity-60">We'll extract the description and analyze recruiter intent</p>
                    </div>
                    <div className="relative group">
                      <input
                        type="url"
                        value={jobUrl}
                        onChange={(e) => setJobUrl(e.target.value)}
                        className="w-full bg-[#070d1f] border border-white/5 rounded-[1.5rem] px-8 py-6 text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-[#69f6b8]/40 focus:ring-4 focus:ring-[#69f6b8]/5 transition-all"
                        placeholder="https://www.linkedin.com/jobs/view/..."
                      />
                    </div>
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        disabled={fetching || !jobUrl.trim()}
                        className="px-12 py-5 bg-[#69f6b8] text-[#002919] rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(105,246,184,0.3)] transition-all hover:scale-[1.03] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-3"
                      >
                        {fetching ? (
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        )}
                        {fetching ? 'Extracting Data...' : 'Start Extraction'}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleManualSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-[#a5aac2] uppercase tracking-widest ml-4">Job Title</label>
                       <input type="text" value={manualJob.title} onChange={(e) => setManualJob({...manualJob, title: e.target.value})} className="w-full bg-[#070d1f] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#69f6b8]/40" placeholder="Software Engineer" required />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-[#a5aac2] uppercase tracking-widest ml-4">Company</label>
                       <input type="text" value={manualJob.company} onChange={(e) => setManualJob({...manualJob, company: e.target.value})} className="w-full bg-[#070d1f] border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-[#69f6b8]/40" placeholder="Google" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#a5aac2] uppercase tracking-widest ml-4">Job Description</label>
                    <textarea value={manualJob.description} onChange={(e) => setManualJob({...manualJob, description: e.target.value})} className="w-full bg-[#070d1f] border border-white/5 rounded-[1.5rem] px-8 py-6 text-sm font-bold min-h-[250px] focus:outline-none focus:border-[#69f6b8]/40 resize-none" placeholder="Paste the job requirements here..." required />
                  </div>
                  <div className="flex justify-center pt-4">
                    <button type="submit" className="px-12 py-5 bg-[#69f6b8] text-[#002919] rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(105,246,184,0.3)] transition-all hover:scale-103">
                      Analyze Pasted Content
                    </button>
                  </div>
                </form>
              )}
              {error && (
                <div className="mt-8 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black text-red-500 uppercase tracking-widest text-center">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Job Data Display */}
          {jobData && !analysis && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="bg-[#11192e] border border-white/5 rounded-[3rem] p-12 obsidian-glow">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/[0.03] rounded-[1.5rem] flex items-center justify-center text-4xl border border-white/5">
                      {jobData.jobBoard?.icon || '🏢'}
                    </div>
                    <div>
                      <h2 className="text-3xl font-black uppercase tracking-tight">{jobData.title}</h2>
                      <p className="text-[#a5aac2] font-heavy text-sm uppercase tracking-widest mt-1">{jobData.company} • {jobData.location || 'Remote'}</p>
                    </div>
                  </div>
                  <button onClick={handleReset} className="text-[#a5aac2] font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                    Reset Engine
                  </button>
                </div>

                <div className="bg-[#070d1f] rounded-[2rem] p-8 border border-white/5 mb-10">
                  <h3 className="text-[10px] font-black text-[#a5aac2] uppercase tracking-[0.3em] mb-6">Extracted Context</h3>
                  <p className="text-[#a5aac2] text-sm font-bold leading-relaxed whitespace-pre-line max-h-64 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10">
                    {jobData.description}
                  </p>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="px-12 py-5 bg-[#69f6b8] text-[#002919] rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(105,246,184,0.3)] transition-all hover:scale-105 disabled:opacity-30 flex items-center gap-3"
                  >
                    {analyzing && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
                    {analyzing ? 'Quantifying Intent...' : 'Analyze Recruiter Intent'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Analysis Results */}
          {analysis && jobData && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-20">
              <div className="bg-[#11192e] border border-white/5 rounded-[3rem] p-12 obsidian-glow">
                <div className="flex flex-col md:flex-row items-center gap-12">
                   <div className="relative w-48 h-48 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="96" cy="96" r="80" stroke="rgba(255,255,255,0.03)" strokeWidth="16" fill="none" />
                        <motion.circle 
                          cx="96" cy="96" r="80" 
                          stroke="#69f6b8" strokeWidth="16" fill="none"
                          initial={{ strokeDasharray: "0 503" }}
                          animate={{ strokeDasharray: `${(analysis.matchPercentage / 100) * 503} 503` }}
                          transition={{ duration: 1.5, delay: 0.2 }}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-black text-white">{analysis.matchPercentage}%</span>
                        <span className="text-[10px] font-black text-[#a5aac2] uppercase tracking-[0.2em] mt-1">Match</span>
                      </div>
                   </div>
                   <div className="flex-1 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                        <h2 className="text-3xl font-black uppercase tracking-tight">Intent Signals</h2>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          analysis.recruiterIntent === 'high' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                          analysis.recruiterIntent === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}>
                          {analysis.recruiterIntent} Priority
                        </span>
                      </div>
                      <p className="text-[#a5aac2] text-sm font-bold leading-relaxed">{analysis.summary}</p>
                   </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-[#11192e] border border-white/5 rounded-[2.5rem] p-10">
                   <h3 className="text-[10px] font-black text-[#a5aac2] uppercase tracking-[0.2em] mb-8 border-b border-white/5 pb-4">Aligned Strengths</h3>
                   <div className="flex flex-wrap gap-2">
                     {analysis.matchingSkills.map(skill => (
                       <span key={skill} className="px-5 py-2.5 bg-green-500/5 border border-green-500/10 rounded-xl text-green-400 text-[10px] font-black uppercase tracking-widest">{skill}</span>
                     ))}
                   </div>
                </div>
                <div className="bg-[#11192e] border border-white/5 rounded-[2.5rem] p-10">
                   <h3 className="text-[10px] font-black text-[#a5aac2] uppercase tracking-[0.2em] mb-8 border-b border-white/5 pb-4">Target Improvements</h3>
                   <div className="flex flex-wrap gap-2">
                     {analysis.missingSkills.map(skill => (
                       <span key={skill} className="px-5 py-2.5 bg-amber-500/5 border border-amber-500/10 rounded-xl text-amber-400 text-[10px] font-black uppercase tracking-widest">{skill}</span>
                     ))}
                   </div>
                </div>
              </div>

              <div className="bg-[#11192e] border border-white/5 rounded-[2.5rem] p-10">
                <h3 className="text-[10px] font-black text-[#a5aac2] uppercase tracking-[0.3em] mb-10 text-center">AI Strategic Guidance</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {analysis.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex gap-4 p-5 bg-[#070d1f] border border-white/5 rounded-2xl">
                      <div className="w-8 h-8 rounded-lg bg-[#69f6b8]/10 flex items-center justify-center text-[10px] font-black text-[#69f6b8] flex-shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-[#a5aac2] text-sm font-bold leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-10">
                <button onClick={handleReset} className="text-[#a5aac2] font-black text-[10px] uppercase tracking-widest hover:text-white transition-all px-8 py-5">
                  Analyze Another Job
                </button>
                <div className="flex gap-4">
                  <button onClick={handleSaveJob} disabled={saved} className={`px-10 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${saved ? 'bg-green-600/20 text-green-400 border border-green-600/30' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}`}>
                    {saved ? '✓ Saved to Tracker' : 'Save To Tracker'}
                  </button>
                  <Link to="/resume-generator" className="px-12 py-5 bg-[#69f6b8] text-[#002919] rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-[0_0_30px_rgba(105,246,184,0.3)] transition-all hover:scale-105 active:scale-95">
                    Generate Resume
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  )
}
