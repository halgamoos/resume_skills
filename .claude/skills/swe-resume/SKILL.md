---
name: swe-resume
description: >
  Use this skill whenever a software engineer asks to create, update, improve, or rewrite their resume,
  CV, or job application documents. Trigger on any of: "build my resume", "update my resume",
  "write a resume", "resume for software engineer", "SWE resume", "tech resume", "resume from my
  markdown", "convert my resume", "make my resume ATS-friendly", "help me apply for jobs",
  "resume for [company] role", or any mention of wanting a .docx resume. Also trigger when the user
  shares a Markdown resume or LinkedIn-style bio and wants a polished output. This skill produces
  ATS-optimized, professionally formatted .docx resumes following software engineering best practices.
  Always use this skill over generic docx creation when the topic is resumes or job applications.
---

# SWE Resume Skill

Creates professional, ATS-optimized `.docx` resumes for software engineers. The output is a
single-column Word document designed to pass automated resume screeners (Greenhouse, Lever, Workday,
iCIMS, Taleo) while also looking clean when read by humans.

---

## Workflow

1. **Check for corpus** — look for `corpus/` directory in the project root (see Corpus section below)
2. **Gather content** — read corpus files first, then interview the user only for gaps
3. **Choose output format** — default to `.docx`; switch to PDF if the user asks for PDF or says they can't open/convert Word files
4. **Build the resume** — follow the Layout and Formatting rules below; use `build_resume.example.mjs` for `.docx` and `build_resume_pdf.example.mjs` for PDF as your code reference
5. **Validate & deliver** — run the generated script with `node build_resume[_pdf].mjs`, confirm the file lands in `output/`, present to user
6. **Offer corpus update** — after delivery, ask if anything new should be logged back to the corpus

---

## Corpus

Before interviewing the user, check for a `corpus/` directory in the project root. These files
are the user's running log of work history and should be treated as the primary source of truth.

**Expected structure:**
```
corpus/
├── microsoft.md       ← work log per employer (or one file per company)
├── projects.md        ← side projects, open source
└── skills.md          ← tech inventory, certifications
```

**How to use the corpus:**
- Read all corpus files before asking the user anything
- Extract projects, metrics, tech stack, dates, and impact from the logs
- Only ask the user about things that are missing or ambiguous in the corpus
- Prefer corpus data over resume data if they conflict — the corpus is more up to date
- When no corpus exists, fall through to the Interview Checklist below

**After resume delivery — corpus update prompt:**
Always end the session by asking: *"Want me to log anything from today's session back to your
corpus?"* If yes, append new entries to the relevant corpus file in the proper format. Never
overwrite existing entries — only append.

---

## Interview Checklist

Use this only when no corpus exists, or to fill gaps the corpus doesn't cover.
Collect as much as possible before starting — don't make assumptions about seniority, stack, or dates.

**Required:**
- Full name, email, phone, LinkedIn URL, GitHub URL (optional), location (city/state or "Remote")
- Target role / job title (e.g. "Senior Backend Engineer", "Staff SWE", "ML Engineer")
- Work experience: for each job → company, title, dates (month/year), 3–6 bullet points
- Education: school, degree, graduation year (GPA optional; include if > 3.5 and < 3 years out)
- Skills: programming languages, frameworks, tools, platforms, cloud providers

**Optional but high-impact:**
- Notable projects (especially open source or side projects with metrics/links)
- Certifications or publications
- Whether they want a summary/objective at the top

---

## ATS Rules (NEVER violate these)

- **Single-column layout only** — multi-column kills ATS parsing
- **No text boxes, no headers/footers for key content** — ATS often can't read these
- **No tables for layout** — tables are fine for skill grids but not for page structure
- **Standard section headings** — use exact phrases: `Experience`, `Education`, `Skills`, `Projects`, `Certifications`
- **Dates must be parseable** — format: `Jan 2021 – Mar 2024` or `2021 – Present`
- **No icons, logos, or decorative graphics** — plain text only
- **Fonts: Arial or Calibri only** — exotic fonts embed as images in some converters
- **File: .docx, not .pdf** — unless the user explicitly wants PDF; docx is safer for ATS

---

## Layout & Section Order

```
[Name]                           [email | phone | LinkedIn | GitHub | Location]
─────────────────────────────────────────────────────────────────────────────
[Summary - optional, 2-3 sentences]

EXPERIENCE
  Company Name                                         Month Year – Month Year
  Job Title
  • Bullet (led, built, reduced, increased — strong verb + metric)
  • Bullet
  ...

SKILLS
  Languages:   Python, Go, TypeScript, Rust
  Frameworks:  FastAPI, React, gRPC, Kubernetes
  Tools/Cloud: AWS (EC2, S3, Lambda), GCP, Terraform, Docker

PROJECTS (optional)
  Project Name | github.com/user/project                               Year
  • One-line description with tech stack and outcome

EDUCATION
  University Name                                                      Year
  B.S. / M.S. in Computer Science (or relevant field)

CERTIFICATIONS (optional)
```

---

## Formatting Spec

Use the `docx` npm library (see docx SKILL.md). Key settings:

```javascript
// Page: US Letter, tight margins for SWE resume
page: {
  size: { width: 12240, height: 15840 },       // US Letter
  margin: { top: 720, right: 900, bottom: 720, left: 900 }  // 0.5" top/bottom, 0.625" sides
}

// Name: large, bold, centered or left-aligned
// Font: Arial throughout
// Name size: 28–32pt
// Section headers: 11pt, ALL CAPS, bold, with bottom border line
// Body text: 10–10.5pt
// Bullet indent: left: 360, hanging: 180 (DXA)
// Line spacing: 1.15x, spacing.after: 60 for bullets, 120 between sections
```

