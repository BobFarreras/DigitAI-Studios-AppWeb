/**
 * @file src/app/sitemap.ts
 * @updated 2026-05-08
 * @summary Route module: src/app/sitemap.ts
 * @scope Composicio de pagina/layout i wiring amb actions; sense logica de dades complexa.
 */
import { MetadataRoute } from 'next';
import { getLocalizedUrl, SEO_LOCALES } from '@/lib/seo';

const INDEXED_PATHS = [
  { path: '', changeFrequency: 'weekly' as const, priority: 1 },
  { path: '/legal/avis-legal', changeFrequency: 'yearly' as const, priority: 0.2 },
  { path: '/legal/privacitat', changeFrequency: 'yearly' as const, priority: 0.2 },
  { path: '/legal/cookies', changeFrequency: 'yearly' as const, priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return SEO_LOCALES.flatMap((locale) =>
    INDEXED_PATHS.map((entry) => ({
      url: getLocalizedUrl(locale, entry.path),
      lastModified: new Date(),
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    }))
  );
}
