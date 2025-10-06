// components/GovernanceClient.tsx
'use client';

import { useMemo, useState } from 'react';

/** Accept a broad/loose telemetry shape (matches external type with optionals). */
type InTelemetry = {
  industry?: string;
  month?: string;
  redactionRate?: number;
  blockRate?: number;
  timeToApproveSec?: number;
  escalationsPer1000?: number;
  piiTypes?: Record<string, number>;
};

/** Internal normalized shape (we guarantee industry is set). */
type Telemetry = InTelemetry & {
  industry: 'All' | 'Finance' | 'Healthcare' | 'SaaS' | 'Public Sector' | string;
};

export default function GovernanceClient({ initialData }: { initialData: InTelemetry[] }) {
  // Normalize incoming data (fill missing industry with "All")
  const normalized: Telemetry[] = useMemo(
    () =>
      (initialData ?? []).map((d) => ({
        ...d,
        industry: (d.industry ?? 'All') as Telemetry['industry'],
      })),
    [initialData]
  );

  const [industry, setIndustry] = useState<Telemetry['industry']>('All');
  const hasData = normalized.length > 0;

  // helpers
  const n = (v?: number) => (typeof v === 'number' && isFinite(v) ? v : 0);
  const s = (v?: string) => v ?? '';

  // Group by industry
  const byIndustry = useMemo(() => {
    const map = new Map<Telemetry['industry'], Telemetry[]>();
    normalized.forEach((d) => {
      const arr = map.get(d.industry) ?? [];
      arr.push(d);
      map.set(d.industry, arr);
    });
    // ensure month order (null-safe)
    map.forEach((arr) => arr.sort((a, b) => s(a.month).localeCompare(s(b.month))));
    return map;
  }, [normalized]);

  const seriesAll = useMemo(() => byIndustry.get('All') ?? [], [byIndustry]);
  const currentSeries = useMemo(
    () => byIndustry.get(industry) ?? seriesAll,
    [byIndustry, industry, seriesAll]
  );

  const latestAll = seriesAll.at(-1) ?? null;
  const latest = currentSeries.at(-1) ?? null;

  const pct = (x: number) => `${Math.round(x * 100)}%`;

  // Comparative deltas vs All
  const deltas = useMemo(() => {
    if (!latest || !latestAll) return null;
    return {
      redactionRate: n(latest.redactionRate) - n(latestAll.redactionRate),
      blockRate: n(latest.blockRate) - n(latestAll.blockRate),
      timeToApproveSec: n(latest.timeToApproveSec) - n(latestAll.timeToApproveSec),
      escalationsPer1000: n(latest.escalationsPer1000) - n(latestAll.escalationsPer1000),
    };
  }, [latest, latestAll]);

  // Cross-industry callouts
  const crossIndustryLatest = useMemo(() => {
    if (!byIndustry.size) return null;
    const month = latestAll?.month ?? Array.from(byIndustry.values())[0]?.at(-1)?.month;
    if (!month) return null;

    const snapshot = Array.from(byIndustry.entries())
      .filter(([k]) => k !== 'All')
      .map(([_, arr]) => arr.find((d) => d.month === month))
      .filter(Boolean) as Telemetry[];

    if (!snapshot.length) return null;

    const maxBy = (
      key: keyof Pick<Telemetry, 'redactionRate' | 'blockRate' | 'timeToApproveSec' | 'escalationsPer1000'>
    ) => snapshot.reduce((m, v) => (n(m?.[key]) > n(v?.[key]) ? m : v), snapshot[0]);

    const minBy = (
      key: keyof Pick<Telemetry, 'redactionRate' | 'blockRate' | 'timeToApproveSec' | 'escalationsPer1000'>
    ) => snapshot.reduce((m, v) => (n(m?.[key]) < n(v?.[key]) ? m : v), snapshot[0]);

    return {
      month,
      highestRedaction: maxBy('redactionRate'),
      lowestRedaction: minBy('redactionRate'),
      highestBlock: maxBy('blockRate'),
      fastestApproval: minBy('timeToApproveSec'),
    };
  }, [byIndustry, latestAll]);

  return (
    <>
      {/* Controls */}
      <section className="max-w-6xl mx-auto px-6 pt-8">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-gray-600 dark:text-gray-300">Industry</label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value as Telemetry['industry'])}
            className="rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-900 px-3 py-2 text-sm
                       text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500/40"
          >
            {['All', 'Finance', 'Healthcare', 'SaaS', 'Public Sector'].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          {/* Download CSV of the current series */}
          <DownloadCsv data={currentSeries} />

          <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
            {latest ? `Latest: ${s(latest.month)}` : hasData ? '' : 'No telemetry available'}
          </span>
        </div>
      </section>

      {/* Empty/Error state */}
      {!hasData ? (
        <section className="max-w-6xl mx-auto px-6 py-10">
          <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-6">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              We couldn’t load telemetry yet. Populate the API or try again.
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* --- Why this matters --- */}
          {latest && latestAll && (
            <WhyThisMatters
              industry={industry}
              latest={{
                ...latest,
                redactionRate: n(latest.redactionRate),
                blockRate: n(latest.blockRate),
                timeToApproveSec: n(latest.timeToApproveSec),
              }}
              latestAll={{
                ...latestAll,
                redactionRate: n(latestAll.redactionRate),
                blockRate: n(latestAll.blockRate),
                timeToApproveSec: n(latestAll.timeToApproveSec),
              }}
              deltas={deltas}
              pct={pct}
            />
          )}

          {/* --- Executive Summary --- */}
          {latest && latestAll && (
            <section className="max-w-6xl mx-auto px-6 py-8">
              <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Executive Summary — {industry}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Benchmarked against All industries ({s(latestAll.month)})
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-white/10 px-3 py-1 text-xs text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg:white/5 dark:bg-opacity-5">
                    <Dot className="text-cyan-500" /> Policy redactions &amp; blocks
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <SummaryCard
                    label="Prompts with redactions"
                    value={pct(n(latest.redactionRate))}
                    delta={deltas?.redactionRate ?? 0}
                    goodIsLower
                  />
                  <SummaryCard
                    label="Policy blocks"
                    value={pct(n(latest.blockRate))}
                    delta={deltas?.blockRate ?? 0}
                    goodIsLower
                  />
                  <SummaryCard
                    label="Avg. approval time"
                    value={`${n(latest.timeToApproveSec)}s`}
                    delta={deltas?.timeToApproveSec ?? 0}
                    unit="s"
                    goodIsLower
                  />
                  <SummaryCard
                    label="Escalations per 1k"
                    value={`${n(latest.escalationsPer1000)}`}
                    delta={deltas?.escalationsPer1000 ?? 0}
                    goodIsLower
                  />
                </div>
              </div>
            </section>
          )}

          {/* --- Industry Callouts --- */}
          {crossIndustryLatest && (
            <section className="max-w-6xl mx-auto px-6 pt-2 pb-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Callout
                  title="Where redaction is highest"
                  kpi={pct(n(crossIndustryLatest.highestRedaction.redactionRate))}
                  caption={`${crossIndustryLatest.highestRedaction.industry} — ${crossIndustryLatest.month}`}
                />
                <Callout
                  title="Where blocks are most common"
                  kpi={pct(n(crossIndustryLatest.highestBlock.blockRate))}
                  caption={`${crossIndustryLatest.highestBlock.industry} — ${crossIndustryLatest.month}`}
                />
                <Callout
                  title="Fastest approvals"
                  kpi={`${n(crossIndustryLatest.fastestApproval.timeToApproveSec)}s`}
                  caption={`${crossIndustryLatest.fastestApproval.industry} — ${crossIndustryLatest.month}`}
                />
              </div>
            </section>
          )}

          {/* --- KPI cards (detail) --- */}
          {latest && (
            <section className="max-w-6xl mx-auto px-6 py-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard label="Prompts with redactions" value={pct(n(latest.redactionRate))} hint="Lower is better" />
                <KpiCard label="Policy blocks" value={pct(n(latest.blockRate))} hint="Lower is better" />
                <KpiCard label="Avg. approval time" value={`${n(latest.timeToApproveSec)}s`} hint="Human-in-the-loop" />
                <KpiCard
                  label="Escalations per 1k prompts"
                  value={`${n(latest.escalationsPer1000)}`}
                  hint="Risk triage load"
                />
              </div>
            </section>
          )}

          {/* --- Charts --- */}
          <section className="max-w-6xl mx-auto px-6 pb-4">
            <div className="grid lg:grid-cols-3 gap-4">
              <Card title="Redaction rate trend" subtitle="Past 6 months (All industries)">
                <LineSpark
                  data={(seriesAll ?? []).map((d) => n(d.redactionRate))}
                  format={(v) => `${Math.round(v * 100)}%`}
                />
              </Card>

              <Card title="Block rate trend" subtitle="Past 6 months (All industries)">
                <LineSpark
                  data={(seriesAll ?? []).map((d) => n(d.blockRate))}
                  format={(v) => `${Math.round(v * 100)}%`}
                />
              </Card>

              <Card title="PII distribution" subtitle={`${industry} — latest month`}>
                <BarMini data={latest ? Object.entries(latest.piiTypes ?? {}) : []} />
              </Card>
            </div>

            {/* Tiny narrative under charts */}
            {latest && latestAll && (
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                {industry === 'All'
                  ? `Redaction and block rates reflect combined policies across industries.`
                  : `${industry} sits ${deltaText(deltas?.redactionRate, true)} on redactions and ${deltaText(
                      deltas?.blockRate,
                      true
                    )} on blocks vs All.`}
              </p>
            )}
          </section>
        </>
      )}
    </>
  );
}

