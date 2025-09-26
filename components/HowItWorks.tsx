// components/HowItWorks.tsx
'use client';

type Variant = 'flow' | 'swimlane' | 'grid';

export default function HowItWorks({ variant = 'flow' }: { variant?: Variant }) {
  if (variant === 'swimlane') return <Swimlane />;
  if (variant === 'grid') return <Grid />;
  return <Flow />;
}

/* ========== Variant: Flow (curved arrows, glass cards) ========== */
function Flow() {
  return (
    <div className="relative isolate rounded-2xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-gray-900/50 backdrop-blur p-6">
      {/* subtle brand gradients */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-40"
           style={{ background:
             'radial-gradient(500px 240px at 85% -10%, rgba(6,182,212,.12), transparent 60%), radial-gradient(380px 220px at 8% 8%, rgba(59,130,246,.10), transparent 60%)'
           }} />
      <div className="relative grid md:grid-cols-3 gap-6">
        <Node title="Your Apps" badge="Sources" tone="blue"
              items={['Internal tools','Customer apps','Back-office']} />
        <Node title="LayerZero" badge="Policy & Redaction" tone="cyan"
              items={['PII/code/secrets scan','Inline redaction','Approvals & audit']} />
        <Node title="LLM Provider" badge="Destination" tone="violet"
              items={['OpenAI / Azure','Anthropic / Vertex','AWS Bedrock / Local LLMs']} />
      </div>
      {/* curved connectors */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 320" aria-hidden>
        <path d="M180 120 C 340 120, 420 120, 580 120" stroke="currentColor" className="text-gray-300 dark:text-white/15" fill="none" strokeWidth="2"/>
        <path d="M620 200 C 780 200, 860 200, 1020 200" stroke="currentColor" className="text-gray-300 dark:text-white/15" fill="none" strokeWidth="2"/>
        {/* arrow heads */}
        <Arrow x={580} y={120} />
        <Arrow x={1020} y={200} />
      </svg>
    </div>
  );
}

/* ========== Variant: Swimlane (left→right lanes with icons) ========== */
function Swimlane() {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
      {[
        { title: 'Apps', tone:'blue', desc: 'Your UI, services, and data sources.' },
        { title: 'LayerZero', tone:'cyan', desc: 'Policy, redaction, approvals, audit.' },
        { title: 'LLMs', tone:'violet', desc: 'Your chosen model providers.' },
      ].map((lane, i) => (
        <div key={lane.title}
             className={`bg-white dark:bg-gray-900 p-5 ${i>0 ? 'border-t border-gray-200 dark:border-white/10':''}`}>
          <div className="flex items-start gap-4">
            <Badge tone={lane.tone}>{lane.title}</Badge>
            <p className="text-sm text-gray-600 dark:text-gray-300">{lane.desc}</p>
          </div>
          <div className="mt-4 grid sm:grid-cols-3 gap-3">
            {i===0 && ['Internal tools','Customer apps','Back-office'].map((t)=>(
              <LaneCard key={t} title={t} />
            ))}
            {i===1 && ['PII/code/secrets','Inline redaction','Approvals & audit'].map((t)=>(
              <LaneCard key={t} title={t} />
            ))}
            {i===2 && ['OpenAI / Azure','Anthropic / Vertex','Bedrock / Local'].map((t)=>(
              <LaneCard key={t} title={t} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ========== Variant: Grid (compact 2×2 with arrows) ========== */
function Grid() {
  return (
    <div className="relative rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-6">
      <div className="grid md:grid-cols-2 gap-4">
        <SmallNode title="Your Apps" tone="blue" />
        <SmallNode title="LLM Provider" tone="violet" />
        <SmallNode title="LayerZero — Policy & Redaction" tone="cyan" span />
        <SmallNote />
      </div>
      {/* lightweight arrows */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1200 600" aria-hidden>
        <path d="M240 160 C 400 160, 520 220, 760 220" stroke="currentColor" className="text-gray-300 dark:text-white/15" fill="none" strokeWidth="2"/>
        <Arrow x={760} y={220}/>
      </svg>
    </div>
  );
}

/* ===== Building blocks ===== */

function Node({ title, badge, items, tone }:{
  title:string; badge:string; items:string[]; tone:'blue'|'cyan'|'violet';
}) {
  const toneGrad = {
    blue: 'from-blue-500 to-cyan-400',
    cyan: 'from-cyan-400 to-blue-500',
    violet: 'from-violet-500 to-fuchsia-400',
  }[tone];
  return (
    <div className="relative rounded-xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-gray-900/70 backdrop-blur p-4">
      <span className={`inline-flex text-[11px] font-semibold text-white px-2 py-1 rounded-md bg-gradient-to-br ${toneGrad}`}>
        {badge}
      </span>
      <div className="mt-2 font-semibold text-gray-900 dark:text-white">{title}</div>
      <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
        {items.map(i => <li key={i} className="list-disc list-inside">{i}</li>)}
      </ul>
    </div>
  );
}

function SmallNode({ title, tone, span=false }:{ title:string; tone:'blue'|'cyan'|'violet'; span?:boolean }) {
  const ring = {
    blue:'ring-blue-300/40 dark:ring-blue-400/20',
    cyan:'ring-cyan-300/40 dark:ring-cyan-400/20',
    violet:'ring-violet-300/40 dark:ring-violet-400/20',
  }[tone];
  return (
    <div className={`${span?'md:col-span-2':''} rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-4 ring-1 ring-inset ${ring}`}>
      <div className="font-semibold text-gray-900 dark:text-white">{title}</div>
    </div>
  );
}

function LaneCard({ title }: { title:string }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-3 text-sm text-gray-700 dark:text-gray-200">
      {title}
    </div>
  );
}

function Badge({ children, tone }:{ children:React.ReactNode; tone:'blue'|'cyan'|'violet'|'emerald' }) {
  const grad = {
    blue:'from-blue-500 to-cyan-400',
    cyan:'from-cyan-400 to-blue-500',
    violet:'from-violet-500 to-fuchsia-400',
    emerald:'from-emerald-500 to-teal-400',
  }[tone];
  return (
    <span className={`inline-flex items-center text-[11px] font-semibold text-white px-2 py-1 rounded-md bg-gradient-to-br ${grad}`}>
      {children}
    </span>
  );
}

function SmallNote() {
  return (
    <div className="md:col-span-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
      Redaction runs before model access; approvals and rationale are logged for audit.
    </div>
  );
}

function Arrow({ x, y }:{ x:number; y:number }) {
  return (
    <polygon points={`${x},${y} ${x-8},${y-4} ${x-8},${y+4}`} className="fill-gray-300 dark:fill-white/20" />
  );
}