import PDFDocument from "pdfkit";
import { createWriteStream, mkdirSync } from "fs";

// ── Constants ─────────────────────────────────────────────────────────────────
const NAME = "Jane Smith";  // ← Claude fills this in from your corpus/interview
const DATE = new Date().toISOString().slice(0, 10);
const FILENAME = `${NAME.replace(/ /g, "_")}_Resume_${DATE}.pdf`;

// US Letter: 612 × 792 points (72pt = 1 inch).
// Margins match the .docx template: 0.5" top/bottom, 0.875" sides.
const ML = 63;              // left  margin
const MR = 63;              // right margin
const W  = 612 - ML - MR;  // usable content width = 486pt

const doc = new PDFDocument({
  size: "LETTER",
  margins: { top: 50, bottom: 50, left: ML, right: MR },
  info: {
    Title:   `${NAME} Resume`,
    Author:  NAME,
    Subject: "Software Engineer Resume",
    Creator: "resume_skills",
  },
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function sectionHeader(text) {
  doc
    .moveDown(0.5)
    .font("Helvetica-Bold").fontSize(11).fillColor("black")
    .text(text);
  doc
    .moveTo(ML, doc.y + 1)
    .lineTo(ML + W, doc.y + 1)
    .lineWidth(0.75)
    .stroke("#2C2C2C");
  doc.moveDown(0.35);
}

function jobHeader(company, location, title, dates) {
  const y1 = doc.y;
  doc.font("Helvetica-Bold").fontSize(10).fillColor("black").text(company, ML, y1);
  doc.font("Helvetica").fontSize(10).fillColor("#555555").text(location, ML, y1, { width: W, align: "right" });
  doc.fillColor("black");

  const y2 = doc.y + 1;
  doc.font("Helvetica-Oblique").fontSize(10).fillColor("black").text(title, ML, y2);
  doc.font("Helvetica").fontSize(10).fillColor("#555555").text(dates, ML, y2, { width: W, align: "right" });
  doc.fillColor("black").moveDown(0.15);
}

function bullets(items) {
  doc
    .font("Helvetica").fontSize(10).fillColor("black")
    .list(items, { bulletRadius: 1.5, textIndent: 12, bulletIndent: 3, lineGap: 2 });
  doc.moveDown(0.15);
}

function skillRow(label, value) {
  doc
    .font("Helvetica-Bold").fontSize(10).fillColor("black")
    .text(label, { continued: true });
  doc.font("Helvetica").text(value);
  doc.moveDown(0.05);
}

// ── Document ──────────────────────────────────────────────────────────────────

// Name
doc
  .font("Helvetica-Bold").fontSize(28).fillColor("black")
  .text(NAME, ML, 50, { width: W, align: "center" });
doc.moveDown(0.25);

// Contact — plain text, centered; ATS reads URLs and email from raw text
doc
  .font("Helvetica").fontSize(10).fillColor("black")
  .text(
    "jane@example.com  |  555-123-4567  |  linkedin.com/in/janesmith  |  github.com/janesmith",
    ML, doc.y, { width: W, align: "center" }
  );
doc.moveDown(0.5);

// ── EXPERIENCE ────────────────────────────────────────────────────────────────
sectionHeader("EXPERIENCE");

jobHeader("Acme Corp", "Seattle, WA", "Senior Software Engineer", "Jan 2022 – Present");
bullets([
  "Designed and shipped a distributed rate-limiting service handling 500K req/s, reducing downstream failures by 70%.",
  "Led migration of monolithic API to microservices across 6 teams, cutting average deploy time from 45 min to 8 min.",
  "Mentored 3 junior engineers; 2 promoted within the year.",
]);

jobHeader("Acme Corp", "Seattle, WA", "Software Engineer Intern", "Jun 2021 – Aug 2021");
bullets([
  "Built an internal observability dashboard (React + FastAPI) adopted by 30+ engineers within the quarter.",
]);

// ── SKILLS ────────────────────────────────────────────────────────────────────
sectionHeader("SKILLS");
skillRow("Languages: ",   "Python, TypeScript, Go, SQL");
skillRow("Frameworks: ",  "FastAPI, React, gRPC, Kubernetes");
skillRow("Infra / Cloud: ", "AWS (EC2, S3, Lambda), Terraform, Docker, Git");

// ── EDUCATION ─────────────────────────────────────────────────────────────────
sectionHeader("EDUCATION");
const eduY = doc.y;
doc.font("Helvetica-Bold").fontSize(10).fillColor("black").text("State University", ML, eduY);
doc.font("Helvetica").fontSize(10).fillColor("#555555").text("May 2022", ML, eduY, { width: W, align: "right" });
doc.fillColor("black").moveDown(0.15);
doc.font("Helvetica-Oblique").fontSize(10).fillColor("black").text("B.S., Computer Science");

// ── Write file ────────────────────────────────────────────────────────────────
mkdirSync("output", { recursive: true });
const stream = createWriteStream(`output/${FILENAME}`);

await new Promise((resolve, reject) => {
  stream.on("finish", resolve);
  stream.on("error", reject);
  doc.pipe(stream);
  doc.end();
});

console.log(`Done → output/${FILENAME}`);
