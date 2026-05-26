/**
 * @file src/repositories/supabase/learning-review-reads.ts
 * @updated 2026-05-19
 * @summary Reads repeated wrong answers for student review queues.
 * @scope Supabase read helpers only; no review business prioritization.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { LearningWeakSpotRecord } from '@/repositories/interfaces/ILearningRepository';
import type { Database, Tables } from '@/types/database.types';

type AttemptRow = Pick<Tables<'learning_attempts'>, 'id' | 'lesson_id'>;
type AnswerRow = Pick<Tables<'learning_step_answers'>, 'step_id' | 'attempt_id' | 'created_at'>;
type StepRow = Pick<Tables<'learning_steps'>, 'id' | 'lesson_id' | 'prompt' | 'type'>;
type LessonRow = Pick<Tables<'learning_lessons'>, 'id' | 'module_id' | 'slug' | 'title'>;
type ModuleRow = Pick<Tables<'learning_modules'>, 'id' | 'track_id'>;
type TrackRow = Pick<Tables<'learning_tracks'>, 'id' | 'slug' | 'title'>;

export async function readWeakSpots(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<LearningWeakSpotRecord[]> {
  const attempts = await supabase
    .from('learning_attempts')
    .select('id, lesson_id')
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
    .limit(30);
  if (attempts.error) throw new Error(attempts.error.message);
  if (!attempts.data || attempts.data.length === 0) return [];

  const answers = await readWrongAnswers(supabase, attempts.data);
  if (answers.length === 0) return [];

  const steps = await readSteps(supabase, answers.map((answer) => answer.step_id));
  const lessons = await readLessons(supabase, steps.map((step) => step.lesson_id));
  const modules = await readModules(supabase, lessons.map((lesson) => lesson.module_id));
  const tracks = await readTracks(supabase, modules.map((module) => module.track_id));
  return aggregateWeakSpots(answers, steps, lessons, modules, tracks);
}

async function readWrongAnswers(supabase: SupabaseClient<Database>, attempts: AttemptRow[]) {
  const result = await supabase
    .from('learning_step_answers')
    .select('step_id, attempt_id, created_at')
    .in('attempt_id', attempts.map((attempt) => attempt.id))
    .eq('is_correct', false)
    .order('created_at', { ascending: false });
  if (result.error) throw new Error(result.error.message);
  return result.data ?? [];
}

async function readSteps(supabase: SupabaseClient<Database>, ids: string[]) {
  const result = await supabase
    .from('learning_steps')
    .select('id, lesson_id, prompt, type')
    .in('id', [...new Set(ids)])
    .eq('publication_status', 'published');
  if (result.error) throw new Error(result.error.message);
  return result.data ?? [];
}

async function readLessons(supabase: SupabaseClient<Database>, ids: string[]) {
  const result = await supabase
    .from('learning_lessons')
    .select('id, module_id, slug, title')
    .in('id', [...new Set(ids)])
    .match({ active: true, publication_status: 'published' });
  if (result.error) throw new Error(result.error.message);
  return result.data ?? [];
}

async function readModules(supabase: SupabaseClient<Database>, ids: string[]) {
  const result = await supabase
    .from('learning_modules')
    .select('id, track_id')
    .in('id', [...new Set(ids)])
    .match({ active: true, publication_status: 'published' });
  if (result.error) throw new Error(result.error.message);
  return result.data ?? [];
}

async function readTracks(supabase: SupabaseClient<Database>, ids: string[]) {
  const result = await supabase
    .from('learning_tracks')
    .select('id, slug, title')
    .in('id', [...new Set(ids)])
    .match({ active: true, publication_status: 'published' });
  if (result.error) throw new Error(result.error.message);
  return result.data ?? [];
}

function aggregateWeakSpots(
  answers: AnswerRow[],
  steps: StepRow[],
  lessons: LessonRow[],
  modules: ModuleRow[],
  tracks: TrackRow[]
) {
  const grouped = new Map<string, { count: number; last: string }>();
  answers.forEach((answer) => {
    const current = grouped.get(answer.step_id);
    grouped.set(answer.step_id, {
      count: (current?.count ?? 0) + 1,
      last: current && current.last > answer.created_at ? current.last : answer.created_at,
    });
  });

  return [...grouped.entries()].flatMap(([stepId, meta]) => {
    const step = steps.find((item) => item.id === stepId);
    const lesson = step ? lessons.find((item) => item.id === step.lesson_id) : null;
    const learningModule = lesson ? modules.find((item) => item.id === lesson.module_id) : null;
    const track = learningModule ? tracks.find((item) => item.id === learningModule.track_id) : null;
    if (!step || !lesson || !track) return [];
    return [{
      stepId,
      lessonId: lesson.id,
      lessonSlug: lesson.slug,
      lessonTitle: lesson.title,
      trackSlug: track.slug,
      trackTitle: track.title,
      prompt: step.prompt,
      type: step.type as LearningWeakSpotRecord['type'],
      wrongCount: meta.count,
      lastWrongAt: meta.last,
    }];
  });
}
