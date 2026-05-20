/**
 * @file src/features/learning/ui/LearningReviewCard.tsx
 * @updated 2026-05-20
 * @summary Review queue card for weak learning concepts.
 * @scope Presentational reinforcement panel.
 */
import { Brain, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/routing';
import { Button } from '@/components/ui/button';
import type { LearningDashboardData } from '@/services/learning/learning-dashboard-service';

type Props = {
  items: string[];
  queue?: LearningDashboardData['reviewQueue'];
  accuracy: number;
};

export function LearningReviewCard({ items, queue = [], accuracy }: Props) {
  const t = useTranslations('Learning');
  const reviewHref = queue[0]?.href ?? '/dashboard/review';

  return (
    <aside className="space-y-4">
      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-950">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-500/15">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-slate-500">{t('review_card_reinforce')}</p>
            <h2 className="text-lg font-black text-slate-950 dark:text-white">{t('review_card_practice_errors')}</h2>
          </div>
        </div>

        <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-300">
          {t('review_card_accuracy_prefix')}{accuracy}{t('review_card_accuracy_suffix')}
        </p>

        <ul className="mt-4 space-y-2">
          {(queue.length > 0 ? queue : items.map((title) => ({ id: title, title, trackTitle: 'Pendent', href: reviewHref }))).map((item) => (
            <li key={item.id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 dark:bg-white/5 dark:text-slate-200">
              {item.title}
              <span className="block text-xs text-slate-500">{item.trackTitle}</span>
            </li>
          ))}
        </ul>

        <Button asChild variant="outline" className="mt-5 h-11 w-full rounded-xl font-black">
          <Link href={reviewHref}>
            <RotateCcw className="mr-2 h-4 w-4" /> {t('review_card_review_now')}
          </Link>
        </Button>
      </div>
    </aside>
  );
}
