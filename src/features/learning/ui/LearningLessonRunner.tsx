/**
 * @file src/features/learning/ui/LearningLessonRunner.tsx
 * @updated 2026-05-22
 * @summary Interactive lesson runner with gamified full-width layout.
 * @scope Client-side lesson interaction; fixed header/footer, scrollable content.
 */
'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Check, ChevronRight, Star } from 'lucide-react';
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

  const stepNumber = runner.step.orderIndex + 1;
  const totalSteps = data.steps.length;
  const progress = Math.round((stepNumber / totalSteps) * 100);
  const isContent = runner.step.type === 'content';

  return (
    <div className="flex h-screen flex-col bg-[#f7f7f7]">
      {/* HEADER - Fixed top */}
      <header className="shrink-0 border-b-2 border-[#e5e5e5] bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="rounded-full hover:bg-[#e5e5e5]">
            <Link href={`/dashboard/learn/${data.trackSlug}`}>
              <ArrowLeft className="h-5 w-5 text-[#777777]" />
            </Link>
          </Button>

          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#58cc02]">
                {data.trackTitle}
              </span>
              <span className="text-xs font-bold text-[#777777]">
                {stepNumber} / {totalSteps}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[#e5e5e5]">
              <motion.div
                className="h-full rounded-full bg-[#58cc02]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffc700] text-amber-900 shadow-[0_4px_0_#d39a00]">
            <Star className="h-5 w-5" />
          </div>
        </div>
      </header>

      {/* CONTENT - Scrollable middle */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-4xl">
          {/* Only show prompt as title for EXERCISE steps, not content steps */}
          {!isContent && (
            <h1 className="mb-6 text-2xl font-black leading-tight text-[#1f1f1f] md:text-3xl">
              {runner.step.prompt}
            </h1>
          )}

          <StepInteraction
            step={runner.step}
            value={runner.selected}
            disabled={Boolean(runner.currentFeedback)}
            feedbackStatus={feedbackStatus(runner.currentFeedback)}
            onChange={runner.updateAnswer}
          />

          <ErrorPanel message={runner.error} />
        </div>
      </main>

      {/* FOOTER - Fixed bottom with button */}
      <footer className="shrink-0 border-t-2 border-[#e5e5e5] bg-white px-4 py-4 shadow-[0_-4px_0_#e5e5e5]">
        <div className="mx-auto max-w-4xl">
          <FeedbackPanel feedback={runner.currentFeedback} />

          <Button
            disabled={!runner.canContinue || runner.isPending}
            onClick={runner.checkOrContinue}
            className="mt-4 h-14 w-full rounded-2xl bg-[#58cc02] text-lg font-black text-white shadow-[0_6px_0_#3f8f01] transition-all hover:translate-y-1 hover:shadow-[0_2px_0_#3f8f01] active:translate-y-1.5 active:shadow-none disabled:bg-[#e5e5e5] disabled:text-[#afafaf] disabled:shadow-none"
          >
            {buttonLabel(t, Boolean(runner.currentFeedback), runner.isLast, runner.step.type)}
            {runner.isLast ? (
              <Check className="ml-2 h-6 w-6" />
            ) : (
              <ChevronRight className="ml-2 h-6 w-6" />
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
}

function feedbackStatus(feedback: StepFeedback | undefined) {
  if (!feedback) return undefined;
  return feedback.isCorrect ? ('correct' as const) : ('incorrect' as const);
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
