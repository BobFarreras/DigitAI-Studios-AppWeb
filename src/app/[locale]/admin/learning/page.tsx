/**
 * @file src/app/[locale]/admin/learning/page.tsx
 * @updated 2026-05-19
 * @summary Admin learning content inventory route.
 * @scope Page composition only; data comes from admin actions.
 */
import { notFound } from 'next/navigation';
import { getAdminLearningContent } from '@/actions/admin/learning-content';
import { AdminLearningContentPage } from '@/features/learning/ui/AdminLearningContentPage';

export default async function AdminLearningPage() {
  const result = await getAdminLearningContent();
  if (!result.success) notFound();

  return <AdminLearningContentPage data={result.data} />;
}
