import { NextResponse } from "next/server";

type SuggestedRule = {
  name: string;
  pattern: string;
  action: "redact" | "flag" | "block";
  replacement?: string | null;
};

export async function POST(req: Request) {
  const { text } = await req.json() as { text: string };

  // Very simple heuristics; good enough for demo and safe offline
  const suggestions: SuggestedRule[] = [];

  const lower = (text || "").toLowerCase();

  if (lower.includes("email") || /@/.test(text)) {
    suggestions.push({
      name: "Email Redaction",
      pattern: "\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b",
      action: "redact",
      replacement: "[REDACTED_EMAIL]",
    });
  }
  if (lower.includes("phone") || /\+?\d[\d\s().-]{7,}\d/.test(text)) {
    suggestions.push({
      name: "Phone Redaction",
      pattern: "\\+?\\d[\\d\\s().-]{7,}\\d",
      action: "redact",
      replacement: "[REDACTED_PHONE]",
    });
  }
  if (/(sk-[A-Za-z0-9-_]{16,}|ghp_[A-Za-z0-9]{36}|AKIA[0-9A-Z]{16})/.test(text) || lower.includes("api key")) {
    suggestions.push({
      name: "API Key Detector",
      pattern: "\\b(?:sk-[A-Za-z0-9-_]{16,}|ghp_[A-Za-z0-9]{36}|AKIA[0-9A-Z]{16})\\b",
      action: "flag",
    });
  }
  if (lower.includes("block") && lower.includes("secret")) {
    suggestions.push({
      name: "Secret Block",
      pattern: "(?i)secret",
      action: "block",
    });
  }

  // Deduplicate by pattern
  const unique = Object.values(
    suggestions.reduce((acc, r) => {
      acc[r.pattern] = r;
      return acc;
    }, {} as Record<string, SuggestedRule>)
  );

  return NextResponse.json({ suggestions: unique });
}