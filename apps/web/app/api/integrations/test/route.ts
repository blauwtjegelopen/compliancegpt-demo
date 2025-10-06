// apps/web/app/api/integrations/test/route.ts
import { NextResponse } from "next/server";

type Provider = "openai" | "anthropic" | "azure";

type Body = {
  provider: Provider;
  apiKey: string;
  baseUrl?: string;
  model?: string;
  region?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    if (!body?.provider || !body?.apiKey) {
      return NextResponse.json({ error: "provider and apiKey are required" }, { status: 400 });
    }

    switch (body.provider) {
      case "openai": {
        // GET /v1/models (doesn’t bill; good for auth check)
        const url = (body.baseUrl?.trim() || "https://api.openai.com/v1") + "/models";
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${body.apiKey}` },
          cache: "no-store",
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`OpenAI auth failed (${res.status}) ${text.slice(0, 200)}`);
        }
        return NextResponse.json({ ok: true, provider: "openai", message: "OpenAI connection OK" });
      }

      case "anthropic": {
        // GET /v1/models (needs x-api-key and anthropic-version)
        const url = (body.baseUrl?.trim() || "https://api.anthropic.com") + "/v1/models";
        const res = await fetch(url, {
          headers: {
            "x-api-key": body.apiKey,
            "anthropic-version": "2023-06-01",
          },
          cache: "no-store",
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`Anthropic auth failed (${res.status}) ${text.slice(0, 200)}`);
        }
        return NextResponse.json({ ok: true, provider: "anthropic", message: "Anthropic connection OK" });
      }

      case "azure": {
        // Azure OpenAI requires a *resource* base URL and api-version
        // Example: https://<resource>.openai.azure.com
        const base = body.baseUrl?.trim();
        if (!base) {
          return NextResponse.json({ error: "Azure baseUrl is required" }, { status: 400 });
        }
        // Low-impact list call to confirm auth.
        const apiVersion = "2024-02-15-preview";
        const url = `${base.replace(/\/+$/, "")}/openai/deployments?api-version=${apiVersion}`;
        const res = await fetch(url, {
          headers: { "api-key": body.apiKey },
          cache: "no-store",
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`Azure OpenAI auth failed (${res.status}) ${text.slice(0, 200)}`);
        }
        return NextResponse.json({ ok: true, provider: "azure", message: "Azure OpenAI connection OK" });
      }

      default:
        return NextResponse.json({ error: "Unsupported provider" }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Test failed" }, { status: 400 });
  }
}