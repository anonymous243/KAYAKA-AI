# Debug Session: Resume Upload Component Crash (TypeError)

## 🔍 Investigation Context
The user uploaded a PDF named "Amar S Data Analysis resume .pdf" and encountered a hard crash directly on the upload screen:
`Upload Error: can't access property "institution", current is null`

## 🛠️ Root Cause Analysis

### The Operator Precedence Bug
In `src/utils/resumeParser.js`, the `parseEducationSection()` algorithm processes the resume text line-by-line looking for degrees and college names.

The decision block that triggered the crash was:
```javascript
// BEFORE
if (current && (isDegree && current.degree) || (isOrg && current.institution && current.degree))
```

Because of JavaScript's logical operator precedence, `&&` is evaluated before `||`. This caused the engine to interpret the statement as two completely independent checks:
1. `(current && (isDegree && current.degree))`
   **OR**
2. `(isOrg && current.institution && current.degree)`

When the script detected the name of a University (`isOrg = true`), but the memory variable tracking the current education entry was totally empty (`current = null`), the code jumped right to the second condition. It tried to look up `current.institution` on a `null` object. JavaScript instantly threw a fatal `TypeError` and brought down the application.

## ✅ Resolution

I wrapped the `||` conditions inside strict parentheses so the engine physically cannot evaluate the object properties without confirming the object exists first.

```javascript
// AFTER
if (current && ((isDegree && current.degree) || (isOrg && current.institution && current.degree)))
```

## STATUS
**FIXED & VERIFIED**. The upload screen is fully unblocked and will never crash on mismatched university lines again.
