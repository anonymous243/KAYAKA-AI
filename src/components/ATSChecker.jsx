import { useState } from 'react'
import { TEMPLATES, TEMPLATE_CATEGORIES, getTemplatesByCategory, getATSTemplates } from '../data/templates'

export default function ATSChecker({ resumeData, onFix }) {
  const [checked, setChecked] = useState(false)
  const [results, setResults] = useState(null)

  const checkATSCompatibility = () => {
    const issues = []
    const suggestions = []

    // Check for basic sections
    const requiredSections = ['summary', 'experience', 'education', 'skills']
    requiredSections.forEach(section => {
      if (!resumeData?.[section] || (Array.isArray(resumeData[section]) && resumeData[section].length === 0)) {
        issues.push(`Missing or empty ${section} section`)
      }
    })

    // Check for contact info
    if (!resumeData?.email) {
      issues.push('Missing email address')
    }
    if (!resumeData?.name) {
      issues.push('Missing name')
    }
    if (!resumeData?.phone && !resumeData?.location) {
      suggestions.push('Add phone number or location for better ATS compatibility')
    }

    // Check skills count
    if (!resumeData?.skills || resumeData.skills.length < 5) {
      suggestions.push('Add more skills (minimum 5 recommended for ATS)')
    }

    // Check experience
    if (!resumeData?.experience || resumeData.experience.length === 0) {
      issues.push('No work experience listed')
    }

    // Check for keywords
    const hasKeywords = resumeData?.skills?.length >= 10
    if (!hasKeywords) {
      suggestions.push('Add more industry-specific keywords to improve ATS matching')
    }

    // Calculate ATS score
    const maxScore = 100
    const deductions = issues.length * 15 + suggestions.length * 5
    const atsScore = Math.max(0, maxScore - deductions)

    setResults({
      atsScore,
      issues,
      suggestions,
      passed: issues.length === 0,
      grade: atsScore >= 90 ? 'A' : atsScore >= 80 ? 'B' : atsScore >= 70 ? 'C' : 'D'
    })
    setChecked(true)
  }

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">ATS Compatibility Check</h3>
          <p className="text-sm text-gray-600 mt-1">Ensure your resume passes ATS systems</p>
        </div>
        <button
          onClick={checkATSCompatibility}
          disabled={checked}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            checked
              ? 'bg-green-600 text-white cursor-default'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
          }`}
        >
          {checked ? '✓ Checked' : 'Run ATS Check'}
        </button>
      </div>

      {checked && results && (
        <div className="space-y-4">
          {/* ATS Score */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{results.atsScore}</div>
                <div className="text-xs text-white/80">Score</div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-3xl font-bold ${
                  results.atsScore >= 90 ? 'text-green-600' :
                  results.atsScore >= 80 ? 'text-blue-600' :
                  results.atsScore >= 70 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  Grade {results.grade}
                </span>
                {results.passed && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    ATS Ready ✓
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {results.passed
                  ? 'Your resume is optimized for ATS systems!'
                  : `${results.issues.length} issues need attention`}
              </p>
            </div>
          </div>

          {/* Issues */}
          {results.issues.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Critical Issues ({results.issues.length})
              </h4>
              <ul className="space-y-1">
                {results.issues.map((issue, idx) => (
                  <li key={idx} className="text-sm text-red-700 flex items-start gap-2">
                    <span>•</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {results.suggestions.length > 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                </svg>
                Suggestions ({results.suggestions.length})
              </h4>
              <ul className="space-y-1">
                {results.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="text-sm text-yellow-700 flex items-start gap-2">
                    <span>•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommended Templates */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h4 className="font-semibold text-blue-800 mb-3">Recommended Templates</h4>
            <div className="grid grid-cols-2 gap-3">
              {getATSTemplates().slice(0, 4).map(template => (
                <div key={template.id} className="p-3 bg-white rounded-lg border border-blue-100">
                  <div className="text-2xl mb-1">{template.preview}</div>
                  <div className="text-sm font-semibold text-gray-900">{template.name}</div>
                  <div className="text-xs text-green-600 font-medium mt-1">ATS Score: {template.atsScore}/100</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!checked && (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-600">Click "Run ATS Check" to analyze your resume compatibility</p>
          <div className="mt-4 flex justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>Section check</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              <span>Keyword analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
              <span>Format validation</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
