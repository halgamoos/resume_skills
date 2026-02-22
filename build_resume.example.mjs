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
const NAME = "Jane Smith";  // ← Claude fills this in from your corpus/interview

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
            new TextRun({ text: NAME, bold: true, size: NAME_SIZE, font: FONT }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 80 },
        }),

        // ── Contact ───────────────────────────────────────────────────────────
        new Paragraph({
          children: [
            hyperlink("jane@example.com", "mailto:jane@example.com"),
            sep(),
            new TextRun({ text: "555-123-4567", size: BODY_SIZE, font: FONT }),
            sep(),
            hyperlink("linkedin.com/in/janesmith", "https://www.linkedin.com/in/janesmith/"),
            sep(),
            hyperlink("github.com/janesmith", "https://github.com/janesmith"),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 160 },
        }),

        // ── EXPERIENCE ────────────────────────────────────────────────────────
        sectionHeader("EXPERIENCE"),

        ...jobHeader(
          "Acme Corp",
          "Seattle, WA",
          "Senior Software Engineer",
          "Jan 2022 – Present"
        ),
        bullet(
          "Designed and shipped a distributed rate-limiting service handling 500K req/s, reducing downstream failures by 70%."
        ),
        bullet(
          "Led migration of monolithic API to microservices across 6 teams, cutting average deploy time from 45 min to 8 min."
        ),
        bullet(
          "Mentored 3 junior engineers; 2 promoted within the year."
        ),

        ...jobHeader(
          "Acme Corp",
          "Seattle, WA",
          "Software Engineer Intern",
          "Jun 2021 – Aug 2021"
        ),
        bullet(
          "Built an internal observability dashboard (React + FastAPI) adopted by 30+ engineers within the quarter."
        ),

        // ── SKILLS ────────────────────────────────────────────────────────────
        sectionHeader("SKILLS"),
        skillRow("Languages: ", "Python, TypeScript, Go, SQL"),
        skillRow("Frameworks: ", "FastAPI, React, gRPC, Kubernetes"),
        skillRow("Infra / Cloud: ", "AWS (EC2, S3, Lambda), Terraform, Docker, Git"),

        // ── EDUCATION ─────────────────────────────────────────────────────────
        sectionHeader("EDUCATION"),
        new Paragraph({
          children: [
            new TextRun({ text: "State University", bold: true, size: BODY_SIZE, font: FONT }),
            new TextRun({ text: "\t", size: BODY_SIZE, font: FONT }),
            new TextRun({ text: "May 2022", size: BODY_SIZE, font: FONT, color: "555555" }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }],
          spacing: { before: 120, after: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "B.S., Computer Science", size: BODY_SIZE, font: FONT, italics: true }),
          ],
          spacing: { before: 0, after: 60 },
        }),

      ],
    },
  ],
});

// ── Write file ────────────────────────────────────────────────────────────────
const DATE = new Date().toISOString().slice(0, 10);
const FILENAME = `${NAME.replace(/ /g, "_")}_Resume_${DATE}.docx`;

mkdirSync("output", { recursive: true });
const buf = await Packer.toBuffer(doc);
writeFileSync(`output/${FILENAME}`, buf);
console.log(`Done → output/${FILENAME}`);
