import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DigitAI Studios',
    short_name: 'DigitAI',
    description: 'Agència de desenvolupament web, apps i automatització IA.',
    start_url: '/',
    display: 'standalone', // Fa que sembli una App real (sense barra de navegador)
    background_color: '#020817', // El color "Midnight Indigo" del teu dark mode
    theme_color: '#020817',
    orientation: 'portrait',
    icons: [
      {
        "src": "/web-app-manifest-192x192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "maskable"
      },
      {
        "src": "/web-app-manifest-512x512.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "maskable"
      },
      {
        src: '/icons/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'maskable', // Important per a Android modern
      },
    ],
  };
}