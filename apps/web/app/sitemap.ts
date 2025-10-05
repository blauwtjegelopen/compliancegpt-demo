import { headers } from 'next/headers';
import type { MetadataRoute } from 'next';

function origin() {
  const h = headers();
  const proto = h.get('x-forwarded-proto') ?? 'http';
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? `localhost:${process.env.PORT || 3000}`;
  return `${proto}://${host}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = origin();
  const routes = [
    '', // homepage
    'features',
    'integrations',
    'pricing',
    'trust',
    'compare',
    'about',
    'admin',
    'state-of-ai-governance',
  ];

  const now = new Date().toISOString();

  return routes.map((r) => ({
    url: `${base}/${r}`.replace(/\/+$/, '/'),
    lastModified: now,
    changeFrequency: r === '' ? 'weekly' : 'monthly',
    priority: r === '' ? 1 : 0.7,
  }));
}