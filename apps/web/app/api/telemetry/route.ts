// app/api/telemetry/route.ts
import { NextResponse } from 'next/server';

// Always fresh (no caching)
export const dynamic = 'force-dynamic';

type Telemetry = {
  industry: 'All' | 'Finance' | 'Healthcare' | 'SaaS' | 'Public Sector';
  month: string;                 // e.g. "2025-03"
  redactionRate: number;         // 0..1
  blockRate: number;             // 0..1
  timeToApproveSec: number;      // seconds
  escalationsPer1000: number;    // count
  piiTypes: Record<string, number>;
};

export async function GET() {
  const months = lastMonths(6); // last 6 months including current

  // Baselines per industry so trends look plausible
  const baseMap: Record<Telemetry['industry'], Partial<Telemetry>> = {
    All:         { redactionRate: 0.16, blockRate: 0.035, timeToApproveSec: 42,  escalationsPer1000: 24 },
    Finance:     { redactionRate: 0.22, blockRate: 0.055, timeToApproveSec: 58,  escalationsPer1000: 34 },
    Healthcare:  { redactionRate: 0.26, blockRate: 0.060, timeToApproveSec: 64,  escalationsPer1000: 39 },
    SaaS:        { redactionRate: 0.12, blockRate: 0.025, timeToApproveSec: 36,  escalationsPer1000: 18 },
    'Public Sector': { redactionRate: 0.19, blockRate: 0.045, timeToApproveSec: 52, escalationsPer1000: 28 },
  };

  // Deterministic small variations so charts move but don’t jump each refresh
  const industries: Telemetry['industry'][] = ['All','Finance','Healthcare','SaaS','Public Sector'];
  const data: Telemetry[] = [];

  industries.forEach((industry, idx) => {
    months.forEach((m, i) => {
      const base = baseMap[industry];
      const wobble = wobbleFn(idx * 31 + i * 17); // stable pseudo-random per point

      const redactionRate = clamp01((base.redactionRate ?? 0.15) * (1 + wobble(-0.12, 0.10)));
      const blockRate     = clamp01((base.blockRate ?? 0.03)   * (1 + wobble(-0.15, 0.12)));
      const timeToApprove = Math.max(20, Math.round((base.timeToApproveSec ?? 40) * (1 + wobble(-0.10, 0.10))));
      const escalations   = Math.max(8,  Math.round((base.escalationsPer1000 ?? 22) * (1 + wobble(-0.18, 0.18))));

      const piiTypes = makePiiDist(industry, i);

      data.push({
        industry,
        month: m,
        redactionRate,
        blockRate,
        timeToApproveSec: timeToApprove,
        escalationsPer1000: escalations,
        piiTypes,
      });
    });
  });

  return NextResponse.json({ data });
}

/* ---------------- helpers ---------------- */

function lastMonths(n: number): string[] {
  const out: string[] = [];
  const d = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const dt = new Date(d.getFullYear(), d.getMonth() - i, 1);
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    out.push(`${y}-${m}`);
  }
  return out;
}

// Returns a function that yields a stable pseudo-random factor between range [min,max]
function wobbleFn(seed: number) {
  return (min = -0.1, max = 0.1) => {
    // xorshift-ish
    let x = Math.sin(seed * 12.9898) * 43758.5453;
    x = x - Math.floor(x);
    return min + x * (max - min);
  };
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, Number(v.toFixed(3))));
}

function makePiiDist(industry: Telemetry['industry'], tIndex: number): Record<string, number> {
  // Simple mix that shifts slightly over months and industries
  const base = {
    email: 40,
    name: 30,
    phone: 18,
    address: 12,
  };
  const nudge = (k: keyof typeof base, amt: number) => (base[k] = Math.max(5, base[k] + amt));

  // Industry tendencies
  if (industry === 'Finance') { nudge('name', +3); nudge('address', +3); }
  if (industry === 'Healthcare') { nudge('name', +5); }
  if (industry === 'SaaS') { nudge('email', +4); }
  if (industry === 'Public Sector') { nudge('address', +4); }

  // Month drift
  const drift = ((tIndex % 3) - 1); // -1,0,1 cycle
  nudge('email', drift);
  nudge('phone', -drift);

  const total = base.email + base.name + base.phone + base.address;
  return {
    Email: Math.round((base.email / total) * 100),
    Name: Math.round((base.name / total) * 100),
    Phone: Math.round((base.phone / total) * 100),
    Address: Math.round((base.address / total) * 100),
  };
}