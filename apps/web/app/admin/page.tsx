// apps/web/app/admin/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth/options";
import ToggleIntegrationButton from "@/components/ToggleIntegrationButton";
import RuleForm from "@/components/RuleForm";
import AIImportRules from "@/components/AIImportRules";
import RulesList from "@/components/RulesList"; // <-- NEW

// Accept search params for tabs
export default async function AdminHome({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/sign-in?callbackUrl=/admin");

  // Load current user + org context
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: { memberships: true },
  });
  const orgId = user?.memberships[0]?.orgId ?? null;

  // Load dashboard data
  const [integrations, membersCount, rulesetSummary] = await Promise.all([
    prisma.integration.findMany({ orderBy: { name: "asc" } }),
    orgId ? prisma.membership.count({ where: { orgId } }) : Promise.resolve(1),
    orgId
      ? prisma.ruleset.findMany({
          where: { orgId },
          select: { id: true, name: true, _count: { select: { rules: true } } },
          orderBy: { createdAt: "asc" },
        })
      : Promise.resolve([] as Array<{ id: string; name: string; _count: { rules: number } }>),
  ]);

  const activeIntegrations = integrations.filter((i) => i.active).length;
  const tab = (searchParams.tab ?? "playground") as
    | "playground"
    | "rules"
    | "integrations"
    | "activity";

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Admin
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Signed in as <span className="font-medium">{session.user.email}</span>
        </p>

        <div className="mt-4 flex gap-3">
          <Link
            href="/admin?tab=playground"
            className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm bg-white text-gray-900 hover:bg-gray-50 border-gray-300
                       dark:bg-transparent dark:text-gray-100 dark:hover:bg-white/5 dark:border-white/10"
          >
            Open demo sandbox
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </header>

      {/* Top metrics (always visible) */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Metric label="Members" value={membersCount} />
        <Metric label="Integrations (active/total)" value={`${activeIntegrations}/${integrations.length}`} />
        <Metric
          label="Rulesets"
          value={
            rulesetSummary.length
              ? `${rulesetSummary.length} (${rulesetSummary.reduce((acc, r) => acc + r._count.rules, 0)} rules)`
              : "0"
          }
        />
      </section>

      {/* Tabs */}
      <TabsNav active={tab} />

      {/* Panels */}
      {tab === "playground" && (
        <section className="mt-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-transparent">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Playground</h2>
              <Link
                href="/admin?tab=rules"
                className="text-sm underline text-gray-700 dark:text-gray-300"
              >
                Configure rules →
              </Link>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              Use the playground on the homepage to try redaction & approvals with your policies.
            </p>
          </div>
        </section>
      )}

      {tab === "rules" && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            Rules &amp; Imports
          </h2>

          {/* Create + Import */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
              <div className="mb-2 font-medium">Create Rule</div>
              <RuleForm />
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
              <div className="mb-2 font-medium">AI-assisted Import</div>
              <AIImportRules />
            </div>
          </div>

          {/* Rulesets overview */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Rulesets</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {rulesetSummary.map((r) => (
                <div key={r.id} className="rounded-2xl border border-gray-200 dark:border-white/10 p-4 bg-white dark:bg-neutral-900">
                  <div className="flex items-baseline justify-between">
                    <div className="font-medium">{r.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">{r._count.rules} rules</div>
                  </div>
                </div>
              ))}
              {rulesetSummary.length === 0 && (
                <div className="text-sm text-gray-600 dark:text-gray-300">No rulesets yet.</div>
              )}
            </div>
          </div>

          {/* Live rules list (first ruleset or default fallback) */}
          <div className="mt-6">
            <RulesList rulesetId={rulesetSummary[0]?.id ?? "default-rules"} />
          </div>
        </section>
      )}

      {tab === "integrations" && (
        <section className="mt-6">
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
                        {i.active ? <Badge tone="ok">Active</Badge> : <Badge tone="approved">Disabled</Badge>}
                        <ToggleIntegrationButton id={i.id} active={i.active} />
                      </div>
                    </td>
                  </tr>
                ))}
                {integrations.length === 0 && (
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
      )}

      {tab === "activity" && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Activity</h2>
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
                <tr className="text-gray-800 dark:text-gray-300">
                  <td className="py-3 px-4 whitespace-nowrap">10:42</td>
                  <td className="py-3 px-4">maria@company.com</td>
                  <td className="py-3 px-4">Prompt scanned (secrets)</td>
                  <td className="py-3 px-4"><Badge tone="ok">Allowed (Redacted)</Badge></td>
                </tr>
                <tr className="text-gray-800 dark:text-gray-300">
                  <td className="py-3 px-4 whitespace-nowrap">10:38</td>
                  <td className="py-3 px-4">lee@company.com</td>
                  <td className="py-3 px-4">Prompt scanned (PII)</td>
                  <td className="py-3 px-4"><Badge tone="ok">Allowed (Redacted)</Badge></td>
                </tr>
                <tr className="text-gray-800 dark:text-gray-300">
                  <td className="py-3 px-4 whitespace-nowrap">10:31</td>
                  <td className="py-3 px-4">arun@company.com</td>
                  <td className="py-3 px-4">Policy escalation</td>
                  <td className="py-3 px-4"><Badge tone="review">Needs Review</Badge></td>
                </tr>
                <tr className="text-gray-800 dark:text-gray-300">
                  <td className="py-3 px-4 whitespace-nowrap">10:18</td>
                  <td className="py-3 px-4">nina@company.com</td>
                  <td className="py-3 px-4">Outbound blocked</td>
                  <td className="py-3 px-4"><Badge tone="block">Blocked</Badge></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}

/* -------------------------- Local UI bits --------------------------- */
function TabsNav({ active }: { active: "playground" | "rules" | "integrations" | "activity" }) {
  const tabs = [
    { id: "playground", label: "Playground" },
    { id: "rules", label: "Rules & Imports" },
    { id: "integrations", label: "Integrations" },
    { id: "activity", label: "Activity" },
  ] as const;

  return (
    <div className="flex gap-2 border-b border-gray-200 dark:border-white/10">
      {tabs.map((t) => {
        const isActive = active === t.id;
        return (
          <Link
            key={t.id}
            href={`/admin?tab=${t.id}`}
            className={[
              "px-3 py-2 text-sm rounded-t-md",
              isActive
                ? "bg-gray-50 text-gray-900 border border-b-0 border-gray-200 -mb-px dark:bg-white/10 dark:text-gray-100 dark:border-white/10"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
            ].join(" ")}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-white/10 p-4 bg-white dark:bg-neutral-900">
      <div className="text-xs text-gray-600 dark:text-gray-300">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</div>
    </div>
  );
}

function Badge({
  tone,
  children,
}: {
  tone: "ok" | "approved" | "review" | "block";
  children: React.ReactNode;
}) {
  const map = {
    ok: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200",
    approved: "bg-gray-200 text-gray-800 dark:bg-white/10 dark:text-gray-300",
    review: "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300",
    block: "bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-300",
  } as const;
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${map[tone]}`}>{children}</span>;
}