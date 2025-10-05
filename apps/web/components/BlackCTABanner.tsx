export default function BlackCTABanner() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <div className="rounded-2xl bg-black text-white p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-xl font-semibold">The foundation of safe AI</div>
          <div className="text-sm text-gray-300">
            Zero-retention mode. Region routing. Audit exports.
          </div>
        </div>
        <div className="flex gap-3">
          <a className="px-4 py-2 rounded-2xl bg-white text-black" href="/trust">
            Security &amp; Trust
          </a>
          <a className="px-4 py-2 rounded-2xl border border-white" href="/admin">
            Launch Demo
          </a>
        </div>
      </div>
    </section>
  );
}