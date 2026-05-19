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
  AdminLearningModuleRecord,
  AdminLearningTrackRecord,
  IAdminLearningContentRepository,
} from '@/repositories/interfaces/IAdminLearningContentRepository';
import type { LearningStepType } from '@/repositories/interfaces/ILearningRepository';

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
          orderIndex: step.order_index,
        })),
    }));

    const moduleRecords = (modules.data ?? []).map((module): AdminLearningModuleRecord => ({
      id: module.id,
      slug: module.slug,
      title: module.title,
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
      active: track.active,
      orderIndex: track.order_index,
      modules: moduleRecords.filter((module) =>
        (modules.data ?? []).some((row) => row.id === module.id && row.track_id === track.id)
      ),
    }));
  }
}

function assertNoError(error: PostgrestError | null) {
  if (error) throw new Error(error.message);
}
