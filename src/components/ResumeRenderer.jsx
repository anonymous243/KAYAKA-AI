import { useEffect, useRef } from 'react'

/**
 * ResumeRenderer.jsx
 * Premium resume rendering engine — renders real A4 resume layout from user data + template config.
 * Optimized for Enhancv-style "Modular Paper" aesthetic with TRUE INLINE EDITING.
 */

const LAYOUT_TYPES = {
  'ats-classic': 'classic',
  'ats-modern': 'modern',
  'ats-executive': 'executive',
  'ats-tech': 'split-modern',
  'ats-career-changer': 'functional',
  'professional-traditional': 'classic',
  'professional-minimalist': 'modern',
  'professional-harvard': 'academic',
  'professional-business': 'classic',
  'creative-designer': 'split-creative',
  'creative-startup': 'split-creative',
  'creative-marketing': 'split-modern',
  'creative-media': 'split-creative',
  'industry-software': 'split-modern',
  'industry-healthcare': 'classic',
  'industry-education': 'academic',
  'industry-sales': 'modern',
  'experience-entry': 'modern',
  'experience-mid': 'classic',
  'experience-senior': 'executive',
  'experience-executive': 'executive',
}

// ── Shared Editable Component ────────────────────────────────

function EditableText({ value, onUpdate, style = {}, placeholder = "Click to edit", multiline = false }) {
  const elementRef = useRef(null)

  // Sync state to element only on initial mount or if value changes externally
  useEffect(() => {
    if (elementRef.current && elementRef.current.innerText !== value) {
      elementRef.current.innerText = value || ''
    }
  }, [value])

  const handleBlur = () => {
    const newValue = elementRef.current.innerText.trim()
    if (newValue !== value) {
      onUpdate(newValue)
    }
  }

  const handleKeyDown = (e) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault()
      elementRef.current.blur()
    }
  }

  return (
    <div
      ref={elementRef}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="hover:bg-black/5 rounded px-0.5 transition-colors focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#69f6b8]/50"
      style={{ 
          minWidth: 10, 
          display: multiline ? 'block' : 'inline-block',
          cursor: 'text',
          outline: 'none',
          ...style 
      }}
      data-placeholder={placeholder}
    />
  )
}

// ── Shared Section Renderers ─────────────────────────────────

function SectionHeader({ title, accent = '#1e3a8a', layout = 'classic' }) {
  const isSplit = layout.includes('split')
  return (
    <div style={{ marginBottom: isSplit ? 12 : 8, marginTop: isSplit ? 16 : 0 }}>
      <h2 style={{ 
        fontSize: isSplit ? 10 : 11, 
        fontWeight: 800, 
        color: isSplit ? '#111' : accent, 
        textTransform: 'uppercase', 
        letterSpacing: '0.1em', 
        borderBottom: isSplit ? `3px solid ${accent}` : `1.5px solid ${accent}`, 
        display: isSplit ? 'inline-block' : 'block',
        paddingBottom: 3, 
        margin: 0,
        width: isSplit ? 'auto' : '100%'
      }}>
        {title}
      </h2>
    </div>
  )
}

function SkillPills({ skills, accent, onUpdate }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
      {(skills || []).slice(0, 15).map((s, i) => (
        <span key={i} style={{ 
          fontSize: 8, 
          fontWeight: 700,
          padding: '3px 8px', 
          background: accent + '10', 
          border: `1.2px solid ${accent}30`, 
          borderRadius: 4, 
          color: '#111',
          textTransform: 'uppercase',
          letterSpacing: '0.02em'
        }}>
          <EditableText 
            value={s} 
            onUpdate={(val) => {
                const newSkills = [...skills]
                newSkills[i] = val
                onUpdate(newSkills)
            }} 
          />
        </span>
      ))}
    </div>
  )
}

