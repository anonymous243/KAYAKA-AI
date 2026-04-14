import axios from 'axios'
import { useAuthStore } from '../store/authStore'

// Smart API URL detection: fallback to Cloudflare Workers if localhost in production
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL
  // If it's localhost (dev), use it; otherwise check if we're on Vercel
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl
  }
  // For production (Vercel), use Cloudflare Workers fallback
  return 'https://kayaka-ai.anonymous24tr.workers.dev/api'
}

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
      return Promise.reject(new Error('Session expired. Please login again.'))
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      return Promise.reject(new Error('You do not have permission to perform this action.'))
    }
    
    // Handle 404 Not Found
    if (error.response?.status === 404) {
      return Promise.reject(new Error('The requested resource was not found.'))
    }
    
    // Handle 500 Server Error
    if (error.response?.status === 500) {
      return Promise.reject(new Error('Server error. Please try again later.'))
    }
    
    // Handle network errors
    if (!error.response) {
      return Promise.reject(new Error('Network error. Please check your connection.'))
    }
    
    // Handle other errors with message from server if available
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong'
    return Promise.reject(new Error(errorMessage))
  }
)

export default api
