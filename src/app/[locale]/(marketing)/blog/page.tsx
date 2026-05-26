/**
 * @file src/app/[locale]/(marketing)/blog/page.tsx
 * @updated 2026-05-15
 * @summary Redirects the legacy public blog index to the active landing.
 * @scope Public route compatibility only; blog management remains in admin.
 */
import { permanentRedirect } from 'next/navigation';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function BlogIndexPage({ params }: PageProps) {
  const { locale } = await params;
  permanentRedirect(`/${locale}`);
}
