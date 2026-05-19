/**
 * @file src/app/[locale]/dashboard/profile/page.tsx
 * @updated 2026-05-19
 * @summary Student learning profile route.
 * @scope Page composition only; data comes from server actions.
 */
import { redirect } from 'next/navigation';
import { getDashboardProfileData } from '@/actions/dashboard-profile';
import { LearningProfilePage } from '@/features/learning/ui/LearningProfilePage';

export default async function ProfilePage() {
  const result = await getDashboardProfileData();

  if (!result.success && 'authRequired' in result) {
    redirect('/');
  }

  if (!result.success) {
    redirect('/');
  }

  return <LearningProfilePage data={result.data} />;
}
