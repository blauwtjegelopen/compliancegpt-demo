// apps/web/app/api/integrations/activate/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // <-- keep this path aligned with your project (db.ts or prisma.ts)
import { requireAdminToken } from "@/lib/integrations";
import { z } from "zod";

const BodySchema = z.object({ id: z.string().min(1) });

export async function POST(req: Request) {
  try {
    requireAdminToken(req);

    // Validate JSON body
    const json = await req.json().catch(() => ({}));
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { id } = parsed.data;

    // Ensure the target integration exists up-front
    const target = await prisma.integration.findUnique({
      where: { id },
      select: { id: true }
    });
    if (!target) {
      return NextResponse.json({ error: "Integration not found" }, { status: 404 });
    }

    // Flip active flags atomically:
    // 1) activate the target
    // 2) deactivate any others that are active
    await prisma.$transaction([
      prisma.integration.update({
        where: { id },
        data: { active: true },
      }),
      prisma.integration.updateMany({
        where: { id: { not: id }, active: true },
        data: { active: false },
      }),
    ]);

    // Return the newly active integration (selected fields only)
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
        updatedAt: true,
      },
    });

    return NextResponse.json(active, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    // P2025 = record not found on update
    const status =
      err?.code === "P2025"
        ? 404
        : typeof err?.status === "number"
        ? err.status
        : 500;

    return NextResponse.json(
      { error: err?.message || "Failed to activate integration" },
      { status }
    );
  }
}