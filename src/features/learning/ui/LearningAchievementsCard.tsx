/**
 * @file src/features/learning/ui/LearningAchievementsCard.tsx
 * @updated 2026-05-17
 * @summary Achievement summary card for the learning dashboard.
 * @scope Presentational dashboard gamification only.
 */
import { Medal } from 'lucide-react';
import type { Achievement } from '@/services/learning/learning-gamification-service';

type Props = {
  achievements: Achievement[];
};

export function LearningAchievementsCard({ achievements }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-950">
      <div className="mb-4 flex items-center gap-2">
        <Medal className="h-5 w-5 text-amber-500" />
        <h2 className="text-lg font-black text-slate-950 dark:text-white">Medalles</h2>
      </div>
      <div className="space-y-3">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="flex items-center gap-3">
            <div className={`h-3 w-3 rounded-full ${achievement.unlocked ? 'bg-[#58cc02]' : 'bg-[#e5e5e5]'}`} />
            <div>
              <p className="text-sm font-black text-slate-950 dark:text-white">{achievement.title}</p>
              <p className="text-xs font-bold text-slate-500">{achievement.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
