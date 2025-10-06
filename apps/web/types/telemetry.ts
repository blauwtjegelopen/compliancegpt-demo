export type Telemetry = {
  /** Logical page or route, e.g. "/state-of-ai-governance" */
  page: string;
  referer?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  ts: string; // ISO timestamp

  /** --- Fields used by GovernanceClient / aggregations --- */
  industry?: string;   // e.g., "Finance", "Healthcare", "All"
  region?: string;     // e.g., "US", "EU"
  event?: string;      // e.g., "view", "cta_click"
  count?: number;      // optional numeric metric

  /**
   * Month bucket used for charts, e.g. "2025-01" or "Jan 2025".
   * Kept as string so we can sort via localeCompare in the component.
   */
  month?: string;

  /** Anything extra you want to attach */
  extra?: Record<string, unknown>;
};
