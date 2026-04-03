/**
 * TemplatePreviewCard.jsx
 * Renders a miniature A4 resume preview inside a selectable card.
 * Uses ResumeRenderer scaled down to card thumbnail size.
 */
import ResumeRenderer from './ResumeRenderer'

const CARD_W = 148   // display width of card thumbnail
const CARD_H = 209   // A4 ratio: 148 * (842/595) ≈ 209
const A4_W   = 595
const SCALE  = CARD_W / A4_W   // ~0.248

const LAYOUT_LABELS = {
  'ats-classic': 'Single Column',
  'ats-modern': 'Modern Clean',
  'ats-executive': 'Executive',
  'ats-tech': 'Two Column',
  'ats-career-changer': 'Functional',
  'professional-traditional': 'Traditional',
  'professional-minimalist': 'Minimalist',
  'professional-harvard': 'Academic',
  'professional-business': 'Business',
  'creative-designer': 'Creative Sidebar',
  'creative-startup': 'Bold Creative',
  'creative-marketing': 'Marketing',
  'creative-media': 'Media',
  'industry-software': 'Tech Dev',
  'industry-healthcare': 'Healthcare',
  'industry-education': 'Academic',
  'industry-sales': 'Sales',
  'experience-entry': 'Entry Level',
  'experience-mid': 'Mid Level',
  'experience-senior': 'Senior',
  'experience-executive': 'C-Suite',
}

const READABILITY_BOOST = {
  'creative-designer': '+8%',
  'creative-startup': '+6%',
  'ats-modern': '+12%',
  'ats-tech': '+15%',
  'experience-executive': '+10%',
  'professional-harvard': '+9%',
}

const HIRED_PERCENT = {
  'ats-classic': '72%',
  'ats-modern': '65%',
  'professional-traditional': '58%',
  'industry-software': '70%',
  'experience-senior': '61%',
}

export default function TemplatePreviewCard({ template, data, isSelected, onSelect }) {
  const readability = READABILITY_BOOST[template.id] || '+12%'
  const hired = HIRED_PERCENT[template.id] || '65%'

  return (
    <div
      onClick={() => onSelect(template)}
      className="group relative cursor-pointer flex flex-col"
      style={{ userSelect: 'none' }}
    >
      {/* Card wrapper */}
      <div
        className={`relative rounded-xl overflow-hidden transition-all duration-200 ${
          isSelected
            ? 'ring-2 ring-[#6C5CE7] shadow-[0_0_20px_rgba(108,92,231,0.35)] -translate-y-1'
            : 'ring-1 ring-white/10 hover:ring-[#6C5CE7]/50 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)]'
        }`}
        style={{ width: CARD_W, background: '#1a1d2e' }}
      >
        {/* Selected checkmark */}
        {isSelected && (
          <div className="absolute top-1.5 right-1.5 z-10 w-5 h-5 bg-[#6C5CE7] rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
          </div>
        )}

        {/* AI Best Match badge */}
        {template.id === 'ats-classic' && !isSelected && (
          <div className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 bg-[#6C5CE7] text-white text-[8px] font-bold rounded tracking-wide">
            AI Pick
          </div>
        )}

        {/* Mini resume preview — clipped A4 */}
        <div style={{ width: CARD_W, height: CARD_H, overflow: 'hidden', background: '#fff', position: 'relative' }}>
          <div style={{ transform: `scale(${SCALE})`, transformOrigin: 'top left', width: A4_W, height: A4_W * (CARD_H / CARD_W) / SCALE }}>
            <ResumeRenderer
              data={data}
              template={template}
              scale={1}
            />
          </div>
          {/* Shimmer overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
        </div>

        {/* Card footer */}
        <div className="px-2.5 py-2 bg-[#0f1221]">
          <div className="flex justify-between items-center mb-0.5">
            <span className="text-[9px] font-bold text-white truncate">{template.name}</span>
            <span className="text-[8px] font-bold text-emerald-400 flex-shrink-0 ml-1">ATS {template.atsScore}</span>
          </div>
          <span className="text-[7.5px] text-white/40">{LAYOUT_LABELS[template.id] || 'Professional'}</span>
        </div>
      </div>

      {/* Stats below card */}
      <div className="flex items-center gap-2 mt-1.5 px-0.5">
        <span className="text-[7.5px] text-[#A29BFE]/70">📈 Readability {readability}</span>
        <span className="text-[7.5px] text-white/30">·</span>
        <span className="text-[7.5px] text-white/40">{hired} hired</span>
      </div>
    </div>
  )
}
