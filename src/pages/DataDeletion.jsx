import { Link } from 'react-router-dom'

export default function DataDeletion() {
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
            Data Deletion Request
          </h1>
          <p className="text-xl text-gray-600">
            Last updated: April 2, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <p className="text-gray-600 mb-8">
                At KAYAKA-AI, we respect your right to control your personal data. This page explains how you can request deletion of your personal information from our systems.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Your Right to Data Deletion</h2>
              <p className="text-gray-600 mb-4">
                Under various data protection laws (including GDPR, CCPA, and others), you have the right to request deletion of your personal data. This is also known as the "right to be forgotten."
              </p>
              <p className="text-gray-600 mb-4">
                You can request deletion of your data at any time, and we will process your request within 30 days, unless there are legal reasons to retain certain information.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. What Data Can Be Deleted</h2>
              <p className="text-gray-600 mb-4">
                When you request data deletion, we will delete the following information:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>Your account information (name, email, profile data)</li>
                <li>Uploaded resumes and parsed resume data</li>
                <li>Job descriptions you have analyzed</li>
                <li>Generated resumes and optimization data</li>
                <li>Application tracking history</li>
                <li>Usage analytics associated with your account</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Data We May Retain</h2>
              <p className="text-gray-600 mb-4">
                In some cases, we may need to retain certain information even after a deletion request:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li><strong>Legal obligations:</strong> Information required for tax, accounting, or legal compliance</li>
                <li><strong>Fraud prevention:</strong> Data necessary to prevent fraud or abuse</li>
                <li><strong>Security:</strong> Information needed to maintain system security</li>
                <li><strong>Dispute resolution:</strong> Data related to ongoing disputes or claims</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. How to Request Data Deletion</h2>
              <p className="text-gray-600 mb-4">
                You can request deletion of your data through the following methods:
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">4.1 Delete Your Account (Self-Service)</h3>
              <p className="text-gray-600 mb-4">
                The fastest way to delete your data is to delete your account directly from your account settings:
              </p>
              <ol className="list-decimal list-inside text-gray-600 mb-4 space-y-2">
                <li>Log in to your KAYAKA-AI account</li>
                <li>Navigate to Account Settings</li>
                <li>Click on "Delete Account"</li>
                <li>Confirm the deletion</li>
              </ol>
              <p className="text-gray-600 mb-4">
                Your account and all associated data will be deleted immediately upon confirmation.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">4.2 Email Request</h3>
              <p className="text-gray-600 mb-4">
                You can also send a deletion request to our privacy team:
              </p>
              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <p className="text-gray-700 font-medium">Email: privacy@kayaka-ai.com</p>
                <p className="text-gray-600 text-sm mt-2">Include your account email address and specify that you want your data deleted.</p>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">4.3 Mail Request</h3>
              <p className="text-gray-600 mb-4">
                For formal written requests, you can mail us at:
              </p>
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-gray-700">KAYAKA-AI<br />
                Attn: Data Protection Officer<br />
                San Francisco, CA</p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Verification Process</h2>
              <p className="text-gray-600 mb-4">
                To protect your privacy, we will verify your identity before processing your deletion request:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>We may send a confirmation email to your registered email address</li>
                <li>For account deletion, you must be logged in to confirm</li>
                <li>For email requests, we may ask for additional verification</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Processing Time</h2>
              <p className="text-gray-600 mb-4">
                We will process your deletion request within the following timeframes:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li><strong>Account deletion (self-service):</strong> Immediate</li>
                <li><strong>Email requests:</strong> Within 30 days</li>
                <li><strong>Complex requests:</strong> Up to 60 days (we will notify you of any delays)</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Confirmation</h2>
              <p className="text-gray-600 mb-4">
                After your deletion request is processed, we will send you a confirmation email. This will include:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>Confirmation that your account has been deleted</li>
                <li>Summary of data that was deleted</li>
                <li>Information about any data retained and the legal basis for retention</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Third-Party Data</h2>
              <p className="text-gray-600 mb-4">
                If we have shared your data with third-party service providers, we will:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>Notify them of your deletion request</li>
                <li>Request that they delete their copies of your data</li>
                <li>Provide you with a list of third parties who received your data (upon request)</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Consequences of Deletion</h2>
              <p className="text-gray-600 mb-4">
                Please note that deleting your data will:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>Permanently delete your account</li>
                <li>Remove all your uploaded and generated resumes</li>
                <li>Delete your application tracking history</li>
                <li>Make it impossible to recover your data</li>
              </ul>
              <p className="text-gray-600 mb-4">
                If you wish to use KAYAKA-AI again in the future, you will need to create a new account.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have questions about data deletion or our privacy practices, please contact us at:
              </p>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700">
                  Email: privacy@kayaka-ai.com<br />
                  Address: San Francisco, CA
                </p>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to Delete Your Data?</h3>
                <p className="text-gray-600 mb-4">
                  If you're sure you want to delete your account and all associated data, you can do so from your account settings.
                </p>
                <Link to="/login" className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all hover:-translate-y-0.5">
                  Go to Account Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © 2026 KAYAKA-AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
