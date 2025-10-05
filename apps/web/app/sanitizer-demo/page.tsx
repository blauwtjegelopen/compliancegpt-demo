'use client';
import { useState } from 'react';
import { completeChat } from '@layerzero/sdk/src/client';

export default function SanitizerDemo() {
  const [input, setInput] = useState('Write a follow-up email to John Doe about invoice #44532 due next week. My email is jane.doe@example.com');
  const [result, setResult] = useState<any>(null);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Sanitizer Demo</h1>
      <textarea className="w-full border rounded p-3 h-40" value={input} onChange={e => setInput(e.target.value)} />
      <button
        className="mt-3 px-4 py-2 rounded bg-black text-white"
        onClick={async () => {
          const res = await completeChat({ messages: [{ role: 'user', content: input }] });
          setResult(res);
        }}
      >
        Send via Proxy
      </button>

      {result && (
        <div className="mt-6 space-y-3">
          <div className="text-sm text-gray-500">Findings header decoded:</div>
          <pre className="bg-gray-50 p-3 rounded border overflow-auto text-sm">{JSON.stringify(result.findings, null, 2)}</pre>
          <div className="text-sm text-gray-500">Upstream (mock) response:</div>
          <pre className="bg-gray-50 p-3 rounded border overflow-auto text-sm">{JSON.stringify(result.data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
