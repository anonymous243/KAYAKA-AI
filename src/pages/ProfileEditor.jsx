import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useResumeStore } from '../store/resumeStore'

export default function ProfileEditor() {
  const navigate = useNavigate()
  const { parsedData, setParsedData } = useResumeStore()
  const [loading, setLoading] = useState(false)
  const [activeSection, setActiveSection] = useState('personal')
  const [showSkillModal, setShowSkillModal] = useState(false)
  const [editingSkill, setEditingSkill] = useState(null)
  const [skillInput, setSkillInput] = useState('')

  // Form state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    linkedin: '',
    website: '',
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: []
  })

  useEffect(() => {
    // Load parsed data from resume upload
    if (parsedData) {
      setProfile(prev => ({
        ...prev,
        name: parsedData.name || '',
        email: parsedData.email || '',
        phone: parsedData.phone || '',
        location: parsedData.location || '',
        summary: parsedData.summary || '',
        skills: parsedData.skills || [],
        experience: parsedData.experience || [],
        education: parsedData.education || [],
        projects: parsedData.projects || []
      }))
    }
  }, [parsedData])

  const handleSave = async () => {
    setLoading(true)
    try {
      // Save to localStorage via store
      setParsedData(profile)
      
      // Navigate to dashboard
      navigate('/dashboard')
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    navigate('/dashboard')
  }

  // Skills handlers
  const addSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }))
      setSkillInput('')
      setShowSkillModal(false)
    }
  }

  const removeSkill = (skill) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }))
  }

  const editSkill = (skill) => {
    setEditingSkill(skill)
    setSkillInput(skill)
    setShowSkillModal(true)
  }

  const updateSkill = () => {
    if (skillInput.trim() && editingSkill) {
      setProfile(prev => ({
        ...prev,
        skills: prev.skills.map(s => s === editingSkill ? skillInput.trim() : s)
      }))
      setSkillInput('')
      setEditingSkill(null)
      setShowSkillModal(false)
    }
  }

  // Experience handlers
  const addExperience = () => {
    setProfile(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: Date.now(),
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }]
    }))
  }

  const updateExperience = (id, field, value) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const removeExperience = (id) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }))
  }

  // Education handlers
  const addEducation = () => {
    setProfile(prev => ({
      ...prev,
      education: [...prev.education, {
        id: Date.now(),
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: ''
      }]
    }))
  }

  const updateEducation = (id, field, value) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }))
  }

  const removeEducation = (id) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }))
  }

  // Project handlers
  const addProject = () => {
    setProfile(prev => ({
      ...prev,
      projects: [...prev.projects, {
        id: Date.now(),
        name: '',
        description: '',
        technologies: [],
        link: ''
      }]
    }))
  }

  const updateProject = (id, field, value) => {
    setProfile(prev => ({
      ...prev,
      projects: prev.projects.map(proj => 
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    }))
  }

  const removeProject = (id) => {
    setProfile(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }))
  }

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'projects', label: 'Projects', icon: '🚀' }
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Animated background */}
      <style>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(5deg); }
          66% { transform: translateY(-5px) rotate(-5deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes border-flow {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        .bg-animated-grid {
          background-image: 
            linear-gradient(rgba(105, 246, 184, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(105, 246, 184, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: grid-move 20s linear infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          animation: shimmer 2s infinite;
        }
        .border-flow {
          animation: border-flow 3s linear infinite;
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .glass-input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        .glass-input:focus {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.2);
        }
        .neon-text {
          text-shadow: 0 0 10px rgba(59, 130, 246, 0.5),
                       0 0 20px rgba(59, 130, 246, 0.3),
                       0 0 30px rgba(59, 130, 246, 0.2);
        }
        .neon-border {
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.3),
                      inset 0 0 10px rgba(59, 130, 246, 0.1);
        }
        .gradient-border {
          position: relative;
          background: linear-gradient(#0a0a0f, #0a0a0f) padding-box,
                      linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899) border-box;
          border: 2px solid transparent;
          border-radius: 16px;
        }
      `}</style>

      {/* Background layers */}
      <div className="fixed inset-0 bg-animated-grid"></div>
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse-glow"></div>
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-500/10 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '4s' }}></div>
      
      {/* Floating particles */}
      <div className="fixed top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full blur-[2px] animate-float"></div>
      <div className="fixed top-3/4 right-1/4 w-3 h-3 bg-purple-400 rounded-full blur-[3px] animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="fixed bottom-1/4 left-1/3 w-2 h-2 bg-pink-400 rounded-full blur-[2px] animate-float" style={{ animationDelay: '2s' }}></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="glass-panel border-b border-white/5 sticky top-0 z-50 bg-[#070d1f]/60 backdrop-blur-2xl">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-10 h-10 bg-gradient-to-br from-[#69f6b8] to-[#005c52] rounded-xl flex items-center justify-center obsidian-glow transition-transform group-hover:scale-110">
                  <svg className="w-6 h-6 text-[#002919]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tighter text-white leading-none uppercase">KAYAKA-AI</span>
                  <span className="text-[9px] font-black text-[#69f6b8] tracking-[0.2em] mt-1 opacity-80 uppercase">Profile Editor</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <Link to="/dashboard" className="text-[#a5aac2] hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
                  ← Back
                </Link>
                <button
                  onClick={handleSkip}
                  className="hidden sm:block text-[#a5aac2] hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
                >
                  Skip
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-8 py-3 bg-[#69f6b8] text-[#002919] rounded-xl font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(105,246,184,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(105,246,184,0.5)] active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-[#002919] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  Save & Continue
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar navigation */}
            <div className="lg:col-span-1">
              <nav className="bg-[#11192e] border border-white/5 rounded-3xl p-6 sticky top-28 shadow-xl">
                <h3 className="text-[10px] font-black text-[#a5aac2] uppercase tracking-[0.2em] mb-6 px-2 opacity-60">
                  Sections
                </h3>
                <div className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative overflow-hidden ${
                        activeSection === section.id
                          ? 'bg-[#69f6b8]/10 text-[#69f6b8] border border-[#69f6b8]/20 shadow-[0_0_15px_rgba(105,246,184,0.1)]'
                          : 'text-[#a5aac2] hover:text-white hover:bg-white/[0.03] border border-transparent'
                      }`}
                    >
                      <span className={`text-xl transition-transform duration-300 ${activeSection === section.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {section.icon}
                      </span>
                      <span className="font-bold text-xs uppercase tracking-widest">{section.label}</span>
                      {activeSection === section.id && (
                        <motion.div 
                          layoutId="active-indicator"
                          className="ml-auto w-1.5 h-1.5 bg-[#69f6b8] rounded-full shadow-[0_0_10px_#69f6b8]"
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Progress indicator */}
                <div className="mt-10 px-2">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                    <span className="opacity-60 text-[#a5aac2]">Completion</span>
                    <span className="text-[#69f6b8]">
                      {Math.round(
                        (((profile.name ? 1 : 0) +
                        (profile.email ? 1 : 0) +
                        (profile.skills?.length > 0 ? 2 : 0) +
                        (profile.experience?.length > 0 ? 2 : 0) +
                        (profile.education?.length > 0 ? 2 : 0) +
                        (profile.projects?.length > 0 ? 2 : 0)) / 10) * 100
                      )}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${(((profile.name ? 1 : 0) +
                          (profile.email ? 1 : 0) +
                          (profile.skills?.length > 0 ? 2 : 0) +
                          (profile.experience?.length > 0 ? 2 : 0) +
                          (profile.education?.length > 0 ? 2 : 0) +
                          (profile.projects?.length > 0 ? 2 : 0)) / 10) * 100}%` 
                      }}
                      className="h-full bg-gradient-to-r from-[#69f6b8] to-[#00dcfd] rounded-full shadow-[0_0_10px_rgba(105,246,184,0.3)]"
                    />
                  </div>
                </div>
              </nav>
            </div>

            {/* Main editor area */}
            <div className="lg:col-span-3">
              {/* Personal Info Section */}
              {activeSection === 'personal' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-[#11192e] border border-white/5 rounded-3xl p-10 shadow-xl"
                >
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-14 h-14 bg-[#69f6b8]/10 rounded-2xl flex items-center justify-center">
                      <span className="text-3xl">👤</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight">Personal Information</h2>
                      <p className="text-[#a5aac2] text-xs font-bold uppercase tracking-widest opacity-60">Identity & Contact Details</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#a5aac2] uppercase tracking-[0.2em] ml-1">Full Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-[#070d1f] border border-white/5 rounded-2xl px-5 py-4 text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-[#69f6b8]/40 focus:ring-4 focus:ring-[#69f6b8]/5 transition-all"
                        placeholder="e.g. John Wick"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#a5aac2] uppercase tracking-[0.2em] ml-1">Email Address</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-[#070d1f] border border-white/5 rounded-2xl px-5 py-4 text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-[#69f6b8]/40 focus:ring-4 focus:ring-[#69f6b8]/5 transition-all"
                        placeholder="john@wick.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#a5aac2] uppercase tracking-[0.2em] ml-1">Phone Number</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full bg-[#070d1f] border border-white/5 rounded-2xl px-5 py-4 text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-[#69f6b8]/40 focus:ring-4 focus:ring-[#69f6b8]/5 transition-all"
                        placeholder="+91 99999 99999"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#a5aac2] uppercase tracking-[0.2em] ml-1">Location</label>
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full bg-[#070d1f] border border-white/5 rounded-2xl px-5 py-4 text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-[#69f6b8]/40 focus:ring-4 focus:ring-[#69f6b8]/5 transition-all"
                        placeholder="Bangalore, India"
                      />
                    </div>
                  </div>

                  <div className="mt-10 space-y-2">
                    <label className="text-[10px] font-black text-[#a5aac2] uppercase tracking-[0.2em] ml-1">Professional Summary</label>
                    <textarea
                      value={profile.summary}
                      onChange={(e) => setProfile(prev => ({ ...prev, summary: e.target.value }))}
                      className="w-full bg-[#070d1f] border border-white/5 rounded-2xl px-5 py-4 text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-[#69f6b8]/40 focus:ring-4 focus:ring-[#69f6b8]/5 transition-all min-h-[150px] resize-none leading-relaxed"
                      placeholder="Showcase your impact and years of expertise..."
                    />
                  </div>
                </motion.div>
              )}

              {/* Skills Section */}
              {activeSection === 'skills' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-[#11192e] border border-white/5 rounded-3xl p-10 shadow-xl"
                >
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-[#69f6b8]/10 rounded-2xl flex items-center justify-center">
                        <span className="text-3xl">⚡</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Skills & Expertise</h2>
                        <p className="text-[#a5aac2] text-xs font-bold uppercase tracking-widest opacity-60">Highlight your core capabilities</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setShowSkillModal(true); setEditingSkill(null); setSkillInput(''); }}
                      className="px-6 py-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-2xl text-white font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 group"
                    >
                      <svg className="w-4 h-4 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Skill
                    </button>
                  </div>

                  {profile.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {profile.skills.map((skill, index) => (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="group relative px-5 py-2.5 bg-[#070d1f] border border-white/5 rounded-xl text-white font-bold text-xs uppercase tracking-tight hover:border-[#69f6b8]/40 hover:shadow-[0_0_15px_rgba(105,246,184,0.1)] transition-all cursor-default"
                        >
                          <span className="relative z-10">{skill}</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-[#69f6b8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                          
                          <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100">
                            <button
                              onClick={(e) => { e.stopPropagation(); editSkill(skill); }}
                              className="w-7 h-7 bg-[#00dcfd] text-[#002919] rounded-lg border border-white/10 shadow-lg flex items-center justify-center hover:scale-110 active:scale-90 transition-all"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); removeSkill(skill); }}
                              className="w-7 h-7 bg-red-500 text-white rounded-lg border border-white/10 shadow-lg flex items-center justify-center hover:scale-110 active:scale-90 transition-all"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-3xl">
                      <div className="w-20 h-20 mx-auto mb-6 bg-white/[0.02] rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <p className="text-[#a5aac2] text-[10px] font-black uppercase tracking-widest opacity-40">No expertise listed yet</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Experience Section */}
              {activeSection === 'experience' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-[#11192e] border border-white/5 rounded-3xl p-10 shadow-xl"
                >
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-[#00dcfd]/10 rounded-2xl flex items-center justify-center">
                        <span className="text-3xl">💼</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Work Experience</h2>
                        <p className="text-[#a5aac2] text-xs font-bold uppercase tracking-widest opacity-60">Your professional journey</p>
                      </div>
                    </div>
                    <button
                      onClick={addExperience}
                      className="px-6 py-3 bg-[#69f6b8] text-[#002919] rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(105,246,184,0.2)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Position
                    </button>
                  </div>

                  <div className="space-y-6">
                    {profile.experience.length > 0 ? (
                      profile.experience.map((exp) => (
                        <motion.div
                          key={exp.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-8 bg-[#070d1f] rounded-3xl border border-white/5 relative group overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => removeExperience(exp.id)}
                              className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>

                          <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-[#a5aac2] uppercase tracking-[0.2em] ml-1">Position / Title</label>
                              <input
                                type="text"
                                value={exp.position}
                                onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-[#69f6b8]/40 transition-all"
                                placeholder="e.g. Senior Product Designer"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-[#a5aac2] uppercase tracking-[0.2em] ml-1">Company</label>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-[#69f6b8]/40 transition-all"
                                placeholder="e.g. Google India"
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-3 gap-8 mb-8">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-[#a5aac2] uppercase tracking-[0.2em] ml-1">Start Date</label>
                              <input
                                type="month"
                                value={exp.startDate}
                                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-[#69f6b8]/40 transition-all"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-[#a5aac2] uppercase tracking-[0.2em] ml-1">End Date</label>
                              <input
                                type="month"
                                value={exp.endDate}
                                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                disabled={exp.current}
                                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-[#69f6b8]/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                              />
                            </div>
                            <div className="flex items-end pb-4">
                              <label className="flex items-center gap-3 cursor-pointer group/check">
                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${exp.current ? 'bg-[#69f6b8] border-[#69f6b8]' : 'border-white/10 group-hover/check:border-white/20'}`}>
                                  {exp.current && (
                                    <svg className="w-4 h-4 text-[#002919]" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                  <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={exp.current}
                                    onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                                  />
                                </div>
                                <span className="text-[10px] font-black text-[#a5aac2] uppercase tracking-widest opacity-60">I currently work here</span>
                              </label>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#a5aac2] uppercase tracking-[0.2em] ml-1">Responsibilities & Impact</label>
                            <textarea
                              value={exp.description}
                              onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                              className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-[#69f6b8]/40 transition-all min-h-[120px] resize-none text-sm leading-relaxed"
                              placeholder="Focus on metrics: 'Increased revenue by 20% by...'"
                            />
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
                        <p className="text-[#a5aac2] text-[10px] font-black uppercase tracking-widest opacity-40 italic">No experience added yet</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Education Section */}
              {activeSection === 'education' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-[#11192e] border border-white/5 rounded-3xl p-10 shadow-xl"
                >
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center">
                        <span className="text-3xl">🎓</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Education</h2>
                        <p className="text-[#a5aac2] text-xs font-bold uppercase tracking-widest opacity-60">Your academic background</p>
                      </div>
                    </div>
                    <button
                      onClick={addEducation}
                      className="px-6 py-3 bg-[#69f6b8] text-[#002919] rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(105,246,184,0.2)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Education
                    </button>
                  </div>

                  <div className="space-y-6">
                    {profile.education.length > 0 ? (
                      profile.education.map((edu) => (
                        <motion.div
                          key={edu.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-8 bg-[#070d1f] rounded-3xl border border-white/5 relative group"
                        >
                          <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => removeEducation(edu.id)}
                              className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>

                          <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-[#a5aac2] uppercase tracking-[0.2em] ml-1">Degree / Certificate</label>
                              <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-[#69f6b8]/40 transition-all"
                                placeholder="e.g. B.Tech in Computer Science"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-[#a5aac2] uppercase tracking-[0.2em] ml-1">School / University</label>
                              <input
                                type="text"
                                value={edu.institution || edu.school}
                                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-[#69f6b8]/40 transition-all"
                                placeholder="e.g. IIT Madras"
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-[#a5aac2] uppercase tracking-[0.2em] ml-1">Field of Study</label>
                              <input
                                type="text"
                                value={edu.field}
                                onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-[#69f6b8]/40 transition-all"
                                placeholder="e.g. Computer Science"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-[#a5aac2] uppercase tracking-[0.2em] ml-1">Graduation Year</label>
                              <input
                                type="month"
                                value={edu.endDate}
                                onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 text-white font-bold focus:outline-none focus:border-[#69f6b8]/40 transition-all"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-[#a5aac2] uppercase tracking-[0.2em] ml-1">CGPA / Grade</label>
                              <input
                                type="text"
                                value={edu.gpa}
                                onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-[#69f6b8]/40 transition-all"
                                placeholder="e.g. 9.2 CGPA"
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
                        <p className="text-[#a5aac2] text-[10px] font-black uppercase tracking-widest opacity-40 italic">No education history added yet</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Projects Section */}
              {activeSection === 'projects' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-[#11192e] border border-white/5 rounded-3xl p-10 shadow-xl"
                >
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-pink-500/10 rounded-2xl flex items-center justify-center">
                        <span className="text-3xl">🚀</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Side Projects</h2>
                        <p className="text-[#a5aac2] text-xs font-bold uppercase tracking-widest opacity-60">Showcase your best work</p>
                      </div>
                    </div>
                    <button
                      onClick={addProject}
                      className="px-6 py-3 bg-[#69f6b8] text-[#002919] rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(105,246,184,0.2)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Project
                    </button>
                  </div>

                  <div className="space-y-6">
                    {profile.projects.length > 0 ? (
                      profile.projects.map((project) => (
                        <motion.div
                          key={project.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-8 bg-[#070d1f] rounded-3xl border border-white/5 relative group"
                        >
                          <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => removeProject(project.id)}
                              className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>

                          <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-[#a5aac2] uppercase tracking-[0.2em] ml-1">Project Name</label>
                              <input
                                type="text"
                                value={project.name}
                                onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-[#69f6b8]/40 transition-all"
                                placeholder="e.g. Kayaka-AI Resume Builder"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-[#a5aac2] uppercase tracking-[0.2em] ml-1">Project Link</label>
                              <input
                                type="url"
                                value={project.link}
                                onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-[#69f6b8]/40 transition-all"
                                placeholder="e.g. https://github.com/..."
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#a5aac2] uppercase tracking-[0.2em] ml-1">Project Description & Highlights</label>
                            <textarea
                              value={project.description}
                              onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                              className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-[#69f6b8]/40 transition-all min-h-[100px] resize-none text-sm leading-relaxed"
                              placeholder="Describe the problem you solved and the impact..."
                            />
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
                        <p className="text-[#a5aac2] text-[10px] font-black uppercase tracking-widest opacity-40 italic">No projects added yet</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Skill Modal */}
      <AnimatePresence>
        {showSkillModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSkillModal(false)}
              className="absolute inset-0 bg-[#070d1f]/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#11192e] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl obsidian-glow"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-[#69f6b8]/10 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">💡</span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">{editingSkill ? 'Edit Skill' : 'New Skill'}</h3>
                  <p className="text-[#a5aac2] text-[10px] font-black uppercase tracking-widest opacity-60">Add expertise to your profile</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#a5aac2] uppercase tracking-[0.2em] ml-1">Skill Name</label>
                  <input
                    type="text"
                    autoFocus
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (editingSkill ? updateSkill() : addSkill())}
                    className="w-full bg-[#070d1f] border border-white/5 rounded-2xl px-6 py-4 text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-[#69f6b8]/40 focus:ring-4 focus:ring-[#69f6b8]/5 transition-all"
                    placeholder="e.g. Distributed Systems"
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    onClick={() => setShowSkillModal(false)}
                    className="flex-1 px-6 py-4 bg-white/[0.03] hover:bg-white/[0.08] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingSkill ? updateSkill : addSkill}
                    className="flex-2 px-10 py-4 bg-[#69f6b8] text-[#002919] rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(105,246,184,0.3)] transition-all hover:scale-105 active:scale-95"
                  >
                    {editingSkill ? 'Update' : 'Add Skill'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
