/**
 * @file src/features/learning/ui/lesson-runner/useLessonAnswerChecks.ts
 * @updated 2026-05-17
 * @summary Background answer checking cache for lesson runner feedback.
 * @scope Server-side answer checks, local cache and reveal state only.
 */
import { useRef, useState } from 'react';
import { checkLearningStepAnswer } from '@/actions/learning-lesson';
import type { LearningRunnerData, LearningRunnerStep } from '@/services/learning/learning-lesson-service';
import type { StepFeedback } from './LessonRunnerPanels';

type CachedCheck = { key: string; feedback: StepFeedback };
const CHECK_ERROR = 'No hem pogut comprovar la resposta. Torna-ho a provar.';

export function useLessonAnswerChecks(data: LearningRunnerData) {
  const [cache, setCache] = useState<Record<string, CachedCheck>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const pendingRef = useRef(new Map<string, Promise<boolean>>());

  function getFeedback(step: LearningRunnerStep | undefined, value: unknown) {
    if (!step) return undefined;
    const cached = getCached(step.id, value);
    return cached && revealed[step.id] ? cached : undefined;
  }

  function clear(stepId: string) {
    setError(null);
    setRevealed((current) => removeKey(current, stepId));
  }

  function precheck(step: LearningRunnerStep, value: unknown) {
    void runCheck(step, value, false);
  }

  async function reveal(step: LearningRunnerStep, value: unknown) {
    const cached = getCached(step.id, value);
    if (cached) {
      setRevealed((current) => ({ ...current, [step.id]: true }));
      return true;
    }
    return runCheck(step, value, true);
  }

  function getCached(stepId: string, value: unknown) {
    const item = cache[stepId];
    return item && item.key === answerKey(value) ? item.feedback : undefined;
  }

  async function runCheck(step: LearningRunnerStep, value: unknown, revealResult: boolean) {
    const key = `${step.id}:${answerKey(value)}`;
    const pending = pendingRef.current.get(key);
    if (pending) return revealAfterPending(step.id, pending, revealResult);

    const task = runRemoteCheck(step, value, revealResult).finally(() => {
      pendingRef.current.delete(key);
    });
    pendingRef.current.set(key, task);
    return revealAfterPending(step.id, task, revealResult);
  }

  async function runRemoteCheck(step: LearningRunnerStep, value: unknown, showError: boolean) {
    try {
      const response = await checkLearningStepAnswer({
        trackSlug: data.trackSlug,
        lessonSlug: data.lesson.slug,
        stepId: step.id,
        value,
      }, data.locale);
      if (!response.success || !response.data) return fail(showError);
      const feedback = { isCorrect: response.data.isCorrect, explanation: response.data.explanation };
      setCache((current) => ({ ...current, [step.id]: { key: answerKey(value), feedback } }));
      return true;
    } catch {
      return fail(showError);
    }
  }

  async function revealAfterPending(stepId: string, pending: Promise<boolean>, revealResult: boolean) {
    const ok = await pending;
    if (ok && revealResult) setRevealed((current) => ({ ...current, [stepId]: true }));
    return ok;
  }

  function fail(showError: boolean) {
    if (showError) setError(CHECK_ERROR);
    return false;
  }

  return { error, clear, getFeedback, precheck, reveal };
}

function answerKey(value: unknown) {
  return JSON.stringify(value);
}

function removeKey<T>(record: Record<string, T>, key: string) {
  const next = { ...record };
  delete next[key];
  return next;
}
