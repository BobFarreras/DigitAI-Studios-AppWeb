/**
 * @file src/app/robots.ts
 * @updated 2026-05-08
 * @summary Route module: src/app/robots.ts
 * @scope Composicio de pagina/layout i wiring amb actions; sense logica de dades complexa.
 */
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dashboard/'], // 🛡️ Protegim les zones privades
    },
    sitemap: 'https://digitaistudios.com/sitemap.xml', // URL final
  };
}
