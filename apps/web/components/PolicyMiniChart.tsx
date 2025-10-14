// components/PolicyMiniChart.tsx
'use client';

type Point = { date: string; redactions: number; blocks: number; approvals: number };

export default function PolicyMiniChart({ data }: { data: Point[] }) {
  return (
    <div className="h-48 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-4">
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        Governance signals (last 30 days)
      </div>
      <LineMulti
        data={data}
        series={[
          { key: 'redactions', label: 'Redactions', color: '#6366f1' },
          { key: 'blocks', label: 'Blocks', color: '#ef4444' },
          { key: 'approvals', label: 'Approvals', color: '#10b981' },
        ]}
      />
    </div>
  );
}

function LineMulti({
  data,
  series,
}: {
  data: Point[];
  series: { key: keyof Point; label: string; color: string }[];
}) {
  const w = 560;
  const h = 160;
  const pad = 18;

  const vals = series.flatMap((s) => data.map((d) => Number(d[s.key]) || 0));
  const min = Math.min(...vals, 0);
  const max = Math.max(...vals, 1);

  const x = (i: number) =>
    pad + (i * (w - pad * 2)) / Math.max(1, data.length - 1);
  const y = (v: number) =>
    max === min ? h / 2 : pad + (h - pad * 2) * (1 - (v - min) / (max - min));

  return (
    <div className="text-xs text-gray-600 dark:text-gray-300">
      <div className="flex gap-3 mb-2">
        {series.map((s) => (
          <span key={String(s.key)} className="inline-flex items-center gap-1">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: s.color }}
            />
            {s.label}
          </span>
        ))}
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-36">
        <line
          x1={pad}
          y1={h - pad}
          x2={w - pad}
          y2={h - pad}
          stroke="currentColor"
          opacity={0.12}
        />
        {series.map((s) => {
          const dAttr = data
            .map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(Number(d[s.key]) || 0)}`)
            .join(' ');
          return (
            <path
              key={String(s.key)}
              d={dAttr}
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    </div>
  );
}