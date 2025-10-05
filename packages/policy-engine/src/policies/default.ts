// packages/policy-engine/src/policies/default.ts
import type { Policy } from "../index";

export const DefaultPolicy: Policy = {
  detectors: [
    // Secrets first (avoid partial clashes with PHONE/NUMBER, etc.)
    {
      id: "secret",
      pattern:
        /\b(?:sk-[A-Za-z0-9-_]{16,}(?![A-Za-z0-9-_])|AKIA[0-9A-Z]{16}(?![A-Z0-9])|ghp_[A-Za-z0-9]{36}(?![A-Za-z0-9])|xox[baprs]-[A-Za-z0-9-]{10,}(?![A-Za-z0-9-])|eyJ[A-Za-z0-9._-]{10,}\.[A-Za-z0-9._-]{10,}\.[A-Za-z0-9._-]{10,}(?![A-Za-z0-9._-]))\b/g,
      classifyAs: "SECRET",
    },
    {
      id: "email",
      pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
      classifyAs: "EMAIL",
    },
    {
      id: "phone",
      // +country, spaces, dots, dashes, parentheses; requires 9+ digits total
      pattern: /\+?\d[\d\s().-]{7,}\d/g,
      classifyAs: "PHONE",
    },
    {
      id: "number",
      // invoice/inv/bill/ref + optional #/-/space + 3+ digits
      pattern: /\b(?:invoice|inv|bill|ref)[-\s#]*\d{3,}\b/gi,
      classifyAs: "NUMBER",
    },
    {
      id: "name-token",
      // Two+ capitalized tokens, allow hyphens/apostrophes (O'Neil, Jean-Luc)
      pattern: /\b([A-Z][a-z'’-]+(?:\s+[A-Z][a-z'’-]+)+)\b/g,
      classifyAs: "NAME",
    },
  ],
  redaction: {
    SECRET: { type: "token", token: "[REDACTED_SECRET]" },
    EMAIL: { type: "token", token: "[REDACTED_EMAIL]" },
    PHONE: { type: "token", token: "[REDACTED_PHONE]" },
    NUMBER: { type: "token", token: "[REDACTED_NUMBER]" },
    NAME:   { type: "token", token: "[REDACTED_NAME]" },
    CUSTOM: { type: "token", token: "[REDACTED_CUSTOM]" },
  },
};