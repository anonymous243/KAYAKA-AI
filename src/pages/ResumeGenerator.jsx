import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useResumeStore } from '../store/resumeStore'
import { useSubscriptionStore } from '../store/subscriptionStore'
import { useToast } from '../hooks/useToast'
import { useEffect } from 'react'
import { Lock } from 'lucide-react'
import html2pdf from 'html2pdf.js'
import ResumeRenderer from '../components/ResumeRenderer'
import TemplatePreviewCard from '../components/TemplatePreviewCard'
import { TEMPLATES, TEMPLATE_CATEGORIES } from '../data/templates'

// ── Category config ──────────────────────────────────────────
const CATS = [
  { key: 'all', label: 'All' },
  { key: TEMPLATE_CATEGORIES.ATS_OPTIMIZED, label: 'ATS' },
  { key: TEMPLATE_CATEGORIES.PROFESSIONAL, label: 'Professional' },
  { key: TEMPLATE_CATEGORIES.CREATIVE, label: 'Creative' },
  { key: TEMPLATE_CATEGORIES.INDUSTRY, label: 'Industry' },
  { key: TEMPLATE_CATEGORIES.EXPERIENCE, label: 'Experience' },
]

const ZOOM_LEVELS = [0.55, 0.70, 0.85, 1.0]
const A4_W = 595
const A4_H = 842

