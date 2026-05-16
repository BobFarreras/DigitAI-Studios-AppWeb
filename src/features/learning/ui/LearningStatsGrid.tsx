/**
 * @file src/features/learning/ui/LearningStatsGrid.tsx
 * @updated 2026-05-16
 * @summary Compact KPI grid for training progress.
 * @scope Presentational dashboard metrics.
 */
import { BookOpenCheck, Clock, Star, Target } from 'lucide-react';
import type { LearningDashboardData } from '@/services/learning/learning-dashboard-service';

type Props = {
  data: LearningDashboardData;
};

export function LearningStatsGrid({ data }: Props) {
  const stats = [
    { label: 'XP total', value: data.xpTotal.toString(), icon: Star, color: 'text-amber-500' },
    { label: 'Llicons fetes', value: data.lessonsDone.toString(), icon: BookOpenCheck, color: 'text-emerald-500' },
    { label: 'Temps setmanal', value: `${data.weeklyMinutes}m`, icon: Clock, color: 'text-sky-500' },
    { label: 'Precisio', value: `${data.accuracy}%`, icon: Target, color: 'text-rose-500' },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-950">
          <stat.icon className={`h-5 w-5 ${stat.color}`} />
          <p className="mt-3 text-2xl font-black text-slate-950 dark:text-white">{stat.value}</p>
          <p className="text-xs font-bold uppercase text-slate-500">{stat.label}</p>
        </div>
      ))}
    </section>
  );
}
