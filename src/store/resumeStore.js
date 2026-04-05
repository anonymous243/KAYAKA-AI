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

    set({
      parsedData: JSON.parse(localStorage.getItem(`kayaka_${userId}_parsed_data`) || 'null'),
      jdAnalysis: JSON.parse(localStorage.getItem(`kayaka_${userId}_jd_analysis`) || 'null'),
      selectedTemplate: JSON.parse(localStorage.getItem(`kayaka_${userId}_selected_template`) || 'null')
    })
  },

  setParsedData: (data) => {
    const key = getStorageKey('parsed_data')
    localStorage.setItem(key, JSON.stringify(data))
    set({ parsedData: data })
  },

  setJdAnalysis: (data) => {
    const key = getStorageKey('jd_analysis')
    localStorage.setItem(key, JSON.stringify(data))
    set({ jdAnalysis: data })
  },

  setSelectedTemplate: (template) => {
    const key = getStorageKey('selected_template')
    localStorage.setItem(key, JSON.stringify(template))
    set({ selectedTemplate: template })
  },

  setUploading: (status) => set({ isUploading: status }),
  setUploadError: (error) => set({ uploadError: error }),

  clearResume: () => {
    const userId = getUserId()
    if (userId !== 'anonymous') {
      localStorage.removeItem(`kayaka_${userId}_parsed_data`)
      localStorage.removeItem(`kayaka_${userId}_jd_analysis`)
      localStorage.removeItem(`kayaka_${userId}_selected_template`)
    }
    set({ parsedData: null, jdAnalysis: null, uploadError: null })
  },

  // Update specific fields
  updateProfile: (updates) => {
    set((state) => {
      const newData = { ...state.parsedData, ...updates }
      const key = getStorageKey('parsed_data')
      localStorage.setItem(key, JSON.stringify(newData))
      return { parsedData: newData }
    })
  },
}))
