/**
 * @file src/features/learning/ui/lesson-runner/useLessonRunnerState.ts
 * @updated 2026-05-17
 * @summary Client state machine for the learning lesson runner.
 * @scope UI state, per-step timing and server action orchestration only.
 */
import { useRef, useState, useTransition } from 'react';
import { submitLearningLesson } from '@/actions/learning-lesson';
import type { LearningRunnerData } from '@/services/learning/learning-lesson-service';
import { useLessonAnswerChecks } from './useLessonAnswerChecks';

type AnswerMap = Record<string, unknown>;
type TimeMap = Record<string, number>;
type LessonResultState = { score: number; xpAwarded: number; mistakeCount: number; requiresReview: boolean };
const SUBMIT_ERROR = 'No hem pogut guardar la llico. Torna-ho a provar.';
export function useLessonRunnerState(data: LearningRunnerData) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [stepTimes, setStepTimes] = useState<TimeMap>({});
  const [startedAt, setStartedAt] = useState(() => currentTimeMs());
  const [result, setResult] = useState<LessonResultState | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const busyRef = useRef(false);
  const checks = useLessonAnswerChecks(data);

  const step = data.steps[index];
  const selected = step ? answers[step.id] : undefined;
  const currentFeedback = checks.getFeedback(step, selected);
  const isLast = index === data.steps.length - 1;
  const progress = data.steps.length > 0 ? Math.round(((index + 1) / data.steps.length) * 100) : 0;
  function updateAnswer(value: unknown) {
    if (!step) return;
    setSubmitError(null);
    checks.clear(step.id);
    setAnswers((current) => ({ ...current, [step.id]: value }));
    if (hasAnswer(step.type, step.config.options, value)) checks.precheck(step, value);
  }

  function checkOrContinue() {
    if (!step || busyRef.current) return;
    setSubmitError(null);
    if (!currentFeedback) {
      revealCurrentStep();
      return;
    }
    if (!isLast) {
      setIndex((current) => current + 1);
      setStartedAt(currentTimeMs());
      return;
    }
    submitLesson();
  }
  function revealCurrentStep() {
    if (!step || busyRef.current) return;
    busyRef.current = true;
    const seconds = secondsSince(startedAt);
    setStepTimes((current) => ({ ...current, [step.id]: seconds }));
    void checks.reveal(step, selected).finally(() => {
      busyRef.current = false;
    });
  }

  function submitLesson() {
    if (busyRef.current) return;
    busyRef.current = true;
    startTransition(async () => {
      try {
        const response = await submitLearningLesson(buildSubmitPayload(data, answers, stepTimes), data.locale);
        if (!response.success) {
          setSubmitError(SUBMIT_ERROR);
          return;
        }
        setResult(response.data);
      } catch {
        setSubmitError(SUBMIT_ERROR);
      } finally {
        busyRef.current = false;
      }
    });
  }

  return {
    step,
    selected,
    currentFeedback,
    result,
    error: checks.error ?? submitError,
    isPending,
    canContinue: step ? hasAnswer(step.type, step.config.options, selected) : false,
    isLast,
    progress,
    updateAnswer,
    checkOrContinue,
  };
}

function buildSubmitPayload(data: LearningRunnerData, answers: AnswerMap, stepTimes: TimeMap) {
  return {
    trackSlug: data.trackSlug,
    lessonSlug: data.lesson.slug,
    answers: Object.entries(answers).map(([stepId, value]) => ({
      stepId,
      value,
      hintUsed: false,
      timeSpentSeconds: stepTimes[stepId] ?? 0,
    })),
  };
}

function hasAnswer(type: string, options: unknown, value: unknown) {
  if (type === 'content') return true;
  if (type === 'order_steps') return Array.isArray(value) && value.length === asArray(options).length;
  if (type === 'match_pairs') return isRecord(value) && Object.keys(value).length === asArray(options).length;
  if (type === 'multi_select') return Array.isArray(value) && value.length > 0;
  if (type === 'ai_prompt_review') return Array.isArray(value) && value.length > 0;
  if (type === 'fill_blank') return typeof value === 'string' && value.trim().length > 0;
  if (type === 'terminal_simulation') return typeof value === 'string' && value.trim().length > 0;
  if (type === 'code_editor') return typeof value === 'string' && value.trim().length > 0;
  return value !== undefined && value !== '';
}

function secondsSince(startedAt: number) {
  return Math.max(1, Math.round((currentTimeMs() - startedAt) / 1000));
}
const asArray = (value: unknown) => Array.isArray(value) ? value : [];
const currentTimeMs = () => globalThis.performance?.now() ?? 0;
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
