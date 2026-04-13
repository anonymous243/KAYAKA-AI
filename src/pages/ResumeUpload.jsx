import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import FileUpload from '../components/FileUpload'
import { uploadResume } from '../services/resumeService'
import { useResumeStore } from '../store/resumeStore'
import PageWrapper from '../components/PageWrapper'

export default function ResumeUpload() {
  const navigate = useNavigate()
  const setParsedData = useResumeStore((state) => state.setParsedData)
  const parsedData = useResumeStore((state) => state.parsedData)

  const handleUpload = async (file) => {
    try {
      const response = await uploadResume(file)
      setParsedData(response)
      // We stay on this page to show the success state before navigating
    } catch (err) {
      console.error('Upload handler error:', err)
      // error is already caught and displayed by the FileUpload component's catch block
    }
  }

  return (
    <PageWrapper className="min-h-screen bg-[#070d1f] text-[#dfe4fe] py-20 px-6 font-sans">
      <div className="max-w-2xl mx-auto relative">
        {/* Glow Background */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#69f6b8]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#00dcfd]/10 rounded-full blur-[100px] pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#11192e] border border-white/[0.05] rounded-3xl p-10 shadow-2xl relative z-10 backdrop-blur-sm"
        >
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-black text-white mb-4 tracking-tight uppercase">Upload Resume</h1>
            <p className="text-[#a5aac2] text-sm leading-relaxed max-w-md mx-auto opacity-80">
              Our AI engine will parse your details and prepare your profile for high-conversion job targeting.
            </p>
          </div>

          <FileUpload onUpload={handleUpload} />

          {parsedData && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-10 overflow-hidden"
            >
              <div className="p-6 bg-[#69f6b8]/5 border border-[#69f6b8]/20 rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-[#69f6b8] rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#002919]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-black text-[#69f6b8] uppercase tracking-widest text-sm">Resume Parsed Successfully</h3>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-[10px] font-black text-[#a5aac2] uppercase tracking-wider">Candidate</span>
                    <span className="col-span-2 text-sm font-bold text-white uppercase">{parsedData.name || 'Anonymous'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-[10px] font-black text-[#a5aac2] uppercase tracking-wider">Contact</span>
                    <span className="col-span-2 text-sm font-bold text-white">{parsedData.email || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-[10px] font-black text-[#a5aac2] uppercase tracking-wider">Top Skills</span>
                    <div className="col-span-2 flex flex-wrap gap-2">
                      {(parsedData.skills || []).slice(0, 5).map(skill => (
                        <span key={skill} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-bold text-[#69f6b8] uppercase tracking-tight">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/profile')}
                  className="w-full py-4 bg-[#69f6b8] text-[#002919] rounded-xl font-black uppercase tracking-widest text-xs hover:shadow-[0_0_25px_rgba(105,246,184,0.4)] transition-all active:scale-[0.98]"
                >
                  Continue to Profile
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </PageWrapper>
  )
}
