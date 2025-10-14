// components/Charts.tsx
'use client';

type TrendPoint = { d: string; allowed: number; blocked: number; redacted: number };

export default function Charts({ data }: { data: TrendPoint[] }) {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <Card title="Allowed / Blocked / Redacted (last 30 days)">
        <LineMulti
          data={data}
          series={[
            { key: 'allowed', label: 'Allowed' },
            { key: 'blocked', label: 'Blocked' },
            { key: 'redacted', label: 'Redacted' },
          ]}
        />
      </Card>

      <Card title="Totals (last 30 days)">
        <Totals data={data} />
      </Card>
    </div>
  );
}

/* ---------- Tiny UI bits ---------- */

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-5">
      <div className="mb-3 font-medium text-gray-900 dark:text-white">{title}</div>
      {children}
    </div>
  );
}

/* ---------- Charts (inline SVG, no deps) ---------- */

// Multi-line spark chart for 2–3 series
function LineMulti({
  data,
  series,
}: {
  data: TrendPoint[];
  series: { key: keyof TrendPoint; label: string }[];
}) {
  const w = 480;
  const h = 160;
  const pad = 16;

  // Flatten all numeric values to find min/max
  const values = series.flatMap((s) => data.map((d) => Number(d[s.key]) || 0));
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);

  const x = (i: number) =>
    pad + (i * (w - pad * 2)) / Math.max(1, data.length - 1);
  const y = (v: number) =>
    max === min ? h / 2 : pad + (h - pad * 2) * (1 - (v - min) / (max - min));

  const colors = ['currentColor', '#ef4444', '#6366f1']; // neutral / red / indigo

  return (
    <div className="text-xs text-gray-600 dark:text-gray-300">
      <div className="flex gap-3 mb-2">
        {series.map((s, i) => (
          <span key={String(s.key)} className="inline-flex items-center gap-1">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: colors[i] }}
            />
            {s.label}
          </span>
        ))}
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-40 text-gray-800 dark:text-gray-200">
        {/* grid line */}
        <line
          x1={pad}
          y1={y(min)}
          x2={w - pad}
          y2={y(min)}
          stroke="currentColor"
          opacity={0.1}
        />
        {series.map((s, i) => {
          const path = data
            .map((d, idx) => `${idx === 0 ? 'M' : 'L'} ${x(idx)} ${y(Number(d[s.key]) || 0)}`)
            .join(' ');
          return (
            <path
              key={String(s.key)}
              d={path}
              fill="none"
              stroke={colors[i]}
              strokeWidth={2}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    </div>
  );
}

// Simple totals breakdown
function Totals({ data }: { data: TrendPoint[] }) {
  const sum = (k: keyof TrendPoint) =>
    data.reduce((acc, d) => acc + (Number(d[k]) || 0), 0);

  const allowed = sum('allowed');
  const blocked = sum('blocked');
  const redacted = sum('redacted');
  const total = allowed + blocked + redacted || 1;

  const parts = [
    { label: 'Allowed', value: allowed },
    { label: 'Blocked', value: blocked },
    { label: 'Redacted', value: redacted },
  ];

  return (
    <div>
      <div className="flex gap-2 h-2 rounded overflow-hidden mb-3">
        {parts.map((p, i) => (
          <div
            key={p.label}
            style={{
              width: `${(p.value / total) * 100}%`,
              background: ['#0ea5e9', '#ef4444', '#6366f1'][i],
            }}
          />
        ))}
      </div>
      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
        {parts.map((p, i) => (
          <li key={p.label} className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded"
              style={{ background: ['#0ea5e9', '#ef4444', '#6366f1'][i] }}
            />
            <span className="w-24">{p.label}</span>
            <span className="tabular-nums">{p.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}