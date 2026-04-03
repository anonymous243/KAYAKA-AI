# KAYAKA-AI — Notion Workspace Blueprint

> **Purpose:** This document defines the complete execution system for building KAYAKA-AI, a SaaS resume optimization platform. Use this as the single source of truth for all AI agents and development workflows.

---

## 📍 Vision

**KAYAKA-AI** is an AI-powered resume optimization SaaS that helps users:
- Upload and parse resumes
- Edit skills and experience profiles
- Analyze job descriptions (JD)
- Generate tailored resumes with match scores
- Download polished, ATS-ready documents
- **Target jobs by URL** (LinkedIn, Naukri, Glassdoor)
- **Get recruiter intent summaries**
- **Smart Apply Pack** (resume + cover letter + recruiter messages)
- **Track job applications**

**Goal:** Enable job seekers to land interviews faster with AI-driven resume customization and automated application tools.

---

## 🏠 KAYAKA-AI HQ (Main Dashboard)

The central command center for daily execution.

### Dashboard Sections

| Section | Purpose |
|---------|---------|
| **Vision** | Short product goal (see above) |
| **Current Phase Tracker** | Displays active phase from Roadmap |
| **Roadmap (Linked View)** | All 7 phases with status |
| **Today's Tasks** | Filtered: `Status = Todo` OR `In Progress` |
| **Blockers** | Issues preventing progress |
| **Quick Nav** | Links to all 6 databases |

---

## 🗄️ Databases

### A. ROADMAP DATABASE (High-Level Phases)

| Property | Type | Options |
|----------|------|---------|
| Phase Name | Title | — |
| Status | Select | `Planned` / `Active` / `Done` |
| Start Date | Date | — |
| End Date | Date | — |
| Priority | Select | `High` / `Medium` / `Low` |
| Notes | Text | — |

#### Pre-Filled Phases

| # | Phase Name | Status | Priority | Completion Date |
|---|------------|--------|----------|-----------------|
| 1 | Foundation | ✅ Done | High | March 2026 |
| 2 | Resume Upload | ✅ Done | High | March 2026 |
| 3 | Profile Editor | ✅ Done | Medium | March 2026 |
| 4 | JD Analyzer | ✅ Done | High | March 2026 |
| 5 | Resume Generator | ✅ Done | High | March 2026 |
| 6 | Download & Polish | ✅ Done | Medium | March 2026 |
| 7 | Testing & Stability | 🔄 In Progress | High | - |
| 8 | Job Targeting Engine | 🔄 In Progress | High | - |
| 9 | Smart Apply Pack | 🔄 In Progress | High | - |

---

### B. FEATURES DATABASE

| Property | Type | Options |
|----------|------|---------|
| Feature Name | Title | — |
| Phase | Relation | → Roadmap |
| Status | Select | `Planned` / `In Progress` / `Done` |
| Complexity | Select | `Low` / `Medium` / `High` |
| API Required | Checkbox | Yes / No |
| UI Required | Checkbox | Yes / No |
| Notes | Text | — |a

---

### C. TASK DATABASE (Kanban Primary System)

| Property | Type | Options |
|----------|------|---------|
| Task Name | Title | — |
| Feature | Relation | → Features |
| Phase | Relation | → Roadmap |
| Status | Select | `Todo` / `In Progress` / `Testing` / `Done` |
| Priority | Select | `High` / `Medium` / `Low` |
| Tool Used | Select | `Qwen CLI` / `Antigravity IDE` / `Manual` |
| Notes | Text | — |

#### Views

| View Name | Type | Filter / Group |
|-----------|------|----------------|
| **Kanban Board** | Board | Grouped by `Status` |
| **Current Phase Tasks** | Table | Filtered by `Phase = Active` |
| **Today's Tasks** | List | `Status = Toado` OR `In Progress` |

---

### D. BUG TRACKER DATABASE

