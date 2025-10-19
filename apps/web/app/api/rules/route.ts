// apps/web/app/api/rules/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const rulesetId = searchParams.get("rulesetId");
  if (!rulesetId) return new NextResponse("rulesetId is required", { status: 400 });

  const rules = await prisma.rule.findMany({
    where: { rulesetId },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, pattern: true, action: true, replacement: true, createdAt: true },
  });

  return NextResponse.json({ rules });
}