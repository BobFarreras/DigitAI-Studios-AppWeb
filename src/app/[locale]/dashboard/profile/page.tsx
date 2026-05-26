/**
 * @file src/app/[locale]/dashboard/profile/page.tsx
 * @updated 2026-05-20
 * @summary Student learning profile route.
 * @scope Page composition only; data comes from server actions.
 */
import { redirect } from 'next/navigation';
import { getDashboardProfileData } from '@/actions/dashboard-profile';
import { LearningProfilePage } from '@/features/learning/ui/LearningProfilePage';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ProfilePage({ params }: Props) {
  const { locale } = await params;
  const result = await getDashboardProfileData(locale);

  if (!result.success && 'authRequired' in result) {
    redirect('/');
  }

  if (!result.success) {
    redirect('/');
  }

  return <LearningProfilePage data={result.data} />;
}
