"use client";

import { useState, useTransition } from "react";
import { useToast } from "@/components/ToastProvider";

const ACTIONS = [
  { value: "redact", label: "Redact" },
  { value: "flag", label: "Flag" },
  { value: "block", label: "Block" },
] as const;

export default function RuleForm({ defaultRulesetId = "default-rules" }: { defaultRulesetId?: string }) {
  const [name, setName] = useState("");
  const [pattern, setPattern] = useState("");
  const [action, setAction] = useState<typeof ACTIONS[number]["value"]>("redact");
  const [replacement, setReplacement] = useState("");
  const [rulesetId, setRulesetId] = useState(defaultRulesetId);
  const [isPending, startTransition] = useTransition();
  const { push } = useToast();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const res = await fetch("/api/rules", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rulesetId, name, pattern, action, replacement }),
        });
        if (!res.ok) throw new Error(await res.text());
        setName("");
        setPattern("");
        setReplacement("");
        push({ tone: "success", title: "Rule created", description: `${name} added to ruleset.` });
      } catch {
        push({ tone: "error", title: "Could not create rule", description: "Check your inputs and try again." });
      }
    });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-neutral-900 p-4">
      <div className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Create rule</div>
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">Ruleset ID</label>
            <input
              className="w-full rounded-md border px-3 py-2 bg-white dark:bg-transparent text-gray-900 dark:text-gray-100 border-gray-300 dark:border-white/10"
              value={rulesetId}
              onChange={(e) => setRulesetId(e.target.value)}
              placeholder="default-rules"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">Name</label>
            <input
              className="w-full rounded-md border px-3 py-2 bg-white dark:bg-transparent text-gray-900 dark:text-gray-100 border-gray-300 dark:border-white/10"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Email Redaction"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">Regex pattern</label>
          <input
            className="w-full rounded-md border px-3 py-2 bg-white dark:bg-transparent text-gray-900 dark:text-gray-100 border-gray-300 dark:border-white/10 font-mono"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">Action</label>
            <select
              className="w-full rounded-md border px-3 py-2 bg-white dark:bg-transparent text-gray-900 dark:text-gray-100 border-gray-300 dark:border-white/10"
              value={action}
              onChange={(e) => setAction(e.target.value as any)}
            >
              {ACTIONS.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">Replacement (optional)</label>
            <input
              className="w-full rounded-md border px-3 py-2 bg-white dark:bg-transparent text-gray-900 dark:text-gray-100 border-gray-300 dark:border-white/10"
              value={replacement}
              onChange={(e) => setReplacement(e.target.value)}
              placeholder="[REDACTED_EMAIL]"
            />
          </div>
        </div>

        <div className="pt-1">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm bg-black text-white hover:bg-black/90 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/90"
          >
            {isPending ? "Saving…" : "Create rule"}
          </button>
        </div>
      </form>
    </div>
  );
}