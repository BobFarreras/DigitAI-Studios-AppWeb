import { MetadataRoute } from 'next';
import { postService } from '@/services/container';

// ⚠️ IMPORTNAT: Canvia això pel teu domini real quan despleguis
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await postService.getLatestPosts();
  const locales = ['es', 'ca', 'en']; // Els teus idiomes

  // 1. Pàgines estàtiques (Home, Blog) per a cada idioma
  const staticPages = locales.flatMap((locale) => [
    {
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ]);

  // 2. Entrades del Blog per a cada idioma
  const postEntries = posts.flatMap((post) => 
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}/blog/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  return [...staticPages, ...postEntries];
}