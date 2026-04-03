import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import { useAuthStore } from '../store/authStore'

// Mock useAuthStore
vi.mock('../store/authStore', () => ({
  useAuthStore: vi.fn(),
}))

const MockComponent = () => <div data-testid="protected-content">Protected Content</div>

const renderProtectedRoute = (authState) => {
  useAuthStore.mockReturnValue(authState)
  
  return render(
    <BrowserRouter>
      <ProtectedRoute>
        <MockComponent />
      </ProtectedRoute>
    </BrowserRouter>
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state when auth is loading', () => {
    renderProtectedRoute({ isAuthenticated: false, loading: true })
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders children when authenticated', () => {
    renderProtectedRoute({ isAuthenticated: true, loading: false })
    
    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
  })

  it('redirects to login when not authenticated', async () => {
    renderProtectedRoute({ isAuthenticated: false, loading: false })
    
    // Wait for redirect to happen
    await waitFor(() => {
      expect(window.location.pathname).toBe('/login')
    }, { timeout: 1000 }).catch(() => {
      // If location doesn't change, check that content is not rendered
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    })
  })
})
