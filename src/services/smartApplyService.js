/**
 * KAYAKA-AI Smart Apply Service
 * Purpose: Generate complete application packs (cover letter, DMs, emails)
 * Security: Client-side only, zero API costs
 * Features: Auto-personalization from resume data
 */

// ============================================
// CONSTANTS & TEMPLATES
// ============================================

export const TEMPLATE_STYLES = {
  professional: 'professional',
  modern: 'modern',
  creative: 'creative'
}

export const COVER_LETTER_TEMPLATES = {
  professional: {
    opening: 'Dear Hiring Manager,',
    closing: 'Sincerely,\n{candidateName}'
  },
  modern: {
    opening: 'Hello {companyName} Team,',
    closing: 'Best regards,\n{candidateName}'
  },
  creative: {
    opening: 'Hi there!',
    closing: 'Excited to connect,\n{candidateName}'
  }
}

// ============================================
// COVER LETTER GENERATION
// ============================================

/**
 * Generate personalized cover letter
 * @param {object} jobData - Job information
 * @param {object} resumeData - Candidate resume data
 * @param {string} style - Template style
 * @returns {object} - Generated cover letter
 */
export const generateCoverLetter = (jobData, resumeData, style = 'professional') => {
  // Validate inputs
  if (!jobData || !resumeData) {
    throw new Error('Job data and resume data are required')
  }

  // Validate and default style
  const validStyle = Object.keys(TEMPLATE_STYLES).includes(style) 
    ? style 
    : 'professional'
  const template = COVER_LETTER_TEMPLATES[validStyle] || COVER_LETTER_TEMPLATES.professional
  
  // Extract candidate info
  const candidateName = resumeData.name || 'Candidate'
  const candidateEmail = resumeData.email || 'email@example.com'
  const candidatePhone = resumeData.phone || ''
  const candidateLocation = resumeData.location || ''
  const candidateSummary = resumeData.summary || ''
  const skills = resumeData.skills || []
  const experience = resumeData.experience || []
  
  // Extract job info
  const jobTitle = jobData.title || 'Position'
  const companyName = jobData.company || 'Company'
  const jobDescription = jobData.description || ''
  
  // Find matching skills
  const jobSkills = extractSkillsFromDescription(jobDescription)
  const matchingSkills = skills.filter(skill =>
    jobSkills.some(jobSkill => 
      jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(jobSkill.toLowerCase())
    )
  ).slice(0, 5)
  
  // Generate personalized content
  const opening = template.opening.replace('{companyName}', companyName)
  
  const intro = generateCoverLetterIntro(jobTitle, companyName, candidateSummary)
  const body = generateCoverLetterBody(matchingSkills, experience, jobDescription)
  const closing = template.closing.replace('{candidateName}', candidateName)
  
  // Assemble cover letter object
  const coverLetter = {
    header: {
      candidateName,
      candidateEmail,
      candidatePhone,
      candidateLocation,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      hiringManager: 'Hiring Manager',
      companyName,
      companyLocation: jobData.location || ''
    },
    opening,
    intro,
    body,
    closing,
    style: validStyle,
    generatedAt: new Date().toISOString()
  }

  // Add full text
  coverLetter.fullText = assembleCoverLetter(coverLetter)

  return coverLetter
}

/**
 * Generate cover letter introduction
 */
const generateCoverLetterIntro = (jobTitle, companyName) => {
  const intros = [
    `I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. With my background and passion for this field, I am confident I can make an immediate impact on your team.`,
    `I was excited to discover the ${jobTitle} opportunity at ${companyName}. Your company's reputation for innovation aligns perfectly with my career goals and expertise.`,
    `As a dedicated professional with a track record of success, I am thrilled to apply for the ${jobTitle} role at ${companyName}. This position represents the perfect next step in my career journey.`
  ]
  
  return intros[Math.floor(Math.random() * intros.length)]
}

/**
 * Generate cover letter body
 */
