import * as pdfjs from 'pdfjs-dist'
// Use explicitly versioned CDN for the worker to avoid Vercel/Vite chunk origin CORS issues
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`

// ─────────────────────────────────────────────
// Section header detection
// ─────────────────────────────────────────────
const SECTION_PATTERNS = {
  experience:  /^(work\s*experience|experience|employment|professional\s*experience|career\s*history|work\s*history)/i,
  education:   /^(education|academic|qualification|studies|schooling)/i,
  skills:      /^(skills|technical\s*skills|core\s*competencies|competencies|technologies|tools|expertise)/i,
  projects:    /^(projects|personal\s*projects|key\s*projects|portfolio|side\s*projects)/i,
  summary:     /^(summary|profile|objective|about|professional\s*summary|career\s*objective|executive\s*summary)/i,
  certifications: /^(certifications?|certificates?|credentials?|licenses?)/i,
  contact:     /^(contact|personal\s*info|personal\s*details|reach\s*me)/i,
}

function detectSection(line) {
  const trimmed = line.trim()
  for (const [key, pattern] of Object.entries(SECTION_PATTERNS)) {
    if (pattern.test(trimmed)) return key
  }
  return null
}

// ─────────────────────────────────────────────
// Contact field extractors
// ─────────────────────────────────────────────
const EMAIL_RE    = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/
const PHONE_RE    = /(\+?[\d\s().]{7,15}\d)/
const LINKEDIN_RE = /(?:linkedin\.com\/in\/)([\w-]+)/i
const GITHUB_RE   = /(?:github\.com\/)([\w-]+)/i
const URL_RE      = /https?:\/\/[^\s,]+/i

function extractEmail(text)    { return (text.match(EMAIL_RE) || [])[1] || '' }
function extractPhone(text)    {
  // avoid matching years like 2019, 2020
  const m = text.match(/(\+?[\d][\d\s\-().]{6,14}\d)/)
  if (!m) return ''
  const digits = m[1].replace(/\D/g, '')
  return digits.length >= 7 && digits.length <= 15 ? m[1].trim() : ''
}
function extractLinkedIn(text) { return (text.match(LINKEDIN_RE) || [])[0] || '' }
function extractGitHub(text)   { return (text.match(GITHUB_RE) || [])[0] || '' }
function extractWebsite(text)  {
  const url = (text.match(URL_RE) || [])[0] || ''
  if (url.includes('linkedin') || url.includes('github')) return ''
  return url
}

// ─────────────────────────────────────────────
// Name extraction
// Name = first short line (< 60 chars) containing only name-like tokens,
// not an email, phone, url, or address keyword
// ─────────────────────────────────────────────
const ADDRESS_SIGNALS = /\d{5,}|street|road|avenue|ave|blvd|lane|nagar|colony|district|state|karnataka|maharashtra|delhi|mumbai|bangalore|hyderabad|chennai|kolkata|raichur|gulbarga|hubli/i
const MR_MS_RE        = /^(mr\.?|ms\.?|mrs\.?|dr\.?|prof\.?)\s+/i

function extractName(lines) {
  for (const line of lines.slice(0, 8)) {
    const t = line.trim()
    if (!t || t.length > 70) continue
    if (EMAIL_RE.test(t))    continue   // skip email lines
    if (PHONE_RE.test(t) && /\d{7,}/.test(t)) continue  // skip phone-heavy lines
    if (ADDRESS_SIGNALS.test(t)) continue // skip address lines
    if (URL_RE.test(t))      continue   // skip URL lines
    if (detectSection(t))    continue   // skip section headers

    // Accept if it looks like a name: mostly letters, spaces, hyphens, dots
    const cleaned = t.replace(MR_MS_RE, '')
    const nameTokens = cleaned.split(/\s+/)
    const allAlpha = nameTokens.every(tok => /^[A-Za-z\-'.]+$/.test(tok))
    if (allAlpha && nameTokens.length >= 1 && nameTokens.length <= 5) {
      return t
    }
  }
  return ''
}

// ─────────────────────────────────────────────
// Skill keyword list
// ─────────────────────────────────────────────
const SKILL_KEYWORDS = [
  'javascript','typescript','react','react.js','node','node.js','next.js','vue','angular',
  'python','java','c++','c#','go','rust','ruby','php','swift','kotlin','dart','scala',
  'html','css','sass','tailwind','bootstrap','material ui','figma',
  'sql','mysql','postgresql','mongodb','redis','elasticsearch','firebase','supabase',
  'aws','azure','gcp','docker','kubernetes','terraform','jenkins','ci/cd','github actions',
  'git','linux','bash','shell',
  'machine learning','deep learning','ai','tensorflow','pytorch','scikit-learn','nlp',
  'rest','graphql','api','microservices','websocket',
  'agile','scrum','jira','notion',
  'express','django','flask','fastapi','spring','rails','laravel',
  'vite','webpack','babel','jest','cypress','playwright',
  'pandas','numpy','matplotlib','seaborn','opencv',
  'flutter','react native','android','ios',
]

function extractSkillsFromText(text) {
  // Pad with spaces and replace punctuation (except +, #, .) with spaces to allow exact word boundary matching
  const wordsText = " " + text.toLowerCase().replace(/[^\w#+.-]+/g, ' ') + " "
  return [...new Set(
    SKILL_KEYWORDS.filter(s => wordsText.includes(" " + s + " "))
      .map(s => s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))
  )]
}

function extractSkillsFromSection(lines) {
  // Skills sections often have comma/bullet separated or one-per-line items
  const raw = lines.join(' ')
  const byComma = raw.split(/[,•|·/]/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 40)
  // Intersect with known skills OR accept short tokens that look like tech
  const known = extractSkillsFromText(raw)
  const cleaned = byComma.filter(s => /^[A-Za-z0-9.#+ -]{2,35}$/.test(s) && !/^\d+$/.test(s))
  return [...new Set([...known, ...cleaned])]
}

// ─────────────────────────────────────────────
// Date range extraction helper
// ─────────────────────────────────────────────
const MONTH_RE = /jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?/i
const YEAR_RE  = /((?:19|20)\d{2})/g

function extractDateRange(line) {
  const hasMonth = MONTH_RE.test(line)
  const years = line.match(YEAR_RE) || []
  const hasPresent = /present|current|now/i.test(line)
  return { hasDate: hasMonth || years.length > 0, years, hasPresent }
}

function parseExperienceSection(lines) {
  const entries = []
  let current = null
  let descLines = []
  let pendingTitleLine = ''

  const commitCurrent = () => {
    if (current) {
      current.description = descLines
        .filter(l => l.trim() && l !== pendingTitleLine) // Remove the leaked title from description
        .map(l => l.replace(/^[•\-–—*]\s*/, '').trim())
        .join('\n')
      entries.push(current)
    }
  }

  for (const line of lines) {
    const t = line.trim()
    if (!t) continue

    const { hasDate, years, hasPresent } = extractDateRange(t)
    const isBullet = /^[•\-–—*]/.test(t)
    const isDateLine = hasDate && t.length < 120 && !isBullet

    if (isDateLine) {
      commitCurrent() // Seal the previous job entry
      
      current = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        company: '',
        position: '',
        startDate: years[0] || '',
        endDate: hasPresent ? 'Present' : (years[1] || years[0] || ''),
        current: hasPresent,
        description: ''
      }
      
      const noDate = t.replace(/(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*/gi, '')
                      .replace(YEAR_RE, '').replace(/[-–|to]+/g, ' ').trim()
                      
      // Case 1: Company and Role are on the same line as Date
      if (noDate.length > 10) {
        if (noDate.includes('at')) {
          const [pos, comp] = noDate.split(/\bat\b/i)
          current.position = pos?.trim() || ''
          current.company  = comp?.trim() || ''
        } else {
          current.company = noDate.substring(0, 60)
        }
      } 
      // Case 2: Company and Role were on the PRECEDING line (pendingTitleLine)
      else if (pendingTitleLine) {
        if (pendingTitleLine.includes('-') || pendingTitleLine.includes('|')) {
          const sep = pendingTitleLine.includes('-') ? '-' : '|';
          const [pos, comp] = pendingTitleLine.split(sep);
          current.position = pos?.trim() || '';
          current.company = (comp || '').trim();
        } else {
          current.position = pendingTitleLine;
        }
      }
      
      descLines = []
      pendingTitleLine = '' // Reset
    } else {
      if (current) descLines.push(t)
      // If it's short and not a bullet, it might be the start of the next job title
      if (!isBullet && !hasDate && t.length > 5 && t.length < 80) {
        pendingTitleLine = t
      } else {
        pendingTitleLine = ''
      }
    }
  }
  commitCurrent()
  return entries
}

// ─────────────────────────────────────────────
// Education block parser
// ─────────────────────────────────────────────
const EDU_DEGREE_RE = /b\.?tech|m\.?tech|b\.?e\.?|m\.?e\.?|bsc|msc|bachelor|master|phd|doctorate|diploma|b\.?sc|m\.?sc|mba|b\.?com|m\.?com|b\.?a\.?|m\.?a\.?/i
const EDU_ORG_RE    = /university|college|institute|school|academy|iit|nit|bits/i

function parseEducationSection(lines) {
  const entries = []
  let current = null

  for (const line of lines) {
    const t = line.trim()
    if (!t) continue

    const { years } = extractDateRange(t)
    const isDegree = EDU_DEGREE_RE.test(t)
    const isOrg    = EDU_ORG_RE.test(t)

    if (isDegree || isOrg) {
      if (current && ((isDegree && current.degree) || (isOrg && current.institution && current.degree))) {
        entries.push(current)
        current = null
      }
      if (!current) {
        current = {
          id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
          institution: '',
          degree: '',
          field: '',
          startDate: years[0] || '',
          endDate: years[1] || years[0] || '',
          gpa: ''
        }
      }
      if (isDegree && !current.degree) {
        current.degree = t.substring(0, 80)
      } 
      if (isOrg && !current.institution) {
        current.institution = t.substring(0, 80)
      }
      if (years.length && !current.endDate) current.endDate = years[years.length - 1]
    } else if (current && years.length) {
      current.startDate = years[0] || current.startDate
      current.endDate   = years[years.length - 1] || current.endDate
    }
  }
  if (current) entries.push(current)
  return entries
}

// ─────────────────────────────────────────────
// Projects block parser
// ─────────────────────────────────────────────
function parseProjectsSection(lines) {
  const entries = []
  let current = null

  for (const line of lines) {
    const t = line.trim()
    if (!t) continue

    const isBullet = /^[•\-–—*]/.test(t)

    // A project title: short non-bullet line that doesn't look like a date
    if (!isBullet && t.length < 80 && !extractDateRange(t).hasDate) {
      if (current) entries.push(current)
      current = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        name: t,
        description: '',
        technologies: extractSkillsFromText(t),
        link: URL_RE.test(t) ? (t.match(URL_RE) || [])[0] : ''
      }
    } else if (current) {
      current.description += (current.description ? '\n' : '') + t.replace(/^[•\-–—*]\s*/, '')
      current.technologies = [...new Set([...current.technologies, ...extractSkillsFromText(t)])]
      if (URL_RE.test(t) && !current.link) current.link = (t.match(URL_RE) || [])[0]
    }
  }
  if (current) entries.push(current)
  return entries
}

// ─────────────────────────────────────────────
// Extract PDF text (pdfjs)
// ─────────────────────────────────────────────
const extractTextFromPDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer()
    if (arrayBuffer.byteLength < 5) throw new Error('File is too small to be a valid PDF')
    const header = new Uint8Array(arrayBuffer.slice(0, 5))
    if (String.fromCharCode(...header) !== '%PDF-') throw new Error('Invalid or corrupt PDF file structure')

    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
    if (pdf.numPages === 0) throw new Error('PDF has no pages')

    let fullText = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      
      // Group items into physical lines based on Y-coordinates
      const linesMap = new Map();
      for (const item of textContent.items) {
        if (!item.str.trim()) continue; // Skip pure whitespace blocks
        
        const y = Math.round(item.transform[5]); // Y coordinate
        const x = item.transform[4];            // X coordinate
        
        // Find if this Y is close to an existing line (within 4 points for superscript/descenders)
        let foundY = null;
        for (const existingY of linesMap.keys()) {
          if (Math.abs(existingY - y) <= 4) {
            foundY = existingY;
            break;
          }
        }
        
        const targetY = foundY !== null ? foundY : y;
        if (!linesMap.has(targetY)) {
          linesMap.set(targetY, []);
        }
        linesMap.get(targetY).push({ str: item.str, x });
      }

      // Sort lines top-to-bottom (PDF Coordinate Y=0 is at the bottom of the page)
      const sortedY = Array.from(linesMap.keys()).sort((a, b) => b - a);
      
      const pageText = sortedY.map(y => {
        // Sort horizontal fragments left-to-right
        const lineItems = linesMap.get(y).sort((a, b) => a.x - b.x);
        // Collapse fragments separated by less than a standard space width (~1-3px is kerning/ligatures)
        let lineStr = '';
        let lastX = -1;
        for (const fr of lineItems) {
           if (lastX !== -1 && (fr.x - lastX) > 10) { // arbitrary wide gap
              lineStr += '  ' + fr.str;
           } else {
              lineStr += (lineStr ? ' ' : '') + fr.str; // standard join
           }
           // approximate width calculation would be better, but we just use X
           lastX = fr.x;
        }
        // Normalize multiple spaces
        return lineStr.replace(/\s{2,}/g, ' ').trim();
      }).join('\n');
      
      fullText += pageText + '\n\n';
    }

    if (!fullText.trim()) throw new Error('PDF appears to be empty or contains only images.')
    return fullText
  } catch (error) {
    if (error.name === 'PasswordException') throw new Error('PDF is password-protected. Please remove the password.')
    if (error.name === 'InvalidPDFException') throw new Error('Invalid or corrupt PDF file')
    throw error
  }
}

// ─────────────────────────────────────────────
// Main: split into sections and parse each
// ─────────────────────────────────────────────
const parseResumeText = async (rawText) => {
  try {
    const lines = rawText.split('\n')

    // Extract basic info
    const name = extractName(lines)
    const fullText = lines.join('\n')
    const email = extractEmail(fullText)
    const phone = extractPhone(fullText)
    const linkedin = extractLinkedIn(fullText)
    const github = extractGitHub(fullText)
    const website = extractWebsite(fullText)

    // Parse sections
    let currentSection = null
    const sectionLines = {
      summary: [],
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: []
    }

    for (const line of lines) {
      const section = detectSection(line)
      if (section) {
        currentSection = section
        continue
      }
      if (currentSection && sectionLines[currentSection]) {
        sectionLines[currentSection].push(line)
      } else if (!currentSection) {
        // Lines before any section (could be contact info or summary)
        if (line.trim().length > 0 && !EMAIL_RE.test(line) && !PHONE_RE.test(line)) {
          sectionLines.summary.push(line)
        }
      }
    }

    // Parse each section
    const experience = parseExperienceSection(sectionLines.experience)
    const education = parseEducationSection(sectionLines.education)
    const projects = parseProjectsSection(sectionLines.projects)
    const skills = sectionLines.skills.length > 0 
      ? extractSkillsFromSection(sectionLines.skills)
      : extractSkillsFromText(fullText)

    // Build summary from pre-section lines or first few lines
    let summary = sectionLines.summary
      .filter(l => l.trim().length > 0 && l.trim().length < 200)
      .slice(0, 5)
      .join(' ')
      .trim()

    // If no summary found, create a basic one
    if (!summary && name) {
      summary = `${name} is a professional with experience in ${skills.slice(0, 3).join(', ')}.`
    }

    return {
      name: name || 'Unknown',
      email: email || '',
      phone: phone || '',
      linkedin: linkedin || '',
      github: github || '',
      website: website || '',
      summary,
      skills,
      experience,
      education,
      projects,
      certifications: []
    }

  } catch (err) {
    console.error('Parsing Error:', err)
    throw new Error('Failed to parse resume. Please ensure the PDF is text-based and not scanned.')
  }
}

// ─────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────
export const uploadAndParseResume = async (file) => {
  try {
    const fileType = file.type

    if (fileType === 'application/pdf') {
      const text = await extractTextFromPDF(file)
      return await parseResumeText(text)
    } else if (fileType === 'text/plain') {
      const text = await file.text()
      return await parseResumeText(text)
    } else {
      throw new Error('Unsupported file format. Please upload a PDF or TXT file.')
    }
  } catch (error) {
    console.error('Error parsing resume:', error)
    throw error
  }
}