| Property | Type | Options |
|----------|------|---------|
| Bug Title | Title | — |
| Feature | Relation | → Features |
| Severity | Select | `Low` / `Medium` / `High` |
| Status | Select | `Open` / `Fixing` / `Fixed` |
| Reproduction Steps | Text | — |
| Fix Notes | Text | — |

---

### E. API TRACKER DATABASE

| Property | Type | Options |
|----------|------|---------|
| Endpoint | Title | — |
| Method | Select | `GET` / `POST` / `PUT` / `DELETE` |
| Status | Select | `Pending` / `Working` / `Tested` |
| Request Schema | Text | — |
| Response Schema | Text | — |
| Tested | Checkbox | Yes / No |

---

### F. PROMPT LOG DATABASE (AI Optimization Layer)

| Property | Type | Options |
|----------|------|---------|
| Task | Title | — |
| Tool Used | Select | `Qwen CLI` / `Antigravity IDE` |
| Prompt Used | Text | — |
| Output Quality | Number | 1–5 |
| Fix Needed | Checkbox | Yes / No |
| Notes | Text | — |

---

## 📋 Phase-Wise Task Breakdown

### PHASE 1 — FOUNDATION

| Task | Feature | Priority | Tool |
|------|---------|----------|------|
| Setup project (React/Vite or Next.js) | Project Setup | High | Qwen CLI |
| Install Tailwind | Project Setup | High | Qwen CLI |
| Setup folder structure | Project Setup | Medium | Manual |
| Build Login page | Authentication | High | Antigravity IDE |
| Build Signup page | Authentication | High | Antigravity IDE |
| Setup routing | Authentication | Medium | Antigravity IDE |
| Implement JWT storage | Authentication | High | Qwen CLI |
| Protect routes | Authentication | High | Qwen CLI |

---

### PHASE 2 — RESUME UPLOAD

| Task | Feature | Priority | Tool |
|------|---------|----------|------|
| Build FileUpload component | Resume Upload | High | Antigravity IDE |
| Connect POST /resume/upload | Resume Upload | High | Qwen CLI |
| Add loading UI | Resume Upload | Medium | Antigravity IDE |
| Display parsed resume data | Resume Upload | High | Antigravity IDE |

---

### PHASE 2.5 — DASHBOARD (Post-Login Hub)

| Task | Feature | Priority | Tool |
|------|---------|----------|------|
| Build Dashboard layout | Dashboard | High | Antigravity IDE |
| Add navigation cards (Upload, Profile, JD, Generator) | Dashboard | High | Antigravity IDE |
| Display user profile summary | Dashboard | Medium | Antigravity IDE |
| Add quick stats/progress | Dashboard | Medium | Antigravity IDE |
| Update routing: Login → Dashboard | Dashboard | High | Qwen CLI |

---

### PHASE 3 — PROFILE EDITOR

| Task | Feature | Priority | Tool |
|------|---------|----------|------|
| Build skills editor | Profile Editor | High | Antigravity IDE |
| Build experience editor component | Profile Editor | High | Antigravity IDE |
| Add add/remove functionality | Profile Editor | Medium | Antigravity IDE |
| Connect PUT /profile/update | Profile Editor | High | Qwen CLI |

---

### PHASE 4 — JD ANALYZER

| Task | Feature | Priority | Tool |
|------|---------|----------|------|
| Build JD input UI | JD Analyzer | High | Antigravity IDE |
| Connect POST /jd/analyze | JD Analyzer | High | Qwen CLI |
| Display match score | JD Analyzer | High | Antigravity IDE |
| Show matching & missing skills | JD Analyzer | High | Antigravity IDE |

---

### PHASE 5 — RESUME GENERATOR

| Task | Feature | Priority | Tool |
|------|---------|----------|------|
| Add generate button | Resume Generator | High | Antigravity IDE |
| Connect POST /resume/generate | Resume Generator | High | Qwen CLI |
| Show resume preview | Resume Generator | High | Antigravity IDE |
| Add regenerate option | Resume Generator | Medium | Antigravity IDE |

