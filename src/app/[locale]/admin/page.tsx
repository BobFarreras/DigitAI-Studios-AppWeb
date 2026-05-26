/**
 * @file src/app/[locale]/admin/page.tsx
 * @updated 2026-05-08
 * @summary Route module: src/app/[locale]/admin/page.tsx
 * @scope Composicio de pagina/layout i wiring amb actions; sense logica de dades complexa.
 */
import { redirect } from 'next/navigation'; // Use native Next.js redirect

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminDashboard({ params }: Props) {
  const { locale } = await params;
  
  // Explicitly construct the URL with the current locale
  redirect(`/${locale}/admin/analytics`);
}
