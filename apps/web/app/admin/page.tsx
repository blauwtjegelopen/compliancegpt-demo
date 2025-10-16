// apps/web/app/admin/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import Link from "next/link";

export default async function AdminHome() {
  const session = await getServerSession(authOptions);

  // Middleware already guards, but this keeps SSR consistent
  if (!session) {
    return null; // middleware will redirect to /sign-in
  }

  const user = session.user;
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-10">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100">
        Admin
      </h1>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        Welcome{user?.name ? `, ${user.name}` : ""}. This is your organization’s admin hub.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/demo"
          className="rounded-xl border border-gray-200 dark:border-white/10 p-5 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 transition"
        >
          <div className="text-gray-900 dark:text-gray-100 font-semibold">Playground (Demo)</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Try redaction, PII/code/secrets detection, and approvals in a safe environment.
          </div>
        </Link>

        <Link
          href="/admin/rules"
          className="rounded-xl border border-gray-200 dark:border-white/10 p-5 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 transition"
        >
          <div className="text-gray-900 dark:text-gray-100 font-semibold">Rules & Policies</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage company rulesets. Import from legal/compliance copy with AI assistance.
          </div>
        </Link>
      </div>
    </section>
  );
}