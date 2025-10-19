// apps/web/prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Safe upserts so you can rerun
  const org = await prisma.organization.upsert({
    where: { id: "demo-org" },
    update: {},
    create: { id: "demo-org", name: "Demo Org" },
  });

  await prisma.integration.upsert({
    where: { provider: "openai" },
    update: {},
    create: {
      name: "OpenAI",
      provider: "openai",
      active: false,
      baseUrl: "https://api.openai.com/v1",
      model: "gpt-4o",
      region: "us",
    },
  });

  await prisma.integration.upsert({
    where: { provider: "anthropic" },
    update: {},
    create: {
      name: "Anthropic",
      provider: "anthropic",
      active: false,
      baseUrl: "https://api.anthropic.com",
      model: "claude-3-5-sonnet",
      region: "us",
    },
  });

  await prisma.ruleset.upsert({
    where: { id: "default-rules" },
    update: {},
    create: {
      id: "default-rules",
      name: "Default Rules",
      orgId: org.id,
      rules: {
        create: [
          {
            name: "Email Redaction",
            pattern: "\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b",
            action: "redact",
            replacement: "[REDACTED_EMAIL]",
          },
          {
            name: "API Keys",
            pattern: "\\bsk-[A-Za-z0-9-_]{16,}\\b",
            action: "flag",
          },
        ],
      },
    },
  });

  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });