/**
 * @file src/app/[locale]/dashboard/learn/page.tsx
 * @updated 2026-05-16
 * @summary App-style learning map route for authenticated users.
 * @scope Page composition only; data comes from server actions.
 */
import { redirect } from 'next/navigation';
import { getDashboardHomeData } from '@/actions/dashboard-home';
import { LearningMapHome } from '@/features/learning/ui/LearningMapHome';

export default async function LearnPage() {
  const result = await getDashboardHomeData();

  if (!result.success && 'authRequired' in result) {
    redirect('/');
  }

  if (!result.success) {
    redirect('/');
  }

  return <LearningMapHome data={result.data} />;
}
