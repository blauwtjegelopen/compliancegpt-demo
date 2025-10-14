// apps/web/components/BlackCTABanner.tsx
export default function BlackCTABanner() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <div
        className="rounded-2xl p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4
                   bg-black text-white dark:bg-gradient-to-b dark:from-gray-950 dark:to-gray-900
                   transition-colors"
      >
        {/* Copy */}
        <div>
          <div className="text-xl font-semibold text-white dark:text-gray-100">
            The foundation of safe AI
          </div>
          <div className="text-sm text-gray-400 dark:text-gray-300">
            Zero-retention mode. Region routing. Audit exports.
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3">
          <a
            href="/trust"
            className="px-4 py-2 rounded-2xl font-medium bg-white text-black hover:bg-gray-100
                       dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-colors"
          >
            Security &amp; Trust
          </a>
          <a
            href="/admin"
            className="px-4 py-2 rounded-2xl font-medium border border-white/70 text-white hover:bg-white hover:text-black
                       dark:border-blue-400 dark:text-blue-100 dark:hover:bg-blue-500 dark:hover:text-white
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-colors"
          >
            Launch Demo
          </a>
        </div>
      </div>
    </section>
  );
}