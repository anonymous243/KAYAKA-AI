import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FileUpload({ onUpload, accept = '.pdf,.doc,.docx', maxSize = 5 * 1024 * 1024 }) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')
  const inputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const validateFile = (file) => {
    if (!file) {
      setError('No file selected')
      return false
    }
    
    // Check file size
    if (file.size > maxSize) {
      const sizeMB = (maxSize / 1024 / 1024).toFixed(1)
      setError(`File size exceeds ${sizeMB}MB limit.`)
      return false
    }
    
    // Check file type
    const validTypes = accept.split(',').map(t => t.trim().toLowerCase())
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    
    if (!validTypes.includes(fileExtension)) {
      setError(`Invalid file type. Please upload PDF, DOC, or DOCX files only`)
      return false
    }
    
    return true
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setError('')

    const file = e.dataTransfer.files[0]
    if (validateFile(file)) {
      setFileName(file.name)
      handleUpload(file)
    }
  }

  const handleChange = (e) => {
    setError('')
    const file = e.target.files[0]
    if (validateFile(file)) {
      setFileName(file.name)
      handleUpload(file)
    }
  }

  const handleUpload = async (file) => {
    setUploading(true)
    try {
      await onUpload(file)
    } catch (err) {
      console.error('FileUpload error:', err)
      const errorMessage = err?.response?.data?.error || err?.message || 'Upload failed. Please try again'
      setError(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full">
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 relative overflow-hidden bg-[#0c1326]/50 ${
          dragActive 
            ? 'border-[#69f6b8] bg-[#69f6b8]/5 shadow-[0_0_30px_rgba(105,246,184,0.1)]' 
            : 'border-white/10 hover:border-[#69f6b8]/40 hover:bg-[#171f36]/50'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleChange}
          disabled={uploading}
        />

        {uploading && (
          <div className="absolute inset-0 bg-[#070d1f] flex flex-col items-center justify-center z-20">
            <div className="w-12 h-12 border-4 border-[#69f6b8]/20 border-t-[#69f6b8] rounded-full animate-spin mb-4" />
            <p className="text-[#69f6b8] font-black uppercase tracking-widest text-[10px] animate-pulse">Analyzing Resume...</p>
          </div>
        )}

        {fileName ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-[#69f6b8]/10 text-[#69f6b8] rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-black uppercase tracking-tight text-sm line-clamp-1 max-w-xs mx-auto">{fileName}</p>
              <p className="text-[#a5aac2] text-[10px] uppercase tracking-widest mt-2 font-bold opacity-60">Click to replace</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-white/5 border border-white/10 text-white/20 rounded-2xl flex items-center justify-center transition-colors group-hover:text-[#69f6b8] group-hover:border-[#69f6b8]/20 group-hover:bg-[#69f6b8]/5">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-white font-black uppercase tracking-widest text-xs">Click or drag file</p>
              <p className="text-[#a5aac2] text-[10px] mt-2 opacity-60 italic">PDF, DOC, DOCX up to 5MB</p>
            </div>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4"
          >
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-none mb-1">Upload Failed</p>
              <p className="text-xs text-red-100/80 font-medium">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
