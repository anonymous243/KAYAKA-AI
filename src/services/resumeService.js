import api from './api'
import { uploadAndParseResume } from '../utils/resumeParser'

export const uploadResume = async (file) => {
  // Real resume parsing - no mock data
  const parsedData = await uploadAndParseResume(file)
  return parsedData
}

export const getParsedResume = async () => {
  const response = await api.get('/resume/parsed')
  return response.data
}
