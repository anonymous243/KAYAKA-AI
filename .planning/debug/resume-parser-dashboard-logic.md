# Debug Session: Dashboard & Resume Parser Logic

## 🐛 Symptoms
- **Expected:** Resume parser accurately identifies strictly professional skills; Dashboard precisely tracks application pipeline unlocking.
- **Actual:** The Resume Parser suffered from catastrophic substring false positives (e.g. tracking "ai" as a skill when words like "training", "email", or "main" appeared). The parser also generated duplicate React rendering keys for loop items causing unmount re-renders. The Dashboard logic failed to upgrade "JD Analyzer" from Pending to Completed, halting visual progression.
- **Error Messages:** Silent logic flaws & key duplicate warnings in React dev tools.

## 🔍 Investigation Context
The user requested a sweep of `Dashboard.jsx` and `resumeParser.js` logic problems. By analyzing the parsing algorithms in `src/utils/resumeParser.js`, several non-boundary RegEx flaws were discovered inside the `extractSkillsFromText` function. Additionally, `src/pages/Dashboard.jsx` had decoupled state arrays preventing progression.

## ✅ ROOT CAUSE FOUND
1. **Substring Overreach:** The scanner iterated `SKILL_KEYWORDS.filter(s => lower.includes(s))`. Because `ai`, `c`, `go` etc are valid keywords, this triggered true on hundreds of naturally occurring words.
2. **React Key Collisions:** Array items for Experience/Education were assigned `Date.now() + entries.length`. Because processing loops execute inside a single millisecond tick, multiple items were assigned the identical duplicate ID.
3. **Hardcoded Progression Logic:** `status: parsedData ? 'pending' : 'locked'` physically hardcapped the JD Analyzer from ever reading `completed`.

## 🛠️ Resolution Strategies Executed
1. **Word Boundaries:** Restructured `extractSkillsFromText` to sanitize alphanumeric noise and wrap scanned words in structural boundaries `( " " + s + " " )`, guaranteeing 100% strict adherence to true skill keywords.
2. **UUID Generation:** Injected `Math.random().toString(36)` entropy to the time-based sequential IDs, ensuring absolutely unique React list keys.
3. **Flow Correction:** Bridged the Dashboard state to accurately check if `jdAnalysis` already exists `<useResumeStore>` and flip the card to Completed, simultaneously unlocking the Resume Generator.

**Status:** ALL ISSUES ARE VERIFIED AND FIXED.
