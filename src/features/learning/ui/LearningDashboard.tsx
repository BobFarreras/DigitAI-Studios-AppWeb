/**
 * @file src/features/learning/ui/LearningDashboard.tsx
 * @updated 2026-05-16
 * @summary Main composition for the gamified training dashboard.
 * @scope UI composition with no data fetching or business mutations.
 */
import type { LearningDashboardData } from '@/services/learning/learning-dashboard-service';
import { LearningAchievementsCard } from './LearningAchievementsCard';
import { LearningDailyGoalCard } from './LearningDailyGoalCard';
import { LearningHero } from './LearningHero';
import { LearningReviewCard } from './LearningReviewCard';
import { LearningStatsGrid } from './LearningStatsGrid';
import { LearningTrackGrid } from './LearningTrackGrid';
import { LearningXpHistoryCard } from './LearningXpHistoryCard';

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
        <div className="space-y-5">
          <LearningDailyGoalCard goal={data.dailyGoal} />
          <LearningAchievementsCard achievements={data.achievements} />
          <LearningXpHistoryCard items={data.xpHistory} />
          <LearningReviewCard items={data.reviewItems} queue={data.reviewQueue} accuracy={data.accuracy} />
        </div>
      </div>
    </div>
  );
}
