/**
 * @file src/app/[locale]/dashboard/review/page.tsx
 * @updated 2026-05-20
 * @summary Review queue route for authenticated learning users.
 * @scope Page composition only; data comes from server actions.
 */
import { redirect } from 'next/navigation';
import { getDashboardReviewData } from '@/actions/dashboard-review';
import { LearningReviewPage } from '@/features/learning/ui/LearningReviewPage';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ReviewPage({ params }: Props) {
  const { locale } = await params;
  const result = await getDashboardReviewData(locale);

  if (!result.success && 'authRequired' in result) {
    redirect('/');
  }

  if (!result.success) {
    redirect('/');
  }

  return <LearningReviewPage data={result.data} />;
}
