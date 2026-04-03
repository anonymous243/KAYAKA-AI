import { Link } from 'react-router-dom'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">KAYAKA-AI</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Home</Link>
              <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Sign In</Link>
              <Link to="/signup" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all hover:-translate-y-0.5">
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600">
            Last updated: March 24, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <p className="text-gray-600 mb-8">
              Welcome to KAYAKA-AI. These Terms of Service govern your use of our resume optimization platform and related services. By accessing or using KAYAKA-AI, you agree to be bound by these terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By creating an account or using KAYAKA-AI, you agree to these Terms of Service and our <Link to="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>. If you do not agree to these terms, please do not use our services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
            <p className="text-gray-600 mb-4">
              KAYAKA-AI provides AI-powered resume optimization services, including:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>Resume upload and parsing</li>
              <li>Profile editing and management</li>
              <li>Job description analysis</li>
              <li>Resume optimization and generation</li>
              <li>Download of optimized resumes</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. User Accounts</h2>
            <p className="text-gray-600 mb-4">
              To access certain features, you must create an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. User Content</h2>
            <p className="text-gray-600 mb-4">
              You retain ownership of content you upload (resumes, profiles, etc.). By uploading content, you grant us a license to use, process, and optimize that content to provide our services.
            </p>
            <p className="text-gray-600 mb-4">
              You represent that you have the right to upload and share any content you submit through our services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Acceptable Use</h2>
            <p className="text-gray-600 mb-4">
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>Use our services for any illegal purpose</li>
              <li>Upload false, misleading, or fraudulent content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt our services</li>
              <li>Reverse engineer or copy our technology</li>
              <li>Use our services to spam or harass others</li>
              <li>Share your account credentials with others</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-600 mb-4">
              KAYAKA-AI and its original content, features, and functionality are owned by KAYAKA-AI and are protected by international copyright, trademark, and other intellectual property laws.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Payment and Subscriptions</h2>
            <p className="text-gray-600 mb-4">
              Some features require a paid subscription. By purchasing a subscription:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>You agree to pay the fees specified at checkout</li>
              <li>Subscriptions automatically renew unless cancelled</li>
              <li>You can cancel at any time before the next billing cycle</li>
              <li>Refunds are provided at our discretion</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-gray-600 mb-4">
              KAYAKA-AI is provided "as is" and "as available" without warranties of any kind. We do not guarantee that:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>Our services will be uninterrupted or error-free</li>
              <li>Optimized resumes will result in job interviews or offers</li>
              <li>Third-party ATS systems will accept our formatted resumes</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              To the maximum extent permitted by law, KAYAKA-AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Indemnification</h2>
            <p className="text-gray-600 mb-4">
              You agree to indemnify and hold harmless KAYAKA-AI from any claims, damages, or expenses arising from your use of our services or violation of these terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Termination</h2>
            <p className="text-gray-600 mb-4">
              We may terminate or suspend your account at any time for any reason, including violation of these terms. Upon termination, your right to use our services will immediately cease.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-600 mb-4">
              We may modify these terms at any time. We will notify you of material changes by email or through our platform. Continued use after changes constitutes acceptance of new terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">13. Governing Law</h2>
            <p className="text-gray-600 mb-4">
              These terms shall be governed by the laws of the State of California, without regard to conflict of law principles.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">14. Contact Information</h2>
            <p className="text-gray-600 mb-4">
              For questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-gray-600">
              Email: legal@kayaka-ai.com<br />
              Address: San Francisco, CA
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-white">KAYAKA-AI</span>
              </Link>
              <p className="text-gray-400 text-sm max-w-md">
                AI-powered resume optimization that helps you land your dream job faster.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">Home</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white text-sm transition-colors">Sign In</Link></li>
                <li><Link to="/signup" className="text-gray-400 hover:text-white text-sm transition-colors">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</Link></li>
                <li><Link to="/cookie-policy" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</Link></li>
                <li><Link to="/data-deletion" className="text-gray-400 hover:text-white text-sm transition-colors">Data Deletion</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2026 KAYAKA-AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
