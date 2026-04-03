import { Link } from 'react-router-dom'

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: 'How to Tailor Your Resume for ATS Systems',
      excerpt: 'Learn the secrets to getting your resume past Applicant Tracking Systems and into human hands.',
      category: 'Resume Tips',
      date: 'March 20, 2026',
      readTime: '5 min read',
      emoji: '📄'
    },
    {
      id: 2,
      title: '10 Skills That Employers Are Looking For in 2026',
      excerpt: 'Discover the most in-demand skills across industries and how to showcase them on your resume.',
      category: 'Career Advice',
      date: 'March 18, 2026',
      readTime: '7 min read',
      emoji: '⚡'
    },
    {
      id: 3,
      title: 'The Perfect Resume Format: A Complete Guide',
      excerpt: 'From chronological to functional, find out which resume format works best for your situation.',
      category: 'Resume Tips',
      date: 'March 15, 2026',
      readTime: '6 min read',
      emoji: '📋'
    },
    {
      id: 4,
      title: 'How to Write a Compelling Professional Summary',
      excerpt: 'Your summary is the first thing recruiters see. Make it count with these proven tips.',
      category: 'Writing Tips',
      date: 'March 12, 2026',
      readTime: '4 min read',
      emoji: '✍️'
    },
    {
      id: 5,
      title: 'Ace Your Interview: Common Questions & Best Answers',
      excerpt: 'Prepare for your next interview with our comprehensive guide to common questions.',
      category: 'Interview Prep',
      date: 'March 10, 2026',
      readTime: '8 min read',
      emoji: '🎤'
    },
    {
      id: 6,
      title: 'LinkedIn Optimization: Get Noticed by Recruiters',
      excerpt: 'Transform your LinkedIn profile into a job-seeking powerhouse with these optimization tips.',
      category: 'LinkedIn',
      date: 'March 8, 2026',
      readTime: '6 min read',
      emoji: '💼'
    }
  ]

  const categories = ['All', 'Resume Tips', 'Career Advice', 'Interview Prep', 'LinkedIn', 'Writing Tips']

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
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full mb-6 border border-blue-100 shadow-sm">
            <span className="text-sm font-semibold text-blue-600">📚 Career Resources</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            The KAYAKA-AI Blog
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Expert tips, guides, and insights to help you land your dream job
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {categories.map((category, index) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  index === 0
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 group cursor-pointer"
              >
                <div className="h-48 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
                  <span className="text-6xl group-hover:scale-110 transition-transform">{post.emoji}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="text-gray-400 text-xs">{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">{post.date}</span>
                    <span className="text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Read more
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
              Load More Posts
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-white/90 mb-8">
            Get the latest career tips, resume advice, and job search strategies delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
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
