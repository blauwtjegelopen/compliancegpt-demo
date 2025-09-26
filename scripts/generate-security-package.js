// scripts/generate-security-package.js
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

// Ensure public/security exists
const outDir = path.join(__dirname, "../public/security");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const filePath = path.join(outDir, "LayerZero-Security-Package.pdf");

const doc = new PDFDocument({ size: "A4", margin: 50 });
doc.pipe(fs.createWriteStream(filePath));

// --- Cover Page ---
doc.fontSize(28).fillColor("#000").text("LayerZero Security Package", { align: "center" });
doc.moveDown();
doc.fontSize(14).fillColor("gray").text("Overview of Security & Compliance Practices", { align: "center" });

doc.addPage();

// --- Section 1 ---
doc.fontSize(20).fillColor("#000").text("1. Compliance & Certifications");
doc.moveDown().fontSize(12).fillColor("black").text(`
- SOC 2 Type II: Independent audit of security, availability, and confidentiality.
- GDPR: Data protection by design and default, EU data residency options.
- HIPAA: Safeguards for handling PHI; BAAs available for eligible plans.
`);

// --- Section 2 ---
doc.addPage();
doc.fontSize(20).text("2. Security Practices");
doc.moveDown().fontSize(12).text(`
- End-to-end encryption (at rest and in transit).
- Strict access controls, least-privilege principle.
- Continuous monitoring & automated policy enforcement.
- AI-fueled red teaming for resilience.
`);

doc.end();

console.log(`✅ Security package generated at: ${filePath}`);