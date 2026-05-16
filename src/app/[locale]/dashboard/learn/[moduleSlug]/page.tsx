/**
 * @file src/app/[locale]/dashboard/learn/[moduleSlug]/page.tsx
 * @updated 2026-05-16
 * @summary Selected learning track map route.
 * @scope Page composition only; data comes from server actions.
 */
import { notFound, redirect } from 'next/navigation';
import { getDashboardHomeData } from '@/actions/dashboard-home';
import { LearningTrackPage } from '@/features/learning/ui/LearningTrackPage';
import { getTrackDetail } from '@/services/learning/learning-dashboard-service';

type Props = {
  params: Promise<{ moduleSlug: string }>;
};

export default async function TrackPage({ params }: Props) {
  const [{ moduleSlug }, result] = await Promise.all([params, getDashboardHomeData()]);

  if (!result.success && 'authRequired' in result) {
    redirect('/');
  }

  if (!result.success) {
    redirect('/');
  }

  const track = getTrackDetail(result.data, moduleSlug);
  if (!track) notFound();

  return <LearningTrackPage data={result.data} track={track} />;
}
