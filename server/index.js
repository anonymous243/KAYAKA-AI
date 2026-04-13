import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());
import Razorpay from 'razorpay';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
app.use(express.json());

// Health check endpoint for monitoring
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Main scraping endpoint
app.post('/api/scrape', async (req, res) => {
  const { url } = req.body;

  if (!url || !url.startsWith('https://')) {
    return res.status(400).json({ error: 'Valid HTTPS URL is required' });
  }

  let browser;
  try {
    console.log(`[Scraper] Launching browser for: ${url}`);
    
    // Launch headless Chromium with production-safe flags
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // Camouflage the browser to bypass simple blockades
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1366, height: 768 });

    // Go to URL and wait until DOM is mostly loaded
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    
    // Extract metadata based on common structures (LinkedIn, Naukri, Glassdoor fallback)
    const jobData = await page.evaluate(() => {
      // 1. Try generic OpenGraph tags first
      const titleOg = document.querySelector('meta[property="og:title"]')?.content;
      const descOg = document.querySelector('meta[property="og:description"]')?.content;
      
      // 2. LinkedIn specific parsing
      const isLinkedIn = window.location.hostname.includes('linkedin.com');
      let title = '', company = '', location = 'Not Specified', description = '';

      if (isLinkedIn) {
        title = document.querySelector('h1.top-card-layout__title, .sub-nav-cta__header')?.innerText?.trim() || titleOg || '';
        company = document.querySelector('.topcard__org-name-link, .sub-nav-cta__optional-url')?.innerText?.trim() || '';
        location = document.querySelector('.topcard__flavor--bullet')?.innerText?.trim() || 'Not Specified';
        description = document.querySelector('.description__text, .show-more-less-html__markup')?.innerText?.trim() || descOg || '';
      } 
      // 3. Naukri specific parsing
      else if (window.location.hostname.includes('naukri.com')) {
        title = document.querySelector('.jd-header-title')?.innerText?.trim() || titleOg || '';
        company = document.querySelector('.jd-header-comp-name')?.innerText?.trim() || '';
        location = document.querySelector('.loc')?.innerText?.trim() || 'Not Specified';
        description = document.querySelector('.dang-inner-html')?.innerText?.trim() || descOg || '';
      }
      // 4. Generic fallback relying on massive schema tags or common class names
      else {
        title = titleOg || document.querySelector('h1')?.innerText?.trim() || 'Job Title Not Found';
        company = document.querySelector('h2, .company')?.innerText?.trim() || 'Company Not Found';
        description = document.querySelector('.job-description, #job-description, .description, [data-automation="jobDescription"]')
          ?.innerText?.trim() || descOg || 'No description found on page.';
      }

      return {
        title: title.replace(/\\n/g, ' ').trim(),
        company: company.replace(/\\n/g, ' ').trim(),
        location: location.replace(/\\n/g, ' ').trim(),
        description: description,
        salary: 'Not Provided', // Not scraping salary reliably to avoid fragile regex
        type: 'Full-time'
      };
    });

    console.log(`[Scraper] Retrieved data for ${jobData.company} - ${jobData.title}`);

    // Fallback error if completely empty
    if (!jobData.title && !jobData.description) {
      throw new Error('Could not parse any useful job data from the page. It might be heavily blocked by Captcha.');
    }

    res.json(jobData);

  } catch (error) {
    console.error(`[Scraper Error]: ${error.message}`);
    res.status(500).json({ error: error.message || 'Scraping failed' });
  } finally {
    if (browser) {
      await browser.close();
      console.log(`[Scraper] Browser instance closed.`);
    }
  }
});

// ===========================================
// ADVANCED AI RESUME PARSER
// ===========================================
import { GoogleGenerativeAI } from '@google/generative-ai';

