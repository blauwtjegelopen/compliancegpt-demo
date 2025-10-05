'use client';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

type Point = { date: string; redactions: number; blocks: number; approvals: number };

export default function PolicyMiniChart({ data }: { data: Point[] }) {
  const fmt = (v: any) => (typeof v === 'number' ? v.toLocaleString() : v);
  return (
    <div className="h-60 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={fmt as any} />
          <Legend verticalAlign="top" height={24} wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="redactions" name="Redactions" stroke="#6366F1" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="blocks" name="Blocks" stroke="#EF4444" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="approvals" name="Approvals" stroke="#10B981" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}