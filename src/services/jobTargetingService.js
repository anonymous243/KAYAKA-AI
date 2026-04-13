/**
 * KAYAKA-AI Job Targeting Service
 * Security: Client-side only, no external API calls for job fetching
 * Purpose: Fetch, analyze, and track job applications
 */

// ============================================
// CONSTANTS & CONFIGURATION
// ============================================

export const SUPPORTED_JOB_BOARDS = [
  { id: 'linkedin', name: 'LinkedIn', domain: 'linkedin.com', icon: '💼', color: 'blue' },
  { id: 'naukri', name: 'Naukri', domain: 'naukri.com', icon: '🇮🇳', color: 'orange' },
  { id: 'glassdoor', name: 'Glassdoor', domain: 'glassdoor.com', icon: '🚪', color: 'green' },
  { id: 'indeed', name: 'Indeed', domain: 'indeed.com', icon: '📋', color: 'purple' },
  { id: 'other', name: 'Other', domain: '', icon: '🔗', color: 'gray' }
]

export const STORAGE_KEY = 'kayaka_job_applications'
export const MAX_JOBS_TRACKED = 100 // Prevent localStorage overflow

// ============================================
// URL VALIDATION (Security Layer 1)
// ============================================

/**
 * Validates and sanitizes job URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid
 */
export const isValidJobUrl = (url) => {
  if (!url || typeof url !== 'string') return false
  
  const trimmed = url.trim()
  if (trimmed.length === 0 || trimmed.length > 2048) return false
  
  try {
    const urlObj = new URL(trimmed)
    
    // Only allow HTTPS (security)
    if (urlObj.protocol !== 'https:') {
      console.warn('Non-HTTPS URL rejected:', urlObj.protocol)
      return false
    }
    
    // Block localhost/internal IPs (security)
    const hostname = urlObj.hostname.toLowerCase()
    if (hostname === 'localhost' || 
        hostname === '127.0.0.1' ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.startsWith('172.')) {
      console.warn('Internal URL rejected:', hostname)
      return false
    }
    
    return true
  } catch {
    return false
  }
}

/**
 * Extract job board from URL
 * @param {string} url - Job URL
 * @returns {object|null} - Job board info or null
 */
export const extractJobBoard = (url) => {
  if (!isValidJobUrl(url)) return null
  
  try {
    const urlObj = new URL(url.trim())
    const hostname = urlObj.hostname.toLowerCase()

    for (const board of SUPPORTED_JOB_BOARDS) {
      if (board.domain && hostname.includes(board.domain)) {
        return { ...board }
      }
    }
    
    return { ...SUPPORTED_JOB_BOARDS.find(b => b.id === 'other') }
  } catch {
    return null
  }
}

// ============================================
// JOB DESCRIPTION FETCHER
// ============================================

/**
 * Fetch job description from URL
 * Note: Uses simulated data (no external API calls - cost-free & secure)
 * In production: Replace with your backend API endpoint
 * @param {string} url - Job posting URL
 * @returns {Promise<object>} - Job data
 */
export const fetchJobDescription = async (url) => {
  if (!isValidJobUrl(url)) {
    throw new Error('Invalid job URL. Please provide a valid HTTPS URL.')
  }

  const jobBoard = extractJobBoard(url)
  if (!jobBoard) {
    throw new Error('Unable to identify job board from URL.')
  }

  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    const response = await fetch(`${API_URL}/scrape`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: url.trim() })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const jobData = await response.json();
    
    return {
      ...jobData,
      url: url.trim(),
      jobBoard,
      fetchedAt: new Date().toISOString()
    };
  } catch (err) {
    // If the backend fails (e.g., node server isn't running), provide a clear error message
    if (err.message === 'Failed to fetch') {
      throw new Error('Unable to connect to the scraper backend. Ensure "npm run dev:all" or "node server/index.js" is running.');
    }
    throw err;
  }
}

/**
 * Generate mock job data (deterministic based on URL hash) - NO LONGER USED BUT KEPT FOR FALLBACK
 * @param {number} seed - URL hash
 * @returns {object} - Mock job data
 */
