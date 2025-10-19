// components/RuleDeleteButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function RuleDeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onDelete = () => {
    if (!confirm("Delete this rule? This cannot be undone.")) return;
    startTransition(async () => {
      const res = await fetch(`/api/rules/${id}`, { method: "DELETE" });
      if (!res.ok) {
        alert(await res.text());
        return;
      }
      router.refresh();
    });
  };

  return (
    <button
      onClick={onDelete}
      disabled={isPending}
      className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-gray-300 dark:border-white/10 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-xs"
      title="Delete rule"
    >
      {isPending ? "Deleting…" : "Delete"}
    </button>
  );
}