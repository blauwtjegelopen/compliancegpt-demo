// apps/web/app/admin/rules/page.tsx
'use client';

import { useState, useTransition } from 'react';
import { Plus, X } from 'lucide-react';
import { routeViaProxy } from '@/lib/proxy';

type RuleAction = 'redact' | 'flag' | 'block';
type CustomRule = { id: string; name: string; pattern: string; action: RuleAction; replacement?: string };
type SuggestedRule = Omit<CustomRule, 'id'>;

function toCustomRules(suggested: SuggestedRule[]): CustomRule[] {
  return (suggested || []).map((r) => ({
    ...r,
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random()}`,
  }));
}

type ProxyResponse = { data?: any; findings?: unknown; error?: string; [k: string]: any };
function extractTextFromProxy(res: ProxyResponse | null): string {
  const anyRes = res as any;
  const candidates = [
    anyRes?.data?.content,
    anyRes?.data?.choices?.[0]?.message?.content,
    anyRes?.choices?.[0]?.message?.content,
    anyRes?.data?.message?.content,
    anyRes?.text,
    anyRes?.echo?.messages?.[0]?.content,
    typeof anyRes?.data === 'string' ? anyRes?.data : null,
  ];
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c;
  }
  return '';
}

export default function RulesPage() {
  const [rules, setRules] = useState<CustomRule[]>([]);
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100">Rules & Policies</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Create custom detection/redaction rules and import suggestions from compliance copy.
      </p>

      <RulesetPanel
        rules={rules}
        onAdd={(r) => setRules((rs) => [...rs, r])}
        onRemove={(id) => setRules((rs) => rs.filter((r) => r.id !== id))}
      />
      <RulesAIBuilder onAddMany={(newRules) => setRules((rs) => [...rs, ...newRules])} />
    </main>
  );
}

/* ---------------------------- Ruleset Panel UI ---------------------------- */
function RulesetPanel({
  rules,
  onAdd,
  onRemove,
}: {
  rules: CustomRule[];
  onAdd: (rule: CustomRule) => void;
  onRemove: (id: string) => void;
}) {
  const [name, setName] = useState('');
  const [pattern, setPattern] = useState('');
  const [action, setAction] = useState<RuleAction>('redact');
  const [replacement, setReplacement] = useState('');

  const addRule = () => {
    if (!name.trim() || !pattern.trim()) return;
    onAdd({
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random()}`,
      name: name.trim(),
      pattern: pattern.trim(),
      action,
      replacement: action === 'redact' && replacement ? replacement : undefined,
    });
    setName(''); setPattern(''); setReplacement(''); setAction('redact');
  };

  return (
    <section className="pb-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-3">Custom rules</h3>
      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent p-4">
        <div className="grid md:grid-cols-5 gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Rule name"
            className="md:col-span-2 rounded-md border border-gray-300 dark:border-white/10 bg-white dark:bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-gray-200"
          />
          <input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Regex pattern (e.g., (?i)ssn\\b\\s*[:#-]?\\s*\\d{3}-\\d{2}-\\d{4})"
            className="md:col-span-3 rounded-md border border-gray-300 dark:border-white/10 bg-white dark:bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-gray-200 font-mono"
          />
          <select
            value={action}
            onChange={(e) => setAction(e.target.value as RuleAction)}
            className="rounded-md border border-gray-300 dark:border-white/10 bg-white dark:bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-gray-200"
          >
            <option value="redact">redact</option>
            <option value="flag">flag</option>
            <option value="block">block</option>
          </select>
          <input
            value={replacement}
            onChange={(e) => setReplacement(e.target.value)}
            placeholder="Replacement (only for redact)"
            className="md:col-span-3 rounded-md border border-gray-300 dark:border-white/10 bg-white dark:bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-gray-200"
            disabled={action !== 'redact'}
          />
          <button
            onClick={addRule}
            className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black text-sm"
            title="Add rule"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>

        <div className="mt-4">
          {rules.length === 0 ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">No custom rules yet.</div>
          ) : (
            <ul className="space-y-2">
              {rules.map((r) => (
                <li key={r.id} className="rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-3 py-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                        {r.name} <span className="ml-2 text-xs text-gray-500">[{r.action}]</span>
                      </div>
                      <div className="mt-1 text-xs text-gray-600 dark:text-gray-400 font-mono break-all">{r.pattern}</div>
                      {r.action === 'redact' && r.replacement && (
                        <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                          replacement: <span className="font-mono">{r.replacement}</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => onRemove(r.id)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-gray-300 dark:border-white/10 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-xs shrink-0"
                      title="Remove"
                    >
                      <X className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

/* ----------------------- AI-assisted rule import UI ----------------------- */
function RulesAIBuilder({
  onAddMany,
  route = routeViaProxy,
}: {
  onAddMany: (rules: CustomRule[]) => void;
  route?: typeof routeViaProxy;
}) {
  const [text, setText] = useState('');
  const [preview, setPreview] = useState<SuggestedRule[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, startTransition] = useTransition();

  const generate = () => {
    setError(null);
    setPreview(null);
    if (!text.trim()) { setError('Paste some policy text first.'); return; }
    startTransition(async () => {
      try {
        const messages = [
          {
            role: 'system',
            content: `You are a compliance rules extractor. From the user's policy text, extract a minimal set of rules as JSON only.
Return JSON ONLY, no prose. Schema:
{ "rules": [ { "name": "string", "pattern": "regex (double-escaped)", "action": "redact | flag | block", "replacement": "optional" } ] }`
          },
          { role: 'user', content: text },
        ];
        const res = await route({ messages });
        const raw = extractTextFromProxy(res);

        let parsed: any = null;
        try { parsed = typeof raw === 'string' ? JSON.parse(raw) : raw; }
        catch { const m = String(raw).match(/\{[\s\S]*\}/); if (m) parsed = JSON.parse(m[0]); }

        if (!parsed || !Array.isArray(parsed.rules)) throw new Error('Model did not return a valid rules array.');
        const cleaned: SuggestedRule[] = parsed.rules
          .filter((r: any) => r?.name && r?.pattern && r?.action)
          .map((r: any) => ({
            name: String(r.name).trim(),
            pattern: String(r.pattern).trim(),
            action: (String(r.action).toLowerCase() as RuleAction) ?? 'flag',
            replacement: r.replacement ? String(r.replacement) : undefined,
          }));
        if (!cleaned.length) throw new Error('No usable rules found.');
        setPreview(cleaned);
      } catch (e: any) {
        setError(e?.message || 'Could not generate rules.');
      }
    });
  };

  const merge = () => {
    if (!preview?.length) return;
    onAddMany(toCustomRules(preview));
    setPreview(null);
    setText('');
  };

  return (
    <section className="pb-10">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-3">AI-assisted rule import</h3>

      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent p-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Paste compliance/legal copy and let AI draft suggested rules (regex + action). Review and merge.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste policy text (e.g., 'Files containing patient identifiers must not leave the tenant...')"
          className="w-full min-h-[140px] rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-gray-200"
        />

        <div className="mt-3 flex gap-2">
          <button
            onClick={generate}
            disabled={busy}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black text-sm"
          >
            {busy ? 'Generating…' : 'Generate rules'}
          </button>
          <button
            onClick={merge}
            disabled={!preview?.length}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm disabled:opacity-50"
            title={preview?.length ? 'Add suggested rules to your ruleset' : 'Generate rules first'}
          >
            Merge to ruleset
          </button>
        </div>

        {error && (
          <div className="mt-3 text-sm rounded border border-rose-200 bg-rose-50 p-2 text-rose-800 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-300">
            {error}
          </div>
        )}

        {preview && (
          <div className="mt-4">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Suggested rules (preview)</div>
            <pre className="text-sm rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-transparent p-3 overflow-auto text-gray-900 dark:text-gray-300">
{JSON.stringify(preview, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </section>
  );
}