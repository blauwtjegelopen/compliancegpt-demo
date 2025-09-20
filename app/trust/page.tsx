'use client';
import ContactUsBlock from '@/components/ContactUsBlock';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TrustPage(){
  const controls: Array<[string,string]> = [
    ['Access Control','RBAC, SSO (Okta/Azure AD), least-privilege'],
    ['Encryption','TLS1.2+ in transit, AES-256 at rest (KMS-managed)'],
    ['Data Residency','EU/US regions; per-tenant routing'],
    ['Retention','Configurable purge; zero-retention mode'],
    ['Auditability','Hash-chained logs; export & webhooks'],
    ['Approvals','Human-in-the-Loop for escalations'],
  ];

  function downloadBase64Pdf(filename: string, base64: string){
    const byteChars = atob(base64);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i);
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  // Tiny placeholder PDFs
  const securityOverviewB64 =
    'JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9nL1BhZ2VzIDIgMCBSID4+CmVuZG9iagoyIDAgb2JqCjw8L1R5cGUgL1BhZ2VzL0tpZHMgWzMgMCBSXS9Db3VudCAxID4+CmVuZG9iagozIDAgb2JqCjw8L1R5cGUgL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94IFswIDAgNTk1IDg0Ml0vQ29udGVudHMgNCAwIFI+PgplbmRvYmoKNCAwIG9iago8PC9MZW5ndGggNjY+PgpzdHJlYW0KQlQKL0YxIDEyIFRmCjEwMCA3OTAgVGQKKE9uZS1QYWdlIFNlY3VyaXR5IE92ZXJ2aWV3KSBUMgowIDc2MCBUZAooQ29tcGxpYW5jZUdQVCAvIFNlY3VyaXR5IE92ZXJ2aWV3IHBsYWNlaG9sZGVyIGZvciBkZW1vcykgVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZgowMDAwMDAwMTA5IDAwMDAwIG4KMDAwMDAwMDE2MCAwMDAwMCBuCjAwMDAwMDAyMzUgMDAwMDAgbgowMDAwMDAwMzYxIDAwMDAwIG4Kc3RhcnR4cmVmCjQyNQolJUVPRgo=';
  const dpaTemplateB64 =
    'JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9nL1BhZ2VzIDIgMCBSID4+CmVuZG9iagoyIDAgb2JqCjw8L1R5cGUgL1BhZ2VzL0tpZHMgWzMgMCBSXS9Db3VudCAxID4+CmVuZG9iagozIDAgb2JqCjw8L1R5cGUgL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94IFswIDAgNTk1IDg0Ml0vQ29udGVudHMgNCAwIFI+PgplbmRvYmoKNCAwIG9iago8PC9MZW5ndGggNzQ+PgpzdHJlYW0KQlQKL0YxIDEyIFRmCjgwIDc5MCBUZAooRFBBIFRlbXBsYXRlIC0gU2FtcGxlIHBsYWNlaG9sZGVyIGZvciBkZW1vcykgVAowIDc2MCBUZAooQXJ0aWNsZSAxOiBEZWZpbml0aW9ucyAmIFRlcm1zKSBUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDUKMDAwMDAwMDAwMCA2NTUzNSBmCjAwMDAwMDAxMDkgMDAwMDAgbgowMDAwMDAwMTYwIDAwMDAwIG4KMDAwMDAwMDI0MCAwMDAwMCBuCjAwMDAwMDAzNzAgMDAwMDAgbgpzdGFydHhyZWYKNDI1CiUlRU9G';
  const soc2SummaryB64 =
    'JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9nL1BhZ2VzIDIgMCBSID4+CmVuZG9iagoyIDAgb2JqCjw8L1R5cGUgL1BhZ2VzL0tpZHMgWzMgMCBSXS9Db3VudCAxID4+CmVuZG9iagozIDAgb2JqCjw8L1R5cGUgL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94IFswIDAgNTk1IDg0Ml0vQ29udGVudHMgNCAwIFI+PgplbmRvYmoKNCAwIG9iago8PC9MZW5ndGggODI+PgpzdHJlYW0KQlQKL0YxIDEyIFRmCjgwIDc5MCBUZAooU09DMiBTdW1tYXJ5IC0gU2FtcGxlIHByYWN0aWNlcyBhbmQgaGlnaC1sZXZlbCBjb250cm9scykgVAowIDc2MCBUZAooUmVhZC1vbmx5IGRlbW8gY29udGVudCkgVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZgowMDAwMDAwMTA5IDAwMDAwIG4KMDAwMDAwMDE2MCAwMDAwMCBuCjAwMDAwMDAyNDggMDAwMDAgbgowMDAwMDAwMzk0IDAwMDAwIG4Kc3RhcnR4cmVmCjQyNQolJUVPRg==';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-indigo-50">
      <Navbar />

      <section className="max-w-6xl mx-auto px-6 py-14">
        <h1 className="text-4xl font-extrabold mb-3">Security &amp; Trust</h1>
        <p className="text-gray-600 max-w-2xl">
          Built for regulated industries. This page summarizes our controls and how data flows through the system.
        </p>
      </section>

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-6">
          <Card><CardContent>
            <h2 className="text-xl font-semibold mb-3">Core Controls</h2>
            <ul className="space-y-2 text-sm text-gray-700">
              {controls.map(([k,v])=> (
                <li key={k} className="flex gap-2 items-start">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 mt-1"/>
                  <span className="font-medium">{k}:</span><span>{v}</span>
                </li>
              ))}
            </ul>
          </CardContent></Card>

          <Card><CardContent>
            <h2 className="text-xl font-semibold mb-3">Data Flow (High Level)</h2>
            <ol className="list-decimal ml-5 space-y-2 text-sm text-gray-700">
              <li>User prompt hits our proxy (SSO-authenticated)</li>
              <li>Detectors run → policy decision (allow / redact / block / escalate)</li>
              <li>Allowed/Redacted prompt is sent to the chosen LLM</li>
              <li>Response is scanned, logs are written (hash-chained)</li>
              <li>Exports/webhooks deliver events as configured</li>
            </ol>
            <p className="text-xs text-gray-500 mt-3">In zero-retention mode, only hashes/metadata are stored.</p>
          </CardContent></Card>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <Card><CardContent>
          <h2 className="text-xl font-semibold mb-3">Compliance Docs</h2>
          <p className="text-sm text-gray-700 mb-4">Download a one-page overview or request detailed documents.</p>
          <div className="flex flex-wrap gap-3 text-sm">
            <button className="px-4 py-2 rounded-2xl border" onClick={()=>downloadBase64Pdf('LayerZero-Security-Overview.pdf', securityOverviewB64)}>
              Download Security Overview (PDF)
            </button>
            <button className="px-4 py-2 rounded-2xl border" onClick={()=>downloadBase64Pdf('LayerZero-DPA-Template.pdf', dpaTemplateB64)}>
              Download DPA (Template)
            </button>
            <button className="px-4 py-2 rounded-2xl border" onClick={()=>downloadBase64Pdf('LayerZero-SOC2-Summary.pdf', soc2SummaryB64)}>
              Download SOC2 Controls (Summary)
            </button>
          </div>
        </CardContent></Card>
      </section>
<ContactUsBlock />
      <Footer />
    </div>
  );
}