const generateCoverLetterBody = (matchingSkills, experience) => {
  const skillsText = matchingSkills.length > 0
    ? `My expertise in ${matchingSkills.join(', ')} directly aligns with the requirements you've outlined.`
    : 'My diverse skill set positions me well to contribute to your team\'s success.'
  
  const experienceText = experience.length > 0
    ? `Throughout my career, I have consistently delivered results and grown into increasingly responsible roles.`
    : ''
  
  const companyInterest = `What excites me most about ${experience.length > 0 ? 'this opportunity' : 'joining your team'} is the chance to contribute to meaningful projects while continuing to develop my skills.`
  
  const callToAction = `I would welcome the opportunity to discuss how my background, skills, and enthusiasm can benefit ${companyInterest.includes('your team') ? 'your organization' : 'your team'}.`
  
  return `${skillsText} ${experienceText} ${companyInterest} ${callToAction}`
}

/**
 * Assemble cover letter into formatted text
 */
const assembleCoverLetter = (coverLetter) => {
  const { header, opening, intro, body, closing } = coverLetter
  
  return `
${header.candidateName}
${header.candidateEmail}${header.candidatePhone ? ' | ' + header.candidatePhone : ''}${header.candidateLocation ? ' | ' + header.candidateLocation : ''}

${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

${header.hiringManager}
${header.companyName}
${header.companyLocation}

${opening}

${intro}

${body}

Thank you for considering my application. I look forward to the possibility of discussing this exciting opportunity with you.

${closing}
`.trim()
}

// ============================================
// LINKEDIN RECRUITER DM GENERATION
// ============================================

/**
 * Generate LinkedIn recruiter DM messages
 * @param {object} jobData - Job information
 * @param {object} resumeData - Candidate resume data
 * @returns {array} - DM messages (initial + follow-up)
 */
export const generateRecruiterDMs = (jobData, resumeData) => {
  if (!jobData || !resumeData) {
    throw new Error('Job data and resume data are required')
  }
  
  const candidateName = resumeData.name || 'Candidate'
  const jobTitle = jobData.title || 'Position'
  const companyName = jobData.company || 'Company'
  const skills = resumeData.skills || []
  const matchingSkills = skills.slice(0, 3)
  
  const messages = [
    {
      type: 'initial',
      subject: `Interest in ${jobTitle} Role at ${companyName}`,
      message: `Hi [Recruiter Name],

I hope this message finds you well! I recently came across the ${jobTitle} opening at ${companyName} and wanted to express my strong interest.

With my experience in ${matchingSkills.join(', ')}, I believe I could be a great fit for your team. I've been following ${companyName}'s work and am impressed by ${companyName.includes('Tech') ? 'your innovative approach' : 'your company culture'}.

I've submitted my application and would love to learn more about this opportunity. Would you be open to a brief conversation?

Best regards,
${candidateName}`
    },
    {
      type: 'follow-up',
      subject: `Following Up: ${jobTitle} Position`,
      message: `Hi [Recruiter Name],

I wanted to follow up on my previous message regarding the ${jobTitle} role at ${companyName}.

I understand you're likely very busy, but I wanted to reiterate my strong interest in this opportunity. My background in ${matchingSkills.join(', ')} aligns well with the requirements, and I'm excited about the possibility of contributing to your team.

If there's any additional information I can provide about my qualifications, please don't hesitate to ask.

Thank you for your time!

Best regards,
${candidateName}`
    }
  ]
  
  return messages
}

// ============================================
// FOLLOW-UP EMAIL GENERATION
// ============================================

/**
 * Generate follow-up email templates
 * @param {object} jobData - Job information
 * @param {object} resumeData - Candidate resume data
 * @returns {array} - Email templates
 */
