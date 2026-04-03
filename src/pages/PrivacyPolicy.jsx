import { Link } from 'react-router-dom'

export default function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600">
            Last updated: March 24, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <p className="text-gray-600 mb-8">
                At KAYAKA-AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our resume optimization platform.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">1.1 Personal Information</h3>
              <p className="text-gray-600 mb-4">
                When you create an account, we collect:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>Name and email address</li>
                <li>Password (encrypted)</li>
                <li>Resume and profile information you provide</li>
                <li>Job descriptions you analyze</li>
                <li>Generated resumes and optimization data</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">1.2 Usage Information</h3>
              <p className="text-gray-600 mb-4">
                We automatically collect information about how you use our platform:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>Device information and IP address</li>
                <li>Browser type and settings</li>
                <li>Pages visited and features used</li>
                <li>Time and duration of usage</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process your resume uploads and generate optimized resumes</li>
                <li>Analyze job descriptions and provide match scores</li>
                <li>Send you technical updates and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Protect against fraud and abuse</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Information Sharing</h2>
              <p className="text-gray-600 mb-4">
                We do not sell your personal information. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li><strong>With your consent:</strong> When you explicitly agree to share information</li>
                <li><strong>Service providers:</strong> With third-party vendors who perform services on our behalf</li>
                <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Data Security</h2>
              <p className="text-gray-600 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication</li>
                <li>Employee training on data protection</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Your Rights</h2>
              <p className="text-gray-600 mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Delete your information</li>
                <li>Export your data in a portable format</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent for data processing</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Cookies</h2>
              <p className="text-gray-600 mb-4">
                We use cookies and similar tracking technologies to enhance your experience. See our <Link to="/cookie-policy" className="text-blue-600 hover:underline">Cookie Policy</Link> for more details.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Data Retention</h2>
              <p className="text-gray-600 mb-4">
                We retain your personal information for as long as necessary to provide our services and comply with legal obligations. You can request deletion of your account and data at any time.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Children's Privacy</h2>
              <p className="text-gray-600 mb-4">
                Our services are not intended for children under 16. We do not knowingly collect personal information from children under 16.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Changes to This Policy</h2>
              <p className="text-gray-600 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-gray-600">
                Email: privacy@kayaka-ai.com<br />
                Address: San Francisco, CA
              </p>
            </div>
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
