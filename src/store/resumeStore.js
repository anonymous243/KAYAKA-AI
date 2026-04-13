import { create } from 'zustand'

const getUserId = () => {
  try {
    const userCache = localStorage.getItem('kayaka_ai_user_cache')
    if (userCache) {
      const user = JSON.parse(userCache)
      return user?.id || 'anonymous'
    }
  } catch {
    // Ignore parse errors, fallback to anonymous
  }
  return 'anonymous'
}

const getStorageKey = (baseKey) => {
  const userId = getUserId()
  return `kayaka_${userId}_${baseKey}`
}

export const useResumeStore = create((set, _get) => ({
  parsedData: null,
  jdAnalysis: null,
  selectedTemplate: null,
  isUploading: false,
  uploadError: null,

  // Initialize data based on current user
  initializeUserData: () => {
    const userId = getUserId()
    if (userId === 'anonymous') return

    try {
      set({
        parsedData: JSON.parse(localStorage.getItem(`kayaka_${userId}_parsed_data`) || 'null'),
        jdAnalysis: JSON.parse(localStorage.getItem(`kayaka_${userId}_jd_analysis`) || 'null'),
        selectedTemplate: JSON.parse(localStorage.getItem(`kayaka_${userId}_selected_template`) || 'null')
      })
    } catch (e) {
      console.error('Failed to parse user data from localStorage:', e)
      set({ parsedData: null, jdAnalysis: null, selectedTemplate: null })
    }
  },

  setParsedData: (data) => {
    const key = getStorageKey('parsed_data')
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (e) {
      console.warn('Failed to save parsed data to localStorage:', e)
    }
    set({ parsedData: data })
  },

  setJdAnalysis: (data) => {
    const key = getStorageKey('jd_analysis')
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (e) {
      console.warn('Failed to save JD analysis to localStorage:', e)
    }
    set({ jdAnalysis: data })
  },

  setSelectedTemplate: (template) => {
    const key = getStorageKey('selected_template')
    try {
      localStorage.setItem(key, JSON.stringify(template))
    } catch (e) {
      console.warn('Failed to save selected template to localStorage:', e)
    }
    set({ selectedTemplate: template })
  },

  setUploading: (status) => set({ isUploading: status }),
  setUploadError: (error) => set({ uploadError: error }),

  clearResume: () => {
    const userId = getUserId()
    if (userId !== 'anonymous') {
      try {
        localStorage.removeItem(`kayaka_${userId}_parsed_data`)
        localStorage.removeItem(`kayaka_${userId}_jd_analysis`)
        localStorage.removeItem(`kayaka_${userId}_selected_template`)
      } catch (e) {
        console.warn('Failed to remove data from localStorage:', e)
      }
    }
    set({ parsedData: null, jdAnalysis: null, uploadError: null })
  },

  // Update specific fields
  updateProfile: (updates) => {
    set((state) => {
      const newData = { ...(state.parsedData || {}), ...updates }
      const key = getStorageKey('parsed_data')
      try {
        localStorage.setItem(key, JSON.stringify(newData))
      } catch (e) {
        console.warn('Failed to save updated profile to localStorage:', e)
      }
      return { parsedData: newData }
    })
  },
}))
