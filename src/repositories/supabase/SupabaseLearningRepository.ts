/**
 * @file src/repositories/supabase/SupabaseLearningRepository.ts
 * @updated 2026-05-20
 * @summary Supabase implementation for learning dashboard reads.
 * @scope Data access only; no learning progression business rules.
 */
import { createAdminClient } from '@/lib/supabase/server';
import type {
  ILearningRepository,
  LearningAttemptCompletion,
  LearningDashboardSnapshot,
  LearningLessonDetailRecord,
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
import { readWeakSpots } from './learning-review-reads';
import { publishedContent, findLessonBySlug, assertNoError } from './learning-query-helpers';

type LessonRow = Tables<'learning_lessons'>;

export class SupabaseLearningRepository implements ILearningRepository {
  private locale: string;

  constructor(locale: string = 'ca') {
    this.locale = locale;
  }

  private getLocalizedColumn(baseColumn: string): string {
    if (this.locale === 'ca') return `${baseColumn}_ca`;
    return `COALESCE(${baseColumn}_${this.locale}, ${baseColumn}_ca)`;
  }

  async getDashboardSnapshot(userId: string): Promise<LearningDashboardSnapshot> {
    const supabase = createAdminClient();
    const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const todayStart = new Date().toISOString().slice(0, 10);

    const [tracks, modules, lessons, progress, xp, streak, attempts] = await Promise.all([
      supabase.from('learning_tracks').select('*').match(publishedContent).order('order_index'),
      supabase.from('learning_modules').select('*').match(publishedContent).order('order_index'),
      supabase.from('learning_lessons').select('*').match(publishedContent).order('order_index'),
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
      tracks: mapTracks(tracks.data ?? [], this.locale),
      modules: mapModules(modules.data ?? [], lessons.data ?? [], this.locale),
      progress: mapProgress(progress.data ?? []),
      xpTotal: sumXp(xp.data ?? []),
      todayXp: sumTodayXp(xp.data ?? [], todayStart),
      xpEvents: mapXpEvents(xp.data ?? []),
      streakDays: streak.data?.current_streak ?? 0,
      weeklyMinutes: sumWeeklyMinutes(attempts.data ?? []),
      averageAccuracy: averageAccuracy(attempts.data ?? []),
      reviewItems: mapReviewItems(progress.data ?? [], lessons.data ?? [], this.locale),
    };
  }

  async getWeakSpots(userId: string) {
    return readWeakSpots(createAdminClient(), userId);
  }

  async getLessonDetail(trackSlug: string, lessonSlug: string): Promise<LearningLessonDetailRecord | null> {
    const supabase = createAdminClient();
    const track = await supabase
      .from('learning_tracks')
      .select('*')
      .eq('slug', trackSlug)
      .match(publishedContent)
      .maybeSingle();
    assertNoError(track.error);
    if (!track.data) return null;

    const modules = await supabase
      .from('learning_modules')
      .select('*')
      .eq('track_id', track.data.id)
      .match(publishedContent)
      .order('order_index');
    assertNoError(modules.error);

    const lesson = await findLessonBySlug(modules.data ?? [], lessonSlug, this.locale);
    if (!lesson) return null;

    const steps = await supabase.from('learning_steps').select('*')
      .eq('lesson_id', lesson.id).eq('publication_status', 'published').order('order_index');
    assertNoError(steps.error);

    const trackData = track.data as Record<string, unknown>;
    const localizedTrack = this.locale === 'ca' 
      ? (trackData['title_ca'] as string | undefined) ?? trackData['title'] as string ?? ''
      : (trackData[`title_${this.locale}`] as string | undefined) ?? (trackData['title_ca'] as string | undefined) ?? (trackData['title'] as string | undefined) ?? '';

    return {
      trackSlug: track.data.slug,
      trackTitle: localizedTrack,
      moduleTitle: lesson.moduleTitle,
      lesson: mapLesson(lesson as LessonRow, this.locale),
      steps: mapSteps(steps.data ?? [], this.locale),
    };
  }

  async completeAttempt(input: LearningAttemptCompletion): Promise<void> {
    await persistAttemptCompletion(createAdminClient(), input);
  }
}
