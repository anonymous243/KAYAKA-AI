import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { useAuthStore } from './store/authStore.js'
import { supabase } from './lib/supabase.js'

// Initialize auth state from existing session on page load
useAuthStore.getState().initAuth()

// Keep auth store in sync with all Supabase session events
// (handles OAuth callbacks, token refreshes, and sign-outs)
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    useAuthStore.setState({
      user: session.user,
      session,
      isAuthenticated: true,
      loading: false,
    })
  } else {
    useAuthStore.setState({
      user: null,
      session: null,
      isAuthenticated: false,
      loading: false,
    })
  }
})

createRoot(document.getElementById('root')).render(
  <ToastProvider>
    <App />
  </ToastProvider>
)
