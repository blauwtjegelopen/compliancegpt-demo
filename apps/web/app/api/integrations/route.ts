// apps/web/app/api/integrations/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { IntegrationSchema, requireAdminToken } from "@/lib/integrations";

export async function GET() {
  try {
    const list = await prisma.integration.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(list);
  } catch (err: any) {
    // Log to server console
    console.error("[GET /api/integrations] error:", err);

    // In dev, surface the message to help debug. In prod, keep it generic.
    const body =
      process.env.NODE_ENV === "production"
        ? { error: "Failed to fetch integrations" }
        : { error: "Failed to fetch integrations", detail: String(err?.message || err) };

    return NextResponse.json(body, { status: 500 });
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
    const created = await prisma.integration.create({ data: parsed.data });
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error("[POST /api/integrations] error:", err);
    const status = typeof err?.status === "number" ? err.status : 500;
    const body =
      process.env.NODE_ENV === "production"
        ? { error: "Failed to create integration" }
        : { error: "Failed to create integration", detail: String(err?.message || err) };
    return NextResponse.json(body, { status });
  }
}