export const generateFollowUpEmails = (jobData, resumeData) => {
  if (!jobData || !resumeData) {
    throw new Error('Job data and resume data are required')
  }
  
  const candidateName = resumeData.name || 'Candidate'
  const candidateEmail = resumeData.email || 'email@example.com'
  const jobTitle = jobData.title || 'Position'
  const companyName = jobData.company || 'Company'
  
  const emails = [
    {
      type: 'post-application',
      subject: `Application Follow-Up: ${jobTitle} Position - ${candidateName}`,
      body: `Dear Hiring Team,

I hope this email finds you well. I am writing to follow up on my application for the ${jobTitle} position at ${companyName}, which I submitted on ${new Date().toLocaleDateString()}.

I am very excited about this opportunity and believe my skills and experience make me a strong candidate for this role. In particular, my background aligns well with the requirements you've outlined.

I understand that you are likely reviewing many applications, but I wanted to reiterate my strong interest in joining ${companyName}. I would welcome the opportunity to discuss how I can contribute to your team's success.

Please let me know if you need any additional information from me. I look forward to hearing from you.

Best regards,
${candidateName}
${candidateEmail}`
    },
    {
      type: 'post-interview',
      subject: `Thank You - ${jobTitle} Interview`,
      body: `Dear [Interviewer Name],

Thank you so much for taking the time to speak with me ${new Date().toLocaleDateString(undefined, { weekday: 'long' })} about the ${jobTitle} position at ${companyName}.

I truly enjoyed learning more about the role and the team. Our conversation about ${companyName.includes('Tech') ? 'the technical challenges' : 'the team dynamics'} further confirmed my excitement about this opportunity.

I am particularly interested in ${companyName} because of ${companyName.includes('Tech') ? 'your innovative approach to solving complex problems' : 'your commitment to excellence'}. I am confident that my experience would allow me to make meaningful contributions to your team.

Please don't hesitate to reach out if you need any additional information from me. I look forward to hearing about next steps.

Thank you again for your time and consideration.

Best regards,
${candidateName}
${candidateEmail}`
    },
    {
      type: 'status-check',
      subject: `Checking In: ${jobTitle} Application Status`,
      body: `Dear Hiring Team,

I hope you're having a great week. I wanted to check in regarding the status of my application for the ${jobTitle} position at ${companyName}.

I remain very interested in this opportunity and am excited about the possibility of joining your team. Please let me know if there's any update on the hiring timeline or if you need any additional information from me.

Thank you for your time and consideration.

Best regards,
${candidateName}
${candidateEmail}`
    }
  ]
  
  return emails
}

// ============================================
// APPLICATION CHECKLIST GENERATION
// ============================================

/**
 * Generate application checklist
 */
export const generateApplicationChecklist = () => {
  return [
    { item: 'Review job description thoroughly', completed: false },
    { item: 'Tailor resume to match job requirements', completed: false },
    { item: 'Write customized cover letter', completed: false },
    { item: 'Research company culture and values', completed: false },
    { item: 'Prepare LinkedIn profile', completed: false },
    { item: 'Connect with recruiter on LinkedIn', completed: false },
    { item: 'Submit application', completed: false },
    { item: 'Save job to tracker', completed: false },
    { item: 'Set follow-up reminder (7 days)', completed: false },
    { item: 'Prepare for potential interview', completed: false }
  ]
}

// ============================================
// SMART APPLY PACK GENERATION
// ============================================

/**
 * Generate complete Smart Apply Pack
 * @param {object} jobData - Job information
 * @param {object} resumeData - Candidate resume data
 * @param {object} jdAnalysis - Job description analysis (optional)
 * @returns {object} - Complete application pack
 */
export const generateSmartApplyPack = (jobData, resumeData, jdAnalysis = null) => {
  // Validate inputs
  if (!jobData || !resumeData) {
    throw new Error('Job data and resume data are required')
  }
  
  // Generate all components
  const coverLetter = generateCoverLetter(jobData, resumeData)
  const recruiterDMs = generateRecruiterDMs(jobData, resumeData)
  const followUpEmails = generateFollowUpEmails(jobData, resumeData)
  const checklist = generateApplicationChecklist(jobData)
  
  // Generate tips based on analysis
  const tips = generateApplicationTips(jobData, resumeData, jdAnalysis)
  
  return {
    jobData: {
      title: jobData.title,
      company: jobData.company,
      location: jobData.location,
      url: jobData.url,
      jobBoard: jobData.jobBoard
    },
    coverLetter,
    recruiterDMs,
    followUpEmails,
    checklist,
    tips,
    generatedAt: new Date().toISOString(),
    version: '1.0'
  }
}

