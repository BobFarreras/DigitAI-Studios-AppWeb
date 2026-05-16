/**
 * @file src/features/learning/ui/LearningLessonRunner.tsx
 * @updated 2026-05-16
 * @summary Interactive lesson runner with several exercise dynamics.
 * @scope Client-side lesson interaction; scoring is submitted to server actions.
 */
'use client';

import { useState, useTransition } from 'react';
import { ArrowLeft, Check, ChevronRight, Construction } from 'lucide-react';
import { Link } from '@/routing';
import { Button } from '@/components/ui/button';
import { submitLearningLesson } from '@/actions/learning-lesson';
import type { LearningRunnerData } from '@/services/learning/learning-lesson-service';
import { StepInteraction } from './lesson-runner/StepInteraction';

type Props = {
  data: LearningRunnerData;
};

type AnswerMap = Record<string, unknown>;

export function LearningLessonRunner({ data }: Props) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [result, setResult] = useState<{ score: number; xpAwarded: number } | null>(null);
  const [isPending, startTransition] = useTransition();
  if (data.steps.length === 0) return <EmptyLesson data={data} />;

  const step = data.steps[index];
  const selected = answers[step.id];
  const isLast = index === data.steps.length - 1;
  const progress = Math.round(((index + 1) / data.steps.length) * 100);

  const canContinue = selected !== undefined && selected !== '';

  function next() {
    if (!isLast) {
      setIndex((current) => current + 1);
      return;
    }

    startTransition(async () => {
      const response = await submitLearningLesson({
        trackSlug: data.trackSlug,
        lessonSlug: data.lesson.slug,
        answers: Object.entries(answers).map(([stepId, value]) => ({
          stepId,
          value,
          hintUsed: false,
          timeSpentSeconds: 0,
        })),
      });
      if (response.success) setResult(response.data);
    });
  }

  if (result) return <LessonResult data={data} score={result.score} xp={result.xpAwarded} />;

  return (
    <section className="mx-auto flex min-h-[calc(100vh-96px)] max-w-2xl flex-col bg-white text-[#3c3c3c] dark:bg-slate-950">
      <div className="mb-5 flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Link href={`/dashboard/learn/${data.trackSlug}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-[#e5e5e5]">
          <div className="h-full rounded-full bg-[#58cc02]" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <p className="text-sm font-black uppercase text-[#58cc02]">{data.trackTitle}</p>
      <h1 className="mt-2 text-3xl font-black">{step.prompt}</h1>

      <div className="mt-8 flex-1">
        <StepInteraction step={step} value={selected} onChange={(value) => setAnswers({ ...answers, [step.id]: value })} />
      </div>

      <div className="sticky bottom-0 -mx-4 border-t-2 border-[#e5e5e5] bg-white p-4 dark:bg-slate-950">
        <Button
          disabled={!canContinue || isPending}
          onClick={next}
          className="h-12 w-full rounded-xl bg-[#58cc02] text-base font-black text-white shadow-[0_5px_0_#3f8f01] hover:bg-[#58cc02]"
        >
          {isLast ? 'Completar' : 'Continuar'}
          {isLast ? <Check className="ml-2 h-5 w-5" /> : <ChevronRight className="ml-2 h-5 w-5" />}
        </Button>
      </div>
    </section>
  );
}

function EmptyLesson({ data }: { data: LearningRunnerData }) {
  return (
    <section className="mx-auto max-w-md py-10 text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#ffc700] text-amber-800 shadow-[0_8px_0_#d39a00]">
        <Construction className="h-12 w-12" />
      </div>
      <h1 className="mt-6 text-3xl font-black text-[#3c3c3c] dark:text-white">Llico en preparacio</h1>
      <p className="mt-3 text-base font-bold leading-6 text-[#777777]">
        Aquesta llico encara no te exercicis publicats.
      </p>
      <Button asChild className="mt-8 h-12 rounded-xl bg-[#58cc02] font-black text-white shadow-[0_5px_0_#3f8f01]">
        <Link href={`/dashboard/learn/${data.trackSlug}`}>Tornar al mapa</Link>
      </Button>
    </section>
  );
}

function LessonResult({ data, score, xp }: { data: LearningRunnerData; score: number; xp: number }) {
  return (
    <section className="mx-auto max-w-md py-10 text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#58cc02] text-white shadow-[0_8px_0_#3f8f01]">
        <Check className="h-12 w-12" />
      </div>
      <h1 className="mt-6 text-3xl font-black text-[#3c3c3c] dark:text-white">Llico completada</h1>
      <p className="mt-3 text-lg font-black text-[#777777]">{score}% precisio · +{xp} XP</p>
      <Button asChild className="mt-8 h-12 rounded-xl bg-[#58cc02] font-black text-white shadow-[0_5px_0_#3f8f01]">
        <Link href={`/dashboard/learn/${data.trackSlug}`}>Tornar al mapa</Link>
      </Button>
    </section>
  );
}
