import { Component } from 'react'
import { Link } from 'react-router-dom'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo })
    
    // Log to error reporting service (e.g., Sentry) in production
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
          <style>{`
            @keyframes pulse-glow {
              0%, 100% { opacity: 0.3; transform: scale(1); }
              50% { opacity: 0.6; transform: scale(1.1); }
            }
            .animate-pulse-glow {
              animation: pulse-glow 4s ease-in-out infinite;
            }
            .glass-panel {
              background: rgba(255, 255, 255, 0.03);
              backdrop-filter: blur(20px);
              border: 1px solid rgba(255, 255, 255, 0.1);
            }
          `}</style>

          {/* Background */}
          <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-red-500/20 rounded-full blur-[120px] animate-pulse-glow"></div>
          <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse-glow"></div>

          <div className="relative z-10 max-w-lg w-full">
            <div className="glass-panel rounded-2xl p-8 border border-red-500/30 text-center">
              {/* Error Icon */}
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-white mb-4">
                Oops! Something went wrong
              </h1>

              {/* Message */}
              <p className="text-gray-400 mb-6">
                We're sorry for the inconvenience. The error has been logged and we'll look into it.
              </p>

              {/* Error Details (Development Only) */}
              {window.location.hostname === 'localhost' && this.state.error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-left">
                  <p className="text-red-400 text-sm font-mono break-all">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleReset}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                >
                  Try Again
                </button>
                <Link
                  to="/dashboard"
                  className="px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/"
                  className="px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors"
                >
                  Go Home
                </Link>
              </div>

              {/* Support Link */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-gray-500 text-sm">
                  Still having issues?{' '}
                  <Link to="/contact" className="text-blue-400 hover:text-blue-300 font-medium">
                    Contact Support
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