const _generateMockJobData = (seed) => {
  const titles = [
    'Senior Software Engineer',
    'Full Stack Developer',
    'Frontend Engineer',
    'Backend Developer',
    'DevOps Engineer',
    'Software Architect',
    'Lead Developer',
    'Principal Engineer'
  ]
  
  const companies = [
    'TechCorp Industries',
    'Innovation Labs',
    'Digital Solutions Inc',
    'Cloud Systems Co',
    'StartupXYZ',
    'Enterprise Tech',
    'AI Dynamics',
    'DataFlow Systems'
  ]
  
  const locations = [
    'San Francisco, CA (Remote)',
    'New York, NY (Hybrid)',
    'Seattle, WA (Remote)',
    'Austin, TX (Hybrid)',
    'Boston, MA (Remote)',
    'Denver, CO (Hybrid)',
    'Chicago, IL (Remote)',
    'Los Angeles, CA (Hybrid)'
  ]
  
  const salaries = [
    '$150,000 - $200,000',
    '$140,000 - $180,000',
    '$160,000 - $220,000',
    '$130,000 - $170,000',
    '$170,000 - $230,000',
    '$145,000 - $190,000'
  ]

  // Use seed to select deterministic values
  const idx = seed % titles.length
  const salaryIdx = (seed * 2) % salaries.length

  return {
    title: titles[idx],
    company: companies[(seed * 3) % companies.length],
    location: locations[(seed * 5) % locations.length],
    salary: salaries[salaryIdx],
    type: 'Full-time',
    description: generateJobDescription(seed, titles[idx]),
    postedDate: new Date(Date.now() - (seed % 30) * 24 * 60 * 60 * 1000).toISOString()
  }
}

/**
 * Generate realistic job description
 * @param {number} seed - Random seed
 * @param {string} title - Job title
 * @returns {string} - Job description
 */
const generateJobDescription = (seed, title) => {
  const descriptions = [
    `We are seeking a talented ${title} to join our growing engineering team.

Responsibilities:
- Design and build scalable web applications
- Collaborate with cross-functional teams
- Write clean, maintainable, and well-tested code
- Participate in code reviews and technical discussions
- Mentor junior developers

Requirements:
- 5+ years of experience in software development
- Strong proficiency in JavaScript, TypeScript, React
- Experience with Node.js and backend development
- Knowledge of AWS, Docker, and modern DevOps practices
- Excellent communication and teamwork skills

Preferred:
- Experience with microservices architecture
- Knowledge of CI/CD pipelines
- Open source contributions`,

    `Join our innovative team as a ${title} and help build the future of technology.

Key Responsibilities:
- Develop high-quality software solutions
- Work with modern tech stack (React, Node.js, Python)
- Optimize applications for maximum speed and scalability
- Ensure technical feasibility of UI/UX designs

Qualifications:
- Bachelor's degree in Computer Science or related field
- 3+ years of professional experience
- Proficiency in modern JavaScript frameworks
- Experience with SQL and NoSQL databases
- Strong problem-solving skills

Benefits:
- Competitive salary and equity
- Health, dental, vision insurance
- Flexible PTO
- Remote-friendly culture`,

    `We're looking for an experienced ${title} to drive technical excellence.

What You'll Do:
- Lead development of key product features
- Architect scalable solutions
- Collaborate with product and design teams
- Drive best practices and code quality

Requirements:
- 7+ years of software development experience
- Expert knowledge of React, TypeScript, Node.js
- Experience leading technical projects
- Strong system design skills
- Excellent communication abilities

Nice to Have:
- Master's degree in Computer Science
- Experience with machine learning
- Technical leadership experience`
  ]

  return descriptions[seed % descriptions.length]
}

/**
 * Simple hash function for strings
 * @param {string} str - Input string
 * @returns {number} - Hash value
 */
const _simpleHash = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

// ============================================
// RECRUITER INTENT ANALYSIS (Client-Side AI)
// ============================================

/**
 * Analyze job description and generate recruiter intent summary
 * Uses client-side analysis (no API costs)
 * @param {object} jobData - Job data
 * @param {array} userSkills - User's skills
 * @returns {Promise<object>} - Analysis result
 */
export const generateRecruiterSummary = async (jobData, userSkills = []) => {
  // Validate inputs
  if (!jobData || !jobData.description) {
    throw new Error('Invalid job data provided')
  }

  // Simulate analysis delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  const description = (jobData.description || '').toLowerCase()
  
  // Extract skills from job description
  const jobSkills = extractSkillsFromDescription(jobData.description || '')
  
  // Find matching and missing skills
  const matchingSkills = userSkills.filter(skill =>
    jobSkills.some(jobSkill => 
      jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(jobSkill.toLowerCase())
    )
  )
  
  const missingSkills = jobSkills.filter(skill =>
    !userSkills.some(userSkill =>
      userSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(userSkill.toLowerCase())
    )
  ).slice(0, 5)

  // Calculate match percentage
  const totalSkills = matchingSkills.length + missingSkills.length || 1
  const matchPercentage = Math.round((matchingSkills.length / totalSkills) * 100)

  // Analyze recruiter intent signals
  const intentSignals = analyzeIntentSignals(description || '', jobData || {})

  // Determine overall recruiter intent
  let recruiterIntent = 'low'
  if (matchPercentage >= 70 || intentSignals.some(s => s.level === 'high')) {
    recruiterIntent = 'high'
  } else if (matchPercentage >= 50 || intentSignals.some(s => s.level === 'medium')) {
    recruiterIntent = 'medium'
  }

  return {
    matchPercentage,
    matchingSkills,
    missingSkills,
    intentSignals,
    recruiterIntent,
    recommendations: generateRecommendations(matchingSkills, missingSkills, jobData),
    summary: generateSummary(matchPercentage, jobData, matchingSkills, missingSkills)
  }
}