/**
 * Generate application tips
 */
const generateApplicationTips = (jobData, resumeData, jdAnalysis) => {
  const tips = []
  
  // Match percentage tip
  if (jdAnalysis?.matchPercentage) {
    if (jdAnalysis.matchPercentage >= 70) {
      tips.push('Strong match! Highlight your top 3 matching skills in your application.')
    } else if (jdAnalysis.matchPercentage >= 50) {
      tips.push('Good match. Consider addressing any skill gaps in your cover letter.')
    } else {
      tips.push('Consider gaining more experience with key required skills before applying.')
    }
  }
  
  // General tips
  tips.push('Customize your resume for each application - don\'t use a generic version.')
  tips.push('Follow up within 7-10 days if you haven\'t heard back.')
  tips.push('Connect with the hiring manager or recruiter on LinkedIn after applying.')
  tips.push('Keep track of all applications in your Job Tracker.')
  
  return tips
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Extract skills from job description
 */
const extractSkillsFromDescription = (description) => {
  if (!description) return []
  
  const skillKeywords = [
    'javascript', 'typescript', 'react', 'node', 'python', 'java', 'c++',
    'html', 'css', 'sql', 'mongodb', 'postgresql', 'aws', 'azure', 'gcp',
    'docker', 'kubernetes', 'git', 'agile', 'scrum', 'rest', 'graphql',
    'machine learning', 'tensorflow', 'vue', 'angular', 'express', 'django',
    'communication', 'leadership', 'teamwork', 'problem solving'
  ]
  
  return skillKeywords.filter(skill =>
    description.toLowerCase().includes(skill)
  ).map(skill => 
    skill.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  )
}

/**
 * Format cover letter as plain text for download/copy
 */
export const formatCoverLetterAsText = (coverLetter) => {
  if (!coverLetter) return ''
  return coverLetter.fullText || ''
}

/**
 * Format all documents as single text file
 */
export const formatSmartApplyPackAsText = (pack) => {
  if (!pack) return ''
  
  return `
SMART APPLY PACK
Generated: ${new Date(pack.generatedAt).toLocaleString()}
Job: ${pack.jobData.title} at ${pack.jobData.company}
${pack.jobData.url ? 'URL: ' + pack.jobData.url : ''}

=====================================
COVER LETTER
=====================================
${formatCoverLetterAsText(pack.coverLetter)}

=====================================
LINKEDIN RECRUITER DM - INITIAL
=====================================
Subject: ${pack.recruiterDMs[0].subject}

${pack.recruiterDMs[0].message}

=====================================
LINKEDIN RECRUITER DM - FOLLOW UP
=====================================
Subject: ${pack.recruiterDMs[1].subject}

${pack.recruiterDMs[1].message}

=====================================
FOLLOW-UP EMAIL - POST APPLICATION
=====================================
Subject: ${pack.followUpEmails[0].subject}

${pack.followUpEmails[0].body}

=====================================
FOLLOW-UP EMAIL - POST INTERVIEW
=====================================
Subject: ${pack.followUpEmails[1].subject}

${pack.followUpEmails[1].body}

=====================================
FOLLOW-UP EMAIL - STATUS CHECK
=====================================
Subject: ${pack.followUpEmails[2].subject}

${pack.followUpEmails[2].body}

=====================================
APPLICATION CHECKLIST
=====================================
${pack.checklist.map((item, i) => `${i + 1}. [ ] ${item.item}`).join('\n')}

=====================================
PRO TIPS
=====================================
${pack.tips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}
`.trim()
}

/**
 * Save applied job to tracker
 */
export const saveAppliedJob = async (jobData) => {
  // Import from jobTargetingService (dynamic import for ESM compatibility)
  const jobTargetingService = await import('./jobTargetingService')
  const { saveJobApplication } = jobTargetingService

  const analysis = {
    matchPercentage: 75, // Default if not provided
    recruiterIntent: 'medium'
  }

  return saveJobApplication({
    title: jobData.title,
    company: jobData.company,
    location: jobData.location,
    url: jobData.url,
    salary: jobData.salary
  }, analysis)
}
