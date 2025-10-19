// apps/web/app/api/rules/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

  const id = params.id;
  if (!id) return new NextResponse("id is required", { status: 400 });

  await prisma.rule.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}