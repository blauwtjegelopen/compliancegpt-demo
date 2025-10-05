// app/admin/page.tsx
"use client";

import { useMemo, useState, useTransition } from "react";
import {
  ShieldCheck,
  EyeOff,
  KeySquare,
  UserCheck,
  Activity,
  ArrowRight,
  Check,
  Scissors,
  Trash2,
  Clipboard,
} from "lucide-react";
import ContactLargeFinal from "@/components/ContactLargeFinal";
import { routeViaProxy } from "@/lib/proxy"; // NEW

// --- Detectors & helpers ---------------------------------------------------
// More forgiving, future-proof-ish patterns (demo-level)
const EMAIL_RE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;

// Accepts +country, spaces, dots, dashes, parentheses; 9+ digits total
const PHONE_RE = /\+?\d[\d\s().-]{7,}\d/g;

// Two+ capitalized tokens, allow hyphens/apostrophes (O'Neil, Jean-Luc)
const NAME_RE = /\b([A-Z][a-z'’-]+(?:\s+[A-Z][a-z'’-]+)+)\b/g;

// invoice/inv/bill/ref + optional #/-/space + 3+ digits
const INVOICE_RE = /\b(?:invoice|inv|bill|ref)[-\s#]*\d{3,}\b/gi;

// Common API key shapes: OpenAI sk-..., AWS AKIA..., GitHub ghp_...,
// Slack xox..., and a loose JWT-ish catcher (eyJ...)
// Negative look-aheads avoid leaving trailing characters.
const API_KEY_RE =
  /\b(?:sk-[A-Za-z0-9-_]{16,}(?![A-Za-z0-9-_])|AKIA[0-9A-Z]{16}(?![A-Z0-9])|ghp_[A-Za-z0-9]{36}(?![A-Za-z0-9])|xox[baprs]-[A-Za-z0-9-]{10,}(?![A-Za-z0-9-])|eyJ[A-Za-z0-9._-]{10,}\.[A-Za-z0-9._-]{10,}\.[A-Za-z0-9._-]{10,}(?![A-Za-z0-9._-]))\b/g;

function sanitizePrompt(input: string) {
  let redactions = 0;
  const redact = (text: string, re: RegExp, label: string) =>
    text.replace(re, () => {
      redactions++;
      return `[REDACTED_${label}]`;
    });

  let out = input;

  // IMPORTANT: redact secrets first to avoid partial matches (e.g., PHONE)
  out = redact(out, API_KEY_RE, "SECRET");

  // Then PII / numbers
  out = redact(out, EMAIL_RE, "EMAIL");
  out = redact(out, PHONE_RE, "PHONE");
  out = redact(out, INVOICE_RE, "NUMBER");
  out = redact(out, NAME_RE, "NAME");

  return { out, redactions };
}

function pct(n: number) {
  return `${n.toFixed(1)}%`;
}

function Badge({
  tone = "ok",
  children,
}: {
  tone?: "ok" | "review" | "block" | "approved" | "redacted";
  children: React.ReactNode;
}) {
  const tones = {
    ok: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300",
    review: "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300",
    block: "bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-300",
    approved: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
    redacted: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300",
  } as const;
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

type QueueStatus = "Pending" | "Approved" | "Redacted";
type QueueItem = {
  id: string;
  user: string;
  text: string;
  redacted?: string;
  status: QueueStatus;
  createdAt: string;
  needsReview: boolean;
};

export default function AdminDemoPage() {
  const [prompt, setPrompt] = useState(
    `Hey team, can you follow up with Jane Doe about invoice 84921?
Her email is jane.doe@acme.com and phone +1 415-555-0199.
Also don't leak sk-1234567890abcdefghijklmnop. Thanks!`
  );
  const analysis = useMemo(() => sanitizePrompt(prompt), [prompt]);

  const piiCount =
    (prompt.match(EMAIL_RE)?.length || 0) +
    (prompt.match(PHONE_RE)?.length || 0) +
    (prompt.match(NAME_RE)?.length || 0);
  const secretsCount = prompt.match(API_KEY_RE)?.length || 0;
  const numbersCount = prompt.match(INVOICE_RE)?.length || 0;

  const blockedRate = secretsCount > 0 ? 2.4 : 0.6;

  // --- Decision union + tone (no "Blocked" branch -> no TS2367) ---
  type Decision = "Allowed (Redacted)" | "Needs Review";
  const decision: Decision =
    secretsCount > 0
      ? "Allowed (Redacted)"
      : piiCount + numbersCount > 25
      ? "Needs Review"
      : "Allowed (Redacted)";

  const decisionTone: "ok" | "review" = decision === "Needs Review" ? "review" : "ok";

  const [queue, setQueue] = useState<QueueItem[]>([
    {
      id: "q1",
      user: "maria@company.com",
      text: "Email Jane Doe about invoice 84921. jane.doe@acme.com +1 415 555 0199",
      status: "Pending",
      createdAt: "10:42",
      needsReview: true,
    },
    {
      id: "q2",
      user: "lee@company.com",
      text: "Share repo link with Nina: ghp_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8",
      status: "Pending",
      createdAt: "10:38",
      needsReview: true,
    },
    {
      id: "q3",
      user: "arun@company.com",
      text: "Send update to client. No sensitive content.",
      status: "Pending",
      createdAt: "10:31",
      needsReview: false,
    },
  ]);

  const pendingCount = queue.filter((q) => q.status === "Pending").length;
  const approvedCount = queue.filter((q) => q.status === "Approved").length;
  const redactedCount = queue.filter((q) => q.status === "Redacted").length;

  const handleApprove = (id: string) =>
    setQueue((qs) => qs.map((q) => (q.id === id ? { ...q, status: "Approved" } : q)));

  const handleRedact = (id: string) =>
    setQueue((qs) =>
      qs.map((q) => {
        if (q.id !== id) return q;
        const { out } = sanitizePrompt(q.text);
        return { ...q, redacted: out, status: "Redacted" };
      })
    );

  const handleDelete = (id: string) => setQueue((qs) => qs.filter((q) => q.id !== id));

  const copySanitized = async () => {
    try {
      await navigator.clipboard.writeText(analysis.out);
      alert("Sanitized prompt copied to clipboard.");
    } catch {
      alert("Could not copy to clipboard.");
    }
  };

  // NEW: proxy call state
  const [proxyResult, setProxyResult] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <main>
      {/* Header */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-200">
          Admin Demo
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
          See how LayerZero protects sensitive data in real time: PII redaction, code & secrets detection,
          and approval workflows—before data leaves your tenant.
        </p>
      </section>

      {/* Playground */}
      <section className="max-w-6xl mx-auto px-6 pb-10">
        <div className="grid md:grid-cols-5 gap-6 items-start">
          {/* Left: Input */}
          <div className="md:col-span-3 rounded-2xl border border-gray-200 bg-white shadow-sm p-5 dark:border-white/10 dark:bg-transparent">
            <div className="flex items-center justify-between mb-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <ShieldCheck className="h-4 w-4" />
                <span>Paste a prompt to scan</span>
              </div>
              <button
                onClick={copySanitized}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                title="Copy sanitized prompt"
              >
                <Clipboard className="h-3.5 w-3.5" />
                Copy sanitized
              </button>
            </div>

            <textarea
              className="w-full min-h-[220px] rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 text-gray-900 dark:text-gray-200 bg-white dark:bg-transparent border-gray-200 dark:border-white/10"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <Badge tone="ok">Inline redaction on</Badge>
              <Badge tone="review">Secret scanning</Badge>
              <Badge tone="ok">Region routing: EU</Badge>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <MetricCard icon={<EyeOff className="h-4 w-4" />} label="PII Redactions" value={piiCount + numbersCount} />
              <MetricCard icon={<KeySquare className="h-4 w-4" />} label="Secrets Detected" value={secretsCount} />
              <MetricCard icon={<Activity className="h-4 w-4" />} label="Blocked" value={pct(secretsCount > 0 ? 2.4 : 0.6)} />
            </div>

            {/* NEW: Send via Proxy */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  startTransition(async () => {
                    const payload = { messages: [{ role: "user", content: prompt }] };
                    const res = await routeViaProxy(payload);
                    setProxyResult(res);
                  });
                }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black text-sm"
              >
                {isPending ? "Sending…" : "Send via Proxy"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {proxyResult && (
              <div className="mt-4 rounded-xl border border-gray-200 dark:border-white/10 p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Proxy findings</div>
                <pre className="text-sm bg-gray-50 dark:bg-transparent p-2 rounded">
                  {JSON.stringify(proxyResult.findings, null, 2)}
                </pre>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-3 mb-1">Upstream response (mock)</div>
                <pre className="text-sm bg-gray-50 dark:bg-transparent p-2 rounded">
                  {JSON.stringify(proxyResult.data, null, 2)}
                </pre>

                {/* ERROR BANNER (added) */}
                {proxyResult?.error && (
                  <div className="mt-2 text-sm rounded border border-rose-200 bg-rose-50 p-2 text-rose-800 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-300">
                    Proxy error: {proxyResult.error}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Decision & Preview */}
          <div className="md:col-span-2 rounded-2xl border border-gray-200 bg-white shadow-sm p-5 dark:border-white/10 dark:bg-transparent">
            <div className="flex items-center justify-between mb-4">
              <div className="font-medium text-gray-900 dark:text-gray-200">Policy Decision</div>
              <Badge tone={decisionTone}>{decision}</Badge>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Prompt (sanitized)</div>
            <pre className="text-sm rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-transparent p-3 overflow-auto text-gray-900 dark:text-gray-300">
{analysis.out}
            </pre>

            <a href="/admin" className="mt-4 inline-flex items-center gap-2 text-sm underline text-gray-700 dark:text-gray-400">
              See full dashboard <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Approval Workflow Queue */}
      <section className="max-w-6xl mx-auto px-6 pb-14">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-200">Approval workflow</h2>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <Badge tone="review">Pending: {pendingCount}</Badge>
            <Badge tone="approved">Approved: {approvedCount}</Badge>
            <Badge tone="redacted">Redacted: {redactedCount}</Badge>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-transparent overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-white/5">
              <tr className="text-left text-gray-700 dark:text-gray-300">
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Prompt</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
              {queue.map((item) => (
                <tr key={item.id} className="text-gray-800 dark:text-gray-300 align-top">
                  <td className="py-3 px-4 whitespace-nowrap">{item.createdAt}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{item.user}</td>
                  <td className="py-3 px-4">
                    <div className="space-y-2">
                      <pre className="whitespace-pre-wrap break-words text-[13px] leading-snug">{item.text}</pre>
                      {item.redacted && (
                        <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-transparent p-2">
                          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-1">
                            <EyeOff className="h-3.5 w-3.5" />
                            <span>Redacted</span>
                          </div>
                          <pre className="whitespace-pre-wrap break-words text-[13px] leading-snug">{item.redacted}</pre>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {item.status === "Pending" && <Badge tone={item.needsReview ? "review" : "ok"}>Pending</Badge>}
                    {item.status === "Approved" && <Badge tone="approved">Approved</Badge>}
                    {item.status === "Redacted" && <Badge tone="redacted">Redacted</Badge>}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 text-xs"
                        disabled={item.status !== "Pending"}
                        title="Approve without changes"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRedact(item.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 text-xs"
                        disabled={item.status !== "Pending"}
                        title="Apply redaction and approve"
                      >
                        <Scissors className="h-3.5 w-3.5" />
                        Redact
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-gray-300 dark:border-white/10 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-xs"
                        title="Remove from queue"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {queue.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 px-4 text-center text-gray-600 dark:text-gray-400">
                    No items in the approval queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Controls overview */}
      <section className="max-w-6xl mx-auto px-6 pb-10">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-200 mb-4">What’s included</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Feature
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Data Protection Guard"
            body="Emails, phone numbers, addresses, names—redacted inline before they leave your tenant."
          />
          <Feature
            icon={<KeySquare className="h-5 w-5" />}
            title="Code & Secret Detection"
            body="Detect API keys, tokens, and code fragments in real time to prevent exfiltration."
          />
          <Feature
            icon={<UserCheck className="h-5 w-5" />}
            title="Approval Workflow"
            body="Escalate sensitive prompts to approvers. Release safely with full audit logs."
          />
        </div>
      </section>

      {/* Recent events */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-200 mb-4">Recent events</h2>
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-transparent overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-white/5">
              <tr className="text-left text-gray-700 dark:text-gray-300">
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
              <Row time="10:42" user="maria@company.com" action="Prompt scanned (secrets)" outcome={<Badge tone="ok">Allowed (Redacted)</Badge>} />
              <Row time="10:38" user="lee@company.com" action="Prompt scanned (PII)" outcome={<Badge tone="ok">Allowed (Redacted)</Badge>} />
              <Row time="10:31" user="arun@company.com" action="Policy escalation" outcome={<Badge tone="review">Needs Review</Badge>} />
              <Row time="10:18" user="nina@company.com" action="Outbound blocked" outcome={<Badge tone="block">Blocked</Badge>} />
            </tbody>
          </table>
        </div>
      </section>

      {/* Contact anchor target */}
      <div id="contact" className="max-w-6xl mx-auto px-6 pb-16">
        <ContactLargeFinal />
      </div>
    </main>
  );
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-transparent">
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div className="mt-2 text-xl font-semibold text-gray-900 dark:text-gray-200">{value}</div>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-transparent">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-white/10 dark:text-blue-300">
          {icon}
        </div>
        <div className="text-gray-900 dark:text-gray-200 font-semibold">{title}</div>
      </div>
      <p className="mt-3 text-gray-600 dark:text-gray-400">{body}</p>
    </div>
  );
}

function Row({ time, user, action, outcome }: { time: string; user: string; action: string; outcome: React.ReactNode }) {
  return (
    <tr className="text-gray-800 dark:text-gray-300">
      <td className="py-3 px-4 whitespace-nowrap">{time}</td>
      <td className="py-3 px-4">{user}</td>
      <td className="py-3 px-4">{action}</td>
      <td className="py-3 px-4">{outcome}</td>
    </tr>
  );
}