/**
 * @file src/features/learning/ui/LearningReviewPage.tsx
 * @updated 2026-05-19
 * @summary Focused review queue screen for weak learning lessons.
 * @scope Presentational review composition only.
 */
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { Link } from '@/routing';
import { Button } from '@/components/ui/button';
import type { LearningDashboardData } from '@/services/learning/learning-dashboard-service';

type Props = {
  data: LearningDashboardData;
};

export function LearningReviewPage({ data }: Props) {
  return (
    <section className="mx-auto max-w-3xl pb-24">
      <Button asChild variant="ghost" className="mb-4 rounded-xl font-black text-[#1cb0f6]">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Resum
        </Link>
      </Button>
      <div className="rounded-2xl bg-[#58cc02] p-5 text-white shadow-[0_6px_0_#3f8f01]">
        <p className="text-xs font-black uppercase">Repas actiu</p>
        <h1 className="mt-1 text-3xl font-black">Practica errors</h1>
        <p className="mt-2 text-sm font-bold text-white/90">
          Precisio actual: {data.accuracy}%. Prioritza les llicons marcades per revisio.
        </p>
      </div>
      <div className="mt-6 grid gap-3">
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

function EmptyReview() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm font-bold text-slate-600 shadow-sm dark:border-white/10 dark:bg-slate-950 dark:text-slate-300">
      No hi ha llicons pendents de repas.
    </div>
  );
}
