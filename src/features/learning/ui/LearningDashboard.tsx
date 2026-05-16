/**
 * @file src/features/learning/ui/LearningDashboard.tsx
 * @updated 2026-05-16
 * @summary Main composition for the gamified training dashboard.
 * @scope UI composition with no data fetching or business mutations.
 */
import type { LearningDashboardData } from '@/services/learning/learning-dashboard-service';
import { LearningHero } from './LearningHero';
import { LearningReviewCard } from './LearningReviewCard';
import { LearningStatsGrid } from './LearningStatsGrid';
import { LearningTrackGrid } from './LearningTrackGrid';

type Props = {
  data: LearningDashboardData;
};

export function LearningDashboard({ data }: Props) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 pb-24 md:gap-7 md:pb-8">
      <LearningHero data={data} />
      <LearningStatsGrid data={data} />
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <LearningTrackGrid tracks={data.tracks} />
        <LearningReviewCard items={data.reviewItems} accuracy={data.accuracy} />
      </div>
    </div>
  );
}
