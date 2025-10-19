import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

/**
 * POST /api/rules/extract
 * body: { rulesetId: string, text: string }
 * Requires: process.env.OPENAI_API_KEY
 */
const Body = z.object({
  rulesetId: z.string().min(1),
  text: z.string().min(20, "Please paste a bit more context to extract rules."),
});

type ExtractedRule = {
  name: string;
  pattern: string;
  action: "redact" | "flag" | "block";
  replacement?: string;
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { rulesetId, text } = parsed.data;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new NextResponse("OPENAI_API_KEY is not configured", { status: 500 });
  }

  // Prompt the model to produce strict JSON array of ExtractedRule objects
  const system = `
You convert compliance policy text into concrete "share-safety" rules for a chat proxy.
Output ONLY a JSON array of objects: { "name": string, "pattern": string (ECMAScript regex), "action": "redact"|"flag"|"block", "replacement"?: string }.
- Prefer precise, minimally-overbroad regex patterns.
- Use "redact" for PII/PHI that can flow after masking, "flag" for risky content that needs review, "block" for hard no-go.
- Example: Emails => {"name":"Email","pattern":"\\\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\\\.[A-Z]{2,}\\\\b","action":"redact","replacement":"[REDACTED_EMAIL]"}.
Return JSON only, no commentary.
`;

  const user = `
Compliance text:
---
${text}
---
Create rules that prevent disallowed disclosure/sharing based on this policy.
`;

  // Minimal REST call (no SDK required)
  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      // Try to keep responses concise and JSON-only
      max_tokens: 1200,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    return new NextResponse(`OpenAI error: ${text}`, { status: 502 });
  }

  const data = await resp.json();
  const content: string = data?.choices?.[0]?.message?.content ?? "[]";

  let extracted: ExtractedRule[] = [];
  try {
    // Some models wrap JSON in ```json ... ```
    const jsonOnly = content.trim().replace(/^```json\s*|\s*```$/g, "");
    const parsed = JSON.parse(jsonOnly);
    if (!Array.isArray(parsed)) throw new Error("Response was not an array");
    extracted = parsed as ExtractedRule[];
  } catch (e) {
    return new NextResponse("Failed to parse AI output as JSON", { status: 502 });
  }

  // Lightweight validation
  const clean = extracted
    .filter(
      (r) =>
        r &&
        typeof r.name === "string" &&
        typeof r.pattern === "string" &&
        ["redact", "flag", "block"].includes(r.action)
    )
    .slice(0, 100); // safety cap

  if (clean.length === 0) {
    return new NextResponse("No rules extracted", { status: 422 });
  }

  // Insert into DB
  const created = await prisma.rule.createMany({
    data: clean.map((r) => ({
      rulesetId,
      name: r.name,
      pattern: r.pattern,
      action: r.action,
      replacement: r.replacement ?? null,
    })),
  });

  return NextResponse.json({ added: created.count, preview: clean.slice(0, 5) });
}