/* ----------------- Why This Matters ----------------- */

function WhyThisMatters({
  industry,
  latest,
  latestAll,
  deltas,
  pct,
}: {
  industry: Telemetry['industry'];
  latest: Telemetry;
  latestAll: Telemetry;
  deltas: {
    redactionRate: number;
    blockRate: number;
    timeToApproveSec: number;
    escalationsPer1000: number;
  } | null;
  pct: (n: number) => string;
}) {
  const isAll = industry === 'All';
  const topPii = Object.entries(latest.piiTypes ?? {}).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))[0];

  const redactionDisplay = isAll ? pct(latest.redactionRate ?? 0) : asPercent(deltas?.redactionRate ?? 0);
  const blockDisplay = isAll ? pct(latest.blockRate ?? 0) : asPercent(deltas?.blockRate ?? 0);

  const redactionLabel = isAll ? 'All (latest) — Redactions' : 'All vs. benchmark — Redactions';
  const blockLabel = isAll ? 'All (latest) — Blocks' : 'All vs. benchmark — Blocks';

  return (
    <section className="max-w-6xl mx-auto px-6 py-6">
      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Why this matters</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          This dashboard shows where governance is working—how often prompts need redaction, how often policies block
          risky content, how long approvals take, and which PII appears most. Use it to calibrate controls, set SLAs,
          and report progress.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {/* Redactions */}
          <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-4">
            <div className="text-xs text-gray-500 dark:text-gray-400">{redactionLabel}</div>
            <div className="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white">{redactionDisplay}</div>
          </div>

          {/* Blocks */}
          <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-4">
            <div className="text-xs text-gray-500 dark:text-gray-400">{blockLabel}</div>
            <div className="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white">{blockDisplay}</div>
          </div>

          {/* Top PII */}
          <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-4">
            <div className="text-xs text-gray-500 dark:text-gray-400">Top PII signal ({latest.month ?? '—'})</div>
            <div className="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white">
              {topPii ? `${topPii[0]} ${topPii[1]}%` : '—'}
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Benchmarked against “All industries” ({latestAll.month ?? '—'}). Lower redactions/blocks and faster approvals are
          better.
        </p>
      </div>
    </section>
  );
}

