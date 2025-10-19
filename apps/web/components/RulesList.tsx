"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Trash2, Copy } from "lucide-react";
import { useToast } from "@/components/ToastProvider";

type RuleRow = {
  id: string;
  name: string;
  pattern: string;
  action: "redact" | "flag" | "block";
  replacement?: string | null;
  createdAt: string;
};

export default function RulesList({ rulesetId }: { rulesetId: string }) {
  const { push } = useToast();
  const [rules, setRules] = useState<RuleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/rules?rulesetId=${encodeURIComponent(rulesetId)}`, { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setRules(json.rules as RuleRow[]);
    } catch (e: any) {
      push({ tone: "error", title: "Failed to load rules", description: e?.message ?? "Try again." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rulesetId]);

  const onDelete = (id: string) => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/rules/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error(await res.text());
        setRules((prev) => prev.filter((r) => r.id !== id));
        push({ tone: "success", title: "Rule deleted" });
      } catch (e: any) {
        push({ tone: "error", title: "Delete failed", description: e?.message ?? "Please try again." });
      }
    });
  };

  const empty = !loading && rules.length === 0;

  const countByAction = useMemo(() => {
    const m = { redact: 0, flag: 0, block: 0 };
    for (const r of rules) m[r.action]++;
    return m;
  }, [rules]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
      <div className="mb-3 flex items-center justify-between">
        <div className="font-medium text-gray-900 dark:text-gray-100">
          Rules in <span className="font-mono text-sm">{rulesetId}</span>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-300">
          redact: {countByAction.redact} · flag: {countByAction.flag} · block: {countByAction.block}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 overflow-hidden dark:border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="py-2.5 px-3 text-left">Name</th>
              <th className="py-2.5 px-3 text-left">Pattern</th>
              <th className="py-2.5 px-3 text-left">Action</th>
              <th className="py-2.5 px-3 text-left">Replacement</th>
              <th className="py-2.5 px-3 text-left"> </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-white/10">
            {loading && (
              <tr>
                <td colSpan={5} className="py-6 px-3 text-center text-gray-500 dark:text-gray-400">
                  Loading rules…
                </td>
              </tr>
            )}
            {empty && (
              <tr>
                <td colSpan={5} className="py-6 px-3 text-center text-gray-500 dark:text-gray-400">
                  No rules yet.
                </td>
              </tr>
            )}
            {!loading &&
              rules.map((r) => (
                <tr key={r.id} className="text-gray-800 dark:text-gray-100">
                  <td className="py-2.5 px-3 align-top">{r.name}</td>
                  <td className="py-2.5 px-3 align-top">
                    {/* Monospace, no white block in dark mode */}
                    <div className="font-mono text-xs break-all text-gray-800 dark:text-gray-200 bg-transparent">
                      {r.pattern}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 align-top">
                    <span
                      className={[
                        "px-2 py-1 rounded-full text-xs font-medium",
                        r.action === "redact" &&
                          "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200",
                        r.action === "flag" &&
                          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
                        r.action === "block" &&
                          "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200",
                      ].join(" ")}
                    >
                      {r.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 align-top">
                    {r.replacement ? (
                      <span className="font-mono text-xs text-gray-700 dark:text-gray-300">{r.replacement}</span>
                    ) : (
                      <span className="text-xs text-gray-500 dark:text-gray-400">—</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 align-top">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50
                                   dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
                        onClick={async () => {
                          await navigator.clipboard.writeText(r.pattern);
                          push({ tone: "info", title: "Pattern copied" });
                        }}
                        title="Copy pattern"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-xs text-rose-700 hover:bg-rose-50
                                   dark:border-white/10 dark:text-rose-300 dark:hover:bg-rose-900/20 disabled:opacity-60"
                        onClick={() => onDelete(r.id)}
                        disabled={isPending}
                        title="Delete rule"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}