/**
 * Extract skills from job description
 * @param {string} description - Job description
 * @returns {array} - Extracted skills
 */
const extractSkillsFromDescription = (description) => {
  const skillKeywords = [
    'javascript', 'typescript', 'react', 'node', 'node.js', 'python', 'java', 'c++', 'c#',
    'html', 'css', 'sql', 'mongodb', 'postgresql', 'mysql', 'aws', 'azure', 'gcp',
    'docker', 'kubernetes', 'git', 'agile', 'scrum', 'rest', 'graphql', 'api',
    'machine learning', 'ml', 'ai', 'tensorflow', 'pytorch', 'vue', 'angular',
    'express', 'django', 'flask', 'spring', 'redis', 'kafka', 'elasticsearch',
    'terraform', 'jenkins', 'ci/cd', 'linux', 'bash', 'ruby', 'go', 'rust', 'swift',
    'communication', 'leadership', 'teamwork', 'problem solving', 'mentoring',
    'redux', 'zustand', 'next.js', 'nuxt', 'webpack', 'babel', 'jest', 'cypress'
  ]

  if (!description || typeof description !== 'string') return []
  
  return skillKeywords.filter(skill =>
    description.toLowerCase().includes(skill)
  ).map(skill => {
    // Capitalize first letter
    return skill.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  })
}

/**
 * Analyze recruiter intent signals
 * @param {string} description - Job description
 * @param {object} jobData - Job data
 * @returns {array} - Intent signals
 */
const analyzeIntentSignals = (description, jobData) => {
  const signals = []
  if (!description || typeof description !== 'string') return signals

  // Urgency signals
  if (description.includes('urgent') || description.includes('immediate') || description.includes('asap')) {
    signals.push({ 
      type: 'urgency', 
      level: 'high', 
      message: 'Job posting indicates urgent hiring need' 
    })
  }

  // Compensation signals
  if (description.includes('competitive salary') || description.includes('top pay') || jobData.salary) {
    signals.push({ 
      type: 'compensation', 
      level: 'medium', 
      message: 'Competitive compensation mentioned' 
    })
  }

  // Culture signals
  if (description.includes('fast-paced') || description.includes('startup') || description.includes('dynamic')) {
    signals.push({ 
      type: 'culture', 
      level: 'medium', 
      message: 'Fast-paced environment indicated' 
    })
  }

  // Growth signals
  if (description.includes('growth') || description.includes('career advancement') || description.includes('promotion')) {
    signals.push({ 
      type: 'growth', 
      level: 'medium', 
      message: 'Career growth opportunities mentioned' 
    })
  }

  // Leadership signals
  if (description.includes('lead') || description.includes('mentor') || description.includes('manage')) {
    signals.push({ 
      type: 'leadership', 
      level: 'medium', 
      message: 'Leadership responsibilities indicated' 
    })
  }

  return signals
}

/**
 * Generate recommendations
 * @param {array} matching - Matching skills
 * @param {array} missing - Missing skills
 * @param {object} jobData - Job data
 * @returns {array} - Recommendations
 */
const generateRecommendations = (matching, missing, jobData) => {
  const recommendations = []

  if (missing.length > 0) {
    recommendations.push(
      `Consider highlighting experience with ${missing.slice(0, 2).join(' and ')}`
    )
  }

  if (matching.length > 0) {
    recommendations.push(
      `Emphasize your ${matching.slice(0, 2).join(' and ')} experience in your resume`
    )
  }

  if (jobData.description.toLowerCase().includes('leadership') || 
      jobData.description.toLowerCase().includes('mentor')) {
    recommendations.push('Highlight any leadership or mentoring experience')
  }

  if (jobData.description.toLowerCase().includes('agile') || 
      jobData.description.toLowerCase().includes('scrum')) {
    recommendations.push('Mention your experience with Agile/Scrum methodologies')
  }

  return recommendations.slice(0, 4)
}

/**
 * Generate summary message
 * @param {number} matchPercentage - Match percentage
 * @param {object} jobData - Job data
 * @param {array} matching - Matching skills
 * @param {array} missing - Missing skills
 * @returns {string} - Summary
 */
