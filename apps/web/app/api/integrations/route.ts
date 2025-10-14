// apps/web/app/api/integrations/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { IntegrationSchema, requireAdminToken } from "@/lib/integrations";
import { Prisma } from "@prisma/client";

// helper: map provider -> default display name
function defaultNameFor(provider: string) {
  const map: Record<string, string> = {
    openai: "OpenAI (BYOK)",
    "azure-openai": "Azure OpenAI (BYOK)",
    anthropic: "Anthropic (BYOK)",
  };
  return map[provider] || `${provider} (BYOK)`;
}

// normalize empty strings to undefined so Prisma omits them
const emptyToUndef = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : (v as string | undefined);

export async function GET() {
  try {
    const list = await prisma.integration.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(list, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch integrations" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    requireAdminToken(req);

    const json = await req.json();
    const parsed = IntegrationSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { provider, name, apiKey, baseUrl, model, region, active } = parsed.data as {
      provider?: string;
      name?: string;
      apiKey?: string | null;
      baseUrl?: string | null;
      model?: string | null;
      region?: string | null;
      active?: boolean;
    };

    if (!provider) {
      return NextResponse.json(
        { error: "provider is required" },
        { status: 400 }
      );
    }

    // Build a Prisma-safe create input (name must be present)
    const data: Prisma.IntegrationCreateInput = {
      name: name && name.trim().length ? name : defaultNameFor(provider),
      provider,
      // optional fields: omit if empty; pass undefined so Prisma doesn't set them to null unless you want null
      apiKey: emptyToUndef(apiKey),
      baseUrl: emptyToUndef(baseUrl),
      model: emptyToUndef(model),
      region: emptyToUndef(region),
      // if your schema has 'active Boolean @default(false)'
      ...(typeof active === "boolean" ? { active } : {}),
    };

    const created = await prisma.integration.create({ data });
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error("[POST /api/integrations] error:", err);
    // P2002 => unique constraint (e.g., provider already exists)
    const status = err?.code === "P2002" ? 409 : 500;
    const message =
      err?.code === "P2002"
        ? "An integration for this provider already exists"
        : err?.message || "Failed to create integration";
    return NextResponse.json({ error: message }, { status });
  }
}