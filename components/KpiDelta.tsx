// components/KpiDelta.tsx
export function KpiDelta({
  delta,
  invert = false, // if "lower is better", set invert=true
}: {
  delta: number; // e.g., +0.04 => +4%
  invert?: boolean;
}) {
  if (Number.isNaN(delta)) return null;
  const good = invert ? delta < 0 : delta > 0;
  const sign = delta > 0 ? "+" : "";
  const label = `${sign}${Math.round(delta * 100)}%`;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium
        ${good
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
          : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"}`}
      title={`${label} vs. prior month`}
    >
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
        {good ? (
          <path d="M6 14l6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        ) : (
          <path d="M6 10l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        )}
      </svg>
      {label}
    </span>
  );
}