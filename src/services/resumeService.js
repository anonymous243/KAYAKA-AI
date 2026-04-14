import api from './api'
import { uploadAndParseResume } from '../utils/resumeParser'

export const uploadResume = async (file) => {
  try {
    // Validate file before processing
    if (!file) {
      throw new Error('No file provided')
    }

    // Real resume parsing - no mock data
    const parsedData = await uploadAndParseResume(file)
    
    // Validate parsed data
    if (!parsedData || typeof parsedData !== 'object') {
      throw new Error('Failed to parse resume data')
    }

    return parsedData
  } catch (error) {
    console.error('uploadResume error:', error)
    throw error
  }
}

export const getParsedResume = async () => {
  try {
    const response = await api.get('/resume/parsed')
    return response.data
  } catch (error) {
    console.error('getParsedResume error:', error)
    throw error
  }
}
