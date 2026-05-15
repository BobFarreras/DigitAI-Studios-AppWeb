/**
 * @file src/app/robots.ts
 * @updated 2026-05-08
 * @summary Route module: src/app/robots.ts
 * @scope Composicio de pagina/layout i wiring amb actions; sense logica de dades complexa.
 */
import { MetadataRoute } from 'next';
import { getLocalizedPath, SEO_LOCALES } from '@/lib/seo';

const PRIVATE_PATHS = ['/admin', '/dashboard'];

function blockedLocalizedPaths(paths: string[]) {
  return SEO_LOCALES.flatMap((locale) =>
    paths.flatMap((path) => {
      const localizedPath = getLocalizedPath(locale, path);
      return [localizedPath, `${localizedPath}/`];
    })
  );
}

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: blockedLocalizedPaths(PRIVATE_PATHS),
    },
    sitemap: 'https://digitaistudios.com/sitemap.xml', // URL final
  };
}
