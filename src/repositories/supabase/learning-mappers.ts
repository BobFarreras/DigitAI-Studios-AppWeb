/**
 * @file src/repositories/supabase/learning-mappers.ts
 * @updated 2026-05-16
 * @summary Maps Supabase learning rows into repository records.
 * @scope Pure data mapping for learning repositories.
 */
import type {
  LearningLessonRecord,
  LearningModuleRecord,
  LearningProgressRecord,
  LearningStepRecord,
  LearningTrackRecord,
  LearningXpEventRecord,
} from '@/repositories/interfaces/ILearningRepository';
import type { Tables } from '@/types/database.types';

type TrackRow = Tables<'learning_tracks'>;
type ModuleRow = Tables<'learning_modules'>;
type LessonRow = Tables<'learning_lessons'>;
type ProgressRow = Tables<'learning_progress'>;
type StepRow = Tables<'learning_steps'>;
type AttemptRow = Tables<'learning_attempts'>;
type XpRow = Pick<Tables<'learning_xp_events'>, 'id' | 'xp' | 'source_type' | 'created_at'>;

export function mapTracks(tracks: TrackRow[]): LearningTrackRecord[] {
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

export function mapModules(modules: ModuleRow[], lessons: LessonRow[]): LearningModuleRecord[] {
  return modules.map((module) => ({
    id: module.id,
    trackId: module.track_id,
    slug: module.slug,
    title: module.title,
    description: module.description,
    orderIndex: module.order_index,
    lessons: lessons.filter((lesson) => lesson.module_id === module.id).map(mapLesson),
  }));
}

export function mapLesson(lesson: LessonRow): LearningLessonRecord {
  return {
    id: lesson.id,
    slug: lesson.slug,
    title: lesson.title,
    objective: lesson.objective,
    estimatedMinutes: lesson.estimated_minutes,
    xpReward: lesson.xp_reward,
    orderIndex: lesson.order_index,
  };
}

export function mapSteps(steps: StepRow[]): LearningStepRecord[] {
  return steps.map((step) => ({
    id: step.id,
    lessonId: step.lesson_id,
    type: step.type as LearningStepRecord['type'],
    prompt: step.prompt,
    explanation: step.explanation,
    config: step.config as Record<string, unknown>,
    orderIndex: step.order_index,
  }));
}

export function mapProgress(progress: ProgressRow[]): LearningProgressRecord[] {
  return progress.map((item) => ({
    lessonId: item.lesson_id,
    completed: item.completed,
    needsReview: item.needs_review,
    bestScore: item.best_score,
  }));
}

export function mapReviewItems(progress: ProgressRow[], lessons: LessonRow[]) {
  const reviewLessonIds = new Set(
    progress.filter((item) => item.needs_review).map((item) => item.lesson_id)
  );
  return lessons
    .filter((lesson) => reviewLessonIds.has(lesson.id))
    .map((lesson) => lesson.title)
    .slice(0, 3);
}

export function sumXp(events: XpRow[]) {
  return events.reduce((total, event) => total + event.xp, 0);
}

export function sumTodayXp(events: XpRow[], today: string) {
  return events
    .filter((event) => event.created_at.startsWith(today))
    .reduce((total, event) => total + event.xp, 0);
}

export function mapXpEvents(events: XpRow[]): LearningXpEventRecord[] {
  return events.slice(0, 5).map((event) => ({
    id: event.id,
    xp: event.xp,
    sourceType: event.source_type,
    createdAt: event.created_at,
  }));
}

export function sumWeeklyMinutes(attempts: AttemptRow[]) {
  const seconds = attempts.reduce((total, attempt) => total + attempt.time_spent_seconds, 0);
  return Math.round(seconds / 60);
}

export function averageAccuracy(attempts: AttemptRow[]) {
  const values = attempts
    .map((attempt) => attempt.accuracy)
    .filter((value): value is number => value !== null);
  if (values.length === 0) return null;
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}