function ExperienceBlock({ exp, accent, idx, onUpdate, layout = 'classic' }) {
  const isSplit = layout.includes('split')
  
  const updateField = (field, val) => {
    onUpdate(idx, field, val)
  }

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <EditableText 
            value={exp.position} 
            onUpdate={(val) => updateField('position', val)}
            style={{ fontSize: isSplit ? 9.5 : 9, fontWeight: 800, color: '#111', textTransform: 'capitalize' }}
        />
        <EditableText 
            value={`${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}`}
            onUpdate={(val) => {
                const parts = val.split('–').map(p => p.trim())
                updateField('startDate', parts[0])
                if (parts[1]) updateField('endDate', parts[1].toLowerCase() === 'present' ? '' : parts[1])
            }}
            style={{ fontSize: 7.5, fontWeight: 700, color: '#888', textAlign: 'right', textTransform: 'uppercase', letterSpacing: '0.05em' }}
        />
      </div>
      <EditableText 
        value={exp.company} 
        onUpdate={(val) => updateField('company', val)}
        style={{ fontSize: 8.5, color: accent, fontWeight: 700, marginBottom: 4, display: 'block' }} 
      />
      
      {exp.description && (
        <ul style={{ paddingLeft: 12, margin: '4px 0 0', listStyleType: 'disc' }}>
          {(Array.isArray(exp.description) ? exp.description : [exp.description]).map((bullet, bIdx) => (
            <li key={bIdx} style={{ fontSize: 8, color: '#444', lineHeight: 1.5, marginBottom: 2 }}>
                <EditableText 
                    value={bullet} 
                    onUpdate={(val) => {
                        const newBullets = Array.isArray(exp.description) ? [...exp.description] : [exp.description]
                        newBullets[bIdx] = val
                        updateField('description', newBullets)
                    }}
                    multiline={true}
                />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ContactItem({ icon, text, path, accent, onUpdate }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
            <span style={{ fontSize: 10, color: accent }}>{icon}</span>
            <EditableText 
                value={text} 
                onUpdate={(val) => onUpdate(path, val)}
                style={{ fontSize: 8, color: '#444', fontWeight: 600 }} 
            />
        </div>
    )
}

// ── Layout: Enhancv-Style Split ──────────────────────────────

function SplitLayout({ data, template, onUpdate, creative = false }) {
  const accent = template.colors?.[0] || '#69f6b8'
  const pi = data.personalInfo || {}
  const name = (pi.fullName || 'Your Name').toUpperCase()
  
  return (
    <div style={{ display: 'flex', height: '100%', boxSizing: 'border-box', background: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '32%', 
        background: creative ? accent + '10' : '#f9fafb', 
        borderRight: '1px solid #f1f5f9',
        padding: '32px 20px', 
        display: 'flex', 
        flexDirection: 'column', 
        shrink: 0 
      }}>
        <div style={{ 
            width: 60, height: 60, borderRadius: '50%', background: accent, color: '#fff', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, marginBottom: 20,
            boxShadow: `0 8px 20px ${accent}40`
        }}>
          {name.charAt(0)}
        </div>

        <EditableText 
            value={name} 
            onUpdate={(val) => onUpdate('personalInfo.fullName', val)}
            style={{ fontSize: 16, fontWeight: 900, color: '#111', margin: '0 0 16px', lineHeight: 1.1, letterSpacing: '-0.02em', display: 'block' }} 
        />
        
        <div style={{ marginBottom: 24 }}>
          <ContactItem icon="✉" text={pi.email} path="personalInfo.email" accent={accent} onUpdate={onUpdate} />
          <ContactItem icon="📞" text={pi.phone} path="personalInfo.phone" accent={accent} onUpdate={onUpdate} />
          <ContactItem icon="📍" text={pi.location} path="personalInfo.location" accent={accent} onUpdate={onUpdate} />
        </div>

        {data.skills?.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <SectionHeader title="Skills" accent={accent} layout="split" />
            <SkillPills skills={data.skills} accent={accent} onUpdate={(val) => onUpdate('skills', val)} />
          </div>
        )}

        {data.education?.length > 0 && (
          <div>
            <SectionHeader title="Education" accent={accent} layout="split" />
            {data.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <EditableText value={edu.institution} onUpdate={(val) => onUpdate(`education.${i}.institution`, val)} style={{ fontSize: 8.5, fontWeight: 800, color: '#111', display: 'block' }} />
                <EditableText value={edu.degree} onUpdate={(val) => onUpdate(`education.${i}.degree`, val)} style={{ fontSize: 7.5, color: '#666', fontWeight: 600, display: 'block' }} />
                <EditableText value={edu.endDate} onUpdate={(val) => onUpdate(`education.${i}.endDate`, val)} style={{ fontSize: 7, color: '#999', display: 'block' }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Body */}
      <div style={{ flex: 1, padding: '32px 28px', overflow: 'hidden' }}>
        {data.summary !== undefined && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ background: accent, height: 20, width: '40%', marginBottom: -14, opacity: 0.15, borderRadius: 2 }} />
            <SectionHeader title="Summary" accent={accent} layout="split" />
            <EditableText 
                value={data.summary} 
                onUpdate={(val) => onUpdate('summary', val)}
                multiline={true}
                style={{ fontSize: 8.5, color: '#444', lineHeight: 1.6, margin: 0, fontWeight: 500, display: 'block' }} 
            />
          </div>
        )}

        {data.experience?.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <SectionHeader title="Experience" accent={accent} layout="split" />
            {data.experience.map((exp, i) => (
              <ExperienceBlock 
                key={i} idx={i} exp={exp} accent={accent} layout="split" 
                onUpdate={(idx, field, val) => onUpdate(`experience.${idx}.${field}`, val)} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Layout: Classic Single Column (Enhanced) ───────────────────

function ClassicLayout({ data, template, onUpdate }) {
  const accent = template.colors?.[0] || '#1e3a8a'
  const pi = data.personalInfo || {}
  const name = pi.fullName || 'Your Name'

  return (
    <div style={{ fontFamily: '"Libre Baskerville", Georgia, serif', color: '#111', padding: '40px 48px', background: '#fff', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <EditableText 
            value={name} 
            onUpdate={(val) => onUpdate('personalInfo.fullName', val)}
            style={{ fontSize: 24, fontWeight: 700, color: '#111', margin: '0 0 8px', letterSpacing: '0.02em', textTransform: 'uppercase', display: 'block' }} 
        />
        <div style={{ fontSize: 8.5, color: '#666', fontWeight: 600, display: 'flex', justifyContent: 'center', gap: 12 }}>
          <EditableText value={pi.email} onUpdate={(val) => onUpdate('personalInfo.email', val)} />
          <span>·</span>
          <EditableText value={pi.phone} onUpdate={(val) => onUpdate('personalInfo.phone', val)} />
          <span>·</span>
          <EditableText value={pi.location} onUpdate={(val) => onUpdate('personalInfo.location', val)} />
        </div>
      </div>

      <div style={{ borderTop: `2px solid ${accent}`, paddingTop: 16 }}>
          {data.summary !== undefined && (
            <div style={{ marginBottom: 18 }}>
              <SectionHeader title="Professional Profile" accent={accent} />
              <EditableText 
                value={data.summary} 
                onUpdate={(val) => onUpdate('summary', val)}
                multiline={true}
                style={{ fontSize: 8.5, color: '#333', lineHeight: 1.6, margin: 0, display: 'block' }} 
              />
            </div>
          )}

          {data.experience?.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <SectionHeader title="Work Experience" accent={accent} />
              {data.experience.map((exp, i) => (
                <ExperienceBlock 
                    key={i} idx={i} exp={exp} accent={accent} 
                    onUpdate={(idx, field, val) => onUpdate(`experience.${idx}.${field}`, val)} 
                />
              ))}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
             {data.skills?.length > 0 && (
                <div>
                  <SectionHeader title="Core Skills" accent={accent} />
                  <SkillPills skills={data.skills} accent={accent} onUpdate={(val) => onUpdate('skills', val)} />
                </div>
             )}
             {data.education?.length > 0 && (
                <div>
                  <SectionHeader title="Education" accent={accent} />
                  {data.education.map((edu, i) => (
                    <div key={i} style={{ marginBottom: 10 }}>
                        <EditableText value={edu.institution} onUpdate={(val) => onUpdate(`education.${i}.institution`, val)} style={{ fontSize: 9, fontWeight: 700, display: 'block' }} />
                        <EditableText value={edu.degree} onUpdate={(val) => onUpdate(`education.${i}.degree`, val)} style={{ fontSize: 8, color: '#555', display: 'block' }} />
                        <div style={{ fontSize: 7.5, color: '#888' }}>
                            <EditableText value={edu.startDate} onUpdate={(val) => onUpdate(`education.${i}.startDate`, val)} />
                            <span> – </span>
                            <EditableText value={edu.endDate} onUpdate={(val) => onUpdate(`education.${i}.endDate`, val)} />
                        </div>
                    </div>
                  ))}
                </div>
             )}
          </div>
      </div>
    </div>
  )
}

// ── Main Renderer ────────────────────────────────────────────

export default function ResumeRenderer({ data, template, scale = 1, onUpdate }) {
  const layoutKey = LAYOUT_TYPES[template?.id] || 'classic'
  const W = 595 
  const H = 842 

  const rendererProps = { data, template, onUpdate }

  const layouts = {
    'classic': <ClassicLayout {...rendererProps} />,
    'modern': <SplitLayout {...rendererProps} creative={false} />,
    'split-modern': <SplitLayout {...rendererProps} creative={false} />,
    'split-creative': <SplitLayout {...rendererProps} creative={true} />,
    'executive': <ClassicLayout {...rendererProps} />,
  }

  return (
    <div
      style={{
        width: W,
        height: H,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        background: '#fff',
        boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <div style={{ height: '100%', width: '100%' }}>
          {layouts[layoutKey] || layouts.classic}
      </div>
    </div>
  )
}

export { LAYOUT_TYPES }
