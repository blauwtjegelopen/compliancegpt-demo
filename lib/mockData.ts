export const logs = [
  { time: '09:01', user: 'alex@co', prompt: 'Summarize GDPR vs CCPA differences', action: 'allowed', rule: 'Baseline Allowlist' },
  { time: '09:12', user: 'maria@co', prompt: 'Draft email to John Doe <john@acme.com>', action: 'redacted', rule: 'PII Guard' },
  { time: '09:24', user: 'lee@co', prompt: 'Paste oauth-service.ts for review', action: 'blocked', rule: 'Source Code Policy' },
  { time: '10:03', user: 'sam@co', prompt: 'Write sales email for ACME', action: 'allowed', rule: 'Baseline Allowlist' },
  { time: '10:34', user: 'maria@co', prompt: 'Regenerate message with phone +31 6 12 34 56 78', action: 'redacted', rule: 'PII Guard' }
];