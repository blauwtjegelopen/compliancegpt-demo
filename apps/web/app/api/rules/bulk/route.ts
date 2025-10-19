import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth/options";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email ?? "demo@local";

    // Find/create user & org (demo-safe)
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: email.split("@")[0],
          memberships: {
            create: { role: "OWNER", org: { create: { name: `${email.split("@")[0]}'s Org` } } },
          },
        },
      });
    }
    const membership = await prisma.membership.findFirst({ where: { userId: user.id } });
    const orgId = membership?.orgId as string;

    // Ensure "Default Rules" exists
    let ruleset = await prisma.ruleset.findFirst({ where: { orgId, name: "Default Rules" } });
    if (!ruleset) {
      ruleset = await prisma.ruleset.create({ data: { name: "Default Rules", orgId } });
    }

    const body = await req.json();
    const rules = Array.isArray(body?.rules) ? body.rules : [];
    if (rules.length === 0) {
      return NextResponse.json({ error: "Provide rules: [{ name, pattern, action, replacement? }, ...]" }, { status: 400 });
    }

    const created = await prisma.$transaction(
      rules.map((r: any) =>
        prisma.rule.create({
          data: {
            name: r.name,
            pattern: r.pattern,
            action: r.action,
            replacement: r.replacement ?? null,
            rulesetId: ruleset.id,
          },
        })
      )
    );

    return NextResponse.json({ ok: true, count: created.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}