export default function ResumeGenerator() {
  const navigate = useNavigate()
  const { parsedData, selectedTemplate, setSelectedTemplate } = useResumeStore()
  const { showToast } = useToast()
  const previewRef = useRef(null)   // visible scaled viewer
  const pdfRef = useRef(null)        // hidden full-size for PDF export

  const [downloading, setDownloading] = useState(false)
  const [activeCat, setActiveCat] = useState('all')
  const [zoom, setZoom] = useState(0.65)

  // Local editable state for real-time sync
  const [resumeData, setResumeData] = useState(parsedData)

  const { hasAccess, fetchSubscription } = useSubscriptionStore()

  useEffect(() => {
    fetchSubscription()
  }, [fetchSubscription])

  // ── Guard ────────────────────────────────────────────────
  if (!parsedData) {
    navigate('/upload')
    return null
  }



  // ── Derived ───────────────────────────────────────────────
  const filtered = activeCat === 'all' ? TEMPLATES : TEMPLATES.filter(t => t.category === activeCat)
  const activeTemplate = selectedTemplate || TEMPLATES[0]

  // ── Helpers ───────────────────────────────────────────────
  const handleUpdate = (path, value) => {
    const newData = { ...resumeData }
    const keys = path.split('.')
    let current = newData
    
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        // Handle array indices (e.g., education.0)
        if (!isNaN(key)) {
            current = current[parseInt(key)]
        } else {
            current = current[key]
        }
    }
    
    const lastKey = keys[keys.length - 1]
    if (!isNaN(lastKey)) {
        current[parseInt(lastKey)] = value
    } else {
        current[lastKey] = value
    }
    
    setResumeData(newData)
    // Sync back to store (debounced or on blur)
  }

  const addExperience = () => {
    const newExp = [...(resumeData.experience || []), { 
        company: 'New Company', 
        position: 'New Role', 
        startDate: '2024', 
        endDate: 'Present', 
        current: true, 
        description: ['Key achievement one', 'Key achievement two'] 
    }]
    handleUpdate('experience', newExp)
  }

  const addEducation = () => {
    const newEdu = [...(resumeData.education || []), {
        institution: 'University Name',
        degree: 'Degree / Major',
        startDate: '2020',
        endDate: '2024'
    }]
    handleUpdate('education', newEdu)
  }

  const handleDownload = async () => {
    const el = pdfRef.current
    if (!el) {
      showToast('Nothing to download yet.', 'error')
      return
    }
    setDownloading(true)
    try {
      await html2pdf().set({
        margin: 0,
        filename: `resume-kayaka-${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'px', format: [A4_W, A4_H], orientation: 'portrait' }
      }).from(el).save()
      showToast('PDF downloaded!', 'success')
    } catch (err) {
      console.error('PDF error:', err)
      showToast('Download failed — try again.', 'error')
    } finally {
      setDownloading(false)
    }
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="h-screen bg-[#070d1f] flex flex-col font-sans text-white selection:bg-[#69f6b8]/20 overflow-hidden">
      <style>{`
        @keyframes grid-move { 0% { transform: translate(0, 0); } 100% { transform: translate(50px, 50px); } }
        .bg-animated-grid {
          background-image: linear-gradient(rgba(105, 246, 184, 0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(105, 246, 184, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: grid-move 20s linear infinite;
        }
        .obsidian-glow { box-shadow: 0 0 50px -12px rgba(105, 246, 184, 0.2); }
        .selected-ring { border-color: #69f6b8 !important; box-shadow: 0 0 20px rgba(105, 246, 184, 0.3); }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(105, 246, 184, 0.1); border-radius: 4px; }
        .editor-pane { background: rgba(11, 16, 34, 0.7); backdrop-blur(10px); }
        
        [contenteditable][data-placeholder]:empty:before {
            content: attr(data-placeholder);
            color: #999;
            font-style: italic;
        }
      `}</style>

      <div className="fixed inset-0 bg-animated-grid pointer-events-none"></div>

      {/* ── Header ───────────────────────────────────────── */}
      <header className="bg-[#070d1f]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50 h-14 shrink-0">
        <div className="max-w-[1920px] mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#69f6b8] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(105,246,184,0.3)]">
              <svg className="w-5 h-5 text-[#002919]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xs font-black tracking-widest uppercase">Kayaka Live Editor <span className="text-[#69f6b8] ml-2 font-medium bg-[#69f6b8]/10 px-2 py-0.5 rounded text-[8px]">Inline Mode</span></span>
          </div>
          <div className="flex items-center gap-6">
             <button
               onClick={handleDownload}
               disabled={downloading}
               className="px-6 py-2 bg-[#69f6b8] text-[#002919] rounded-lg font-black text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(105,246,184,0.2)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
             >
               {downloading ? 'Compiling...' : 'Export PDF'}
             </button>
             <Link to="/dashboard" className="text-[#a5aac2] font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">← Dashboard</Link>
          </div>
        </div>
      </header>

      {/* ── Main Workspace ────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden relative z-10">

        {/* ── COL 1: Template Sidebar ────────────────────── */}
        <div className="w-[300px] shrink-0 border-r border-white/5 bg-[#0b1022] flex flex-col">
          <div className="p-5 border-b border-white/5 shrink-0">
             <h3 className="text-[10px] font-black text-[#a5aac2] uppercase tracking-[0.2em] mb-4">Templates</h3>
             <div className="grid grid-cols-3 gap-2">
                {CATS.map(cat => (
                  <button 
                    key={cat.key} 
                    onClick={() => setActiveCat(cat.key)}
                    className={`px-1 py-2 rounded-lg text-[8px] font-black uppercase transition-all ${activeCat === cat.key ? 'bg-[#69f6b8] text-[#002919]' : 'bg-white/5 text-[#a5aac2] hover:bg-white/10'}`}
                  >
                    {cat.label}
                  </button>
                ))}
             </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
             <div className="flex flex-col gap-5">
                {filtered.map(template => (
                  <TemplatePreviewCard
                    key={template.id}
                    template={template}
                    data={resumeData}
                    isSelected={activeTemplate?.id === template.id}
                    onSelect={setSelectedTemplate}
                  />
                ))}
             </div>
          </div>
        </div>

        {/* ── COL 2: Infinity Workspace ──────────────────── */}
        <div className="flex-1 bg-[#0b1022]/20 flex flex-col overflow-hidden relative">
           
           {/* Toolbar */}
           <div className="absolute top-6 left-6 z-20 flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[#070d1f]/80 backdrop-blur border border-white/10 rounded-full px-4 py-2 shadow-2xl">
                 <button onClick={() => setZoom(z => Math.max(0.4, z - 0.1))} className="w-8 h-8 flex items-center justify-center text-[#a5aac2] hover:text-white transition-all text-lg hover:bg-white/5 rounded-full">−</button>
                 <span className="text-[11px] font-black text-white w-12 text-center">{Math.round(zoom * 100)}%</span>
                 <button onClick={() => setZoom(z => Math.min(1.5, z + 0.1))} className="w-8 h-8 flex items-center justify-center text-[#a5aac2] hover:text-white transition-all text-lg hover:bg-white/5 rounded-full">+</button>
              </div>

              <div className="flex items-center gap-2 bg-[#070d1f]/80 backdrop-blur border border-white/10 rounded-full px-4 py-2 shadow-2xl">
                 <button onClick={addExperience} className="flex items-center gap-2 px-3 py-1 text-[9px] font-bold text-[#69f6b8] hover:bg-[#69f6b8]/10 rounded-full transition-all">
                    <span>+ WORK</span>
                 </button>
                 <div className="w-px h-4 bg-white/10" />
                 <button onClick={addEducation} className="flex items-center gap-2 px-3 py-1 text-[9px] font-bold text-[#69f6b8] hover:bg-[#69f6b8]/10 rounded-full transition-all">
                    <span>+ EDU</span>
                 </button>
              </div>
           </div>

           {/* Preview Pan Area */}
           <div className="flex-1 overflow-auto scrollbar-thin p-16 flex justify-center items-start bg-dot-grid relative">
              <div className="relative group perspective-1000 my-10">
                <div className="absolute -inset-10 bg-[#69f6b8]/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                
                {/* Paper Container */}
                <div
                  ref={previewRef}
                  className="shadow-[0_48px_120px_-40px_rgba(0,0,0,0.9)] rounded-[2px] transition-all duration-700 ease-out border border-white/10 relative"
                  style={{
                    width: A4_W * zoom,
                    height: A4_H * zoom,
                    overflow: 'hidden',
                    background: 'white',
                    transformOrigin: 'top center'
                  }}
                >
                  <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', width: A4_W, height: A4_H }}>
                    <ResumeRenderer 
                        data={resumeData} 
                        template={activeTemplate} 
                        scale={1} 
                        onUpdate={handleUpdate}
                    />
                  </div>
                  {!hasAccess('pro') && (
                    <div className="absolute bottom-4 right-4 text-gray-400/50 font-bold text-xs pointer-events-none select-none tracking-widest uppercase">
                      Created with Kayaka-AI (Free Plan)
                    </div>
                  )}
                </div>
              </div>
           </div>

           {/* Status Bar */}
           <div className="shrink-0 h-10 border-t border-white/5 bg-[#0b1022] px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="relative">
                    <div className="w-1.5 h-1.5 bg-[#69f6b8] rounded-full" />
                    <div className="absolute inset-0 w-1.5 h-1.5 bg-[#69f6b8] rounded-full animate-ping" />
                 </div>
                 <span className="text-[9px] font-black uppercase tracking-widest text-[#69f6b8]">Live Canvas</span>
                 <div className="w-px h-3 bg-white/10 mx-2" />
                 <span className="text-[9px] font-medium text-[#a5aac2]">Changes are saved locally</span>
              </div>
              <div className="flex items-center gap-4 text-[#a5aac2]">
                 <span className="text-[9px] font-black uppercase tracking-widest">A4 Workspace v2.5</span>
                 <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 border border-[#a5aac2] rounded-sm" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Pixel Perfect</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Hidden export layer */}
      <div ref={pdfRef} style={{ position: 'fixed', left: -9999, width: A4_W, height: A4_H, background: 'white' }}>
        <ResumeRenderer data={resumeData} template={activeTemplate} scale={1} onUpdate={() => {}} />
        {!hasAccess('pro') && (
          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            color: 'rgba(156, 163, 175, 0.5)',
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>
            Created with Kayaka-AI (Free Plan)
          </div>
        )}
      </div>
    </div>
  )
}
