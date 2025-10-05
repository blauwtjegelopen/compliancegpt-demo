// packages/policy-engine/src/index.ts

export type Finding = {
  type: "NAME" | "EMAIL" | "PHONE" | "NUMBER" | "SECRET" | "CUSTOM";
  start: number;
  end: number;
  value: string;
};

export type RedactionRule =
  | { type: "mask"; maskWith?: string }
  | { type: "token"; token?: string }
  | { type: "remove" };

export interface Policy {
  detectors: Array<{
    id: string;
    pattern: RegExp;
    classifyAs: Finding["type"];
  }>;
  redaction: Record<Finding["type"], RedactionRule>;
}

export function detect(input: string, policy: Policy): Finding[] {
  const out: Finding[] = [];
  for (const d of policy.detectors) {
    for (const m of input.matchAll(d.pattern)) {
      out.push({
        type: d.classifyAs,
        start: m.index ?? 0,
        end: (m.index ?? 0) + (m[0]?.length ?? 0),
        value: m[0] ?? ""
      });
    }
  }
  return out;
}

export function redact(input: string, findings: Finding[], policy: Policy): string {
  // Apply from right-to-left so earlier indices remain valid
  const sorted = findings.slice().sort((a, b) => b.start - a.start);
  let out = input;
  for (const f of sorted) {
    const rule = policy.redaction[f.type];
    if (!rule) continue;
    const before = out.slice(0, f.start);
    const after = out.slice(f.end);
    switch (rule.type) {
      case "token": {
        const token = rule.token ?? `[REDACTED_${f.type}]`;
        out = `${before}${token}${after}`;
        break;
      }
      case "mask": {
        const mask = rule.maskWith ?? "●";
        out = `${before}${mask.repeat(f.value.length)}${after}`;
        break;
      }
      case "remove": {
        out = `${before}${after}`;
        break;
      }
    }
  }
  return out;
}

export function sanitize(input: string, policy: Policy) {
  const findings = detect(input, policy);
  return { output: redact(input, findings, policy), findings };
}