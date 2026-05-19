/**
 * @file src/app/[locale]/dashboard/review/page.tsx
 * @updated 2026-05-19
 * @summary Review queue route for authenticated learning users.
 * @scope Page composition only; data comes from server actions.
 */
import { redirect } from 'next/navigation';
import { getDashboardHomeData } from '@/actions/dashboard-home';
import { LearningReviewPage } from '@/features/learning/ui/LearningReviewPage';

export default async function ReviewPage() {
  const result = await getDashboardHomeData();

  if (!result.success && 'authRequired' in result) {
    redirect('/');
  }

  if (!result.success) {
    redirect('/');
  }

  return <LearningReviewPage data={result.data} />;
}
