/**
 * @file src/app/[locale]/admin/projects/new/page.tsx
 * @updated 2026-05-15
 * @summary Marks the automatic website factory route as retired.
 * @scope Route compatibility only; factory implementation lives in legacy.
 */
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/admin-guard';

export default async function CreateProjectPage() {
  await requireAdmin();
  notFound();
}
