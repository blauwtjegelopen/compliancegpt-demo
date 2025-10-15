'use client';

type Props = { children: React.ReactNode };

/**
 * PageShell
 * - Provides a full-bleed layer for subtle gradients
 * - Constrains the artwork to the same max-width as content (so it "scales with content")
 * - Adds sane mobile spacing + overflow guards
 */
export default function PageShell({ children }: Props) {
  return (
    <div className="relative min-h-dvh bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      {/* Decorative background that scales with content width */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="mx-auto h-full w-full max-w-6xl opacity-60 dark:opacity-40">
          <div className="h-full w-full [background:radial-gradient(600px_300px_at_80%_-20%,rgba(6,182,212,.15),transparent_60%),radial-gradient(420px_260px_at_10%_10%,rgba(59,130,246,.12),transparent_60%)]" />
        </div>
      </div>

      {/* Content */}
      <div className="relative">{children}</div>
    </div>
  );
}