// components/VisionStrip.tsx
export default function VisionStrip() {
  return (
    <section aria-labelledby="vision-title" className="bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-gray-900/50 backdrop-blur p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <h2
                id="vision-title"
                className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white"
              >
                Adopt AI faster, keep control of your data.
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                <span className="text-blue-600 font-semibold">LayerZero</span> ensures privacy,
                compliance, and auditability so you can innovate with confidence.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Privacy by default</Badge>
              <Badge>Policy-aware prompts</Badge>
              <Badge>Tenant-bound processing</Badge>
              <Badge>Auditable decisions</Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-full border border-gray-200 dark:border-white/10
                 bg-gray-50 dark:bg-white/5 px-3 py-1 text-xs font-medium
                 text-gray-700 dark:text-gray-200"
    >
      {children}
    </span>
  );
}