app.post('/api/parse-resume', async (req, res) => {
  const { rawText } = req.body;
  
  if (!rawText || rawText.length < 50) {
    return res.status(400).json({ error: 'Text content is empty or unreadable.' });
  }
  
  // Requires the user to add GEMINI_API_KEY inside their .env configuration
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'System missing GEMINI_API_KEY in backend configuration. Please add it to your .env file and restart the server.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // gemini-pro is deprecated — use gemini-1.5-flash (fast, stable, and free tier)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Enforce strict JSON output schema directly in the prompt
    const prompt = `
    You are an expert HR systems resume parser. Extract the structured content from the following raw PDF text dump.
    Ignore boilerplate PDF garbage or random symbols.
    You MUST respond with pure JSON formatting ONLY. Do not use markdown blocks. Your response must be strictly valid JSON matching this exact structure:
    {
      "name": "Full Name",
      "email": "Email Address",
      "phone": "Phone Number",
      "location": "City, State or Country",
      "summary": "1-3 sentences summarizing the profile. If no summary exists, synthesize a short professional one based on their title.",
      "linkedin": "LinkedIn URL if present",
      "website": "Personal Website or GitHub if present",
      "skills": ["A list", "of", "exact", "skills", "found"],
      "experience": [
        {
          "company": "Company Name",
          "position": "Job Title",
          "startDate": "Start Date (e.g. 05/2024 or May 2024)",
          "endDate": "End Date or Present",
          "current": true_or_false,
          "description": "Multi-line bullet points or single paragraph exactly as written"
        }
      ],
      "education": [
        {
          "institution": "University/College Name",
          "degree": "Full Name of Degree",
          "field": "Major/Field of Study if present",
          "startDate": "Start Date",
          "endDate": "End Date",
          "gpa": "GPA if present"
        }
      ],
      "projects": [
        {
          "name": "Project Name",
          "description": "Explanation of the project and their contributions",
          "technologies": ["Tech", "Stack", "Used"],
          "link": "Project Link if present"
        }
      ]
    }
    
    If any field is completely missing, return an empty string "" or empty array [] for it. Make sure titles, dates, and companies are not mixed.
    Here is the unformatted resume text:
    
    ${rawText}
    `;

    console.log(`[Parser Core] Communicating with Gemini 1.5 Flash...`);
    const result = await model.generateContent(prompt);
    let output = result.response.text().trim();
    
    // Strip markdown fences if the model wrapped the JSON anyway
    output = output.replace(/^```(?:json)?/im, '').replace(/```\s*$/m, '').trim();
    // Find the first { and last } to extract pure JSON even if there's surrounding text
    const jsonStart = output.indexOf('{');
    const jsonEnd = output.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      output = output.substring(jsonStart, jsonEnd + 1);
    }
    
    const parsedJSON = JSON.parse(output);
    console.log(`[Parser Core] Extraction Successful! Found Name: ${parsedJSON.name}`);
    
    res.json(parsedJSON);

  } catch (error) {
    console.error(`[AI Extraction Error]:`, error);
    res.status(500).json({ error: 'LLM Extraction Failed', details: error.message });
  }
});

