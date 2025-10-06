// apps/web/app/api/integrations/activate/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminToken } from "@/lib/integrations";

export async function POST(req: Request) {
  try {
    requireAdminToken(req);
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    await prisma.$transaction([
      prisma.integration.updateMany({ data: { active: false }, where: { active: true } }),
      prisma.integration.update({ where: { id }, data: { active: true } }),
    ]);

    const active = await prisma.integration.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        provider: true,
        baseUrl: true,
        model: true,
        region: true,
        active: true,
      },
    });

    return NextResponse.json(active);
  } catch (err: any) {
    const status = err?.code === "P2025" ? 404 : typeof err?.status === "number" ? err.status : 500;
    return NextResponse.json({ error: err?.message || "Failed to activate integration" }, { status });
  }
}