import {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  BorderStyle, LevelFormat, TabStopType, ExternalHyperlink
} from "docx";
import { writeFileSync, mkdirSync } from "fs";

// ── Constants ─────────────────────────────────────────────────────────────────
const FONT = "Arial";
const BODY_SIZE = 20;      // 10pt in half-points
const HEADER_SIZE = 22;    // 11pt
const NAME_SIZE = 56;      // 28pt
// Content width = page width (12240) - left margin (900) - right margin (900)
const RIGHT_TAB = 10440;

// ── Numbering config ──────────────────────────────────────────────────────────
const numberingConfig = {
  config: [
    {
      reference: "resume-bullets",
      levels: [
        {
          level: 0,
          format: LevelFormat.BULLET,
          text: "\u2022",
          alignment: AlignmentType.LEFT,
          style: {
            paragraph: {
              indent: { left: 360, hanging: 180 },
            },
          },
        },
      ],
    },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function sectionHeader(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: HEADER_SIZE, font: FONT })],
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: "2C2C2C", space: 1 },
    },
    spacing: { before: 240, after: 100 },
  });
}

function jobHeader(company, location, title, dates) {
  return [
    new Paragraph({
      children: [
        new TextRun({ text: company, bold: true, size: BODY_SIZE, font: FONT }),
        new TextRun({ text: "\t", size: BODY_SIZE, font: FONT }),
        new TextRun({ text: location, size: BODY_SIZE, font: FONT, color: "555555" }),
      ],
      tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }],
      spacing: { before: 120, after: 0 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: title, bold: true, size: BODY_SIZE, font: FONT, italics: true }),
        new TextRun({ text: "\t", size: BODY_SIZE, font: FONT }),
        new TextRun({ text: dates, size: BODY_SIZE, font: FONT, color: "555555" }),
      ],
      tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }],
      spacing: { before: 0, after: 60 },
    }),
  ];
}

function bullet(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: BODY_SIZE, font: FONT })],
    numbering: { reference: "resume-bullets", level: 0 },
    spacing: { before: 0, after: 60 },
  });
}

function skillRow(label, value) {
  return new Paragraph({
    children: [
      new TextRun({ text: label, bold: true, size: BODY_SIZE, font: FONT }),
      new TextRun({ text: value, size: BODY_SIZE, font: FONT }),
    ],
    spacing: { before: 0, after: 60 },
  });
}

function sep() {
  return new TextRun({ text: "  |  ", size: BODY_SIZE, font: FONT, color: "888888" });
}

function hyperlink(displayText, url) {
  return new ExternalHyperlink({
    link: url,
    children: [
      new TextRun({
        text: displayText,
        size: BODY_SIZE,
        font: FONT,
        color: "1155CC",
        underline: { type: "single" },
      }),
    ],
  });
}

