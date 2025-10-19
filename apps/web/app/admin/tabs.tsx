// apps/web/app/admin/tabs.tsx
"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EyeOff, KeySquare, Activity, ArrowRight, Check, Scissors, Trash2, Clipboard } from "lucide-react";
import RuleForm from "@/components/RuleForm";
import AIImportRules from "@/components/AIImportRules";
import ToggleIntegrationButton from "@/components/ToggleIntegrationButton";
import RuleDeleteButton from "@/components/RuleDeleteButton";
import { routeViaProxy } from "@/lib/proxy";

type Integration = {
  id: string; name: string; provider: string; model: string | null; region: string | null; baseUrl: string | null; active: boolean;
};
type RulesetSummary = { id: string; name: string; _count: { rules: number } };
type RuleRow = { id: string; rulesetId: string; name: string; pattern: string; action: string; replacement: string | null };

export default function AdminTabs({
  initialTab,
  integrations,
  rulesets,
  rulesBySet,
}: {
  initialTab: "overview" | "playground" | "rules" | "approvals" | "events" | "integrations";
  integrations: Integration[];
  rulesets: RulesetSummary[];
  rulesBySet: Record<string, RuleRow[]>;
}) {
  const router = useRouter();
  const search = useSearchParams();
  const [tab, setTab] = useState(initialTab);

  const go = (next: typeof tab) => {
    setTab(next);
    const params = new URLSearchParams(search?.toString() ?? "");
    params.set("tab", next);
    router.replace(`/admin?${params.toString()}`);
  };

  return (
    <>
      {/* Tabs nav */}
      <div className="mb-5 border-b border-gray-200 dark:border-white/10">
        <div className="flex flex-wrap gap-2">
          {[
            ["overview", "Overview"],
            ["playground", "Playground"],
            ["rules", "Rules & Imports"],
            ["approvals", "Approvals"],
            ["integrations", "Integrations"],
            ["events", "Events"],
          ].map(([key, label]) => {
            const active = tab === (key as any);
            return (
              <button
                key={key}
                onClick={() => go(key as any)}
                className={[
                  "px-3 py-2 text-sm rounded-t-md border-b-2",
                  active
                    ? "border-gray-900 dark:border-white text-gray-900 dark:text-gray-100"
                    : "border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100",
                ].join(" ")}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {tab === "overview" && (
        <div className="space-y-8">
          <OverviewPanel integrations={integrations} />
          <RulesetsPanel rulesets={rulesets} rulesBySet={rulesBySet} />
        </div>
      )}

      {tab === "playground" && <PlaygroundPanel />}

      {tab === "rules" && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <RuleForm />
            <AIImportRules />
          </div>
          <RulesetsPanel rulesets={rulesets} rulesBySet={rulesBySet} />
        </div>
      )}

      {tab === "approvals" && <ApprovalsPanel />}

      {tab === "integrations" && <IntegrationsPanel integrations={integrations} />}

      {tab === "events" && <EventsPanel />}
    </>
  );
}

/* -------------------- Panels -------------------- */

function OverviewPanel({ integrations }: { integrations: Integration[] }) {
  const active = integrations.filter((i) => i.active).length;
  return (
    <section className="rounded-2xl border border-gray-200 dark:border-white/10 p-4 bg-white dark:bg-neutral-900">
      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">At a glance</div>
      <div className="grid sm:grid-cols-3 gap-3">
        <MetricCard icon={<EyeOff className="h-4 w-4" />} label="Policies" value="Live" />
        <MetricCard icon={<KeySquare className="h-4 w-4" />} label="Integrations active" value={active} />
        <MetricCard icon={<Activity className="h-4 w-4" />} label="Blocks (24h)" value="—" />
      </div>
    </section>
  );
}

function RulesetsPanel({ rulesets, rulesBySet }: { rulesets: RulesetSummary[]; rulesBySet: Record<string, RuleRow[]> }) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Rulesets</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {rulesets.map((r) => {
          const rules = rulesBySet[r.id] ?? [];
          return (
            <div key={r.id} className="rounded-2xl border border-gray-200 dark:border-white/10 p-4 bg-white dark:bg-neutral-900">
              <div className="flex items-baseline justify-between">
                <div className="font-medium text-gray-900 dark:text-gray-100">{r.name}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">{r._count.rules} rules</div>
              </div>

              {rules.length ? (
                <div className="mt-3 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300">
                      <tr>
                        <th className="py-2 px-3 text-left">Name</th>
                        <th className="py-2 px-3 text-left">Action</th>
                        <th className="py-2 px-3 text-left">Pattern</th>
                        <th className="py-2 px-3 text-left">Replacement</th>
                        <th className="py-2 px-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                      {rules.map((rule) => (
                        <tr key={rule.id} className="text-gray-800 dark:text-gray-100 align-top">
                          <td className="py-2 px-3">{rule.name}</td>
                          <td className="py-2 px-3 capitalize">{rule.action}</td>
                          <td className="py-2 px-3">
                            <code
                              className="font-mono text-xs block max-w-[22rem] truncate bg-transparent dark:bg-transparent text-gray-800 dark:text-gray-100"
                              title={rule.pattern}
                            >
                              {rule.pattern}
                            </code>
                          </td>
                          <td className="py-2 px-3">
                            {rule.replacement ? (
                              <code className="font-mono text-xs bg-transparent dark:bg-transparent text-gray-800 dark:text-gray-100">
                                {rule.replacement}
                              </code>
                            ) : (
                              <span className="text-gray-500 dark:text-gray-400">—</span>
                            )}
                          </td>
                          <td className="py-2 px-3">
                            <RuleDeleteButton id={rule.id} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">No rules yet.</div>
              )}
            </div>
          );
        })}
        {!rulesets.length && <div className="text-sm text-gray-600 dark:text-gray-300">No rulesets yet.</div>}
      </div>
    </section>
  );
}

/* Playground (same behavior as demo, embedded here) */
const EMAIL_RE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE_RE = /\+?\d[\d\s().-]{7,}\d/g;
const NAME_RE = /\b([A-Z][a-z'’-]+(?:\s+[A-Z][a-z'’-]+)+)\b/g;
const INVOICE_RE = /\b(?:invoice|inv|bill|ref)[-\s#]*\d{3,}\b/gi;
const API_KEY_RE =
  /\b(?:sk-[A-Za-z0-9-_]{16,}(?![A-Za-z0-9-_])|AKIA[0-9A-Z]{16}(?![A-Z0-9])|ghp_[A-Za-z0-9]{36}(?![A-Za-z0-9])|xox[baprs]-[A-Za-z0-9-]{10,}(?![A-Za-z0-9-])|eyJ[A-Za-z0-9._-]{10,}\.[A-Za-z0-9._-]{10,}\.[A-Za-z0-9._-]{10,}(?![A-Za-z0-9._-]))\b/g;

function sanitizePrompt(input: string) {
  const redact = (text: string, re: RegExp, label: string) => text.replace(re, () => `[REDACTED_${label}]`);
  let out = input;
  out = redact(out, API_KEY_RE, "SECRET");
  out = redact(out, EMAIL_RE, "EMAIL");
  out = redact(out, PHONE_RE, "PHONE");
  out = redact(out, INVOICE_RE, "NUMBER");
  out = redact(out, NAME_RE, "NAME");
  return out;
}

function PlaygroundPanel() {
  const [prompt, setPrompt] = useState(
    `Hey team, can you follow up with Jane Doe about invoice 84921?
Her email is jane.doe@acme.com and phone +1 415-555-0199.
Also don't leak sk-1234567890abcdefghijklmnop. Thanks!`
  );
  const sanitized = useMemo(() => sanitizePrompt(prompt), [prompt]);

  const piiCount =
    (prompt.match(EMAIL_RE)?.length || 0) +
    (prompt.match(PHONE_RE)?.length || 0) +
    (prompt.match(NAME_RE)?.length || 0) +
    (prompt.match(INVOICE_RE)?.length || 0);
  const secretsCount = prompt.match(API_KEY_RE)?.length || 0;
  const blockedRate = secretsCount > 0 ? "2.4%" : "0.6%";
  const decision: "Allowed (Redacted)" | "Needs Review" =
    secretsCount > 0 ? "Allowed (Redacted)" : piiCount > 25 ? "Needs Review" : "Allowed (Redacted)";
  const [isPending, startTransition] = useTransition();
  const [proxyResult, setProxyResult] = useState<any>(null);

  const copySanitized = async () => {
    try { await navigator.clipboard.writeText(sanitized); } catch {}
  };

  return (
    <section className="space-y-6">
      <div className="grid md:grid-cols-5 gap-6 items-start">
        {/* Left */}
        <div className="md:col-span-3 rounded-2xl border border-gray-200 bg-white shadow-sm p-5 dark:border-white/10 dark:bg-transparent">
          <div className="flex items-center justify-between mb-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <EyeOff className="h-4 w-4" />
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
          <div className="mt-5 grid grid-cols-3 gap-3">
            <MetricCard icon={<EyeOff className="h-4 w-4" />} label="PII Redactions" value={piiCount} />
            <MetricCard icon={<KeySquare className="h-4 w-4" />} label="Secrets Detected" value={secretsCount} />
            <MetricCard icon={<Activity className="h-4 w-4" />} label="Blocked" value={blockedRate} />
          </div>
          <div className="mt-4">
            <button
              onClick={() => {
                startTransition(async () => {
                  const res = await routeViaProxy({ messages: [{ role: "user", content: prompt }] });
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
              <pre className="text-sm bg-gray-50 dark:bg-transparent p-2 rounded overflow-auto">
                {JSON.stringify(proxyResult.findings, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="md:col-span-2 rounded-2xl border border-gray-200 bg-white shadow-sm p-5 dark:border-white/10 dark:bg-transparent">
          <div className="flex items-center justify-between mb-4">
            <div className="font-medium text-gray-900 dark:text-gray-200">Policy Decision</div>
            <Badge tone={decision === "Needs Review" ? "review" : "ok"}>{decision}</Badge>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Prompt (sanitized)</div>
          <pre className="text-sm rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-transparent p-3 overflow-auto text-gray-900 dark:text-gray-300">
{sanitizePrompt(prompt)}
          </pre>
        </div>
      </div>
    </section>
  );
}

function ApprovalsPanel() {
  // Placeholder (can wire to real queue later)
  return (
    <section className="rounded-2xl border border-gray-200 dark:border-white/10 p-4 bg-white dark:bg-neutral-900">
      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Approvals</div>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">No pending items.</p>
    </section>
  );
}

function IntegrationsPanel({ integrations }: { integrations: Integration[] }) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Integrations</h2>
      <div className="rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-white/10 text-gray-700 dark:text-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Provider</th>
              <th className="py-3 px-4 text-left">Model</th>
              <th className="py-3 px-4 text-left">Region</th>
              <th className="py-3 px-4 text-left">Base URL</th>
              <th className="py-3 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-white/10">
            {integrations.map((i) => (
              <tr key={i.id} className="text-gray-800 dark:text-gray-100">
                <td className="py-3 px-4">{i.name}</td>
                <td className="py-3 px-4">{i.provider}</td>
                <td className="py-3 px-4">{i.model ?? "—"}</td>
                <td className="py-3 px-4">{i.region ?? "—"}</td>
                <td className="py-3 px-4">
                  <span className="block max-w-[18rem] truncate" title={i.baseUrl ?? ""}>
                    {i.baseUrl ?? "—"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Badge tone={i.active ? "ok" : "muted"}>{i.active ? "Active" : "Disabled"}</Badge>
                    <ToggleIntegrationButton id={i.id} active={i.active} />
                  </div>
                </td>
              </tr>
            ))}
            {!integrations.length && (
              <tr>
                <td className="py-6 px-4 text-center text-gray-500 dark:text-gray-400" colSpan={6}>
                  No integrations yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function EventsPanel() {
  return (
    <section className="max-w-6xl mx-auto px-0">
      <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Recent events</h2>
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
  );
}

/* -------------------- little bits -------------------- */

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

function Badge({
  tone,
  children,
}: {
  tone: "ok" | "muted" | "review" | "block";
  children: React.ReactNode;
}) {
  const map = {
    ok: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200",
    muted: "bg-gray-200 text-gray-800 dark:bg-white/10 dark:text-gray-300",
    review: "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300",
    block: "bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-300",
  } as const;
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${map[tone]}`}>{children}</span>;
}