/* ----------------- Small UI building blocks ----------------- */

function SummaryCard({
  label,
  value,
  delta,
  unit,
  goodIsLower = false,
}: {
  label: string;
  value: string;
  delta: number;
  unit?: 's';
  goodIsLower?: boolean;
}) {
  const sign: 'up' | 'down' | 'flat' = delta === 0 ? 'flat' : delta > 0 ? 'up' : 'down';
  const isGood = goodIsLower ? delta < 0 : delta > 0;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-4">
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{value}</div>
        <DeltaPill sign={sign} good={isGood} value={unit === 's' ? `${fmtNum(delta)}s` : asPercent(delta)} />
      </div>
    </div>
  );
}

function DeltaPill({ sign, good, value }: { sign: 'up' | 'down' | 'flat'; good: boolean; value: string }) {
  let arrow = '→';
  if (sign === 'up') arrow = '↑';
  if (sign === 'down') arrow = '↓';
  const tone = good
    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
    : sign === 'flat'
    ? 'bg-gray-50 text-gray-700 dark:bg-white/5 dark:text-gray-300'
    : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ring-1 ring-inset
                      ${tone} ring-black/5 dark:ring-white/10`}
    >
      <span aria-hidden="true">{arrow}</span>
      <span>{value}</span>
      <span className="sr-only">
        {good ? 'better than benchmark' : sign === 'flat' ? 'on par with benchmark' : 'worse than benchmark'}
      </span>
    </span>
  );
}

function Callout({ title, kpi, caption }: { title: string; kpi: string; caption: string }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-4">
      <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">{title}</div>
      <div className="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white">{kpi}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{caption}</div>
    </div>
  );
}

function KpiCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-4">
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
      <div className="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white">{value}</div>
      {hint && <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{hint}</div>}
    </div>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-5">
      <div className="mb-3">
        <div className="font-medium text-gray-900 dark:text-white">{title}</div>
        {subtitle && <div className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

/** Minimal line sparkline using inline SVG (no deps). */
function LineSpark({ data, format }: { data: number[]; format?: (v: number) => string }) {
  if (!data?.length) return <div className="h-20 rounded bg-gray-50 dark:bg-white/5" />;
  const w = 320, h = 72, pad = 8;
  const xs = (i: number) => pad + (i * (w - pad * 2)) / Math.max(data.length - 1, 1);
  const min = Math.min(...data), max = Math.max(...data);
  const ys = (v: number) => (max === min ? h / 2 : pad + (h - pad * 2) * (1 - (v - min) / (max - min)));
  const d = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xs(i)} ${ys(v)}`).join(' ');
  const last = data[data.length - 1];

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-20 text-cyan-600 dark:text-cyan-400">
        <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <div className="absolute top-1 right-1 text-xs text-gray-600 dark:text-gray-300">
        {format ? format(last) : String(last)}
      </div>
    </div>
  );
}

