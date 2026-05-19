/**
 * @file src/repositories/supabase/SupabaseLearningRepository.ts
 * @updated 2026-05-16
 * @summary Supabase implementation for learning dashboard reads.
 * @scope Data access only; no learning progression business rules.
 */
import type { PostgrestError } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabase/server';
import type {
  ILearningRepository,
  LearningAttemptCompletion,
  LearningLessonDetailRecord,
  LearningDashboardSnapshot,
} from '@/repositories/interfaces/ILearningRepository';
import type { Tables } from '@/types/database.types';
import {
  averageAccuracy,
  mapLesson,
  mapModules,
  mapProgress,
  mapReviewItems,
  mapSteps,
  mapTracks,
  mapXpEvents,
  sumTodayXp,
  sumWeeklyMinutes,
  sumXp,
} from './learning-mappers';
import { persistAttemptCompletion } from './learning-persistence';

type ModuleRow = Tables<'learning_modules'>;

export class SupabaseLearningRepository implements ILearningRepository {
  async getDashboardSnapshot(userId: string): Promise<LearningDashboardSnapshot> {
    const supabase = createAdminClient();
    const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const todayStart = new Date().toISOString().slice(0, 10);

    const [tracks, modules, lessons, progress, xp, streak, attempts] = await Promise.all([
      supabase.from('learning_tracks').select('*').eq('active', true).order('order_index'),
      supabase.from('learning_modules').select('*').eq('active', true).order('order_index'),
      supabase.from('learning_lessons').select('*').eq('active', true).order('order_index'),
      supabase.from('learning_progress').select('*').eq('user_id', userId),
      supabase
        .from('learning_xp_events')
        .select('id, xp, source_type, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
      supabase.from('learning_streaks').select('*').eq('user_id', userId).maybeSingle(),
      supabase
        .from('learning_attempts')
        .select('*')
        .eq('user_id', userId)
        .gte('started_at', weekStart),
    ]);

    assertNoError(tracks.error);
    assertNoError(modules.error);
    assertNoError(lessons.error);
    assertNoError(progress.error);
    assertNoError(xp.error);
    assertNoError(streak.error);
    assertNoError(attempts.error);

    return {
      tracks: mapTracks(tracks.data ?? []),
      modules: mapModules(modules.data ?? [], lessons.data ?? []),
      progress: mapProgress(progress.data ?? []),
      xpTotal: sumXp(xp.data ?? []),
      todayXp: sumTodayXp(xp.data ?? [], todayStart),
      xpEvents: mapXpEvents(xp.data ?? []),
      streakDays: streak.data?.current_streak ?? 0,
      weeklyMinutes: sumWeeklyMinutes(attempts.data ?? []),
      averageAccuracy: averageAccuracy(attempts.data ?? []),
      reviewItems: mapReviewItems(progress.data ?? [], lessons.data ?? []),
    };
  }

  async getLessonDetail(
    trackSlug: string,
    lessonSlug: string
  ): Promise<LearningLessonDetailRecord | null> {
    const supabase = createAdminClient();
    const track = await supabase
      .from('learning_tracks')
      .select('*')
      .eq('slug', trackSlug)
      .eq('active', true)
      .maybeSingle();
    assertNoError(track.error);
    if (!track.data) return null;

    const modules = await supabase
      .from('learning_modules')
      .select('*')
      .eq('track_id', track.data.id)
      .eq('active', true)
      .order('order_index');
    assertNoError(modules.error);

    const lesson = await findLessonBySlug(modules.data ?? [], lessonSlug);
    if (!lesson) return null;

    const steps = await supabase
      .from('learning_steps')
      .select('*')
      .eq('lesson_id', lesson.id)
      .order('order_index');
    assertNoError(steps.error);

    return {
      trackSlug: track.data.slug,
      trackTitle: track.data.title,
      moduleTitle: lesson.moduleTitle,
      lesson: mapLesson(lesson),
      steps: mapSteps(steps.data ?? []),
    };
  }

  async completeAttempt(input: LearningAttemptCompletion): Promise<void> {
    await persistAttemptCompletion(createAdminClient(), input);
  }
}

async function findLessonBySlug(modules: ModuleRow[], lessonSlug: string) {
  const supabase = createAdminClient();
  const moduleIds = modules.map((module) => module.id);
  if (moduleIds.length === 0) return null;

  const lesson = await supabase
    .from('learning_lessons')
    .select('*')
    .in('module_id', moduleIds)
    .eq('slug', lessonSlug)
    .eq('active', true)
    .maybeSingle();
  assertNoError(lesson.error);
  if (!lesson.data) return null;

  const lessonData = lesson.data;
  const learningModule = modules.find((item) => item.id === lessonData.module_id);
  return { ...lessonData, moduleTitle: learningModule?.title ?? 'Formacio' };
}

function assertNoError(error: PostgrestError | null) {
  if (error) throw new Error(error.message);
}
