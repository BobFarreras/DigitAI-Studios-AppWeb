/**
 * @file src/features/learning/ui/LearningLessonRunner.tsx
 * @updated 2026-05-20
 * @summary Interactive lesson runner with several exercise dynamics.
 * @scope Client-side lesson interaction; scoring is submitted to server actions.
 */
'use client';

import { ArrowLeft, Check, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/routing';
import { Button } from '@/components/ui/button';
import type { LearningRunnerData } from '@/services/learning/learning-lesson-service';
import { StepInteraction } from './lesson-runner/StepInteraction';
import {
  EmptyLesson,
  ErrorPanel,
  FeedbackPanel,
  LessonResult,
  type StepFeedback,
} from './lesson-runner/LessonRunnerPanels';
import { useLessonRunnerState } from './lesson-runner/useLessonRunnerState';

type Props = {
  data: LearningRunnerData;
};

export function LearningLessonRunner({ data }: Props) {
  const t = useTranslations('Learning');
  const runner = useLessonRunnerState(data);
  if (data.steps.length === 0) return <EmptyLesson data={data} />;
  if (runner.result) return <LessonResult data={data} score={runner.result.score} xp={runner.result.xpAwarded} />;

  return (
    <section className="mx-auto flex min-h-[calc(100vh-96px)] max-w-2xl flex-col bg-white text-[#3c3c3c] dark:bg-slate-950">
      <div className="mb-5 flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Link href={`/dashboard/learn/${data.trackSlug}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-[#e5e5e5]">
          <div className="h-full rounded-full bg-[#58cc02]" style={{ width: `${runner.progress}%` }} />
        </div>
      </div>

      <p className="text-sm font-black uppercase text-[#58cc02]">{data.trackTitle}</p>
      <h1 className="mt-2 text-3xl font-black">{runner.step.prompt}</h1>

      <div className="mt-8 flex-1">
        <StepInteraction
          step={runner.step}
          value={runner.selected}
          disabled={Boolean(runner.currentFeedback)}
          feedbackStatus={feedbackStatus(runner.currentFeedback)}
          onChange={runner.updateAnswer}
        />
        <ErrorPanel message={runner.error} />
      </div>

      <div className="sticky bottom-0 -mx-4 border-t-2 border-[#e5e5e5] bg-white p-4 dark:bg-slate-950">
        <div className="mb-4">
          <FeedbackPanel feedback={runner.currentFeedback} />
        </div>
        <Button
          disabled={!runner.canContinue || runner.isPending}
          onClick={runner.checkOrContinue}
          className="h-12 w-full rounded-xl bg-[#58cc02] text-base font-black text-white shadow-[0_5px_0_#3f8f01] hover:bg-[#58cc02]"
        >
          {buttonLabel(t, Boolean(runner.currentFeedback), runner.isLast, runner.step.type)}
          {runner.isLast ? <Check className="ml-2 h-5 w-5" /> : <ChevronRight className="ml-2 h-5 w-5" />}
        </Button>
      </div>
    </section>
  );
}

function feedbackStatus(feedback: StepFeedback | undefined) {
  if (!feedback) return undefined;
  return feedback.isCorrect ? 'correct' as const : 'incorrect' as const;
}

function buttonLabel(
  t: ReturnType<typeof useTranslations>,
  hasFeedback: boolean,
  isLast: boolean,
  stepType: string
) {
  if (stepType === 'content') {
    return isLast ? t('lesson_complete_btn') : t('lesson_continue');
  }
  if (!hasFeedback) return t('lesson_check');
  return isLast ? t('lesson_complete_btn') : t('lesson_continue');
}
