'use client';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, PieChart, Pie } from 'recharts';

export function TrendChart({ data }: { data: any[] }){
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 10, right: 10, top: 5, bottom: 5 }}>
          <XAxis dataKey="d" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="allowed" />
          <Line type="monotone" dataKey="blocked" />
          <Line type="monotone" dataKey="redacted" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
export function ViolationsPie({ data }: { data: any[] }){
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} label />
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}