// ===========================================
// STRATEGIC RESUME BRIDGING (THE BRIDGE)
// ===========================================
app.post('/api/bridge-resume', async (req, res) => {
  const { resumeData, targetJD } = req.body;
  
  if (!resumeData || !targetJD) {
    return res.status(400).json({ error: 'Both resume data and target JD are required for bridging.' });
  }
  
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing Gemini API Key in backend.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    You are a Strategic Career Architect. Your task is to "BRIDGE" the user's existing resume data to a specific Target Job Description (JD).
    
    CRITICAL RULES:
    1. DO NOT HALLUCINATE: Only use the user's actual roles and companies.
    2. STRATEGIC ALIGNMENT: Rewrite the professional summary and experience bullet points to emphasize skills and achievements that directly match the Target JD's requirements.
    3. TERMINOLOGY: Use keywords, verbs, and industry-specific language found in the Target JD.
    4. TONE: Maintain a high-impact, professional, and result-oriented tone.
    5. FORMAT: Respond ONLY with valid JSON matching the user's input structure.

    TARGET JOB DESCRIPTION:
    ${targetJD}

    USER RESUME DATA (JSON):
    ${JSON.stringify(resumeData, null, 2)}

    Process the data and return the optimized JSON resume.
    `;

    console.log(`[Bridge Core] Bridging resume to JD goals...`);
    const result = await model.generateContent(prompt);
    let output = result.response.text().trim();
    
    output = output.replace(/^```(?:json)?/im, '').replace(/```\s*$/m, '').trim();
    const jsonStart = output.indexOf('{');
    const jsonEnd = output.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      output = output.substring(jsonStart, jsonEnd + 1);
    }
    
    const bridgedJSON = JSON.parse(output);
    console.log(`[Bridge Core] Strategic Alignment Successful!`);
    
    res.json(bridgedJSON);

  } catch (error) {
    console.error(`[Bridge Error]:`, error);
    res.status(500).json({ error: 'Strategic Bridging Failed', details: error.message });
  }
});

// ===========================================
// SMART APPLY ENGINE (AI PACK GENERATOR)
// ===========================================
app.post('/api/generate-smart-pack', async (req, res) => {
  const { resumeData, jobData, style = 'professional' } = req.body;
  
  if (!resumeData || !jobData) {
    return res.status(400).json({ error: 'Both resume data and job data are required for pack generation.' });
  }
  
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing Gemini API Key in backend.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    You are a Strategic Career Architect and HR Expert. Your task is to generate a comprehensive "Smart Apply Pack" for a candidate applying to a specific job.
    
    CANDIDATE DATA:
    ${JSON.stringify(resumeData, null, 2)}

    JOB DESCRIPTION:
    ${JSON.stringify(jobData, null, 2)}

    STYLE: ${style}

    CRITICAL RULES:
    1. DO NOT HALLUCINATE: Only use the candidate's actual roles, skills, and companies.
    2. NARRATIVE SYNERGY: Bridge the candidate's strengths to the job's requirements.
    3. TONE: Use a ${style} tone. (Professional = standard SaaS corporate, Modern = bold and high-impact, Creative = storytelling and passionate).
    4. OUTPUT FORMAT: Respond ONLY with valid JSON. Do not include markdown fences.

    REQUIRED JSON STRUCTURE:
    {
      "coverLetter": {
        "opening": "Standard professional salutation",
        "intro": "High-impact 1-2 sentence introduction stating the role and enthusiasm.",
        "body": "2-3 paragraphs bridging specific candidate skills/experiences to the job requirements.",
        "closing": "Professional sign-off",
        "fullText": "The complete, formatted cover letter text including header, date, and placeholder for contact info."
      },
      "recruiterDMs": [
        {
          "type": "initial",
          "subject": "Short LinkedIn subject hook",
          "message": "A 2-3 sentence personalized LinkedIn message to a recruiter."
        },
        {
          "type": "follow-up",
          "subject": "Follow-up subject",
          "message": "A polite follow-up message if they haven't responded in 3 days."
        }
      ],
      "followUpEmails": [
        {
          "type": "post-application",
          "subject": "Subject for email sent 1 day after applying",
          "body": "Professional email body."
        },
        {
          "type": "post-interview",
          "subject": "Thank you email subject",
          "body": "A personalized thank you email mentioning likely interview topics."
        },
        {
          "type": "status-check",
          "subject": "Checking in after 1 week",
          "body": "A polite status check email body."
        }
      ],
      "checklist": [
        { "item": "Step 1 description", "completed": false },
        { "item": "Step 2 description", "completed": false },
        { "item": "Step 3 description", "completed": false },
        { "item": "Step 4 description", "completed": false },
        { "item": "Step 5 description", "completed": false }
      ],
      "tips": [
        "Strategic tip 1 for this specific job",
        "Strategic tip 2 for this specific candidate",
        "Company-specific research tip (if info available)"
      ]
    }
    `;

    console.log(`[SmartPack Core] Generating AI Apply Pack for ${resumeData.name}...`);
    const result = await model.generateContent(prompt);
    let output = result.response.text().trim();
    
    // Cleanup output
    output = output.replace(/^```(?:json)?/im, '').replace(/```\s*$/m, '').trim();
    const jsonStart = output.indexOf('{');
    const jsonEnd = output.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      output = output.substring(jsonStart, jsonEnd + 1);
    }
    
    const packJSON = JSON.parse(output);
    console.log(`[SmartPack Core] Package Architecture Successful!`);
    
    res.json(packJSON);

  } catch (error) {
    console.error(`[SmartPack Error]:`, error);
    res.status(500).json({ error: 'AI Pack Generation Failed', details: error.message });
  }
});

// ===========================================
// RAZORPAY PAYMENT INTEGRATION
// ===========================================

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret'
});

// Create Order Header
app.post('/api/create-order', async (req, res) => {
  const { amount, currency, planName, userId } = req.body;

  if (!amount || !userId) {
    return res.status(400).json({ error: 'Amount and User ID are required' });
  }

  try {
    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise for INR)
      currency: currency || 'INR',
      receipt: `receipt_${Date.now()}_${userId.substring(0, 8)}`,
      notes: {
        planName,
        userId
      }
    };

    const order = await razorpay.orders.create(options);
    console.log(`[Razorpay] Order created: ${order.id} for user ${userId}`);
    res.json(order);
  } catch (error) {
    console.error(`[Razorpay Order Error]:`, error);
    res.status(500).json({ error: 'Failed to create Razorpay order', details: error.message });
  }
});

// Verify Payment
app.post('/api/verify-payment', async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    userId,
    planName: _planName,
    amount: _amount
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment verification details' });
  }

  try {
    // Generate signature for verification
    const text = razorpay_order_id + "|" + razorpay_payment_id;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
      .update(text)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      console.log(`[Razorpay] Payment verified: ${razorpay_payment_id} for user ${userId}`);

      // In a real app, you would update Supabase here as well.
      // But we'll let the frontend handle the Supabase update for simplicity in this demo,
      // or we can do it here if we had service role access.
      // For now, return success.
      res.json({ status: 'success', message: 'Payment verified successfully' });
    } else {
      console.error(`[Razorpay] Signature mismatch!`);
      res.status(400).json({ status: 'failure', message: 'Invalid signature' });
    }
  } catch (error) {
    console.error(`[Razorpay Verification Error]:`, error);
    res.status(500).json({ error: 'Payment verification failed', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Job Scraper Backend running on http://localhost:${PORT}`);
  console.log(`📡 Ready to extract Jobs.`);
  console.log(`🧠 AI Parser Online (Waiting for API Keys).\n`);
});
