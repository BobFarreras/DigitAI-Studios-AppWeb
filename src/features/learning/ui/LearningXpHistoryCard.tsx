/**
 * @file src/features/learning/ui/LearningXpHistoryCard.tsx
 * @updated 2026-05-20
 * @summary Recent XP history card for the learning dashboard.
 * @scope Presentational dashboard gamification only.
 */
import { Clock3 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { LearningDashboardData } from '@/services/learning/learning-dashboard-service';

type Props = {
  items: LearningDashboardData['xpHistory'];
};

export function LearningXpHistoryCard({ items }: Props) {
  const t = useTranslations('Learning');

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-950">
      <div className="mb-4 flex items-center gap-2">
        <Clock3 className="h-5 w-5 text-[#1cb0f6]" />
        <h2 className="text-lg font-black text-slate-950 dark:text-white">{t('xp_history_title')}</h2>
      </div>
      <div className="space-y-3">
        {items.length === 0 ? <EmptyState /> : items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2 dark:bg-white/5">
            <div>
              <p className="text-sm font-black text-slate-950 dark:text-white">{item.label}</p>
              <p className="text-xs font-bold text-slate-500">{item.dateLabel}</p>
            </div>
            <p className="text-sm font-black text-[#58cc02]">+{item.xp}{t('xp_history_suffix')}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function EmptyState() {
  const t = useTranslations('Learning');

  return (
    <p className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-bold text-slate-500 dark:bg-white/5">
      {t('xp_history_empty')}
    </p>
  );
}
