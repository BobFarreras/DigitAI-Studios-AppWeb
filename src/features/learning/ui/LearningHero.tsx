/**
 * @file src/features/learning/ui/LearningHero.tsx
 * @updated 2026-05-20
 * @summary Hero card for the next learning action.
 * @scope Presentational training dashboard header.
 */
import { ArrowRight, Flame, Timer } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/routing';
import { Button } from '@/components/ui/button';
import type { LearningDashboardData } from '@/services/learning/learning-dashboard-service';

type Props = {
  data: LearningDashboardData;
};

export function LearningHero({ data }: Props) {
  const t = useTranslations('Learning');

  return (
    <section className="overflow-hidden rounded-[28px] border border-emerald-200 bg-emerald-50 p-5 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-950/20 md:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-center">
        <div className="space-y-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              {t('formacioDigitAI')}
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl">
              {t('hero_continue_prefix')}{data.userName}
            </h1>
            <p className="mt-3 max-w-2xl text-base font-medium text-slate-600 dark:text-slate-300">
              {t('hero_subtitle')}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-[0_8px_0_#bbf7d0] dark:bg-slate-950 dark:shadow-[0_8px_0_rgba(16,185,129,0.22)]">
            <p className="text-xs font-bold uppercase text-slate-500">{t('hero_next_lesson')}</p>
            <h2 className="mt-1 text-xl font-black text-slate-950 dark:text-white">
              {data.continueLesson.title}
            </h2>
            <div className="mt-3 flex flex-wrap gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
              <span>{data.continueLesson.module}</span>
              <span className="flex items-center gap-1">
                <Timer className="h-4 w-4" /> {data.continueLesson.estimatedMinutes}{t('hero_minutes_suffix')}
              </span>
            </div>
          </div>

          <Button asChild className="h-12 rounded-xl bg-emerald-600 px-5 text-base font-black text-white shadow-[0_5px_0_#047857] hover:bg-emerald-500">
            <Link href={data.continueLesson.href}>
              {t('hero_start_prefix')}<ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        <div className="rounded-[26px] bg-white p-5 text-center shadow-sm dark:bg-slate-950">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/15">
            <Flame className="h-14 w-14 fill-current" />
          </div>
          <p className="mt-4 text-4xl font-black text-slate-950 dark:text-white">{data.streakDays}</p>
          <p className="text-sm font-bold uppercase text-slate-500">{t('hero_streak_suffix')}</p>
        </div>
      </div>
    </section>
  );
}