---

### PHASE 6 — DOWNLOAD & POLISH

| Task | Feature | Priority | Tool |
|------|---------|----------|------|
| Add download buttons | Download & Polish | High | Antigravity IDE |
| Handle file downloads | Download & Polish | High | Qwen CLI |
| Add success UI | Download & Polish | Medium | Antigravity IDE |
| Add error handling (toasts) | Download & Polish | High | Antigravity IDE |

---

### PHASE 7 — TESTING & STABILITY

| Task | Feature | Priority | Tool |
|------|---------|----------|------|
| Test all flows | Testing | High | Manual |
| Handle API failures | Testing | High | Qwen CLI |
| Handle token expiry | Testing | High | Qwen CLI |
| Fix all bugs | Testing | High | Manual |

---

### PHASE 8 — JOB TARGETING ENGINE 🎯

| Task | Feature | Priority | Tool |
|------|---------|----------|------|
| Add URL input field (LinkedIn, Naukri, Glassdoor) | Job Targeting | High | Antigravity IDE |
| Build job description scraper/fetcher | Job Targeting | High | Qwen CLI |
| Generate tailored resume version | Job Targeting | High | Antigravity IDE |
| Create recruiter intent summary | Job Targeting | High | Qwen CLI |
| Display missing skills analysis | Job Targeting | Medium | Antigravity IDE |
| Add job application tracker | Job Targeting | Low | Antigravity IDE |

---

### PHASE 9 — SMART APPLY PACK 📬

| Task | Feature | Priority | Tool |
|------|---------|----------|------|
| Build Smart Apply button/component | Smart Apply | High | Antigravity IDE |
| Generate customized resume for job | Smart Apply | High | Antigravity IDE |
| Generate AI cover letter | Smart Apply | High | Qwen CLI |
| Generate LinkedIn recruiter DM | Smart Apply | Medium | Qwen CLI |
| Generate follow-up email template | Smart Apply | Medium | Qwen CLI |
| Create application package preview | Smart Apply | Medium | Antigravity IDE |
| Add download all as ZIP | Smart Apply | Low | Qwen CLI |
| Add copy-to-clipboard for messages | Smart Apply | Low | Antigravity IDE |

---

## 🔗 Database Relations

```
Roadmap ←→ Features (One-to-Many)
   ↓
   └──→ Tasks (Many-to-Many via Phase & Feature)
            ↓
            └──→ Bug Tracker (via Feature relation)
            └──→ API Tracker (implicit via Feature)
            └──→ Prompt Log (via Task relation)
```

### Key Relations Summary

| From | To | Purpose |
|------|-----|---------|
| Features → Roadmap | Phase | Track which phase owns each feature |
| Tasks → Features | Feature | Link tasks to their parent feature |
| Tasks → Roadmap | Phase | Enable phase-based filtering |
| Bug Tracker → Features | Feature | Identify buggy features |
| Prompt Log → Tasks | Task | Track AI prompt effectiveness per task |

---

## 🔄 Daily Workflow

```
1. Open "KAYAKA-AI HQ" Dashboard
2. Check "Current Phase" → Know what to work on
3. Open "Today's Tasks" → Pick a task (Todo → In Progress)
4. Work using Qwen CLI / Antigravity IDE
5. Log prompts in Prompt Log (optional optimization)
6. Move task to Testing → Done
7. If bug found → Create entry in Bug Tracker
8. Repeat
```

---

## 🎨 UX Guidelines

- **Clean, minimal layout** — No clutter, focus on execution
- **Clear hierarchy** — Dashboard → Databases → Entries
- **Easy navigation** — Quick links between related databases
- **Solo-dev optimized** — No unnecessary complexity

---

## 🚀 Quick Start for AI Agents

