import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const active = (body as { active?: unknown })?.active;
  if (typeof active !== "boolean") {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  try {
    const integration = await prisma.integration.update({
      where: { id: params.id },
      data: { active },
    });
    return NextResponse.json(integration);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}