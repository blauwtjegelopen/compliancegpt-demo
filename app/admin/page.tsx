'use client';
import { useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { logs as baseLogs } from '@/lib/mockData';
import PolicyMiniChart from '@/components/PolicyMiniChart';

export default function AdminPage(){
  const [activePolicies, setActivePolicies] = useState<string[]>(['Baseline Allowlist']);
  function addPolicy(name: string){
    setActivePolicies(prev => prev.includes(name) ? prev : [...prev, name]);
  }
  function clearPolicies(){
    setActivePolicies([]);
  }

  // Demo chart data (last 7 days)
  const chartData = useMemo(() => {
    const today = new Date();
    const arr: any[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const label = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      const base = 10 + ((d.getDate() * 7) % 12);
      arr.push({
        date: label,
        redactions: base + (i % 3) * 4,
        blocks: Math.max(0, Math.round(base/4) - (i%2 ? 1 : 0)),
        approvals: Math.round(base/2) + (i%4),
      });
    }
    return arr;
  }, []);

  // CSV export for logs
  const [logRows] = useState(baseLogs);
  function exportCsv(){
    const header = ['time','user','prompt','action','rule'];
    const csv = [header.join(',')].concat(
      logRows.map(r => header.map(h => '"' + String((r as any)[h]).replace(/"/g,'\\"') + '"').join(','))
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'activity-log.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  // Approvals with filter + actions
  const [approvals, setApprovals] = useState([
    { id: 'A-1024', submitted: '10:10', user: 'lee@co', reason: 'Source Code', prompt: 'Analyze function from oauth-service repo...', status: 'pending' },
    { id: 'A-1025', submitted: '10:14', user: 'maria@co', reason: 'PII', prompt: 'Email to client John Doe <john@acme.com>...', status: 'pending' }
  ]);
  const [filter, setFilter] = useState('all');
  const filteredApprovals = approvals.filter(a => filter==='all' ? true : a.status===filter);
  function approve(id: string){
    setApprovals(prev => prev.map(a => a.id===id ? { ...a, status: 'approved' } : a));
  }
  function deny(id: string){
    setApprovals(prev => prev.map(a => a.id===id ? { ...a, status: 'denied' } : a));
  }
  function exportApprovals(){
    const header = ['id','submitted','user','reason','prompt','status'];
    const csv = [header.join(',')].concat(
      approvals.map(r => header.map(h => '"' + String((r as any)[h]).replace(/"/g,'\\"') + '"').join(','))
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'approvals.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <Navbar />
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Demo</h1>

        {/* Active Policies */}
        <div className="rounded-2xl bg-white shadow p-5 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Active Policies</h2>
            <span className="text-sm text-gray-500">(demo) Click templates below to add</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {activePolicies.map(p => (
              <span key={p} className="px-2.5 py-1 rounded-full text-xs bg-indigo-50 text-indigo-700 border border-indigo-100">{p}</span>
            ))}
            {activePolicies.length > 0 && (
              <button onClick={clearPolicies} className="ml-2 px-2 py-1 rounded-full text-xs border text-gray-600 hover:bg-gray-50">Clear</button>
            )}
          </div>

          {/* Quick add preset buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={()=>addPolicy('GDPR PII Guard')} className="px-2.5 py-1 rounded-full text-xs border">+ GDPR PII Guard</button>
            <button onClick={()=>addPolicy('PCI DSS Card Shield')} className="px-2.5 py-1 rounded-full text-xs border">+ PCI DSS Card Shield</button>
            <button onClick={()=>addPolicy('HIPAA PHI Filter')} className="px-2.5 py-1 rounded-full text-xs border">+ HIPAA PHI Filter</button>
          </div>

          {/* KPI row + Chart */}
          <div className="mt-5 grid md:grid-cols-4 gap-4 items-start">
            <div className="rounded-xl border p-4">
              <div className="text-xs text-gray-500">Weekly Redactions</div>
              <div className="text-2xl font-semibold">{chartData.reduce((s,d)=>s+d.redactions,0).toLocaleString()}</div>
            </div>
            <div className="rounded-xl border p-4">
              <div className="text-xs text-gray-500">Weekly Blocks</div>
              <div className="text-2xl font-semibold">{chartData.reduce((s,d)=>s+d.blocks,0).toLocaleString()}</div>
            </div>
            <div className="rounded-xl border p-4">
              <div className="text-xs text-gray-500">Approved via HITL</div>
              <div className="text-2xl font-semibold">{chartData.reduce((s,d)=>s+d.approvals,0).toLocaleString()}</div>
            </div>
            <div className="rounded-xl border p-4 md:col-span-1 md:col-start-4 hidden md:block">
              <div className="text-xs text-gray-500 mb-1">7-day Trend</div>
            </div>
          </div>
          <div className="mt-3 rounded-xl border p-3">
            <PolicyMiniChart data={chartData} />
            <div className="mt-2 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1 mr-3"><span className="inline-block w-3 h-0.5 bg-indigo-500" /> Redactions</span>
              <span className="inline-flex items-center gap-1 mr-3"><span className="inline-block w-3 h-0.5 bg-red-500" /> Blocks</span>
              <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-0.5 bg-emerald-500" /> Approvals</span>
            </div>
          </div>
        </div>

        {/* Logs */}
        <div className="rounded-2xl bg-white shadow overflow-hidden">
          <div className="p-5 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="font-semibold text-lg">Activity Log</h2>
              <button onClick={exportCsv} className="px-3 py-1.5 rounded-xl border text-sm">Export CSV</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-sm text-gray-600">
                <tr>
                  <th className="px-5 py-3">Time</th>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Prompt (truncated)</th>
                  <th className="px-5 py-3">Action</th>
                  <th className="px-5 py-3">Rule</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {logRows.map((row,i) => (
                  <tr key={i} className="text-sm">
                    <td className="px-5 py-3 whitespace-nowrap">{row.time}</td>
                    <td className="px-5 py-3 whitespace-nowrap">{row.user}</td>
                    <td className="px-5 py-3 truncate max-w-[300px]">{row.prompt}</td>
                    <td className="px-5 py-3 capitalize">{row.action}</td>
                    <td className="px-5 py-3">{row.rule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Approval Queue */}
        <div className="mt-6 rounded-2xl bg-white shadow overflow-hidden">
          <div className="p-5 border-b flex items-center justify-between">
            <h2 className="font-semibold text-lg">Human-in-the-Loop Approval Queue</h2>
            <div className="flex gap-3 items-center">
              <label className="text-sm text-gray-600">Filter:</label>
              <select value={filter} onChange={(e)=>setFilter(e.target.value)} className="border rounded-xl px-2 py-1 text-sm">
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="denied">Denied</option>
              </select>
              <button onClick={exportApprovals} className="px-3 py-1.5 rounded-xl border text-sm">Download CSV</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-sm text-gray-600">
                <tr>
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Submitted</th>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Reason</th>
                  <th className="px-5 py-3">Prompt</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredApprovals.map(item => (
                  <tr key={item.id} className="text-sm">
                    <td className="px-5 py-3 whitespace-nowrap">{item.id}</td>
                    <td className="px-5 py-3 whitespace-nowrap">{item.submitted}</td>
                    <td className="px-5 py-3 whitespace-nowrap">{item.user}</td>
                    <td className="px-5 py-3 whitespace-nowrap">{item.reason}</td>
                    <td className="px-5 py-3 truncate max-w-[400px]">{item.prompt}</td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${item.status==='approved' ? 'bg-green-100 text-green-800' : item.status==='denied' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{item.status}</span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap flex gap-2">
                      <button onClick={() => deny(item.id)} className="px-3 py-1.5 rounded-xl border">Deny</button>
                      <button onClick={() => approve(item.id)} className="px-3 py-1.5 rounded-xl bg-green-600 text-white">Approve & Release</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}