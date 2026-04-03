import { createContext, useState } from 'react'
import Toast from '../components/Toast'

// eslint-disable-next-line react-refresh/only-export-components
export const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  const hideToast = () => {
    setToast(null)
  }

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </ToastContext.Provider>
  )
}
