import { headers } from 'next/headers';
import type { MetadataRoute } from 'next';

function origin() {
  const h = headers();
  const proto = h.get('x-forwarded-proto') ?? 'http';
  const host =
    h.get('x-forwarded-host') ??
    h.get('host') ??
    `localhost:${process.env.PORT || 3000}`;
  return `${proto}://${host}`;
}

export default function robots(): MetadataRoute.Robots {
  const base = origin();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin'], // keep the admin demo out of indexing
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}