/** Minimal bar chart (category,value[]) using inline SVG. */
function BarMini({ data }: { data: [string, number][] }) {
  if (!data?.length) return <div className="h-28 rounded bg-gray-50 dark:bg-white/5" />;
  const max = Math.max(...data.map(([, v]) => v));
  const w = 320, h = 120, gap = 10;
  const barW = (w - gap * (data.length - 1)) / data.length;

  return (
    <div className="text-xs">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-28">
        {data.map(([k, v], i) => {
          const bh = Math.round((v / (max || 1)) * (h - 20));
          const x = i * (barW + gap);
          const y = h - bh;
          return (
            <g key={k}>
              <rect x={x} y={y} width={barW} height={bh} rx="6" className="fill-gray-2 00 dark:fill-white/15" />
              <text x={x + barW / 2} y={h - 4} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300">
                {k}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function DownloadCsv({ data }: { data: InTelemetry[] }) {
  const onClick = () => {
    if (!data?.length) return;
    const headers = [
      'industry',
      'month',
      'redactionRate',
      'blockRate',
      'timeToApproveSec',
      'escalationsPer1000',
      'Email',
      'Name',
      'Phone',
      'Address',
    ];
    const rows = data.map((d) => [
      d.industry ?? '',
      d.month ?? '',
      d.redactionRate ?? '',
      d.blockRate ?? '',
      d.timeToApproveSec ?? '',
      d.escalationsPer1000 ?? '',
      d.piiTypes?.Email ?? '',
      d.piiTypes?.Name ?? '',
      d.piiTypes?.Phone ?? '',
      d.piiTypes?.Address ?? '',
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `layerzero-telemetry-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className="ml-auto rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-900 px-3 py-2 text-sm
                 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5"
    >
      Download CSV
    </button>
  );
}

function Dot({ className = '' }: { className?: string }) {
  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${className}`} aria-hidden="true" />;
}

/* ----- small utils ----- */
function asPercent(delta: number) {
  if (!isFinite(delta)) return '0%';
  const s = Math.round(delta * 100);
  return s > 0 ? `+${s}%` : `${s}%`;
}
function fmtNum(n: number) {
  const s = Math.round(n);
  return s > 0 ? `+${s}` : `${s}`;
}
function deltaText(delta: number | undefined, lowerIsBetter = false) {
  if (delta === undefined || !isFinite(delta) || delta === 0) return 'on par';
  const dirUp = delta > 0;
  const good = lowerIsBetter ? !dirUp : dirUp;
  const sign = Math.abs(Math.round(delta * 100)) + '%';
  return `${dirUp ? '↑' : '↓'} ${sign} ${good ? 'better' : 'higher'}`;
}