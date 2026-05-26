/**
 * @file src/app/[locale]/dashboard/page.tsx
 * @updated 2026-05-20
 * @summary Training dashboard route for authenticated users.
 * @scope Page composition only; data comes from server actions.
 */
import { redirect } from 'next/navigation';
import { getDashboardHomeData } from '@/actions/dashboard-home';
import { LearningDashboard } from '@/features/learning/ui/LearningDashboard';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  const result = await getDashboardHomeData(locale);

  if (!result.success && 'authRequired' in result) {
    redirect('/');
  }

  if (!result.success) {
    redirect('/');
  }

  return <LearningDashboard data={result.data} />;
}
