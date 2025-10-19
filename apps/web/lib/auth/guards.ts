// Server-only helpers to fetch session + enforce roles
import "server-only";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";

export async function getServerAuth() {
  const session = await getServerSession(authOptions);
  return session;
}

export async function requireUser() {
  const session = await getServerAuth();
  if (!session?.user?.email) {
    // Middleware already protects /admin, but keep this as a guardrail
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireRole(roles: Array<"OWNER" | "ADMIN" | "ANALYST" | "VIEWER">) {
  const session = await requireUser();
  const user = await prisma.user.findUnique({
    where: { email: session.user!.email! },
    include: { memberships: { include: { org: true } } },
  });
  if (!user) throw new Error("Unauthorized");

  // Simple rule: allow if any membership matches allowed roles
  const hasRole = user.memberships.some((m) => roles.includes(m.role as any));
  if (!hasRole) throw new Error("Forbidden");
  return { session, user };
}