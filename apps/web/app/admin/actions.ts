'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';

async function getCurrentOrgId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error('Not authenticated');

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { memberships: true },
  });
  const orgId = user?.memberships[0]?.orgId;
  if (!orgId) throw new Error('No organization context');
  return orgId;
}

async function ensureDefaultRuleset(orgId: string) {
  const existing = await prisma.ruleset.findFirst({
    where: { orgId },
    orderBy: { createdAt: 'asc' },
  });
  if (existing) return existing;

  return prisma.ruleset.create({
    data: {
      orgId,
      name: 'Default Rules',
    },
  });
}

const createRuleSchema = z.object({
  name: z.string().min(2, 'Provide a name'),
  pattern: z.string().min(1, 'Provide a regex pattern'),
  action: z.enum(['redact', 'flag', 'block']),
  replacement: z.string().optional().nullable(),
});

export async function createRuleAction(formData: FormData) {
  const parsed = createRuleSchema.safeParse({
    name: formData.get('name'),
    pattern: formData.get('pattern'),
    action: formData.get('action'),
    replacement: formData.get('replacement'),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten().formErrors.join(', ') || 'Invalid input' };
  }

  const orgId = await getCurrentOrgId();
  const ruleset = await ensureDefaultRuleset(orgId);

  await prisma.rule.create({
    data: {
      rulesetId: ruleset.id,
      name: parsed.data.name,
      pattern: parsed.data.pattern,
      action: parsed.data.action,
      replacement: parsed.data.replacement || undefined,
    },
  });

  revalidatePath('/admin');
  return { ok: true };
}

/**
 * AI-assisted import (heuristic, offline):
 * Parses a pasted policy/requirements text and adds a few sensible default rules
 * based on keywords. No external LLM required.
 */
export async function importRulesAction(formData: FormData) {
  const policy = String(formData.get('policy') || '').trim();
  if (!policy) return { ok: false, error: 'Paste a policy or requirements text' };

  const orgId = await getCurrentOrgId();
  const ruleset = await ensureDefaultRuleset(orgId);

  // Heuristic detections -> rules we’ll create
  const wantEmail = /email|pii|personally identifiable/i.test(policy);
  const wantPhone = /phone|mobile|sms|contact number/i.test(policy);
  const wantSecrets = /secret|api key|token|key|credential|password/i.test(policy);
  const wantBlock = /block|forbid|prohibit|must not/i.test(policy);
  const wantGDPR = /gdpr|eu data|personal data/i.test(policy);

  const candidates: Array<{
    name: string;
    pattern: string;
    action: 'redact' | 'flag' | 'block';
    replacement?: string;
  }> = [];

  if (wantEmail || wantGDPR) {
    candidates.push({
      name: 'Email Redaction',
      pattern: String.raw`\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b`,
      action: wantBlock ? 'block' : 'redact',
      replacement: '[REDACTED_EMAIL]',
    });
  }
  if (wantPhone || wantGDPR) {
    candidates.push({
      name: 'Phone Redaction',
      pattern: String.raw`\+?\d[\d\s().-]{7,}\d`,
      action: wantBlock ? 'block' : 'redact',
      replacement: '[REDACTED_PHONE]',
    });
  }
  if (wantSecrets) {
    candidates.push(
      {
        name: 'OpenAI style key',
        pattern: String.raw`\bsk-[A-Za-z0-9-_]{16,}\b`,
        action: 'flag',
      },
      {
        name: 'GitHub token',
        pattern: String.raw`\bghp_[A-Za-z0-9]{36}\b`,
        action: 'flag',
      },
      {
        name: 'JWT-like token',
        pattern: String.raw`\beyJ[A-Za-z0-9._-]{10,}\.[A-Za-z0-9._-]{10,}\.[A-Za-z0-9._-]{10,}\b`,
        action: 'flag',
      }
    );
  }

  // Always add a safe default if nothing detected
  if (candidates.length === 0) {
    candidates.push({
      name: 'Invoice Numbers',
      pattern: String.raw`\b(?:invoice|inv|bill|ref)[-\s#]*\d{3,}\b`,
      action: 'redact',
      replacement: '[REDACTED_NUMBER]',
    });
  }

  await prisma.rule.createMany({
    data: candidates.map((c) => ({
      rulesetId: ruleset.id,
      name: c.name,
      pattern: c.pattern,
      action: c.action,
      replacement: c.replacement,
    })),
  });

  revalidatePath('/admin');
  return { ok: true, count: candidates.length };
}