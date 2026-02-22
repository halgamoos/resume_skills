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
3. **Consult the docx skill** — read `/mnt/skills/public/docx/SKILL.md` before writing any code
4. **Build the resume** — follow the Layout and Formatting rules below
5. **Validate & deliver** — run validation, copy to `/mnt/user-data/outputs/`, present to user
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

## References

- For docx creation mechanics, tables, styles, bullet lists → `/mnt/skills/public/docx/SKILL.md`
- For PDF export if requested → `/mnt/skills/public/pdf/SKILL.md`

---

## Validation & Output

After generating:
1. Run `python scripts/office/validate.py resume.docx`
2. Fix any validation errors before presenting
3. Copy final file to `/mnt/user-data/outputs/[Name]_Resume.docx`
4. Present with `present_files` tool

Remind the user: if they want a PDF version, export from Word/Google Docs (not a converter)
for best ATS compatibility.
