import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const Body = z.object({
  rulesetId: z.string().min(1), // user-provided slug/label
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

  const body = await req.json();
  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { rulesetId, rules } = parsed.data;

  // 1) Resolve current user + org (create tiny demo org if user has none)
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: { memberships: true },
  });
  if (!user) return new NextResponse("User not found", { status: 404 });

  let orgId = user.memberships[0]?.orgId ?? null;
  if (!orgId) {
    const org = await prisma.organization.upsert({
      where: { id: "demo-org" },
      update: {},
      create: { id: "demo-org", name: "Demo Org" },
    });
    await prisma.membership.upsert({
      where: { id: `${user.id}-demo-org` },
      update: {},
      create: { id: `${user.id}-demo-org`, userId: user.id, orgId: org.id, role: "admin" },
    });
    orgId = org.id;
  }

  // 2) Ensure a ruleset **for this org**. If the requested id is used by another org, suffix it.
  const prettyName = rulesetId.replace(/[-_]/g, " ").replace(/\b\w/g, s => s.toUpperCase());

  // try to find a ruleset with this id under THIS org
  let ruleset = await prisma.ruleset.findFirst({
    where: { id: rulesetId, orgId },
  });

  if (!ruleset) {
    // is the id taken by a different org?
    const takenElsewhere = await prisma.ruleset.findUnique({ where: { id: rulesetId } });

    const finalId =
      takenElsewhere && takenElsewhere.orgId !== orgId
        ? `${rulesetId}__${orgId}`
        : rulesetId;

    // create (or noop if it now exists)
    ruleset = await prisma.ruleset.upsert({
      where: { id: finalId },
      update: {},
      create: { id: finalId, name: prettyName, orgId },
    });
  }

  // 3) De-dup inside this ruleset by name
  const existing = await prisma.rule.findMany({
    where: { rulesetId: ruleset.id },
    select: { name: true },
  });
  const existingNames = new Set(existing.map(r => r.name));

  const toInsert = rules
    .filter(r => !existingNames.has(r.name))
    .map(r => ({
      rulesetId: ruleset!.id,
      name: r.name,
      pattern: r.pattern,
      action: r.action,
      replacement: r.replacement ?? null,
    }));

  if (toInsert.length === 0) {
    // still revalidate so the UI reflects the (possibly new) ruleset
    revalidatePath("/admin");
    return NextResponse.json({ count: 0, rulesetId: ruleset.id, message: "All rules already exist." });
  }

  // 4) Insert (no skipDuplicates needed)
  const created = await prisma.rule.createMany({ data: toInsert });

  // 5) Revalidate the admin dashboard so the Rulesets section updates
  revalidatePath("/admin");

  return NextResponse.json({ count: created.count, rulesetId: ruleset.id });
}