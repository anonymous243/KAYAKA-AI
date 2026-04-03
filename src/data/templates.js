/**
 * KAYAKA-AI Resume Templates Database
 * 20+ ATS-Optimized Templates Across 5 Categories
 */

export const TEMPLATE_CATEGORIES = {
  ATS_OPTIMIZED: 'ats-optimized',
  PROFESSIONAL: 'professional',
  CREATIVE: 'creative',
  INDUSTRY: 'industry',
  EXPERIENCE: 'experience'
}

export const TEMPLATES = [
  // ============================================
  // ATS-OPTIMIZED TEMPLATES (5 templates)
  // ============================================
  {
    id: 'ats-classic',
    name: 'Classic ATS',
    category: TEMPLATE_CATEGORIES.ATS_OPTIMIZED,
    description: 'Ultra-clean single-column layout optimized for ATS systems',
    preview: '📄',
    features: ['Single column', 'Premium Serif Typography', 'ATS-friendly', 'Clean layout', 'Standard sections'],
    bestFor: ['All industries', 'Corporate roles', 'Government jobs'],
    fonts: ['Libre Baskerville', 'Arial', 'Calibri', 'Times New Roman'],
    atsScore: 100,
    difficulty: 'easy',
    colors: ['#000000', '#333333', '#666666']
  },
  {
    id: 'ats-modern',
    name: 'Modern ATS',
    category: TEMPLATE_CATEGORIES.ATS_OPTIMIZED,
    description: 'Contemporary design with subtle ATS-friendly elements',
    preview: '📱',
    features: ['Two-column split', 'Sidebar stats', 'Modern styling', 'ATS-compatible', 'Clean headers'],
    bestFor: ['Tech companies', 'Startups', 'Modern corporations'],
    fonts: ['Inter', 'Helvetica', 'Arial'],
    atsScore: 98,
    difficulty: 'easy',
    colors: ['#69f6b8', '#070d1f']
  },
  {
    id: 'ats-executive',
    name: 'Executive ATS',
    category: TEMPLATE_CATEGORIES.ATS_OPTIMIZED,
    description: 'Senior-level focused with leadership emphasis',
    preview: '👔',
    features: ['Executive summary', 'Leadership focus', 'ATS-optimized', 'Professional'],
    bestFor: ['C-suite', 'VP roles', 'Directors', 'Senior executives'],
    fonts: ['Times New Roman', 'Georgia', 'Garamond'],
    atsScore: 97,
    difficulty: 'medium',
    colors: ['#1e3a8a', '#333333', '#666666']
  },
  {
    id: 'ats-tech',
    name: 'Tech ATS',
    category: TEMPLATE_CATEGORIES.ATS_OPTIMIZED,
    description: 'Skills-forward layout for technical roles',
    preview: '💻',
    features: ['Technical sidebar', 'Tech stack highlighted', 'ATS-friendly', 'Project focus'],
    bestFor: ['Software engineers', 'Developers', 'IT professionals', 'Data scientists'],
    fonts: ['Inter', 'Fira Code', 'Arial'],
    atsScore: 99,
    difficulty: 'easy',
    colors: ['#69f6b8', '#333333', '#666666']
  },
  {
    id: 'ats-career-changer',
    name: 'Career Changer ATS',
    category: TEMPLATE_CATEGORIES.ATS_OPTIMIZED,
    description: 'Highlights transferable skills for career transitions',
    preview: '🔄',
    features: ['Transferable skills', 'Functional format', 'ATS-compatible', 'Achievement focus'],
    bestFor: ['Career changers', 'Military veterans', 'Returning professionals'],
    fonts: ['Arial', 'Calibri', 'Verdana'],
    atsScore: 96,
    difficulty: 'medium',
    colors: ['#7c3aed', '#333333', '#666666']
  },

  // ============================================
  // PROFESSIONAL TEMPLATES (4 templates)
  // ============================================
  {
    id: 'professional-traditional',
    name: 'Traditional Professional',
    category: TEMPLATE_CATEGORIES.PROFESSIONAL,
    description: 'Classic business format for conservative industries',
    preview: '📋',
    features: ['Conservative design', 'Clear hierarchy', 'Time-tested format', 'Professional'],
    bestFor: ['Law', 'Finance', 'Consulting', 'Accounting'],
    fonts: ['Times New Roman', 'Georgia', 'Garamond'],
    atsScore: 95,
    difficulty: 'easy',
    colors: ['#1e3a8a', '#333333', '#666666']
  },
  {
    id: 'professional-minimalist',
    name: 'Minimalist Professional',
    category: TEMPLATE_CATEGORIES.PROFESSIONAL,
    description: 'Clean, modern design with maximum readability',
    preview: '✨',
    features: ['Minimal design', 'Maximum white space', 'Clean typography', 'Modern'],
    bestFor: ['Business', 'Marketing', 'Sales', 'Operations'],
    fonts: ['Helvetica', 'Arial', 'Open Sans'],
    atsScore: 94,
    difficulty: 'easy',
    colors: ['#333333', '#666666', '#999999']
  },
  {
    id: 'professional-harvard',
    name: 'Harvard Style',
    category: TEMPLATE_CATEGORIES.PROFESSIONAL,
    description: 'Academic standard format used by top universities',
    preview: '🎓',
    features: ['Academic standard', 'Education focus', 'Publications section', 'Research friendly'],
    bestFor: ['Academia', 'Research', 'PhD candidates', 'Professors'],
    fonts: ['Times New Roman', 'Georgia', 'Palatino'],
    atsScore: 93,
    difficulty: 'medium',
    colors: ['#a61c00', '#333333', '#666666']
  },
  {
    id: 'professional-business',
    name: 'Business Professional',
    category: TEMPLATE_CATEGORIES.PROFESSIONAL,
    description: 'Corporate-ready format for business roles',
    preview: '💼',
    features: ['Business focus', 'Results-oriented', 'Professional design', 'Corporate ready'],
    bestFor: ['Management', 'Business development', 'HR', 'Administration'],
    fonts: ['Calibri', 'Arial', 'Verdana'],
    atsScore: 95,
    difficulty: 'easy',
    colors: ['#0f172a', '#333333', '#666666']
  },

  // ============================================
  // CREATIVE TEMPLATES (4 templates)
  // ============================================
  {
    id: 'creative-designer',
    name: 'Designer Creative',
    category: TEMPLATE_CATEGORIES.CREATIVE,
    description: 'Portfolio-friendly layout for creative professionals',
    preview: '🎨',
    features: ['Visual hierarchy', 'Portfolio links', 'Creative layout', 'Design-focused'],
    bestFor: ['Graphic designers', 'UX/UI designers', 'Art directors', 'Creatives'],
    fonts: ['Montserrat', 'Open Sans', 'Lato'],
    atsScore: 75,
    difficulty: 'hard',
    colors: ['#ec4899', '#8b5cf6', '#333333']
  },
  {
    id: 'creative-startup',
    name: 'Startup Bold',
    category: TEMPLATE_CATEGORIES.CREATIVE,
    description: 'Modern, bold design for startup culture',
    preview: '🚀',
    features: ['Bold design', 'Modern aesthetic', 'Startup culture', 'Innovation focus'],
    bestFor: ['Startups', 'Tech companies', 'Innovation roles', 'Entrepreneurs'],
    fonts: ['Poppins', 'Montserrat', 'Inter'],
    atsScore: 80,
    difficulty: 'medium',
    colors: ['#f59e0b', '#ef4444', '#333333']
  },
  {
    id: 'creative-marketing',
    name: 'Marketing Creative',
    category: TEMPLATE_CATEGORIES.CREATIVE,
    description: 'Visual hierarchy optimized for marketing roles',
    preview: '📊',
    features: ['Metrics focus', 'Campaign highlights', 'Visual appeal', 'Results-driven'],
    bestFor: ['Marketing', 'Advertising', 'PR', 'Communications'],
    fonts: ['Raleway', 'Open Sans', 'Lato'],
    atsScore: 82,
    difficulty: 'medium',
    colors: ['#3b82f6', '#10b981', '#333333']
  },
  {
    id: 'creative-media',
    name: 'Media Creative',
    category: TEMPLATE_CATEGORIES.CREATIVE,
    description: 'Dynamic layout for media and entertainment',
    preview: '🎬',
    features: ['Dynamic design', 'Media links', 'Entertainment focus', 'Creative freedom'],
    bestFor: ['Media', 'Entertainment', 'Journalism', 'Content creation'],
    fonts: ['Playfair Display', 'Lato', 'Source Sans Pro'],
    atsScore: 78,
    difficulty: 'hard',
    colors: ['#8b5cf6', '#ec4899', '#333333']
  },

  // ============================================
  // INDUSTRY-SPECIFIC TEMPLATES (4 templates)
  // ============================================
  {
    id: 'industry-software',
    name: 'Software Engineer',
    category: TEMPLATE_CATEGORIES.INDUSTRY,
    description: 'Tech stack and projects focused for developers',
    preview: '⚙️',
    features: ['Tech stack section', 'Projects highlighted', 'GitHub links', 'Skills matrix'],
    bestFor: ['Software engineers', 'Full-stack developers', 'Backend developers', 'DevOps'],
    fonts: ['Consolas', 'Fira Code', 'Arial'],
    atsScore: 97,
    difficulty: 'medium',
    colors: ['#059669', '#2563eb', '#333333']
  },
  {
    id: 'industry-healthcare',
    name: ' Healthcare Professional',
    category: TEMPLATE_CATEGORIES.INDUSTRY,
    description: 'Certifications and patient care focused',
    preview: '🏥',
    features: ['Certifications first', 'Patient care focus', 'Licenses highlighted', 'Clinical experience'],
    bestFor: ['Nurses', 'Doctors', 'Healthcare admin', 'Medical technicians'],
    fonts: ['Arial', 'Calibri', 'Times New Roman'],
    atsScore: 96,
    difficulty: 'easy',
    colors: ['#dc2626', '#333333', '#666666']
  },
  {
    id: 'industry-education',
    name: 'Education Professional',
    category: TEMPLATE_CATEGORIES.INDUSTRY,
    description: 'Teaching philosophy and curriculum focused',
    preview: '📚',
    features: ['Teaching philosophy', 'Curriculum development', 'Student outcomes', 'Certifications'],
    bestFor: ['Teachers', 'Professors', 'Administrators', 'Education specialists'],
    fonts: ['Georgia', 'Times New Roman', 'Garamond'],
    atsScore: 94,
    difficulty: 'medium',
    colors: ['#7c3aed', '#333333', '#666666']
  },
  {
    id: 'industry-sales',
    name: 'Sales Professional',
    category: TEMPLATE_CATEGORIES.INDUSTRY,
    description: 'Metrics and achievements driven layout',
    preview: '📈',
    features: ['Quota achievements', 'Revenue metrics', 'Sales figures', 'Performance data'],
    bestFor: ['Sales reps', 'Account executives', 'Business development', 'Sales managers'],
    fonts: ['Arial', 'Helvetica', 'Verdana'],
    atsScore: 95,
    difficulty: 'easy',
    colors: ['#16a34a', '#333333', '#666666']
  },

  // ============================================
  // EXPERIENCE LEVEL TEMPLATES (4 templates)
  // ============================================
  {
    id: 'experience-entry',
    name: 'Entry Level',
    category: TEMPLATE_CATEGORIES.EXPERIENCE,
    description: 'Education-focused for new graduates',
    preview: '🎓',
    features: ['Education first', 'Internships highlighted', 'Coursework section', 'Skills emphasis'],
    bestFor: ['Recent graduates', 'Students', 'Interns', 'First job seekers'],
    fonts: ['Arial', 'Calibri', 'Helvetica'],
    atsScore: 93,
    difficulty: 'easy',
    colors: ['#3b82f6', '#333333', '#666666']
  },
  {
    id: 'experience-mid',
    name: 'Mid-Level Professional',
    category: TEMPLATE_CATEGORIES.EXPERIENCE,
    description: 'Balanced education and experience layout',
    preview: '⚖️',
    features: ['Experience focused', 'Achievement bullets', 'Skills integration', 'Career progression'],
    bestFor: ['3-7 years experience', 'Career advancement', 'Specialists', 'Team leads'],
    fonts: ['Calibri', 'Arial', 'Times New Roman'],
    atsScore: 96,
    difficulty: 'easy',
    colors: ['#2563eb', '#333333', '#666666']
  },
  {
    id: 'experience-senior',
    name: 'Senior Level',
    category: TEMPLATE_CATEGORIES.EXPERIENCE,
    description: 'Leadership and impact focused',
    preview: '🌟',
    features: ['Leadership emphasis', 'Strategic impact', 'Team management', 'Business results'],
    bestFor: ['Senior managers', 'Directors', 'Team leads', 'Principal ICs'],
    fonts: ['Georgia', 'Times New Roman', 'Garamond'],
    atsScore: 97,
    difficulty: 'medium',
    colors: ['#1e40af', '#333333', '#666666']
  },
  {
    id: 'experience-executive',
    name: 'Executive C-Suite',
    category: TEMPLATE_CATEGORIES.EXPERIENCE,
    description: 'C-suite ready with board-level focus',
    preview: '👑',
    features: ['Executive summary', 'Board experience', 'P&L responsibility', 'Strategic vision'],
    bestFor: ['CEOs', 'CFOs', 'CTOs', 'VPs', 'Board members'],
    fonts: ['Times New Roman', 'Garamond', 'Palatino'],
    atsScore: 95,
    difficulty: 'hard',
    colors: ['#1e3a8a', '#333333', '#666666']
  }
]

// Helper functions
export const getTemplatesByCategory = (category) => {
  return TEMPLATES.filter(t => t.category === category)
}

export const getTemplateById = (id) => {
  return TEMPLATES.find(t => t.id === id)
}

export const getATSTemplates = () => {
  return TEMPLATES.filter(t => t.atsScore >= 90)
}

export const getTemplatesByATS = (minScore = 0) => {
  return TEMPLATES.filter(t => t.atsScore >= minScore)
}

export const TEMPLATE_COUNTS = {
  [TEMPLATE_CATEGORIES.ATS_OPTIMIZED]: 5,
  [TEMPLATE_CATEGORIES.PROFESSIONAL]: 4,
  [TEMPLATE_CATEGORIES.CREATIVE]: 4,
  [TEMPLATE_CATEGORIES.INDUSTRY]: 4,
  [TEMPLATE_CATEGORIES.EXPERIENCE]: 4,
  total: 21
}
