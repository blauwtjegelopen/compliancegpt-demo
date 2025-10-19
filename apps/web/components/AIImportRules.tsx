"use client";

import { useState, useTransition } from "react";
import { useToast } from "@/components/ToastProvider";

type ImportRule = {
  name: string;
  pattern: string;
  action: "redact" | "flag" | "block";
  replacement?: string;
};

const SAMPLE: ImportRule[] = [
  {
    name: "Email",
    pattern: "\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b",
    action: "redact",
    replacement: "[REDACTED_EMAIL]",
  },
  { name: "API Key (sk-…)", pattern: "\\bsk-[A-Za-z0-9-_]{16,}\\b", action: "flag" },
];

export default function AIImportRules({ defaultRulesetId = "default-rules" }: { defaultRulesetId?: string }) {
  const [rulesetId, setRulesetId] = useState(defaultRulesetId);
  const [jsonText, setJsonText] = useState(JSON.stringify(SAMPLE, null, 2));
  const [complianceText, setComplianceText] = useState("");
  const [isPending, startTransition] = useTransition();
  const { push } = useToast();

  const importRules = () => {
    startTransition(async () => {
      try {
        let parsed: ImportRule[];
        try {
          parsed = JSON.parse(jsonText);
        } catch {
          throw new Error("Invalid JSON. Paste an array of rules.");
        }
        if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("No rules found.");

        const res = await fetch("/api/rules/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rulesetId, rules: parsed }),
        });
        if (!res.ok) throw new Error(await res.text());

        const json = await res.json();
        push({ tone: "success", title: "Imported rules", description: `${json.count} rule(s) added.` });
      } catch (e: any) {
        push({ tone: "error", title: "Import failed", description: e?.message ?? "Please check your JSON." });
      }
    });
  };

  const extractAndImportFromCompliance = () => {
    startTransition(async () => {
      try {
        if (!complianceText.trim()) throw new Error("Please paste your compliance text first.");

        const res = await fetch("/api/rules/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rulesetId, text: complianceText }),
        });
        if (!res.ok) throw new Error(await res.text());

        const json = await res.json() as { added: number; preview?: ImportRule[] };
        push({
          tone: "success",
          title: "Compliance rules added",
          description: `Added ${json.added} rule(s) derived from your compliance text.`,
        });
      } catch (e: any) {
        push({ tone: "error", title: "Extraction failed", description: e?.message ?? "Please try again." });
      }
    });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-neutral-900 p-4">
      <div className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Rules &amp; AI-assisted import</div>

      {/* Header controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">Ruleset ID</label>
          <input
            className="w-full rounded-md border px-3 py-2 bg-white dark:bg-transparent text-gray-900 dark:text-gray-100 border-gray-300 dark:border-white/10"
            value={rulesetId}
            onChange={(e) => setRulesetId(e.target.value)}
            placeholder="default-rules"
          />
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => setJsonText(JSON.stringify(SAMPLE, null, 2))}
            className="ml-auto inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm border border-gray-300 hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5"
          >
            Insert example
          </button>
        </div>
      </div>

      {/* JSON import */}
      <div className="mt-4 rounded-xl border border-gray-200 dark:border-white/10 p-3 bg-white dark:bg-transparent">
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Import from JSON</div>
        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">
          Paste JSON rules (array of {"{"}name, pattern, action, replacement?{"}"})
        </label>
        <textarea
          className="w-full h-40 rounded-md border px-3 py-2 font-mono text-sm bg-white dark:bg-transparent text-gray-900 dark:text-gray-100 border-gray-300 dark:border-white/10"
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          spellCheck={false}
        />
        <div className="pt-2">
          <button
            onClick={importRules}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm bg-black text-white hover:bg-black/90 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/90"
          >
            {isPending ? "Importing…" : "Import rules"}
          </button>
        </div>
      </div>

      {/* Compliance ingestion via AI */}
      <div className="mt-4 rounded-xl border border-gray-200 dark:border-white/10 p-3 bg-white dark:bg-transparent">
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Compliance text → Extract with AI &amp; import</div>
        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">
          Paste your company/sector compliance policy (freeform text, PDF copy, etc.)
        </label>
        <textarea
          className="w-full h-40 rounded-md border px-3 py-2 text-sm bg-white dark:bg-transparent text-gray-900 dark:text-gray-100 border-gray-300 dark:border-white/10"
          value={complianceText}
          onChange={(e) => setComplianceText(e.target.value)}
          placeholder="Paste your compliance policy here…"
        />
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          We’ll extract share-safety rules (PII/PHI restrictions, sector-specific prohibitions, data residency, etc.) into structured patterns and add them to your ruleset.
        </p>
        <div className="pt-2">
          <button
            onClick={extractAndImportFromCompliance}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm bg-black text-white hover:bg-black/90 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/90"
          >
            {isPending ? "Extracting…" : "Extract with AI & Import"}
          </button>
        </div>
      </div>
    </div>
  );
}