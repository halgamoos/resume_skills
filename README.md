# resume_skills

A Claude Code workspace for building software engineer resumes using the `swe-resume` skill. Claude interviews you about your experience, reads your structured work history corpus, and generates a polished `.docx` resume.

---

## How it works

1. **Corpus** (`corpus/`) — Your running log of work history. Fill this out as you ship things so Claude has rich context before it asks you anything. _This folder is personal — see note below._
2. **Skill** (`.claude/skills/swe-resume/`) — The `swe-resume` Claude Code skill that drives the interview and resume generation workflow.
3. **Build script** (`build_resume.mjs`) — A Node.js script Claude generates for you during the session. It contains your personal resume content and is gitignored — see `build_resume.example.mjs` for the expected shape.
4. **Output** (`output/`) — Where finished resumes land, named `YourName_Resume_YYYY-MM-DD.docx`. _This folder is personal — see note below._

---

## Getting started

### Prerequisites

- [Claude Code](https://claude.ai/code) CLI installed and authenticated
- Node.js 18+

### Setup

```bash
npm install
```

### Usage

1. Open this folder in Claude Code
2. Say: `build my resume` or `update my resume`
3. Claude will read your corpus files first, then interview you only for gaps
4. A `.docx` resume is saved to `output/`

---

## Corpus structure

The `corpus/` folder is your personal work history log. Create one `.md` file per employer:

```
corpus/
├── company-name.md    ← one file per employer
├── projects.md        ← side projects, open source contributions
└── skills.md          ← tech inventory, certifications, tools
```

Log things as you ship them — don't wait until job hunting season. Even rough notes are enough; Claude polishes them into resume bullets. The more detail you keep here, the less Claude needs to ask you.

> **Your corpus files stay local.** Everything inside `corpus/` is listed in `.gitignore` and is never committed. It is personal data — your projects, metrics, team details, and impact numbers. The folder itself is tracked (via `.gitkeep`) so others can see the structure, but the contents are yours alone.

---

## Output folder

Generated `.docx` resumes are saved to `output/` with the format `YourName_Resume_YYYY-MM-DD.docx`.

> **Your output files stay local.** Everything inside `output/` is listed in `.gitignore` and is never committed. The folder itself is tracked (via `.gitkeep`) so the structure is clear, but your actual resumes never leave your machine.

---

## Want to use this yourself?

**Fork this repo.** Then:

1. Clone your fork locally
2. Run `npm install`
3. Create your corpus files in `corpus/` (they'll never be committed)
4. Open in Claude Code and say `build my resume`

Your personal data stays entirely on your machine. This repo only ever contains the skill, the build tooling, and empty placeholder folders.

---

## Customizing

- **Resume layout and bullets** — edit `build_resume.mjs` (your local generated copy) or `build_resume.example.mjs` to change the template Claude follows
- **Interview behavior and writing rules** — edit `.claude/skills/swe-resume/SKILL.md`
- **Work history** — add files to `corpus/` (gitignored, stays local)
