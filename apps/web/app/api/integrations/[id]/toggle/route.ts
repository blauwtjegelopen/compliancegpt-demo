import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const integ = await prisma.integration.findUnique({ where: { id: params.id } });
  if (!integ) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.integration.update({
    where: { id: params.id },
    data: { active: !integ.active },
  });

  return NextResponse.json({ ok: true, active: updated.active });
}