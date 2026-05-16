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
  LearningDashboardSnapshot,
  LearningLessonRecord,
  LearningModuleRecord,
  LearningTrackRecord,
} from '@/repositories/interfaces/ILearningRepository';
import type { Tables } from '@/types/database.types';

type TrackRow = Tables<'learning_tracks'>;
type ModuleRow = Tables<'learning_modules'>;
type LessonRow = Tables<'learning_lessons'>;
type ProgressRow = Tables<'learning_progress'>;
type AttemptRow = Tables<'learning_attempts'>;
type XpRow = Pick<Tables<'learning_xp_events'>, 'xp'>;

export class SupabaseLearningRepository implements ILearningRepository {
  async getDashboardSnapshot(userId: string): Promise<LearningDashboardSnapshot> {
    const supabase = createAdminClient();
    const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [tracks, modules, lessons, progress, xp, streak, attempts] = await Promise.all([
      supabase.from('learning_tracks').select('*').eq('active', true).order('order_index'),
      supabase.from('learning_modules').select('*').eq('active', true).order('order_index'),
      supabase.from('learning_lessons').select('*').eq('active', true).order('order_index'),
      supabase.from('learning_progress').select('*').eq('user_id', userId),
      supabase.from('learning_xp_events').select('xp').eq('user_id', userId),
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
      streakDays: streak.data?.current_streak ?? 0,
      weeklyMinutes: sumWeeklyMinutes(attempts.data ?? []),
      averageAccuracy: averageAccuracy(attempts.data ?? []),
      reviewItems: mapReviewItems(progress.data ?? [], lessons.data ?? []),
    };
  }
}

function mapTracks(tracks: TrackRow[]): LearningTrackRecord[] {
  return tracks.map((track) => ({
    id: track.id,
    slug: track.slug,
    title: track.title,
    description: track.description,
    icon: track.icon,
    color: track.color,
    orderIndex: track.order_index,
  }));
}

function mapModules(modules: ModuleRow[], lessons: LessonRow[]): LearningModuleRecord[] {
  return modules.map((module) => ({
    id: module.id,
    trackId: module.track_id,
    slug: module.slug,
    title: module.title,
    description: module.description,
    orderIndex: module.order_index,
    lessons: mapLessons(lessons.filter((lesson) => lesson.module_id === module.id)),
  }));
}

function mapLessons(lessons: LessonRow[]): LearningLessonRecord[] {
  return lessons.map((lesson) => ({
    id: lesson.id,
    slug: lesson.slug,
    title: lesson.title,
    estimatedMinutes: lesson.estimated_minutes,
    orderIndex: lesson.order_index,
  }));
}

function mapProgress(progress: ProgressRow[]) {
  return progress.map((item) => ({
    lessonId: item.lesson_id,
    completed: item.completed,
    needsReview: item.needs_review,
    bestScore: item.best_score,
  }));
}

function mapReviewItems(progress: ProgressRow[], lessons: LessonRow[]) {
  const reviewLessonIds = new Set(
    progress.filter((item) => item.needs_review).map((item) => item.lesson_id)
  );
  return lessons
    .filter((lesson) => reviewLessonIds.has(lesson.id))
    .map((lesson) => lesson.title)
    .slice(0, 3);
}

function sumXp(events: XpRow[]) {
  return events.reduce((total, event) => total + event.xp, 0);
}

function sumWeeklyMinutes(attempts: AttemptRow[]) {
  const seconds = attempts.reduce((total, attempt) => total + attempt.time_spent_seconds, 0);
  return Math.round(seconds / 60);
}

function averageAccuracy(attempts: AttemptRow[]) {
  const values = attempts
    .map((attempt) => attempt.accuracy)
    .filter((value): value is number => value !== null);
  if (values.length === 0) return null;
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

function assertNoError(error: PostgrestError | null) {
  if (error) throw new Error(error.message);
}
