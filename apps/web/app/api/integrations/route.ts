// apps/web/app/api/integrations/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { IntegrationSchema, requireAdminToken } from "@/lib/integrations";

export async function GET() {
  try {
    const list = await prisma.integration.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(list);
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
    const created = await prisma.integration.create({ data: parsed.data });
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    const status = typeof err?.status === "number" ? err.status : 500;
    return NextResponse.json(
      { error: err?.message || "Failed to create integration" },
      { status }
    );
  }
}