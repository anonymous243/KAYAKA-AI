import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AnimatePresence } from 'framer-motion'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'

// Lazy load pages for code splitting
const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const AuthCallback = lazy(() => import('./pages/AuthCallback'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const ResumeUpload = lazy(() => import('./pages/ResumeUpload'))
const ProfileEditor = lazy(() => import('./pages/ProfileEditor'))
const JDAnalyzer = lazy(() => import('./pages/JDAnalyzer'))
const ResumeGenerator = lazy(() => import('./pages/ResumeGenerator'))
const JobTargeting = lazy(() => import('./pages/JobTargeting'))
const JobTracker = lazy(() => import('./pages/JobTracker'))
const SmartApply = lazy(() => import('./pages/SmartApply'))
const About = lazy(() => import('./pages/About'))
const Blog = lazy(() => import('./pages/Blog'))
const Careers = lazy(() => import('./pages/Careers'))
const Contact = lazy(() => import('./pages/Contact'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'))
const DataDeletion = lazy(() => import('./pages/DataDeletion'))
const AuthFlowTest = lazy(() => import('./pages/AuthFlowTest'))
const Subscription = lazy(() => import('./pages/Subscription'))
const Checkout = lazy(() => import('./pages/Checkout'))

// Loading fallback component
function PageLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/auth/github/callback" element={<AuthCallback />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/data-deletion" element={<DataDeletion />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <ResumeUpload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jd-analyzer"
          element={
            <ProtectedRoute>
              <JDAnalyzer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume-generator"
          element={
            <ProtectedRoute>
              <ResumeGenerator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/job-targeting"
          element={
            <ProtectedRoute>
              <JobTargeting />
            </ProtectedRoute>
          }
        />
        <Route
          path="/job-tracker"
          element={
            <ProtectedRoute>
              <JobTracker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/smart-apply"
          element={
            <ProtectedRoute>
              <SmartApply />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscription"
          element={
            <ProtectedRoute>
              <Subscription />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        {/* Dev/Test Routes */}
        <Route path="/test-auth" element={<AuthFlowTest />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<PageLoading />}>
          <AnimatedRoutes />
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
