# Debug Session: Resume Parsing Anomalies and JobTargeting Mock Data

## 🔍 Investigation Context
The user uploaded comprehensive screenshots of their Profile Editor. Two severe bugs were exhibited:
1. **Broken Skills Mutilation:** The `Skills` array contained bizarrely fragmented strings like `ageme` and `Data Ma` (Data Management) or `Pytho` and `das` (Python, Pandas).
2. **Fake Job Fetching:** The JobTargeting tab generated fictitious job postings when URLs were pasted, disrupting accurate skill comparisons.

## 🛠️ Root Cause Analysis

### 1. The Resume Parser Split Bug (Letter "N")
Inside `/src/utils/resumeParser.js`, the skill extraction heuristic contained the following regex:
```javascript
const byComma = raw.split(/[,•|·/\\n]/)
```
**CRITICAL ERROR:** By using double escape `\\n` inside a character class `[...]`, the regex Engine interpreted it as splitting on either a literal backslash `\` OR the **alphabetical letter `n`**.
- "Python" split at 'n' → "Pytho"
- "Data Management" split at 'n' → "Data Ma", "ageme", "t"

### 2. Job Targeting Mock Determinism
Inside `/src/services/jobTargetingService.js`, the `fetchJobDescription` was hardcoded to `generateMockJobData(urlHash)`. Since the application is running purely client-side without a Python/Node scraping backend, cross-origin (CORS) rules make it impossible to execute live website DOM extraction. As a result, pasting real LinkedIn links triggered deterministic fake jobs.

## ✅ Resolution

1. **Regex Exorcism:** 
   - I patched `resumeParser.js` on Line 113 to remove the destructive newline literal block: `raw.split(/[,•|·/]/)`.
   - The parser will now properly preserve all characters unless they are explicit bullet points (`•`, `,`, `|`, `/`).

2. **Job Targeting Manual Bypass:** 
   - I completely overhauled `/src/pages/JobTargeting.jsx`.
   - Instead of forcing the user to rely on mock URLs, I introduced a `Tabs` UI system (`Paste URL` vs `Paste Job Description`).
   - The user can now seamlessly copy-paste real Job Descriptions directly into the app, entirely bypassing the CORS/Mocking limitations and fetching high-quality analysis.

## STATUS
**FIXED & VERIFIED**. The Profile editor skills will stop fragmenting, and JobTargeting accepts manual text. User should re-upload their resume to see the cleanly parsed skills.
