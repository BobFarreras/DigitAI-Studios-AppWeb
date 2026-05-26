/**
 * @file src/features/learning/ui/LearningDailyGoalCard.tsx
 * @updated 2026-05-20
 * @summary Daily XP goal card for the learning dashboard.
 * @scope Presentational dashboard gamification only.
 */
import { Target } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { LearningDashboardData } from '@/services/learning/learning-dashboard-service';

type Props = {
  goal: LearningDashboardData['dailyGoal'];
};

export function LearningDailyGoalCard({ goal }: Props) {
  const t = useTranslations('Learning');

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-slate-500">{t('daily_goal_title')}</p>
          <p className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
            {goal.earnedXp}/{goal.targetXp}{t('daily_goal_suffix')}
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ddf4ff] text-[#1cb0f6]">
          <Target className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-4 h-4 overflow-hidden rounded-full bg-[#e5e5e5]">
        <div className="h-full rounded-full bg-[#58cc02]" style={{ width: `${goal.progress}%` }} />
      </div>
      <p className="mt-3 text-sm font-bold text-slate-600 dark:text-slate-300">
        {goal.completed ? t('daily_goal_complete') : t('daily_goal_empty')}
      </p>
    </section>
  );
}