### Section Header Style

```javascript
// Section headers use a bottom border as a visual divider (NOT a table)
new Paragraph({
  children: [new TextRun({ text: "EXPERIENCE", bold: true, size: 22, font: "Arial" })],
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "2C2C2C", space: 1 } },
  spacing: { before: 200, after: 100 }
})
```

### File naming (always dynamic — never hardcode)

```javascript
// At the top of the constants block — derive filename from these two values
const NAME = "Candidate Full Name";   // ← fill in from interview/corpus
const DATE = new Date().toISOString().slice(0, 10);  // always runtime, never a literal date
const FILENAME = `${NAME.replace(/ /g, "_")}_Resume_${DATE}.docx`;
```

- `NAME` must be used in both the document `TextRun` and the output filename — never duplicate the string
- `DATE` must always be computed at runtime — never a hardcoded string like `"2025-01-01"`

### Bullet Points

```javascript
// Always use LevelFormat.BULLET with numbering config — NEVER unicode bullets
numbering: {
  config: [{
    reference: "resume-bullets",
    levels: [{
      level: 0,
      format: LevelFormat.BULLET,
      text: "•",
      alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 360, hanging: 180 } } }
    }]
  }]
}
```

---

## Writing Strong Bullets

Apply these patterns when rewriting or improving the user's bullet points:

**Formula:** `Strong verb + what you built/did + measurable outcome`

| Weak | Strong |
|------|--------|
| Worked on microservices | Decomposed monolithic API into 12 microservices, reducing deploy time by 60% |
| Fixed performance issues | Profiled and optimized PostgreSQL queries, cutting p99 latency from 800ms to 90ms |
| Helped with ML pipeline | Co-designed training pipeline on AWS SageMaker processing 2TB/day of user events |
| Built internal tool | Built internal CI dashboard (React + FastAPI) adopted by 40+ engineers |

**Strong verbs by category:**
- Architecture: Designed, Architected, Led, Established
- Building: Built, Implemented, Developed, Shipped, Launched
- Improving: Optimized, Reduced, Improved, Refactored, Migrated
- Scaling: Scaled, Grew, Expanded, Automated
- Collaboration: Mentored, Partnered, Coordinated, Drove

---

## Skills Section Format

Group skills into categories. Don't just dump a keyword list — ATS can parse categories fine
and it reads better to humans.

```
Languages:    Python, TypeScript, Go, Java, SQL
Frameworks:   FastAPI, React, gRPC, Spring Boot, PyTorch
Infra/Cloud:  AWS (EC2, RDS, Lambda, S3), Kubernetes, Terraform, Docker
Tools:        Git, GitHub Actions, Datadog, Grafana, Jira
```

---

## PDF Generation

Use `pdfkit` (already in `package.json`) when the user requests PDF output or cannot convert from Word.
Reference `build_resume_pdf.example.mjs` for the full working template. Key points:

```javascript
import PDFDocument from "pdfkit";
import { createWriteStream, mkdirSync } from "fs";

// US Letter: 612 × 792 points (72pt = 1 inch)
const ML = 63; const MR = 63; const W = 612 - ML - MR;  // 486pt content width

const doc = new PDFDocument({
  size: "LETTER",
  margins: { top: 50, bottom: 50, left: ML, right: MR },
  info: { Title: `${NAME} Resume`, Author: NAME, Subject: "Software Engineer Resume" },
});
```

**pdfkit font names** (built-in, no install needed):
- `"Helvetica"` — body text (visually identical to Arial)
- `"Helvetica-Bold"` — bold
- `"Helvetica-Oblique"` — italic

**Section divider line** (replaces the docx bottom border):
```javascript
doc.font("Helvetica-Bold").fontSize(11).text(text);
doc.moveTo(ML, doc.y + 1).lineTo(ML + W, doc.y + 1).lineWidth(0.75).stroke("#2C2C2C");
```

**Same-line left + right text** (company/dates, etc.):
```javascript
const y = doc.y;
doc.font("Helvetica-Bold").text(leftText, ML, y);
doc.font("Helvetica").fillColor("#555555").text(rightText, ML, y, { width: W, align: "right" });
```

**Bullet list:**
```javascript
doc.font("Helvetica").fontSize(10)
   .list(items, { bulletRadius: 1.5, textIndent: 12, bulletIndent: 3, lineGap: 2 });
```

**Write output** (always async with a stream):
```javascript
mkdirSync("output", { recursive: true });
const stream = createWriteStream(`output/${FILENAME}`);
await new Promise((resolve, reject) => {
  stream.on("finish", resolve);
  stream.on("error", reject);
  doc.pipe(stream);
  doc.end();
});
```

**ATS notes for PDF:** pdfkit produces real-text PDFs (not images), so text is fully parseable.
Contact line should be plain centered text — URL and email hyperlink annotations are cosmetic only.

---

## References

- `.docx` template → `build_resume.example.mjs`
- PDF template → `build_resume_pdf.example.mjs`

---

## Validation & Output

After generating:
1. Run `node build_resume.mjs` (or `node build_resume_pdf.mjs` for PDF)
2. Confirm the file appears in `output/` with the correct name
3. Present the path to the user

The generated scripts write to `output/` automatically — no manual copy step needed.
