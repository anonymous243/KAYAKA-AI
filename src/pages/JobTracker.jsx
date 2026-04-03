import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  getTrackedApplications,
  updateApplicationStatus,
  deleteApplication
} from '../services/jobTargetingService'
import { useToast } from '../hooks/useToast'

const STATUS_OPTIONS = [
  { id: 'saved', label: 'Saved', color: 'gray' },
  { id: 'applied', label: 'Applied', color: 'blue' },
  { id: 'interview', label: 'Interview', color: 'purple' },
  { id: 'offer', label: 'Offer', color: 'green' },
  { id: 'rejected', label: 'Rejected', color: 'red' },
  { id: 'withdrawn', label: 'Withdrawn', color: 'orange' }
]

export default function JobTracker() {
  const { showToast } = useToast()
  const [applications, setApplications] = useState([])
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = () => {
    const apps = getTrackedApplications()
    setApplications(apps)
  }

  const handleStatusChange = (id, newStatus) => {
    try {
      updateApplicationStatus(id, newStatus)
      loadApplications()
      showToast('Status updated!', 'success')
    } catch {
      showToast('Failed to update status', 'error')
    }
  }

  const handleDelete = (id, title) => {
    if (!confirm(`Delete "${title}" from tracker?`)) return
    
    try {
      deleteApplication(id)
      loadApplications()
      showToast('Job removed from tracker', 'success')
    } catch {
      showToast('Failed to delete job', 'error')
    }
  }

  const filteredApps = applications.filter(app => {
    if (filter === 'all') return true
    return app.status === filter
  })

  const sortedApps = [...filteredApps].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.appliedDate) - new Date(a.appliedDate)
    } else if (sortBy === 'match') {
      return (b.matchPercentage || 0) - (a.matchPercentage || 0)
    } else if (sortBy === 'company') {
      return (a.company || '').localeCompare(b.company || '')
    }
    return 0
  })

  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'applied').length,
    interview: applications.filter(a => a.status === 'interview').length,
    offer: applications.filter(a => a.status === 'offer').length
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      <style>{`
        @keyframes grid-move { 0% { transform: translate(0, 0); } 100% { transform: translate(40px, 40px); } }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.1); } }
        .bg-animated-grid {
          background-image: linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: grid-move 3s linear infinite;
        }
        .animate-pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }
        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .neon-text { text-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }
      `}</style>

      <div className="fixed inset-0 bg-animated-grid"></div>
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse-glow"></div>
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10">
        {/* Header */}
        <header className="glass-panel border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent neon-text">
                  KAYAKA-AI
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">
                  ← Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Job Application Tracker</h1>
            <p className="text-gray-400">Track and manage all your job applications</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-panel rounded-xl p-4 border border-white/10">
              <p className="text-3xl font-bold text-white">{stats.total}</p>
              <p className="text-gray-400 text-sm">Total Jobs</p>
            </div>
            <div className="glass-panel rounded-xl p-4 border border-blue-500/30">
              <p className="text-3xl font-bold text-blue-400">{stats.applied}</p>
              <p className="text-gray-400 text-sm">Applied</p>
            </div>
            <div className="glass-panel rounded-xl p-4 border border-purple-500/30">
              <p className="text-3xl font-bold text-purple-400">{stats.interview}</p>
              <p className="text-gray-400 text-sm">Interviews</p>
            </div>
            <div className="glass-panel rounded-xl p-4 border border-green-500/30">
              <p className="text-3xl font-bold text-green-400">{stats.offer}</p>
              <p className="text-gray-400 text-sm">Offers</p>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="glass-panel rounded-2xl p-6 mb-6 border border-blue-500/30">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-gray-400">Filter:</span>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50"
                >
                  <option value="all">All Jobs</option>
                  {STATUS_OPTIONS.map(status => (
                    <option key={status.id} value={status.id}>{status.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-gray-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50"
                >
                  <option value="date">Date (Newest)</option>
                  <option value="match">Match Score</option>
                  <option value="company">Company</option>
                </select>
                <Link
                  to="/job-targeting"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Job
                </Link>
              </div>
            </div>
          </div>

          {/* Applications List */}
          {sortedApps.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center border border-white/10">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No applications yet</h3>
              <p className="text-gray-400 mb-6">Start tracking your job applications</p>
              <Link
                to="/job-targeting"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Target Your First Job
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedApps.map((app) => {
                const statusOption = STATUS_OPTIONS.find(s => s.id === app.status)
                const colorClasses = {
                  gray: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
                  blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                  purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
                  green: 'bg-green-500/20 text-green-400 border-green-500/30',
                  red: 'bg-red-500/20 text-red-400 border-red-500/30',
                  orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                }

                return (
                  <div
                    key={app.id}
                    className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Job Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-white">{app.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colorClasses[statusOption?.color]}`}>
                            {statusOption?.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                          <span>{app.company}</span>
                          <span>•</span>
                          <span>{app.location}</span>
                          {app.salary && (
                            <>
                              <span>•</span>
                              <span className="text-green-400">{app.salary}</span>
                            </>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Match:</span>
                            <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  app.matchPercentage >= 70 ? 'bg-green-500' :
                                  app.matchPercentage >= 50 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${app.matchPercentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-white font-medium">{app.matchPercentage}%</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            Added {new Date(app.appliedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-3">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className="px-3 py-2 bg-white/10 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50"
                        >
                          {STATUS_OPTIONS.map(status => (
                            <option key={status.id} value={status.id}>{status.label}</option>
                          ))}
                        </select>
                        {app.url && (
                          <a
                            href={app.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            View
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(app.id, app.title)}
                          className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl text-sm font-medium hover:bg-red-500/30 transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
