// apps/web/app/api/integrations/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { IntegrationSchema, requireAdminToken } from "@/lib/integrations";

type Ctx = { params: { id: string } };

function maskKey(k?: string | null) {
  if (!k) return "";
  if (k.length <= 8) return "••••";
  return `${k.slice(0, 3)}••••${k.slice(-4)}`;
}

function scrubIntegration<T extends { apiKey?: string | null }>(row: T) {
  const { apiKey, ...rest } = row;
  return { ...rest, maskedKey: maskKey(apiKey), hasKey: !!apiKey };
}

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const item = await prisma.integration.findUnique({
      where: { id: params.id },
    });
    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(scrubIntegration(item));
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch integration" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: Ctx) {
  try {
    requireAdminToken(req);

    const json = await req.json();
    const parsed = IntegrationSchema.partial().safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await prisma.integration.update({
      where: { id: params.id },
      data: parsed.data,
    });

    return NextResponse.json(scrubIntegration(updated));
  } catch (err: any) {
    const status =
      err?.code === "P2025"
        ? 404
        : typeof err?.status === "number"
        ? err.status
        : 500;
    return NextResponse.json(
      { error: err?.message || "Failed to update integration" },
      { status }
    );
  }
}

export async function DELETE(req: Request, { params }: Ctx) {
  try {
    requireAdminToken(req);

    await prisma.integration.delete({ where: { id: params.id } });
    // Don’t echo sensitive fields back; just confirm deletion.
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    const status =
      err?.code === "P2025"
        ? 404
        : typeof err?.status === "number"
        ? err.status
        : 500;
    return NextResponse.json(
      { error: err?.message || "Failed to delete integration" },
      { status }
    );
  }
}