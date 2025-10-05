// apps/web/lib/integrations.ts
import { z } from "zod";

export const IntegrationSchema = z.object({
  name: z.string().min(1),
  provider: z.string().min(1),
  apiKey: z.string().optional().nullable(),
});
export type IntegrationInput = z.infer<typeof IntegrationSchema>;

export function requireAdminToken(req: Request) {
  const expected = process.env.SHARED_ADMIN_TOKEN;
  const got =
    req.headers.get("x-admin-token") ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expected || got !== expected) {
    const e = new Error("Unauthorized");
    // @ts-ignore add status for our error formatter
    (e as any).status = 401;
    throw e;
  }
}