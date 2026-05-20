/**
 * @file src/features/learning/ui/LearningReviewPage.tsx
 * @updated 2026-05-20
 * @summary Focused review queue screen for weak learning lessons.
 * @scope Presentational review composition only.
 */
import { ArrowLeft, AlertTriangle, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/routing';
import { Button } from '@/components/ui/button';
import type { LearningReviewData } from '@/services/learning/learning-review-service';

type Props = {
  data: LearningReviewData;
};

export function LearningReviewPage({ data }: Props) {
  const t = useTranslations('Learning');

  return (
    <section className="mx-auto max-w-3xl pb-24">
      <Button asChild variant="ghost" className="mb-4 rounded-xl font-black text-[#1cb0f6]">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('review_page_summary')}
        </Link>
      </Button>
      <div className="rounded-2xl bg-[#58cc02] p-5 text-white shadow-[0_6px_0_#3f8f01]">
        <p className="text-xs font-black uppercase">{t('review_page_active_review')}</p>
        <h1 className="mt-1 text-3xl font-black">{t('review_page_practice_errors')}</h1>
        <p className="mt-2 text-sm font-bold text-white/90">
          {data.reviewSummary.weakSpotCount}{t('review_page_weak_questions')}{data.accuracy}{t('review_page_percent')}
        </p>
      </div>
      <Summary data={data} />
      <WeakSpots data={data} />
      <div className="mt-6 grid gap-3">
        <h2 className="text-lg font-black text-[#3c3c3c] dark:text-white">{t('review_page_lessons_reinforce')}</h2>
        {data.reviewQueue.length === 0 ? <EmptyReview /> : data.reviewQueue.map((item) => (
          <Button key={item.id} asChild variant="outline" className="h-auto justify-between rounded-xl p-4">
            <Link href={item.href}>
              <span className="text-left">
                <span className="block font-black">{item.title}</span>
                <span className="block text-xs font-bold text-slate-500">{item.trackTitle}</span>
              </span>
              <RotateCcw className="h-5 w-5 text-[#58cc02]" />
            </Link>
          </Button>
        ))}
      </div>
    </section>
  );
}

function Summary({ data }: Props) {
  const t = useTranslations('Learning');

  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-3">
      <Metric label={t('review_page_repeated_errors')} value={data.reviewSummary.repeatedMistakes} />
      <Metric label={t('review_page_review_queue')} value={data.reviewQueue.length} />
      <Metric label={t('review_page_weekly_time')} value={`${data.weeklyMinutes}m`} />
    </div>
  );
}

function WeakSpots({ data }: Props) {
  const t = useTranslations('Learning');

  if (data.weakSpots.length === 0) return null;

  return (
    <section className="mt-6 space-y-3">
      <h2 className="text-lg font-black text-[#3c3c3c] dark:text-white">{t('review_page_priority_questions')}</h2>
      {data.weakSpots.map((spot) => (
        <Button key={spot.stepId} asChild variant="outline" className="h-auto justify-start rounded-xl p-4">
          <Link href={spot.href} className="flex w-full items-start gap-3">
            <AlertTriangle className={`mt-1 h-5 w-5 ${priorityColor(spot.priority)}`} />
            <span className="text-left">
              <span className="block text-sm font-black">{spot.prompt}</span>
              <span className="mt-1 block text-xs font-bold text-slate-500">
                {spot.trackTitle} · {spot.lessonTitle} · {spot.wrongCount}{t('review_page_errors')}
              </span>
            </span>
          </Link>
        </Button>
      ))}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-950">
      <p className="text-2xl font-black text-[#3c3c3c] dark:text-white">{value}</p>
      <p className="text-xs font-black uppercase text-slate-500">{label}</p>
    </div>
  );
}

function EmptyReview() {
  const t = useTranslations('Learning');

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm font-bold text-slate-600 shadow-sm dark:border-white/10 dark:bg-slate-950 dark:text-slate-300">
      {t('review_page_empty')}
    </div>
  );
}

function priorityColor(priority: string) {
  if (priority === 'high') return 'text-rose-500';
  if (priority === 'medium') return 'text-amber-500';
  return 'text-[#1cb0f6]';
}
