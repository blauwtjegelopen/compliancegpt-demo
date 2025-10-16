// apps/web/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Avoid creating multiple clients in dev (HMR) and keep type safe
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Verbose logs in dev, quiet in prod
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;