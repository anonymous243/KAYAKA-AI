import { Link } from 'react-router-dom'

export default function Careers() {
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
              <Link to="/about" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">About</Link>
              <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Sign In</Link>
              <Link to="/signup" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all hover:-translate-y-0.5">
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full mb-6 border border-blue-100 shadow-sm">
            <span className="text-sm font-semibold text-blue-600">🚀 Join Our Journey</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            We're Building Something Special
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            KAYAKA-AI is a lean, focused team dedicated to helping job seekers land their dream jobs. 
            We're not actively hiring right now, but we're always interested in connecting with talented people.
          </p>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Do</h2>
            <p className="text-xl text-gray-600">AI-powered resume optimization for everyone</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                emoji: '📄',
                title: 'Resume Analysis',
                description: 'Upload your resume and get AI-powered insights to improve your chances.'
              },
              {
                emoji: '🎯',
                title: 'JD Matching',
                description: 'Compare your resume against job descriptions and see your match score.'
              },
              {
                emoji: '✨',
                title: 'Smart Optimization',
                description: 'Generate tailored resumes optimized for ATS systems in seconds.'
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="text-5xl mb-4">{item.emoji}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Built Different</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We're a small, focused team that believes in quality over quantity. Instead of chasing growth at all costs, we're building a sustainable product that genuinely helps people.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Every feature we build is designed with one goal in mind: helping job seekers get more interviews and land better jobs. No bloat, no nonsense — just tools that work.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We're proud to be bootstrapped and independent. This means we answer to our users, not investors.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-3xl p-8 flex items-center justify-center h-80">
              <div className="text-center">
                <div className="text-6xl mb-4">🏠</div>
                <p className="text-gray-600 font-medium">Remote-first & Bootstrapped</p>
                <p className="text-gray-500 text-sm mt-2">Building sustainably since 2024</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">What guides our work</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                emoji: '🎯',
                title: 'User First',
                description: 'Every decision we make starts with what is best for our users'
              },
              {
                emoji: '💡',
                title: 'Simplicity',
                description: 'We build simple, intuitive tools that anyone can use.'
              },
              {
                emoji: '🤝',
                title: 'Transparency',
                description: 'We are open about our process, pricing, and decisions'
              },
              {
                emoji: '🌱',
                title: 'Sustainability',
                description: 'We are building for the long term, not quick exits'
              }
            ].map((value, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 hover:shadow-md transition-all"
              >
                <div className="text-4xl mb-3">{value.emoji}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stay Connected */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Want to Stay Updated?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            We're not hiring right now, but feel free to reach out if you'd like to connect or have suggestions for how we can improve KAYAKA-AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-block px-10 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg"
            >
              Get in Touch
            </Link>
            <Link
              to="/blog"
              className="inline-block px-10 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/30"
            >
              Read Our Blog
            </Link>
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
