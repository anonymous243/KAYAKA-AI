import { describe, it, expect, beforeEach } from 'vitest'
import { useResumeStore } from '../store/resumeStore'

describe('resumeStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useResumeStore.setState({
      parsedData: null,
      jdAnalysis: null,
      isUploading: false,
      uploadError: null
    })
  })

  it('initializes with correct default state', () => {
    const state = useResumeStore.getState()
    
    expect(state.parsedData).toBeNull()
    expect(state.jdAnalysis).toBeNull()
    expect(state.isUploading).toBe(false)
  })

  it('sets parsed data correctly', () => {
    const mockData = {
      name: 'John Doe',
      email: 'john@example.com',
      skills: ['JavaScript', 'React']
    }
    
    useResumeStore.getState().setParsedData(mockData)
    
    const state = useResumeStore.getState()
    expect(state.parsedData).toEqual(mockData)
  })

  it('sets JD analysis correctly', () => {
    const mockAnalysis = {
      matchScore: 85,
      matchingSkills: ['JavaScript', 'React'],
      missingSkills: ['Node.js']
    }
    
    useResumeStore.getState().setJdAnalysis(mockAnalysis)
    
    const state = useResumeStore.getState()
    expect(state.jdAnalysis).toEqual(mockAnalysis)
  })

  it('persists parsed data to localStorage', () => {
    const mockData = {
      name: 'John Doe',
      email: 'john@example.com'
    }

    useResumeStore.getState().setParsedData(mockData)

    const stored = localStorage.getItem('kayaka_anonymous_parsed_data')
    expect(JSON.parse(stored)).toEqual(mockData)
  })

  it('persists JD analysis to localStorage', () => {
    const mockAnalysis = { matchScore: 85 }

    useResumeStore.getState().setJdAnalysis(mockAnalysis)

    const stored = localStorage.getItem('kayaka_anonymous_jd_analysis')
    expect(JSON.parse(stored)).toEqual(mockAnalysis)
  })

  it('clears all data with clearResume', () => {
    // First set some data
    useResumeStore.getState().setParsedData({ name: 'Test' })
    useResumeStore.getState().setJdAnalysis({ score: 85 })
    
    // Then clear
    useResumeStore.getState().clearResume()
    
    const state = useResumeStore.getState()
    expect(state.parsedData).toBeNull()
    expect(state.jdAnalysis).toBeNull()
  })

  it('updates profile with partial data', () => {
    const initialData = {
      name: 'John Doe',
      email: 'john@example.com',
      skills: ['JavaScript']
    }
    
    useResumeStore.getState().setParsedData(initialData)
    
    // Update only name
    useResumeStore.getState().updateProfile({ name: 'Jane Doe' })
    
    const state = useResumeStore.getState()
    expect(state.parsedData.name).toBe('Jane Doe')
    expect(state.parsedData.email).toBe('john@example.com')
  })
})
