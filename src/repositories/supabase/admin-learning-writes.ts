/**
 * @file src/repositories/supabase/admin-learning-writes.ts
 * @updated 2026-05-19
 * @summary Supabase write helpers for admin learning content.
 * @scope Data persistence helpers only.
 */
import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import type {
  AdminLearningLessonCreate,
  AdminLearningLessonUpdate,
  AdminLearningModuleCreate,
  AdminLearningModuleUpdate,
  AdminLearningStepCreate,
  AdminLearningStepUpdate,
  AdminLearningTrackCreate,
  AdminLearningTrackUpdate,
} from '@/repositories/interfaces/IAdminLearningContentRepository';
import type { Database, Json } from '@/types/database.types';

type Client = SupabaseClient<Database>;

export async function writeTrack(supabase: Client, input: AdminLearningTrackUpdate | AdminLearningTrackCreate) {
  const payload = {
    slug: input.slug, title: input.title, description: input.description,
    icon: input.icon, color: input.color, active: input.active, order_index: input.orderIndex,
  };
  const result = 'id' in input
    ? await supabase.from('learning_tracks').update(payload).eq('id', input.id)
    : await supabase.from('learning_tracks').insert(payload);
  assertNoError(result.error);
}

export async function writeModule(supabase: Client, input: AdminLearningModuleUpdate | AdminLearningModuleCreate) {
  const payload = {
    slug: input.slug, title: input.title, description: input.description,
    level: input.level, active: input.active, order_index: input.orderIndex,
  };
  const result = 'id' in input
    ? await supabase.from('learning_modules').update(payload).eq('id', input.id)
    : await supabase.from('learning_modules').insert({ ...payload, track_id: input.trackId });
  assertNoError(result.error);
}

export async function writeLesson(supabase: Client, input: AdminLearningLessonUpdate | AdminLearningLessonCreate) {
  const payload = {
    slug: input.slug, title: input.title, objective: input.objective,
    active: input.active, estimated_minutes: input.estimatedMinutes,
    xp_reward: input.xpReward, order_index: input.orderIndex,
  };
  const result = 'id' in input
    ? await supabase.from('learning_lessons').update(payload).eq('id', input.id)
    : await supabase.from('learning_lessons').insert({ ...payload, module_id: input.moduleId });
  assertNoError(result.error);
}

export async function writeStep(supabase: Client, input: AdminLearningStepUpdate | AdminLearningStepCreate) {
  const payload = {
    type: input.type, prompt: input.prompt, explanation: input.explanation,
    config: input.config as Json, order_index: input.orderIndex,
  };
  const result = 'id' in input
    ? await supabase.from('learning_steps').update(payload).eq('id', input.id)
    : await supabase.from('learning_steps').insert({ ...payload, lesson_id: input.lessonId });
  assertNoError(result.error);
}

function assertNoError(error: PostgrestError | null) {
  if (error) throw new Error(error.message);
}
