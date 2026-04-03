import { Link } from 'react-router-dom'

export default function CookiePolicy() {
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
            Cookie Policy
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
              This Cookie Policy explains how KAYAKA-AI uses cookies and similar technologies to recognize you when you visit our website or use our services. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. What Are Cookies?</h2>
            <p className="text-gray-600 mb-4">
              Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work efficiently and to provide reporting information.
            </p>
            <p className="text-gray-600 mb-4">
              Cookies set by the website owner (in this case, KAYAKA-AI) are called "first-party cookies." Cookies set by parties other than the website owner are called "third-party cookies."
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Why Do We Use Cookies?</h2>
            <p className="text-gray-600 mb-4">
              We use cookies for several reasons:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li><strong>Essential cookies:</strong> Required to provide you with services available through our website</li>
              <li><strong>Performance cookies:</strong> Help us understand how visitors interact with our website</li>
              <li><strong>Functionality cookies:</strong> Remember your choices and preferences</li>
              <li><strong>Analytics cookies:</strong> Collect information about how you use our website</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Types of Cookies We Use</h2>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">3.1 Essential Cookies</h3>
            <p className="text-gray-600 mb-4">
              These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-gray-700">Cookie</th>
                    <th className="text-left py-2 text-gray-700">Purpose</th>
                    <th className="text-left py-2 text-gray-700">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-600">session_id</td>
                    <td className="py-2 text-gray-600">Maintain user session</td>
                    <td className="py-2 text-gray-600">Session</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-600">auth_token</td>
                    <td className="py-2 text-gray-600">Authentication</td>
                    <td className="py-2 text-gray-600">7 days</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">3.2 Analytics Cookies</h3>
            <p className="text-gray-600 mb-4">
              These cookies collect information about how visitors use our website, such as which pages visitors go to most often. We use this information to improve our website.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-gray-700">Cookie</th>
                    <th className="text-left py-2 text-gray-700">Purpose</th>
                    <th className="text-left py-2 text-gray-700">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-600">_ga</td>
                    <td className="py-2 text-gray-600">Google Analytics - distinguish users</td>
                    <td className="py-2 text-gray-600">2 years</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-600">_gid</td>
                    <td className="py-2 text-gray-600">Google Analytics - throttle request rate</td>
                    <td className="py-2 text-gray-600">1 day</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">3.3 Functionality Cookies</h3>
            <p className="text-gray-600 mb-4">
              These cookies allow our website to remember choices you make (such as your user name, language, or region) and provide enhanced, more personalized features.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-gray-700">Cookie</th>
                    <th className="text-left py-2 text-gray-700">Purpose</th>
                    <th className="text-left py-2 text-gray-700">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-600">user_preferences</td>
                    <td className="py-2 text-gray-600">Store user settings</td>
                    <td className="py-2 text-gray-600">1 year</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-600">theme</td>
                    <td className="py-2 text-gray-600">Remember theme preference</td>
                    <td className="py-2 text-gray-600">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. How to Control Cookies</h2>
            <p className="text-gray-600 mb-4">
              You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences through your browser settings. Most web browsers allow some control of most cookies through the browser settings.
            </p>
            <p className="text-gray-600 mb-4">
              To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.allaboutcookies.org</a>.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Updates to This Policy</h2>
            <p className="text-gray-600 mb-4">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for operational, legal, or regulatory reasons. We will notify you of any material changes by posting a notice on our website.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about our use of cookies, please contact us at:
            </p>
            <p className="text-gray-600">
              Email: privacy@kayaka-ai.com<br />
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
