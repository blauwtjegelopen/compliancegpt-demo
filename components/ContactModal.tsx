'use client';
import { useEffect, useState } from 'react';

export default function ContactModal() {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);

  // Expose a global opener so buttons can call window.openContactSales()
  useEffect(() => {
    (window as any).openContactSales = () => setOpen(true);
    return () => { delete (window as any).openContactSales; };
  }, []);

  function close(){ if (!sending) setOpen(false); }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    // Demo: pretend to send, then close
    setTimeout(() => { setSending(false); setOpen(false); alert('Thanks! We will reach out.'); }, 800);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={close} />

      {/* modal */}
      <div className="relative z-[101] w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="p-5 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Contact Us</h3>
          <button onClick={close} className="rounded-full p-1 hover:bg-gray-100" aria-label="Close">✕</button>
        </div>

        <form onSubmit={onSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input required name="name" className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Work Email</label>
            <input required type="email" name="email" className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Company</label>
            <input name="company" className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">How can we help?</label>
            <textarea name="message" rows={4} className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10" />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">We’ll reply within 1 business day.</div>
            <button
              disabled={sending}
              className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-60"
              type="submit"
            >
              {sending ? 'Sending…' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
