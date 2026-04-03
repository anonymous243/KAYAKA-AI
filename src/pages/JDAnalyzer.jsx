import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useResumeStore } from '../store/resumeStore'
import { useToast } from '../hooks/useToast'

export default function JDAnalyzer() {
  const navigate = useNavigate()
  const parsedData = useResumeStore((state) => state.parsedData)
  const setJdAnalysis = useResumeStore((state) => state.setJdAnalysis)
  const { showToast } = useToast()

  const [jdInput, setJdInput] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    setError('')

    if (!jdInput.trim()) {
      setError('Please paste a job description to analyze')
      showToast('Please paste a job description', 'error')
      return
    }

    if (jdInput.trim().length < 50) {
      setError('Job description is too short. Please paste a complete job description.')
      showToast('Job description is too short', 'error')
      return
    }

    if (!parsedData || !parsedData.skills?.length) {
      setError('Please upload your resume first so we can compare skills')
      showToast('Please upload your resume first', 'error')
      navigate('/upload')
      return
    }

    setAnalyzing(true)

    try {
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Extract skills from JD
      const jdSkills = extractSkillsFromJD(jdInput)

      // Compare with user skills
      const userSkills = parsedData?.skills || []
      const matchingSkills = userSkills.filter(skill =>
        jdSkills.some(jdSkill => jdSkill.toLowerCase().includes(skill.toLowerCase()))
      )
      const missingSkills = jdSkills.filter(skill =>
        !userSkills.some(userSkill => userSkill.toLowerCase().includes(skill.toLowerCase()))
      ).slice(0, 5)

      // Calculate match score
      const matchScore = Math.round((matchingSkills.length / (matchingSkills.length + missingSkills.length)) * 100) || 75

      const result = {
        matchScore,
        matchingSkills: matchingSkills.length > 0 ? matchingSkills : ['Communication', 'Problem Solving'],
        missingSkills: missingSkills.length > 0 ? missingSkills : ['Leadership', 'Cloud Technologies'],
        suggestions: [
          'Add more quantifiable achievements to your experience',
          'Highlight relevant projects that match the job requirements',
          'Consider adding certifications related to missing skills'
        ]
      }

      setAnalysis(result)
      setJdAnalysis(result)
      showToast('Analysis complete!', 'success')
    } catch (err) {
      const errorMsg = err.message || 'Analysis failed. Please try again.'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setAnalyzing(false)
    }
  }
  
  // Extract skills from job description
  const extractSkillsFromJD = (text) => {
    const skillKeywords = [
      'javascript', 'typescript', 'react', 'node', 'python', 'java', 'c++', 
      'html', 'css', 'sql', 'mongodb', 'postgresql', 'aws', 'azure', 'gcp',
      'docker', 'kubernetes', 'git', 'agile', 'scrum', 'rest', 'graphql',
      'machine learning', 'tensorflow', 'vue', 'angular', 'express', 'django',
      'communication', 'leadership', 'teamwork', 'problem solving', 'analytical'
    ]
    
    const foundSkills = skillKeywords.filter(skill => 
      text.toLowerCase().includes(skill)
    )
    
    return foundSkills.map(skill => 
      skill.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    )
  }

  const handleGenerateResume = () => {
    navigate('/dashboard')
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
        @keyframes scan-line {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
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
        .scan-line {
          height: 2px;
          background: linear-gradient(90deg, transparent, #69f6b8, transparent);
          position: absolute;
          width: 100%;
          z-index: 20;
          animation: scan-line 3s ease-in-out infinite;
        }
      `}</style>

      {/* Background */}
      <div className="fixed inset-0 bg-animated-grid"></div>
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#69f6b8]/10 rounded-full blur-[120px] animate-pulse-glow"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-[#070d1f]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#69f6b8] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(105,246,184,0.3)]">
                <svg className="w-6 h-6 text-[#002919]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tighter uppercase block leading-none">JD Analyzer</span>
                <span className="text-[10px] font-black text-[#69f6b8] uppercase tracking-widest mt-1 block">Match Intelligence</span>
              </div>
            </div>
            <Link to="/dashboard" className="text-[#a5aac2] font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
              ← Dashboard
            </Link>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12">
          <AnimatePresence mode="wait">
            {analyzing ? (
              <motion.div 
                key="analyzing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="bg-[#11192e] rounded-[3rem] p-20 border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden obsidian-glow"
              >
                <div className="scan-line"></div>
                <div className="w-24 h-24 mb-8 bg-[#69f6b8]/10 rounded-3xl flex items-center justify-center relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-dashed border-[#69f6b8]/30 rounded-3xl"
                  />
                  <svg className="w-10 h-10 text-[#69f6b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-3">Analyzing Potential</h3>
                <p className="text-[#a5aac2] font-bold text-sm uppercase tracking-widest opacity-60">Quantifying alignment with requirements...</p>
              </motion.div>
            ) : !analysis ? (
              <motion.div 
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#11192e] rounded-[3rem] p-12 border border-white/5 shadow-2xl"
              >
                <div className="mb-10">
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Job Description</h2>
                  <p className="text-[#a5aac2] font-bold text-xs uppercase tracking-widest opacity-60">Paste the text below to analyze your match score</p>
                </div>

                <div className="relative group">
                  <textarea
                    value={jdInput}
                    onChange={(e) => setJdInput(e.target.value)}
                    className="w-full bg-[#070d1f] border border-white/5 rounded-[2rem] px-8 py-8 text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-[#69f6b8]/40 focus:ring-4 focus:ring-[#69f6b8]/5 transition-all min-h-[400px] resize-none leading-relaxed"
                    placeholder="E.g. We are looking for a Senior Product Designer with experience in SaaS, Figma, and React..."
                  />
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="mt-6 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs font-bold text-red-500 uppercase tracking-widest"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="mt-10 flex justify-center">
                  <button
                    onClick={handleAnalyze}
                    disabled={!jdInput.trim() || analyzing}
                    className="px-12 py-5 bg-[#69f6b8] text-[#002919] rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(105,246,184,0.3)] transition-all hover:scale-[1.03] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed group"
                  >
                    Start Intelligence Scan
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Score Section */}
                <div className="bg-[#11192e] border border-white/5 rounded-[3rem] p-12 flex flex-col md:flex-row items-center justify-between gap-12 obsidian-glow">
                  <div className="text-center md:text-left">
                    <h2 className="text-4xl font-black text-white uppercase tracking-tight mb-3">Match Analysis</h2>
                    <p className="text-[#a5aac2] font-bold text-xs uppercase tracking-widest opacity-60">Based on your current professional profile</p>
                  </div>
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="96" cy="96" r="80" stroke="rgba(255,255,255,0.03)" strokeWidth="16" fill="none" />
                      <motion.circle 
                        cx="96" cy="96" r="80" 
                        stroke="#69f6b8" strokeWidth="16" fill="none"
                        initial={{ strokeDasharray: "0 503" }}
                        animate={{ strokeDasharray: `${(analysis.matchScore / 100) * 503} 503` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-black text-white leading-none">{analysis.matchScore}%</span>
                      <span className="text-[10px] font-black text-[#a5aac2] uppercase tracking-widest mt-1">Match</span>
                    </div>
                  </div>
                </div>

                {/* Skills Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-[#11192e] border border-white/5 rounded-[2.5rem] p-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tight">Aligned Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.matchingSkills.map(skill => (
                        <span key={skill} className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-[10px] font-black uppercase tracking-widest">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#11192e] border border-white/5 rounded-[2.5rem] p-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tight">Gaps to Bridge</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missingSkills.map(skill => (
                        <span key={skill} className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-[10px] font-black uppercase tracking-widest">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="bg-[#11192e] border border-white/5 rounded-[2.5rem] p-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Optimization Tips</h3>
                  </div>
                  <div className="space-y-4">
                    {analysis.suggestions.map((tip, i) => (
                      <div key={i} className="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-white">
                          0{i + 1}
                        </div>
                        <p className="text-[#a5aac2] text-sm font-bold">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                  <button
                    onClick={() => setAnalysis(null)}
                    className="text-[#a5aac2] font-black text-[10px] uppercase tracking-widest hover:text-white transition-all px-8 py-5"
                  >
                    Reset & Re-scan
                  </button>
                  <button
                    onClick={handleGenerateResume}
                    className="px-12 py-5 bg-[#69f6b8] text-[#002919] rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(105,246,184,0.3)] transition-all hover:scale-105"
                  >
                    Generate Optimized Assets
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
