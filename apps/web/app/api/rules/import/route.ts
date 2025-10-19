import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const Body = z.object({
  rulesetId: z.string().min(1),
  rules: z.array(
    z.object({
      name: z.string().min(1),
      pattern: z.string().min(1),
      action: z.enum(["redact", "flag", "block"]),
      replacement: z.string().optional(),
    })
  ).min(1),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { rulesetId, rules } = parsed.data;

  // Use the user's existing org membership; do not create orgs here
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { memberships: true },
  });

  const orgId = user?.memberships[0]?.orgId;
  if (!orgId) {
    return NextResponse.json(
      { error: "No organization context. Join or create an org before importing rules." },
      { status: 400 }
    );
  }

  // Ensure the ruleset exists for this org (ID is global; ensure it’s tied to this org)
  await prisma.ruleset.upsert({
    where: { id: rulesetId },
    update: {},
    create: { id: rulesetId, name: rulesetId, orgId }, // orgId is non-null now
  });

  // Prevent duplicates by name within the ruleset
  const existing = await prisma.rule.findMany({
    where: { rulesetId },
    select: { name: true },
  });
  const existingNames = new Set(existing.map((r) => r.name));

  const toCreate = rules
    .filter((r) => !existingNames.has(r.name))
    .map((r) => ({
      rulesetId,
      name: r.name,
      pattern: r.pattern,
      action: r.action,
      replacement: r.replacement ?? null,
    }));

  if (toCreate.length > 0) {
    await prisma.rule.createMany({ data: toCreate });
  }

  return NextResponse.json({ count: toCreate.length });
}