/**
 * @file src/app/[locale]/dashboard/learn/[moduleSlug]/page.tsx
 * @updated 2026-05-22
 * @summary Selected learning track map route with module hierarchy.
 * @scope Page composition only; data comes from server actions.
 */
import { notFound, redirect } from 'next/navigation';
import { getTrackModuleTree } from '@/actions/track-module-tree';
import { LearningTrackPage } from '@/features/learning/ui/LearningTrackPage';

type Props = {
  params: Promise<{ moduleSlug: string; locale: string }>;
};

export default async function TrackPage({ params }: Props) {
  const { moduleSlug, locale } = await params;
  const result = await getTrackModuleTree(moduleSlug, locale);

  if (!result.success && 'authRequired' in result) {
    redirect('/');
  }

  if (!result.success) {
    redirect('/');
  }

  const track = result.data.tracks.find((t) => t.slug === moduleSlug);
  if (!track) notFound();

  return (
    <LearningTrackPage
      data={result.data}
      tree={result.tree}
      trackTitle={track.title}
      trackColor={track.color ?? undefined}
      isLocked={track.status === 'locked'}
    />
  );
}
