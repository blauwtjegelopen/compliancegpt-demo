// apps/web/app/api/integrations/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { IntegrationSchema, requireAdminToken } from "@/lib/integrations";

type Ctx = { params: { id: string } };

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const item = await prisma.integration.findUnique({
      where: { id: params.id },
    });
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
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
    return NextResponse.json(updated);
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
    const deleted = await prisma.integration.delete({
      where: { id: params.id },
    });
    return NextResponse.json(deleted);
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