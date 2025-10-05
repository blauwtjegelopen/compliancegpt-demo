"use client";
type Props = { variant?: "flow" | "simple" };
export default function HowItWorks({ variant = "flow" }: Props) {
  if (variant === "flow") {
    return (
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { title: "Your App", desc: "Sends request (prompt/data)" },
          { title: "LayerZero", desc: "Detects & redacts sensitive fields" },
          { title: "LLM Provider", desc: "Receives sanitized payload" },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl border p-4 dark:border-white/10">
            <div className="font-semibold">{s.title}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{s.desc}</div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="rounded-2xl border p-4 dark:border-white/10">
      <div className="font-semibold">How it works</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">Sanitize → Forward → Observe.</div>
    </div>
  );
}
