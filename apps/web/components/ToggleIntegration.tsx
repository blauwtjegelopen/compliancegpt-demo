"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function ToggleIntegration({
  id,
  active,
}: { id: string; active: boolean }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const toggle = () => {
    startTransition(async () => {
      await fetch(`/api/integrations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      });
      router.refresh();
    });
  };

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className={`px-2 py-1 rounded-md text-xs border
        ${active
          ? "bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700"
          : "bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/15"
        }`}
      title={active ? "Disable" : "Enable"}
    >
      {isPending ? "Saving…" : active ? "Disable" : "Enable"}
    </button>
  );
}