"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Sugg = {
  name: string;
  pattern: string;
  action: "redact" | "flag" | "block";
  replacement?: string | null;
  selected?: boolean;
};

export default function AiImportPage() {
  const r = useRouter();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Sugg[] | null>(null);
  const [saving, setSaving] = useState(false);

  async function generate() {
    setLoading(true);
    const res = await fetch("/api/rules/ai-import", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    setSuggestions((data.suggestions || []).map((s: Sugg) => ({ ...s, selected: true })));
    setLoading(false);
  }

  async function saveSelected() {
    if (!suggestions) return;
    setSaving(true);
    try {
      for (const s of suggestions.filter((x) => x.selected)) {
        await fetch("/api/rules", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name: s.name,
            pattern: s.pattern,
            action: s.action,
            replacement: s.replacement ?? null,
          }),
        });
      }
      r.push("/admin");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold">AI-assisted Rule Import</h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        Paste policy text or requirements; we’ll suggest common regex rules you can add.
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your security/policy text…"
        className="mt-5 w-full h-40 rounded-md border px-3 py-2 bg-white dark:bg-neutral-900 border-gray-300 dark:border-white/15"
      />

      <div className="mt-3 flex gap-2">
        <button
          onClick={generate}
          disabled={loading || !text.trim()}
          className="rounded-md px-4 py-2 text-sm bg-black text-white dark:bg-white dark:text-black disabled:opacity-60"
        >
          {loading ? "Analyzing…" : "Suggest rules"}
        </button>
        <button
          onClick={() => history.back()}
          className="rounded-md px-4 py-2 text-sm border border-gray-300 dark:border-white/15"
        >
          Cancel
        </button>
      </div>

      {suggestions && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Suggestions</h2>
          <div className="space-y-3">
            {suggestions.map((s, i) => (
              <label key={i} className="block rounded-xl border border-gray-200 dark:border-white/10 p-4 bg-white dark:bg-neutral-900">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="mt-1 text-sm">
                      Action: <span className="font-mono">{s.action}</span>
                      {s.replacement ? (
                        <> · Replacement: <span className="font-mono">{s.replacement}</span></>
                      ) : null}
                    </div>
                    <div className="mt-2 text-xs font-mono text-gray-700 dark:text-gray-300 break-all">
                      {s.pattern}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={!!s.selected}
                    onChange={(e) =>
                      setSuggestions((prev) =>
                        prev!.map((x, idx) => (idx === i ? { ...x, selected: e.target.checked } : x))
                      )
                    }
                    className="mt-1 h-4 w-4"
                  />
                </div>
              </label>
            ))}
          </div>

          <div className="mt-4">
            <button
              onClick={saveSelected}
              disabled={saving || !suggestions.some((s) => s.selected)}
              className="rounded-md px-4 py-2 text-sm bg-black text-white dark:bg-white dark:text-black disabled:opacity-60"
            >
              {saving ? "Adding…" : "Add selected rules"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}