"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewRulePage() {
  const r = useRouter();
  const [name, setName] = useState("");
  const [pattern, setPattern] = useState("");
  const [action, setAction] = useState<"redact" | "flag" | "block">("redact");
  const [replacement, setReplacement] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/rules", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, pattern, action, replacement: replacement || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      r.push("/admin");
    } catch (e: any) {
      setError(e.message || "Failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-10 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold">New Rule</h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        Add a custom detection/redaction rule to your default ruleset.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm mb-1">Rule name</label>
          <input
            className="w-full rounded-md border px-3 py-2 bg-white dark:bg-neutral-900 border-gray-300 dark:border-white/15"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Email Redaction"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Regex pattern</label>
          <input
            className="w-full rounded-md border px-3 py-2 bg-white dark:bg-neutral-900 border-gray-300 dark:border-white/15 font-mono"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Action</label>
          <select
            className="w-full rounded-md border px-3 py-2 bg-white dark:bg-neutral-900 border-gray-300 dark:border-white/15"
            value={action}
            onChange={(e) => setAction(e.target.value as any)}
          >
            <option value="redact">redact</option>
            <option value="flag">flag</option>
            <option value="block">block</option>
          </select>
        </div>

        {action === "redact" && (
          <div>
            <label className="block text-sm mb-1">Replacement (optional)</label>
            <input
              className="w-full rounded-md border px-3 py-2 bg-white dark:bg-neutral-900 border-gray-300 dark:border-white/15 font-mono"
              value={replacement}
              onChange={(e) => setReplacement(e.target.value)}
              placeholder="[REDACTED_EMAIL]"
            />
          </div>
        )}

        {error && (
          <div className="text-sm text-rose-500">{error}</div>
        )}

        <div className="flex gap-2 pt-2">
          <button
            onClick={submit}
            disabled={submitting || !name || !pattern || !action}
            className="rounded-md px-4 py-2 text-sm bg-black text-white dark:bg-white dark:text-black disabled:opacity-60"
          >
            {submitting ? "Saving…" : "Save rule"}
          </button>
          <button
            onClick={() => history.back()}
            className="rounded-md px-4 py-2 text-sm border border-gray-300 dark:border-white/15"
          >
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
}