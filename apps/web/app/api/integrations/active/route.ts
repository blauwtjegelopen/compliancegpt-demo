// apps/web/app/api/integrations/active/secret/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminToken } from "@/lib/integrations";

export async function GET(req: Request) {
  try {
    requireAdminToken(req);
    const item = await prisma.integration.findFirst({
      where: { active: true },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        provider: true,
        apiKey: true,
        baseUrl: true,
        model: true,
        region: true,
      },
    });
    if (!item || !item.apiKey) {
      return NextResponse.json({ error: "No active integration configured" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (err: any) {
    const status = typeof err?.status === "number" ? err.status : 500;
    return NextResponse.json({ error: err?.message || "Failed to fetch secret" }, { status });
  }
}