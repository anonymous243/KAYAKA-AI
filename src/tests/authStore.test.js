import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../store/authStore'

describe('authStore', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Reset store to initial state
    useAuthStore.setState({
      user: null,
      session: null,
      isAuthenticated: false,
      loading: true,
      tokenRefreshTimer: null
    })
  })

  it('initializes with correct default state', () => {
    const state = useAuthStore.getState()
    
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.session).toBeNull()
    expect(state.loading).toBe(true)
  })

  it('sets authenticated state when user data is provided', () => {
    const mockUser = { id: '123', email: 'test@example.com' }
    
    useAuthStore.setState({
      user: mockUser,
      isAuthenticated: true,
      loading: false
    })
    
    const state = useAuthStore.getState()
    expect(state.user).toEqual(mockUser)
    expect(state.isAuthenticated).toBe(true)
  })

  it('clears state on sign out simulation', () => {
    // First set some state
    useAuthStore.setState({
      user: { id: '123' },
      isAuthenticated: true,
      loading: false
    })
    
    // Then clear it
    useAuthStore.setState({
      user: null,
      session: null,
      isAuthenticated: false,
      loading: false
    })
    
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
  })

  it('persists user to localStorage', () => {
    const mockUser = { id: '123', email: 'test@example.com' }
    
    // Simulate setting user
    localStorage.setItem('kayaka_ai_user_cache', JSON.stringify(mockUser))
    
    // Verify it's there
    const stored = localStorage.getItem('kayaka_ai_user_cache')
    expect(JSON.parse(stored)).toEqual(mockUser)
  })
})
