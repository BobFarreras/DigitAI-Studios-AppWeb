/**
 * @file src/app/[locale]/dashboard/learn/page.tsx
 * @updated 2026-05-20
 * @summary App-style learning map route for authenticated users.
 * @scope Page composition only; data comes from server actions.
 */
import { redirect } from 'next/navigation';
import { getDashboardHomeData } from '@/actions/dashboard-home';
import { LearningMapHome } from '@/features/learning/ui/LearningMapHome';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LearnPage({ params }: Props) {
  const { locale } = await params;
  const result = await getDashboardHomeData(locale);

  if (!result.success && 'authRequired' in result) {
    redirect('/');
  }

  if (!result.success) {
    redirect('/');
  }

  return <LearningMapHome data={result.data} />;
}
