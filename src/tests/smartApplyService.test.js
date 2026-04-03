import { describe, it, expect } from 'vitest'
import {
  generateCoverLetter,
  generateRecruiterDMs,
  generateFollowUpEmails,
  generateApplicationChecklist,
  generateSmartApplyPack,
  formatCoverLetterAsText,
  formatSmartApplyPackAsText,
  TEMPLATE_STYLES,
  COVER_LETTER_TEMPLATES
} from '../services/smartApplyService'

describe('Smart Apply Service', () => {
  // Mock data
  const mockJobData = {
    title: 'Senior Software Engineer',
    company: 'TechCorp Industries',
    location: 'San Francisco, CA (Remote)',
    url: 'https://www.linkedin.com/jobs/view/12345',
    salary: '$150,000 - $200,000',
    jobBoard: { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
    description: `We are seeking a talented Senior Software Engineer.
    
    Requirements:
    - JavaScript, TypeScript, React
    - Node.js, Python
    - AWS, Docker
    - Communication skills
    - Leadership experience`
  }

  const mockResumeData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    location: 'San Francisco, CA',
    summary: 'Experienced software engineer with 5+ years of experience',
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS'],
    experience: [
      {
        company: 'Previous Company',
        position: 'Software Engineer',
        startDate: '2020-01',
        endDate: 'Present',
        description: 'Built scalable web applications'
      }
    ]
  }

  const mockJdAnalysis = {
    matchPercentage: 85,
    recruiterIntent: 'high',
    matchingSkills: ['JavaScript', 'React', 'Node.js'],
    missingSkills: ['Kubernetes', 'GraphQL']
  }

  // ============================================
  // COVER LETTER TESTS
  // ============================================
  describe('generateCoverLetter', () => {
    it('generates cover letter with all required fields', () => {
      const result = generateCoverLetter(mockJobData, mockResumeData)

      expect(result).toHaveProperty('header')
      expect(result).toHaveProperty('opening')
      expect(result).toHaveProperty('intro')
      expect(result).toHaveProperty('body')
      expect(result).toHaveProperty('closing')
      expect(result).toHaveProperty('fullText')
      expect(result).toHaveProperty('style')
      expect(result).toHaveProperty('generatedAt')
    })

    it('personalizes with candidate name', () => {
      const result = generateCoverLetter(mockJobData, mockResumeData)

      expect(result.header.candidateName).toBe('John Doe')
      expect(result.closing).toContain('John Doe')
      expect(result.fullText).toContain('John Doe')
    })

    it('personalizes with company name', () => {
      const result = generateCoverLetter(mockJobData, mockResumeData)

      expect(result.fullText).toContain('TechCorp Industries')
    })

    it('includes candidate contact info', () => {
      const result = generateCoverLetter(mockJobData, mockResumeData)

      expect(result.header.candidateEmail).toBe('john.doe@example.com')
      expect(result.header.candidatePhone).toBe('+1 234 567 8900')
      expect(result.header.candidateLocation).toBe('San Francisco, CA')
    })

    it('generates different styles', () => {
      const professional = generateCoverLetter(mockJobData, mockResumeData, 'professional')
      const modern = generateCoverLetter(mockJobData, mockResumeData, 'modern')
      const creative = generateCoverLetter(mockJobData, mockResumeData, 'creative')

      expect(professional.style).toBe('professional')
      expect(modern.style).toBe('modern')
      expect(creative.style).toBe('creative')
      expect(professional.opening).not.toBe(modern.opening)
    })

    it('uses default style when invalid style provided', () => {
      const result = generateCoverLetter(mockJobData, mockResumeData, 'invalid')

      expect(result.style).toBe('professional')
    })

    it('throws error for missing job data', () => {
      expect(() => generateCoverLetter(null, mockResumeData)).toThrow('Job data and resume data are required')
    })

    it('throws error for missing resume data', () => {
      expect(() => generateCoverLetter(mockJobData, null)).toThrow('Job data and resume data are required')
    })

    it('includes date in header', () => {
      const result = generateCoverLetter(mockJobData, mockResumeData)

      expect(result.header.date).toBeDefined()
      expect(result.fullText).toMatch(/\d{4}/) // Contains year
    })
  })

  // ============================================
  // RECRUITER DM TESTS
  // ============================================
  describe('generateRecruiterDMs', () => {
    it('generates two messages (initial + follow-up)', () => {
      const result = generateRecruiterDMs(mockJobData, mockResumeData)

      expect(result).toHaveLength(2)
      expect(result[0].type).toBe('initial')
      expect(result[1].type).toBe('follow-up')
    })

    it('includes subject lines', () => {
      const result = generateRecruiterDMs(mockJobData, mockResumeData)

      expect(result[0].subject).toBeDefined()
      expect(result[1].subject).toBeDefined()
      expect(result[0].subject).toContain('Senior Software Engineer')
    })

    it('personalizes with candidate name', () => {
      const result = generateRecruiterDMs(mockJobData, mockResumeData)

      expect(result[0].message).toContain('John Doe')
      expect(result[1].message).toContain('John Doe')
    })

    it('includes job title and company', () => {
      const result = generateRecruiterDMs(mockJobData, mockResumeData)

      expect(result[0].message).toContain('Senior Software Engineer')
      expect(result[0].message).toContain('TechCorp Industries')
    })

    it('mentions candidate skills', () => {
      const result = generateRecruiterDMs(mockJobData, mockResumeData)

      const allMessages = result.map(m => m.message).join(' ')
      expect(allMessages).toMatch(/JavaScript|TypeScript|React|Node\.js|Python|AWS/)
    })

    it('throws error for missing data', () => {
      expect(() => generateRecruiterDMs(null, mockResumeData)).toThrow('Job data and resume data are required')
      expect(() => generateRecruiterDMs(mockJobData, null)).toThrow('Job data and resume data are required')
    })
  })

  // ============================================
  // FOLLOW-UP EMAIL TESTS
  // ============================================
  describe('generateFollowUpEmails', () => {
    it('generates three email templates', () => {
      const result = generateFollowUpEmails(mockJobData, mockResumeData)

      expect(result).toHaveLength(3)
    })

    it('includes post-application email', () => {
      const result = generateFollowUpEmails(mockJobData, mockResumeData)

      expect(result[0].type).toBe('post-application')
      expect(result[0].subject).toContain('Application Follow-Up')
    })

    it('includes post-interview email', () => {
      const result = generateFollowUpEmails(mockJobData, mockResumeData)

      expect(result[1].type).toBe('post-interview')
      expect(result[1].subject).toContain('Thank You')
    })

    it('includes status check email', () => {
      const result = generateFollowUpEmails(mockJobData, mockResumeData)

      expect(result[2].type).toBe('status-check')
      expect(result[2].subject).toContain('Checking In')
    })

    it('includes candidate contact info', () => {
      const result = generateFollowUpEmails(mockJobData, mockResumeData)

      const allEmails = result.map(e => e.body).join(' ')
      expect(allEmails).toContain('john.doe@example.com')
    })

    it('personalizes with job details', () => {
      const result = generateFollowUpEmails(mockJobData, mockResumeData)

      const allEmails = result.map(e => e.body).join(' ')
      expect(allEmails).toContain('Senior Software Engineer')
      expect(allEmails).toContain('TechCorp Industries')
    })

    it('throws error for missing data', () => {
      expect(() => generateFollowUpEmails(null, mockResumeData)).toThrow('Job data and resume data are required')
      expect(() => generateFollowUpEmails(mockJobData, null)).toThrow('Job data and resume data are required')
    })
  })

  // ============================================
  // CHECKLIST TESTS
  // ============================================
  describe('generateApplicationChecklist', () => {
    it('generates checklist with 10 items', () => {
      const result = generateApplicationChecklist(mockJobData)

      expect(result).toHaveLength(10)
    })

    it('all items have completed status', () => {
      const result = generateApplicationChecklist(mockJobData)

      result.forEach(item => {
        expect(item).toHaveProperty('item')
        expect(item).toHaveProperty('completed')
        expect(item.completed).toBe(false)
      })
    })

    it('includes key application steps', () => {
      const result = generateApplicationChecklist()

      const items = result.map(i => i.item)
      expect(items.join(' ')).toMatch(/resume/i)
      expect(items.join(' ')).toMatch(/cover letter/i)
      expect(items.join(' ')).toMatch(/application/i)
      expect(items.join(' ')).toMatch(/follow-up/i)
    })
  })

  // ============================================
  // SMART APPLY PACK TESTS
  // ============================================
  describe('generateSmartApplyPack', () => {
    it('generates complete application pack', () => {
      const result = generateSmartApplyPack(mockJobData, mockResumeData, mockJdAnalysis)

      expect(result).toHaveProperty('jobData')
      expect(result).toHaveProperty('coverLetter')
      expect(result).toHaveProperty('recruiterDMs')
      expect(result).toHaveProperty('followUpEmails')
      expect(result).toHaveProperty('checklist')
      expect(result).toHaveProperty('tips')
      expect(result).toHaveProperty('generatedAt')
      expect(result).toHaveProperty('version')
    })

    it('includes job information', () => {
      const result = generateSmartApplyPack(mockJobData, mockResumeData)

      expect(result.jobData.title).toBe('Senior Software Engineer')
      expect(result.jobData.company).toBe('TechCorp Industries')
      expect(result.jobData.url).toBe('https://www.linkedin.com/jobs/view/12345')
    })

    it('generates tips based on analysis', () => {
      const result = generateSmartApplyPack(mockJobData, mockResumeData, mockJdAnalysis)

      expect(result.tips).toBeDefined()
      expect(result.tips.length).toBeGreaterThan(0)
    })

    it('includes version number', () => {
      const result = generateSmartApplyPack(mockJobData, mockResumeData)

      expect(result.version).toBe('1.0')
    })

    it('throws error for missing data', () => {
      expect(() => generateSmartApplyPack(null, mockResumeData)).toThrow('Job data and resume data are required')
      expect(() => generateSmartApplyPack(mockJobData, null)).toThrow('Job data and resume data are required')
    })
  })

  // ============================================
  // FORMAT UTILITIES TESTS
  // ============================================
  describe('formatCoverLetterAsText', () => {
    it('returns full text from cover letter', () => {
      const coverLetter = generateCoverLetter(mockJobData, mockResumeData)
      const result = formatCoverLetterAsText(coverLetter)

      expect(result).toContain('John Doe')
      expect(result).toContain('john.doe@example.com')
      expect(result).toContain('Senior Software Engineer')
    })

    it('returns empty string for null input', () => {
      const result = formatCoverLetterAsText(null)

      expect(result).toBe('')
    })
  })

  describe('formatSmartApplyPackAsText', () => {
    it('formats complete pack as text', () => {
      const pack = generateSmartApplyPack(mockJobData, mockResumeData, mockJdAnalysis)
      const result = formatSmartApplyPackAsText(pack)

      expect(result).toContain('SMART APPLY PACK')
      expect(result).toContain('COVER LETTER')
      expect(result).toContain('LINKEDIN RECRUITER DM')
      expect(result).toContain('FOLLOW-UP EMAIL')
      expect(result).toContain('APPLICATION CHECKLIST')
      expect(result).toContain('PRO TIPS')
    })

    it('includes all sections with separators', () => {
      const pack = generateSmartApplyPack(mockJobData, mockResumeData)
      const result = formatSmartApplyPackAsText(pack)

      expect(result).toContain('=====================================')
    })

    it('returns empty string for null input', () => {
      const result = formatSmartApplyPackAsText(null)

      expect(result).toBe('')
    })
  })

  // ============================================
  // TEMPLATE CONSTANTS TESTS
  // ============================================
  describe('Template Constants', () => {
    it('has all template styles defined', () => {
      expect(TEMPLATE_STYLES).toHaveProperty('professional')
      expect(TEMPLATE_STYLES).toHaveProperty('modern')
      expect(TEMPLATE_STYLES).toHaveProperty('creative')
    })

    it('has all cover letter templates', () => {
      expect(COVER_LETTER_TEMPLATES).toHaveProperty('professional')
      expect(COVER_LETTER_TEMPLATES).toHaveProperty('modern')
      expect(COVER_LETTER_TEMPLATES).toHaveProperty('creative')
    })

    it('cover letter templates have opening and closing', () => {
      Object.values(COVER_LETTER_TEMPLATES).forEach(template => {
        expect(template).toHaveProperty('opening')
        expect(template).toHaveProperty('closing')
      })
    })
  })
})
