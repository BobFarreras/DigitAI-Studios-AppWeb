/**
 * @file src/features/learning/ui/lesson-runner/LessonRunnerPanels.tsx
 * @updated 2026-05-20
 * @summary Lesson runner empty, feedback and completion panels.
 * @scope Presentational state panels for the lesson runner.
 */
import { Construction } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/routing';
import { Button } from '@/components/ui/button';
import type { LearningRunnerData } from '@/services/learning/learning-lesson-service';

export type StepFeedback = { isCorrect: boolean; explanation: string | null };

export function EmptyLesson({ data }: { data: LearningRunnerData }) {
  const t = useTranslations('Learning');

  return (
    <section className="mx-auto max-w-md py-10 text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#ffc700] text-amber-800 shadow-[0_8px_0_#d39a00]">
        <Construction className="h-12 w-12" />
      </div>
      <h1 className="mt-6 text-3xl font-black text-[#3c3c3c] dark:text-white">{t('lesson_preparing')}</h1>
      <p className="mt-3 text-base font-bold leading-6 text-[#777777]">
        {t('lesson_preparing_desc')}
      </p>
      <Button asChild className="mt-8 h-12 rounded-xl bg-[#58cc02] font-black text-white shadow-[0_5px_0_#3f8f01]">
        <Link href={`/dashboard/learn/${data.trackSlug}`}>{t('lesson_back_to_map')}</Link>
      </Button>
    </section>
  );
}

export function FeedbackPanel({ feedback }: { feedback: StepFeedback | undefined }) {
  const t = useTranslations('Learning');
  if (!feedback) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 22, scale: 0.94, rotate: -1 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 420, damping: 18 }}
      className="rounded-xl border-2 border-[#ffc800] bg-[#fff4b8] p-4 font-bold text-[#3c3c3c] shadow-[0_5px_0_#e6b400]"
    >
      <p className="text-base font-black">{feedback.isCorrect ? t('lesson_correct') : t('lesson_incorrect')}</p>
      {feedback.explanation ? <p className="mt-1 text-sm leading-5">{feedback.explanation}</p> : null}
    </motion.div>
  );
}

export function ErrorPanel({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="mt-4 rounded-xl border-2 border-[#ff4b4b] bg-white p-4 text-sm font-bold text-[#ff4b4b]">
      {message}
    </div>
  );
}
