/**
 * @file src/app/[locale]/dashboard/learn/page.tsx
 * @updated 2026-05-16
 * @summary Learning map route for authenticated users.
 * @scope Page composition only; reuses the current dashboard MVP.
 */
import { redirect } from 'next/navigation';
import { getDashboardHomeData } from '@/actions/dashboard-home';
import { LearningDashboard } from '@/features/learning/ui/LearningDashboard';

export default async function LearnPage() {
  const result = await getDashboardHomeData();

  if (!result.success && 'authRequired' in result) {
    redirect('/');
  }

  if (!result.success) {
    redirect('/');
  }

  return <LearningDashboard data={result.data} />;
}
