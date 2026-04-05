import { useState } from 'react'
import { TEMPLATES, TEMPLATE_CATEGORIES } from '../data/templates'

const CATEGORY_INFO = {
  [TEMPLATE_CATEGORIES.ATS_OPTIMIZED]: { name: 'ATS-Optimized', icon: '✅', color: 'green' },
  [TEMPLATE_CATEGORIES.PROFESSIONAL]: { name: 'Professional', icon: '💼', color: 'blue' },
  [TEMPLATE_CATEGORIES.CREATIVE]: { name: 'Creative', icon: '🎨', color: 'purple' },
  [TEMPLATE_CATEGORIES.INDUSTRY]: { name: 'Industry-Specific', icon: '⚙️', color: 'orange' },
  [TEMPLATE_CATEGORIES.EXPERIENCE]: { name: 'Experience Level', icon: '📊', color: 'indigo' }
}

export default function TemplateSelector({ selectedTemplate, onSelect }) {
  const [activeCategory, setActiveCategory] = useState(TEMPLATE_CATEGORIES.ATS_OPTIMIZED)

  const filteredTemplates = TEMPLATES.filter(t => t.category === activeCategory)

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Template</h3>
        <p className="text-gray-600">Select from 21 professional templates optimized for ATS and recruiters</p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {Object.entries(CATEGORY_INFO).map(([key, info]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
              activeCategory === key
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{info.icon}</span>
            <span>{info.name}</span>
            <span className="text-xs opacity-75">
              ({TEMPLATES.filter(t => t.category === key).length})
            </span>
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            onClick={() => onSelect(template)}
            className={`cursor-pointer rounded-xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
              selectedTemplate?.id === template.id
                ? 'border-blue-600 bg-blue-50 shadow-lg shadow-blue-500/25'
                : 'border-gray-200 hover:border-blue-400'
            }`}
          >
            {/* Template Preview */}
            <div className="p-4 bg-gray-50 rounded-t-lg border-b border-gray-200">
              <div className="text-4xl text-center">{template.preview}</div>
              {template.atsScore >= 90 && (
                <div className="mt-2 flex justify-center">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    ATS {template.atsScore}/100
                  </span>
                </div>
              )}
            </div>

            {/* Template Info */}
            <div className="p-4">
              <h4 className="font-bold text-gray-900 mb-1">{template.name}</h4>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
              
              {/* Features */}
              <div className="flex flex-wrap gap-1 mb-3">
                {template.features.slice(0, 2).map((feature, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                    {feature}
                  </span>
                ))}
              </div>

              {/* Best For */}
              <div className="text-xs text-gray-500">
                <span className="font-medium">Best for:</span> {template.bestFor.slice(0, 2).join(', ')}
              </div>

              {/* Selected Indicator */}
              {selectedTemplate?.id === template.id && (
                <div className="mt-3 flex items-center gap-2 text-blue-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-semibold">Selected</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Template Count */}
      <div className="mt-6 text-center text-sm text-gray-500">
        Showing {filteredTemplates.length} templates in {CATEGORY_INFO[activeCategory].name} category
        {' • '}Total {TEMPLATES.length} templates available
      </div>
    </div>
  )
}
