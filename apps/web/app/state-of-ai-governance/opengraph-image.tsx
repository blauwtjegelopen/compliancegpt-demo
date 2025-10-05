// app/state-of-ai-governance/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'State of AI Governance — LayerZero Research';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0B0F13',
          color: '#ffffff',
          padding: 48,
          fontFamily:
            'system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        {/* Subtle brand gradients */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(600px 300px at 80% -20%, rgba(6,182,212,.22), transparent 60%), radial-gradient(420px 260px at 10% 10%, rgba(59,130,246,.18), transparent 60%)',
          }}
        />

        {/* Header */}
        <div style={{ fontSize: 20, opacity: 0.8, letterSpacing: 2, textTransform: 'uppercase' }}>
          LayerZero Research
        </div>

        {/* Title */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05 }}>
            State of AI Governance
          </div>
          <div
            style={{
              fontSize: 24,
              opacity: 0.85,
              marginTop: 12,
              maxWidth: 900,
            }}
          >
            Benchmarks for redactions, blocks, approvals &amp; escalations across industries.
          </div>
        </div>

        {/* Footer pills */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
          {[
            'Privacy by default',
            'Policy-aware prompts',
            'Tenant-bound processing',
            'Auditable decisions',
          ].map((t) => (
            <div
              key={t}
              style={{
                fontSize: 20,
                padding: '10px 16px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}