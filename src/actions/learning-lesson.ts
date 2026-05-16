/**
 * @file src/actions/learning-lesson.ts
 * @updated 2026-05-16
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

type RunnerResult =
  | { success: true; data: LearningRunnerData }
  | { success: false; authRequired?: true; error: string };

type SubmitResult =
  | { success: true; data: Awaited<ReturnType<LearningLessonService['submitLesson']>> }
  | { success: false; authRequired?: true; error: string };

export async function getLearningLessonRunner(
  trackSlug: string,
  lessonSlug: string
): Promise<RunnerResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, authRequired: true, error: 'auth_required' };

  const service = new LearningLessonService(new SupabaseLearningRepository());
  const data = await service.getRunner(trackSlug, lessonSlug);
  if (!data) return { success: false, error: 'lesson_not_found' };

  return { success: true, data };
}

export async function submitLearningLesson(input: unknown): Promise<SubmitResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, authRequired: true as const, error: 'auth_required' };

  const parsed = submitSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: 'invalid_payload' };

  const service = new LearningLessonService(new SupabaseLearningRepository());
  const result = await service.submitLesson(
    user.id,
    parsed.data.trackSlug,
    parsed.data.lessonSlug,
    parsed.data.answers
  );

  return { success: true, data: result };
}

async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
