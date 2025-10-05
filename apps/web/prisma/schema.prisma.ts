// apps/web/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Tenant {
  id        String          @id @default(cuid())
  slug      String          @unique            // e.g. "demo"
  name      String
  createdAt DateTime        @default(now())
  updatedAt DateTime        @updatedAt
  configs   ProviderConfig[]
}

enum Provider {
  openai
  anthropic
  azure
}

model ProviderConfig {
  id         String   @id @default(cuid())
  tenantId   String
  tenant     Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  provider   Provider
  baseUrl    String?
  model      String?
  region     String?
  apiKey     String    // stored server-side; never returned to browser
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt

  @@index([tenantId, provider])
}