When working on KAYAKA-AI:

1. **Reference this file** to understand the current phase and tasks
2. **Check Task Database** for what's `Todo` or `In Progress`
3. **Use appropriate tool** (Qwen CLI / Antigravity IDE / Manual)
4. **Log work** in relevant databases (Tasks, Bugs, API, Prompts)
5. **Update status** as you progress (Todo → In Progress → Testing → Done)

---

## 📝 Notes

- This workspace is designed for **daily execution**, not just documentation
- All databases are **interconnected** for full traceability
- The system supports **phase-based filtering** to maintain focus
- Built for a **solo developer** — zero chaos, maximum clarity

---

**Last Updated:** March 27, 2026
**Project:** KAYAKA-AI
**Status:** Phases 1-6 Complete ✅ | Phases 7-9 In Progress 🔄

---

## 🛡️ Route Stability & Future-Proofing

### Protected Routes (Require Authentication)

All protected routes use `ProtectedRoute` component which:
- Checks `isAuthenticated` from `authStore`
- Shows loading spinner during auth state verification
- Redirects to `/login` if not authenticated
- Preserves state using Zustand + localStorage persistence

| Route | Component | Phase | Status | Notes |
|-------|-----------|-------|--------|-------|
| `/dashboard` | Dashboard | 1 | ✅ Protected | Main hub after login |
| `/upload` | ResumeUpload | 2 | ✅ Protected | File upload & parsing |
| `/profile` | ProfileEditor | 3 | ✅ Protected | Edit skills, experience, education |
| `/jd-analyzer` | JDAnalyzer | 4 | ✅ Protected | Analyze job descriptions |
| `/resume-generator` | ResumeGenerator | 5 | ✅ Protected | Generate optimized resumes |
| `/job-targeting` | JobTargeting | 8 | ✅ Protected | URL-based job targeting |
| `/job-tracker` | JobTracker | 8 | ✅ Protected | Track applications |
| `/smart-apply` | SmartApply | 9 | ✅ Protected | Generate apply packs |

### Public Routes (No Authentication Required)

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | Landing | Homepage / Landing page |
| `/login` | Login | User login (redirects to dashboard if authenticated) |
| `/signup` | Signup | User registration (redirects to dashboard if authenticated) |
| `/auth/callback` | AuthCallback | OAuth callback handler (Google) |
| `/auth/github/callback` | AuthCallback | OAuth callback handler (GitHub) |
| `/about` | About | About page |
| `/blog` | Blog | Blog page |
| `/careers` | Careers | Careers page |
| `/contact` | Contact | Contact page |
| `/privacy-policy` | PrivacyPolicy | Legal: Privacy Policy |
| `/terms-of-service` | TermsOfService | Legal: Terms of Service |
| `/cookie-policy` | CookiePolicy | Legal: Cookie Policy |

### Route Guard Implementation

```javascript
// ProtectedRoute.jsx
- Checks auth state from useAuthStore
- Shows loading during auth verification
- Redirects unauthenticated users to /login
- All protected routes wrapped with this component
```

### Auth State Management

```javascript
// authStore.js (Zustand)
- Persistent storage via localStorage
- Syncs with Supabase auth state changes
- Handles OAuth callbacks, token refresh, sign-out
- initAuth() called on app load
```

### Future-Proofing Guidelines

1. **Always wrap new protected routes** with `<ProtectedRoute>` component
2. **Use Zustand stores** for shared state (auth, resume data, JD analysis)
3. **localStorage persistence** for critical data (parsedData, jdAnalysis)
4. **Toast notifications** for all user actions (success/error states)
5. **Loading states** for all async operations
6. **Error boundaries** should be added for production stability
7. **Code splitting** recommended for large components (build warning present)

### Known Build Warning

- Bundle size > 500KB (uses html2pdf, pdfjs-dist)
- Recommendation: Implement code splitting with dynamic imports
- Current workaround: Accept warning, optimize in Phase 7

