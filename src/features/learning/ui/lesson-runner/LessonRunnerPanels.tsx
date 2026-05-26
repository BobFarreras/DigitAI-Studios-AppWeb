/**
 * @file src/features/learning/ui/lesson-runner/LessonRunnerPanels.tsx
 * @updated 2026-05-20
 * @summary Lesson runner empty, feedback and completion panels.
 * @scope Presentational state panels for the lesson runner.
 */
import { ArrowLeft, Check, Construction, Star, Target, X } from 'lucide-react';
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

export function LessonResult({ data, score, xp, correctCount, mistakeCount }: {
  data: LearningRunnerData;
  score: number;
  xp: number;
  correctCount: number;
  mistakeCount: number;
}) {
  const t = useTranslations('Learning');
  const total = correctCount + mistakeCount;

  // Store completion in sessionStorage for return animation
  if (typeof window !== 'undefined') {
    // Extract module slug from trackSlug (we need the actual module)
    const urlParts = window.location.pathname.split('/');
    const moduleSlug = urlParts[urlParts.indexOf('learn') + 1];
    if (moduleSlug) {
      sessionStorage.setItem('recently_completed_node', moduleSlug);
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="flex h-28 w-28 items-center justify-center rounded-full bg-[#58cc02] text-white shadow-[0_10px_0_#3f8f01]"
      >
        <Check className="h-14 w-14" />
      </motion.div>

      <h1 className="mt-6 text-3xl font-black text-[#1f1f1f]">{t('lesson_completed_title')}</h1>

      {/* Score ring */}
      <div className="mt-6 flex items-center gap-6">
        <div className="text-center">
          <div className="text-4xl font-black text-[#58cc02]">{score}%</div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#afafaf]">{t('lesson_accuracy')}</p>
        </div>

        <div className="h-12 w-px bg-[#e5e5e5]" />

        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Target className="h-5 w-5 text-[#58cc02]" />
            <span className="text-2xl font-black text-[#58cc02]">{correctCount}</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#afafaf]">Encerts</p>
        </div>

        {mistakeCount > 0 ? (
          <>
            <div className="h-12 w-px bg-[#e5e5e5]" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <X className="h-5 w-5 text-[#ff4b4b]" />
                <span className="text-2xl font-black text-[#ff4b4b]">{mistakeCount}</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#afafaf]">Errors</p>
            </div>
          </>
        ) : null}

        <div className="h-12 w-px bg-[#e5e5e5]" />

        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Star className="h-5 w-5 text-[#ffc700]" />
            <span className="text-2xl font-black text-[#ffc700]">+{xp}</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#afafaf]">XP</p>
        </div>
      </div>

      {/* Perfect score message */}
      {mistakeCount === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 rounded-2xl bg-[#ffc700]/10 px-6 py-3"
        >
          <p className="text-sm font-black text-[#d39a00]">Perfecte! {total}/{total} encerts sense errors!</p>
        </motion.div>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 w-full max-w-xs">
        <Button asChild className="h-14 w-full rounded-2xl bg-[#58cc02] text-lg font-black text-white shadow-[0_6px_0_#3f8f01] hover:translate-y-0.5 hover:shadow-[0_3px_0_#3f8f01] transition-all">
          <Link href={`/dashboard/learn/${data.trackSlug}`}>
            <ArrowLeft className="mr-2 h-5 w-5" />
            Tornar al modul
          </Link>
        </Button>
      </div>
    </div>
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
