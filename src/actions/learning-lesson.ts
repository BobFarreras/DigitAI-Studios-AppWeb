/**
 * @file src/actions/learning-lesson.ts
 * @updated 2026-05-20
 * @summary Server actions for learning lesson runner.
 * @scope Auth, input validation and service orchestration only.
 */
'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { SupabaseLearningRepository } from '@/repositories/supabase/SupabaseLearningRepository';
import {
  LearningLessonService,
  type LearningRunnerData,
} from '@/services/learning/learning-lesson-service';

const answerSchema = z.object({
  stepId: z.string().uuid(),
  value: z.unknown(),
  hintUsed: z.boolean().default(false),
  timeSpentSeconds: z.number().int().min(0).max(3600).default(0),
});

const submitSchema = z.object({
  trackSlug: z.string().min(1).max(80),
  lessonSlug: z.string().min(1).max(80),
  answers: z.array(answerSchema).min(1).max(20),
});

const checkSchema = z.object({
  trackSlug: z.string().min(1).max(80),
  lessonSlug: z.string().min(1).max(80),
  stepId: z.string().uuid(),
  value: z.unknown(),
});

type RunnerResult =
  | { success: true; data: LearningRunnerData }
  | { success: false; authRequired?: true; error: string };

type SubmitResult =
  | { success: true; data: Awaited<ReturnType<LearningLessonService['submitLesson']>> }
  | { success: false; authRequired?: true; error: string };

type CheckResult =
  | { success: true; data: Awaited<ReturnType<LearningLessonService['checkAnswer']>> }
  | { success: false; authRequired?: true; error: string };

export async function getLearningLessonRunner(
  trackSlug: string,
  lessonSlug: string,
  locale: string = 'ca'
): Promise<RunnerResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, authRequired: true, error: 'auth_required' };

  const service = new LearningLessonService(new SupabaseLearningRepository(locale));
  const data = await service.getRunner(trackSlug, lessonSlug, locale);
  if (!data) return { success: false, error: 'lesson_not_found' };

  return { success: true, data };
}

export async function submitLearningLesson(input: unknown, locale: string = 'ca'): Promise<SubmitResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, authRequired: true as const, error: 'auth_required' };

  const parsed = submitSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: 'invalid_payload' };

  const service = new LearningLessonService(new SupabaseLearningRepository(locale));
  const result = await service.submitLesson(
    user.id,
    parsed.data.trackSlug,
    parsed.data.lessonSlug,
    parsed.data.answers
  );

  return { success: true, data: result };
}

export async function checkLearningStepAnswer(input: unknown, locale: string = 'ca'): Promise<CheckResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, authRequired: true as const, error: 'auth_required' };

  const parsed = checkSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: 'invalid_payload' };

  const service = new LearningLessonService(new SupabaseLearningRepository(locale));
  const result = await service.checkAnswer(
    parsed.data.trackSlug,
    parsed.data.lessonSlug,
    parsed.data.stepId,
    parsed.data.value
  );

  return result ? { success: true, data: result } : { success: false, error: 'step_not_found' };
}

async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
