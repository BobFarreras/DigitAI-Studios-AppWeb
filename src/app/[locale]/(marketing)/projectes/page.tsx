/**
 * @file src/app/[locale]/(marketing)/projectes/page.tsx
 * @updated 2026-05-15
 * @summary Redirects the legacy public projects page to the active landing.
 * @scope Public route compatibility only; admin project tooling remains untouched.
 */
import { permanentRedirect } from 'next/navigation';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ProjectsPage({ params }: PageProps) {
  const { locale } = await params;
  permanentRedirect(`/${locale}`);
}