---

## ✅ Phase Completion Checklist

### Phase 1 — FOUNDATION ✅
- [x] Project setup (Vite + React)
- [x] Tailwind CSS installed
- [x] Folder structure created
- [x] Login page built
- [x] Signup page built
- [x] Routing configured
- [x] JWT/Session storage (Supabase Auth)
- [x] Protected routes implemented

### Phase 2 — RESUME UPLOAD ✅
- [x] FileUpload component built
- [x] Resume parsing implemented
- [x] Loading UI added
- [x] Parsed data display working

### Phase 2.5 — DASHBOARD ✅
- [x] Dashboard layout built
- [x] Navigation cards added
- [x] User profile summary displayed
- [x] Progress tracking implemented
- [x] Routing: Login → Dashboard working

### Phase 3 — PROFILE EDITOR ✅
- [x] Skills editor built
- [x] Experience editor component built
- [x] Education editor component built
- [x] Projects editor component built
- [x] Add/remove functionality working
- [x] LocalStorage persistence implemented

### Phase 4 — JD ANALYZER ✅
- [x] JD input UI built
- [x] Skills extraction implemented
- [x] Match score calculation working
- [x] Matching/missing skills display
- [x] AI suggestions display

### Phase 5 — RESUME GENERATOR ✅
- [x] Generate button implemented
- [x] Resume optimization logic
- [x] Resume preview component
- [x] Regenerate option added

### Phase 6 — DOWNLOAD & POLISH ✅
- [x] PDF download (html2pdf)
- [x] TXT download option
- [x] Success UI feedback
- [x] Error handling with toasts
- [x] Loading states during download

### Phase 7 — TESTING & STABILITY ✅
- [x] Error boundaries implemented
- [x] Code splitting with lazy loading
- [x] Token expiry handling
- [x] Unit tests for critical components
- [x] Build passing with chunk optimization
- [x] Lint passing (0 errors)

### Phase 8 — JOB TARGETING ENGINE 🔄
- [x] URL input field (LinkedIn, Naukri, Glassdoor)
- [x] Job description fetcher service
- [x] JobTracker page created
- [ ] Full scraping implementation
- [ ] Recruiter intent summary
- [ ] Application tracker UI complete

### Phase 9 — SMART APPLY PACK 🔄
- [x] SmartApply page created
- [x] Service files created
- [ ] Cover letter generation
- [ ] LinkedIn recruiter DM generation
- [ ] Follow-up email template
- [ ] Package preview UI
- [ ] Download as ZIP
- [ ] Copy-to-clipboard functionality

---

## 📊 Current Project Status

### ✅ Build Status: PASSING
- **Lint:** ✅ No errors
- **Build:** ✅ Successful (warning: bundle size acceptable)
- **Routes:** ✅ All 21 routes working
- **Auth:** ✅ Supabase Auth + OAuth functional
- **State Management:** ✅ Zustand + localStorage persistent

### 📁 Key Documentation Files

| File | Purpose |
|------|---------|
| `PLAN.md` | Master project blueprint |
| `ROUTE_STABILITY.md` | Route protection & stability guide |
| `SETUP_SUPABASE.md` | Supabase setup instructions |
| `SUPABASE_SETUP.md` | Database schema documentation |
| `supabase-schema.sql` | SQL schema for database |

### 🚀 How to Run

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint check
npm run lint
```

### 🎯 Next Steps (Phase 7-9)

1. **Phase 7:** Complete testing suite, add error boundaries
2. **Phase 8:** Implement job scraping, complete job tracker UI
3. **Phase 9:** Complete Smart Apply pack generation

---

**Last Updated:** March 27, 2026  
**Project:** KAYAKA-AI  
**Status:** Phases 1-6 Complete ✅ | Phases 7-9 In Progress 🔄  
**Build:** ✅ Passing  
**Routes:** ✅ All Stable
