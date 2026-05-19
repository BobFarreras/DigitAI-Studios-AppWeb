/**
 * @file src/repositories/supabase/SupabaseAdminLearningContentRepository.ts
 * @updated 2026-05-19
 * @summary Supabase reads for admin learning content inventory.
 * @scope Data access only; no admin UI or domain decisions.
 */
import type { PostgrestError } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabase/server';
import type {
  AdminLearningLessonRecord,
  AdminLearningLessonUpdate,
  AdminLearningModuleRecord,
  AdminLearningModuleUpdate,
  AdminLearningStepUpdate,
  AdminLearningTrackRecord,
  AdminLearningTrackUpdate,
  IAdminLearningContentRepository,
} from '@/repositories/interfaces/IAdminLearningContentRepository';
import type { LearningStepType } from '@/repositories/interfaces/ILearningRepository';
import type { Json } from '@/types/database.types';

export class SupabaseAdminLearningContentRepository implements IAdminLearningContentRepository {
  async listContent(): Promise<AdminLearningTrackRecord[]> {
    const supabase = createAdminClient();
    const [tracks, modules, lessons, steps] = await Promise.all([
      supabase.from('learning_tracks').select('*').order('order_index'),
      supabase.from('learning_modules').select('*').order('order_index'),
      supabase.from('learning_lessons').select('*').order('order_index'),
      supabase.from('learning_steps').select('*').order('order_index'),
    ]);

    assertNoError(tracks.error);
    assertNoError(modules.error);
    assertNoError(lessons.error);
    assertNoError(steps.error);

    const lessonRecords = (lessons.data ?? []).map((lesson): AdminLearningLessonRecord => ({
      id: lesson.id,
      slug: lesson.slug,
      title: lesson.title,
      objective: lesson.objective,
      active: lesson.active,
      xpReward: lesson.xp_reward,
      estimatedMinutes: lesson.estimated_minutes,
      orderIndex: lesson.order_index,
      steps: (steps.data ?? [])
        .filter((step) => step.lesson_id === lesson.id)
        .map((step) => ({
          id: step.id,
          type: step.type as LearningStepType,
          prompt: step.prompt,
          explanation: step.explanation,
          config: step.config as Record<string, unknown>,
          orderIndex: step.order_index,
        })),
    }));

    const moduleRecords = (modules.data ?? []).map((module): AdminLearningModuleRecord => ({
      id: module.id,
      slug: module.slug,
      title: module.title,
      description: module.description,
      level: module.level,
      active: module.active,
      orderIndex: module.order_index,
      lessons: lessonRecords.filter((lesson) =>
        (lessons.data ?? []).some((row) => row.id === lesson.id && row.module_id === module.id)
      ),
    }));

    return (tracks.data ?? []).map((track): AdminLearningTrackRecord => ({
      id: track.id,
      slug: track.slug,
      title: track.title,
      description: track.description,
      icon: track.icon,
      color: track.color,
      active: track.active,
      orderIndex: track.order_index,
      modules: moduleRecords.filter((module) =>
        (modules.data ?? []).some((row) => row.id === module.id && row.track_id === track.id)
      ),
    }));
  }

  async updateTrack(input: AdminLearningTrackUpdate) {
    const result = await createAdminClient().from('learning_tracks').update({
      slug: input.slug,
      title: input.title,
      description: input.description,
      icon: input.icon,
      color: input.color,
      active: input.active,
      order_index: input.orderIndex,
    }).eq('id', input.id);
    assertNoError(result.error);
  }

  async updateModule(input: AdminLearningModuleUpdate) {
    const result = await createAdminClient().from('learning_modules').update({
      slug: input.slug,
      title: input.title,
      description: input.description,
      level: input.level,
      active: input.active,
      order_index: input.orderIndex,
    }).eq('id', input.id);
    assertNoError(result.error);
  }

  async updateLesson(input: AdminLearningLessonUpdate) {
    const result = await createAdminClient().from('learning_lessons').update({
      slug: input.slug,
      title: input.title,
      objective: input.objective,
      active: input.active,
      estimated_minutes: input.estimatedMinutes,
      xp_reward: input.xpReward,
      order_index: input.orderIndex,
    }).eq('id', input.id);
    assertNoError(result.error);
  }

  async updateStep(input: AdminLearningStepUpdate) {
    const result = await createAdminClient().from('learning_steps').update({
      type: input.type,
      prompt: input.prompt,
      explanation: input.explanation,
      config: input.config as Json,
      order_index: input.orderIndex,
    }).eq('id', input.id);
    assertNoError(result.error);
  }
}

function assertNoError(error: PostgrestError | null) {
  if (error) throw new Error(error.message);
}