const generateSummary = (matchPercentage, jobData, matching, missing) => {
  const title = jobData.title || 'this position'
  const company = jobData.company || 'this company'

  if (matchPercentage >= 80) {
    return `Excellent match! Your skills align well with ${title} at ${company}. You have ${matching.length} matching skills. Consider applying soon.`
  } else if (matchPercentage >= 60) {
    return `Good match! You have most of the required skills for ${title}. Consider addressing ${missing.length} missing skills before applying.`
  } else if (matchPercentage >= 40) {
    return `Moderate match. You have some relevant skills for ${title}, but may want to develop ${missing.length} additional skills to strengthen your application.`
  } else {
    return `Low match. This ${title} role requires skills you may not have yet. Consider building experience in ${missing.slice(0, 2).join(', ')} before applying.`
  }
}

// ============================================
// JOB TRACKING (localStorage with Validation)
// ============================================

/**
 * Save job application to tracker
 * @param {object} jobData - Job data
 * @param {object} analysis - Analysis result
 * @returns {object} - Saved application
 */
export const saveJobApplication = (jobData, analysis) => {
  // Validate inputs
  if (!jobData || !jobData.title || !jobData.company) {
    throw new Error('Invalid job data')
  }

  // Get existing applications
  const applications = getTrackedApplications()
  
  // Check for duplicates (by URL)
  if (jobData.url && applications.some(app => app.url === jobData.url)) {
    throw new Error('This job is already in your tracker')
  }

  // Check storage limit
  if (applications.length >= MAX_JOBS_TRACKED) {
    throw new Error(`Maximum ${MAX_JOBS_TRACKED} jobs can be tracked. Please remove some jobs.`)
  }

  const newApplication = {
    id: Date.now(),
    url: jobData.url || '',
    title: sanitizeString(jobData.title),
    company: sanitizeString(jobData.company),
    location: sanitizeString(jobData.location || 'Remote'),
    salary: sanitizeString(jobData.salary || ''),
    appliedDate: new Date().toISOString(),
    status: 'saved',
    matchPercentage: analysis?.matchPercentage || 0,
    recruiterIntent: analysis?.recruiterIntent || 'unknown',
    notes: ''
  }

  applications.push(newApplication)
  safeStorageSet(STORAGE_KEY, applications)

  return newApplication
}

/**
 * Get all tracked applications
 * @returns {array} - Applications
 */
export const getTrackedApplications = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    
    const parsed = JSON.parse(data)
    if (!Array.isArray(parsed)) return []
    
    return parsed
  } catch {
    console.error('Error reading job applications from storage')
    return []
  }
}

/**
 * Update application status
 * @param {number} id - Application ID
 * @param {string} status - New status
 * @returns {array} - Updated applications
 */
export const updateApplicationStatus = (id, status) => {
  const applications = getTrackedApplications()
  
  const validStatuses = ['saved', 'applied', 'interview', 'offer', 'rejected', 'withdrawn']
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status')
  }

  const updated = applications.map(app =>
    app.id === id 
      ? { ...app, status, updatedAt: new Date().toISOString() }
      : app
  )
  
  safeStorageSet(STORAGE_KEY, updated)
  return updated
}

/**
 * Delete application
 * @param {number} id - Application ID
 * @returns {array} - Updated applications
 */
export const deleteApplication = (id) => {
  const applications = getTrackedApplications()
  const filtered = applications.filter(app => app.id !== id)
  safeStorageSet(STORAGE_KEY, filtered)
  return filtered
}

/**
 * Update application notes
 * @param {number} id - Application ID
 * @param {string} notes - Notes
 * @returns {array} - Updated applications
 */
export const updateApplicationNotes = (id, notes) => {
  const applications = getTrackedApplications()
  const updated = applications.map(app =>
    app.id === id 
      ? { ...app, notes: sanitizeString(notes), updatedAt: new Date().toISOString() }
      : app
  )
  safeStorageSet(STORAGE_KEY, updated)
  return updated
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Safely set localStorage with error handling
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 */
const safeStorageSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded. Consider removing old entries.')
      throw new Error('Storage full. Please remove some tracked jobs.')
    }
    throw error
  }
}

/**
 * Sanitize string (prevent XSS)
 * @param {string} str - Input string
 * @returns {string} - Sanitized string
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return ''
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .slice(0, 500) // Limit length
}

/**
 * Clear all tracked jobs
 */
export const clearAllTrackedJobs = () => {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Get storage statistics
 * @returns {object} - Storage stats
 */
export const getStorageStats = () => {
  const applications = getTrackedApplications()
  return {
    total: applications.length,
    max: MAX_JOBS_TRACKED,
    remaining: MAX_JOBS_TRACKED - applications.length,
    byStatus: {
      saved: applications.filter(a => a.status === 'saved').length,
      applied: applications.filter(a => a.status === 'applied').length,
      interview: applications.filter(a => a.status === 'interview').length,
      offer: applications.filter(a => a.status === 'offer').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
      withdrawn: applications.filter(a => a.status === 'withdrawn').length
    }
  }
}
