'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function RequestPilotForm(){
  const [status, setStatus] = useState<'idle'|'submitting'|'success'>('idle');
  const [form, setForm] = useState({ name:'', email:'', company:'', size:'', notes:'' });

  function onChange(e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>){
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e: React.FormEvent){
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => setStatus('success'), 900);
  }

  if (status === 'success') return (
    <div className="rounded-2xl border p-6 bg-green-50">
      <div className="font-semibold mb-1">Request received!</div>
      <p className="text-sm text-gray-700">We’ll reach out within one business day to schedule your pilot walkthrough.</p>
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input className="border rounded-xl px-3 py-2" name="name" placeholder="Full name" value={form.name} onChange={onChange} required />
      <input className="border rounded-xl px-3 py-2" name="email" placeholder="Work email" type="email" value={form.email} onChange={onChange} required />
      <input className="border rounded-xl px-3 py-2" name="company" placeholder="Company" value={form.company} onChange={onChange} required />
      <select className="border rounded-xl px-3 py-2" name="size" value={form.size} onChange={onChange} required>
        <option value="">Company size</option>
        <option>1-50</option>
        <option>51-250</option>
        <option>251-1,000</option>
        <option>1,001-5,000</option>
        <option>5,001+</option>
      </select>
      <textarea className="md:col-span-2 border rounded-xl px-3 py-2" rows={4} name="notes" placeholder="Anything we should know? (tools, policies, timelines)" value={form.notes} onChange={onChange} />
      <div className="md:col-span-2"><Button type="submit" className="w-full md:w-auto">Request Pilot</Button></div>
    </form>
  );
}