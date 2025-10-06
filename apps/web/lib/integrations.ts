// apps/web/lib/integrations.ts
import { z } from "zod";
import { NextRequest } from "next/server";

export const IntegrationSchema = z.object({
  name: z.string().min(1),
  provider: z.string().min(1),
  apiKey: z.string().optional(),
  baseUrl: z.string().optional(),
  model: z.string().optional(),
  region: z.string().optional(),
});

export function requireAdminToken(req: Request | NextRequest) {
  const token = req.headers.get("x-shared-admin-token");
  if (!token || token !== process.env.SHARED_ADMIN_TOKEN) {
    const err = new Error("Unauthorized");
    (err as any).status = 401;
    throw err;
  }
}