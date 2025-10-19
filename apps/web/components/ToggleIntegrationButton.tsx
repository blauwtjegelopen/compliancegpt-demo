"use client";

import { useOptimistic, useTransition } from "react";
import { useToast } from "@/components/ToastProvider";

export default function ToggleIntegrationButton({
  id,
  active,
}: {
  id: string;
  active: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [optimisticActive, setOptimisticActive] = useOptimistic(active);
  const { push } = useToast();

  const toggle = () => {
    startTransition(async () => {
      const next = !optimisticActive;
      setOptimisticActive(next); // optimistic flip

      try {
        const res = await fetch(`/api/integrations/${id}/toggle`, { method: "POST" });
        if (!res.ok) throw new Error(await res.text());
        const json = await res.json();
        // reconcile if server disagrees
        if (typeof json.active === "boolean") setOptimisticActive(json.active);

        push({
          tone: "success",
          title: json.active ? "Integration enabled" : "Integration disabled",
          description: "Your change has been saved.",
        });
      } catch (e) {
        // rollback
        setOptimisticActive(!next);
        push({
          tone: "error",
          title: "Toggle failed",
          description: "Please try again.",
        });
      }
    });
  };

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs border transition
        ${optimisticActive
          ? "bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700 disabled:opacity-60"
          : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50 disabled:opacity-60 dark:bg-transparent dark:text-gray-200 dark:border-white/10 dark:hover:bg-white/5"
        }`}
      aria-pressed={optimisticActive}
    >
      {isPending ? "Saving…" : optimisticActive ? "Disable" : "Enable"}
    </button>
  );
}