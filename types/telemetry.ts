export type Telemetry = {
  industry: 'All' | 'Finance' | 'Healthcare' | 'SaaS' | 'Public Sector';
  month: string;                 // YYYY-MM
  redactionRate: number;         // 0..1
  blockRate: number;             // 0..1
  timeToApproveSec: number;      // seconds
  escalationsPer1000: number;    // number
  piiTypes: Record<string, number>;
};
