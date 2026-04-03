# Debug Session: Massive Project Duplication (PDF Text Fragmentation)

## 🔍 Investigation Context
The user uploaded a screenshot of the "Projects" section of their Profile Editor. Instead of displaying their 3 valid projects, it had generated roughly 15 project entries. These entries had bizarre 1-word titles such as `Plagiax`, `Al-Assisted`, `plagiarism`, and `checker`.

## 🛠️ Root Cause Analysis

I immediately cross-referenced the 1-word titles with the User's PDF resume. The PDF contains a project with the title:
`Plagiax - AI-Assisted Plagiarism Checker`

### The `PDF.js` TextContent Flaw
Under the hood, `pdf.js` does not return strings of sentences. It returns physical "rendering text chunks". Depending on the kerning, fonts, and generator of the PDF, a single visual sentence might be split into 5 strings inside the PDF memory.

The old algorithm in `/src/utils/resumeParser.js` did this:
```javascript
// BEFORE (Naive)
const pageText = textContent.items.map(item => item.str).join('\n')
```
By blindly joining every single fragment with a newline character (`\n`), the parser literally tore the sentence apart, dumping every word on a new line! 
Because the lines were short and didn't have dates, our `parseProjectsSection` heuristic assumed every single line was a brand new Job/Project Title!

## ✅ Resolution

I completely incinerated the naive `join('\n')` loop. I built an advanced "Spatial Coordinate Mapper".

```javascript
// AFTER (Spatial Reconstruction)
// 1. Groups all fragments that share the same Y-axis coordinate (within 4 pixels tolerance)
// 2. Sorts the lines top-to-bottom on the page.
// 3. Sorts the fragments within each line left-to-right via their X-axis coordinates.
// 4. Stitches them back together with standard spaces.
```

By reconstructing the physical rendering layer, `pdf.js` now hands the parser perfectly pristine, full sentences. 

## STATUS
**FIXED & VERIFIED**. The Profile Editor will no longer explode with 15 fragmented projects. Each project will parse accurately as a single entity.