// ── Document ──────────────────────────────────────────────────────────────────
const doc = new Document({
  numbering: numberingConfig,
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 720, right: 900, bottom: 720, left: 900 },
        },
      },
      children: [

        // ── Name ──────────────────────────────────────────────────────────────
        new Paragraph({
          children: [
            new TextRun({ text: "Hamza Algamoos", bold: true, size: NAME_SIZE, font: FONT }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 80 },
        }),

        // ── Contact (no location) ──────────────────────────────────────────────
        new Paragraph({
          children: [
            hyperlink("halgamoos@gmail.com", "mailto:halgamoos@gmail.com"),
            sep(),
            new TextRun({ text: "718-916-2524", size: BODY_SIZE, font: FONT }),
            sep(),
            hyperlink("linkedin.com/in/hamza-algamoos", "https://www.linkedin.com/in/hamza-algamoos/"),
            sep(),
            hyperlink("github.com/Halgamoos", "https://github.com/Halgamoos"),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 160 },
        }),

        // ── EXPERIENCE ────────────────────────────────────────────────────────
        sectionHeader("EXPERIENCE"),

        // Microsoft — Full-time SWE
        ...jobHeader(
          "Microsoft",
          "Redmond, WA",
          "Software Engineer — M365 Search",
          "May 2024 – Present"
        ),
        bullet(
          "Architected the Semantic Fabric Platform, a client-driven vector embedding onboarding framework enabling flexible, item-level integration of any content for semantic indexing; adopted by 4 teams under the VP of Semantic and Lexical Ingestion."
        ),
        bullet(
          "Designed an extensible model abstraction layer supporting OpenAI text-embedding-3-large and internal Microsoft embedding models (FBV8, FBV4), establishing the org-wide standard for vector model onboarding across M365 Search."
        ),
        bullet(
          "Integrated MinMax quantized indexing into the M365 Semantic Index, reducing storage by 40% and DRAM memory consumption while preserving 99% recall."
        ),
        bullet(
          "Ranked #1 code contributor out of 45 engineers under skip-level manager, consistently delivering high-velocity production changes across C#, .NET, and Rust codebases."
        ),

        // Microsoft — Intern 2023
        ...jobHeader(
          "Microsoft",
          "Redmond, WA",
          "Software Engineer Intern — M365 Search",
          "Jun 2023 – Aug 2023"
        ),
        bullet(
          "Optimized the M365 Search Data Shard Management Service to increase queries per second (QPS) with reduced processing time and resource usage."
        ),
        bullet(
          "Implemented an In-Place Upscaling solution for Query Shards that lowered infrastructure resource consumption by up to 35%."
        ),

        // Microsoft — Intern 2022
        ...jobHeader(
          "Microsoft",
          "Redmond, WA",
          "Software Engineer Intern — M365",
          "Jun 2022 – Aug 2022"
        ),
        bullet(
          "Integrated Azure Chaos Studio API into the M365 Repair Management Service to improve resilience by simulating fault injection and outage scenarios."
        ),
        bullet(
          "Built an SDK in C# to interact with the Chaos fault injection REST API and identity provider, enabling automated chaos experiments at scale."
        ),

        // Microsoft — New Technologist
        ...jobHeader(
          "Microsoft",
          "Redmond, WA (Remote)",
          "New Technologist Intern",
          "Jun 2021 – Aug 2021"
        ),
        bullet(
          "Developed a web app MVP with a cross-functional team of 5 focused on building community empathy through shared cultural experiences."
        ),
        bullet(
          "Conducted usability tests, empathy mapping, and user persona research to improve product user flow, guided by coaching from a senior SWE and PM."
        ),

        // ── SKILLS ────────────────────────────────────────────────────────────
        sectionHeader("SKILLS"),
        skillRow("Languages: ", "C#, Rust, Python, JavaScript, C++, PowerShell, HTML, CSS"),
        skillRow("Frameworks: ", ".NET Core, ASP.NET Core, React, Node.js, Protocol Buffers"),
        skillRow("Infra / Cloud: ", "Azure, Azure Chaos Studio, REST APIs, Git"),
        skillRow("Domains: ", "Semantic Search, Vector Embeddings, Distributed Systems, ML Indexing, ANN (Approximate Nearest Neighbor)"),

        // ── EDUCATION ─────────────────────────────────────────────────────────
        sectionHeader("EDUCATION"),
        new Paragraph({
          children: [
            new TextRun({ text: "CUNY Hunter College", bold: true, size: BODY_SIZE, font: FONT }),
            new TextRun({ text: "\t", size: BODY_SIZE, font: FONT }),
            new TextRun({ text: "Jan 2024", size: BODY_SIZE, font: FONT, color: "555555" }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }],
          spacing: { before: 120, after: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "B.A., Computer Science", size: BODY_SIZE, font: FONT, italics: true }),
          ],
          spacing: { before: 0, after: 60 },
        }),

      ],
    },
  ],
});

// ── Write file ────────────────────────────────────────────────────────────────
const DATE = "2026-02-21";
const FILENAME = `Hamza_Algamoos_Resume_${DATE}.docx`;

mkdirSync("output", { recursive: true });
const buf = await Packer.toBuffer(doc);
writeFileSync(`output/${FILENAME}`, buf);
console.log(`Done → output/${FILENAME}`);
