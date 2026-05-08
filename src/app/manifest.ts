/**
 * @file src/app/manifest.ts
 * @updated 2026-05-08
 * @summary Route module: src/app/manifest.ts
 * @scope Composicio de pagina/layout i wiring amb actions; sense logica de dades complexa.
 */
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DigitAI Studios',
    short_name: 'DigitAI',
    description: 'Agència de desenvolupament web, apps i automatització IA.',
    start_url: '/',
    display: 'standalone',
    background_color: '#020817',
    theme_color: '#020817',
    orientation: 'portrait',
    icons: [
      {
        "src": "/web-app-manifest-192x192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "any" // 👈 CANVIAT: Abans era 'maskable'
      },
      {
        "src": "/maskable_icon-removebg-preview.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "any" // 👈 CANVIAT: Abans era 'maskable'
      },
      // Pots mantenir una entrada extra per a maskable SI tens una imatge amb marges
      {
         "src": "/maskable_icon-removebg-preview.png",
         "sizes": "512x512",
         "type": "image/png",
         "purpose": "maskable" // Només deixa això si la imatge té molt marge al voltant
      }
    ],
  };
}
