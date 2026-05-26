/**
 * @file src/app/[locale]/(marketing)/blog/[slug]/page.tsx
 * @updated 2026-05-15
 * @summary Redirects legacy public blog articles to the active landing.
 * @scope Public route compatibility only; article editing remains in admin.
 */
import { permanentRedirect } from 'next/navigation';

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function BlogPostPage({ params }: PageProps) {
  const { locale } = await params;
  permanentRedirect(`/${locale}`);
}
