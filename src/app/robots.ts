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