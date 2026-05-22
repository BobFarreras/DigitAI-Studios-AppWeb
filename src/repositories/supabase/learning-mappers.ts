/**
 * @file src/repositories/supabase/learning-mappers.ts
 * @updated 2026-05-20
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
import type { TrackRow, ModuleRow, LessonRow, ProgressRow, StepRow, AttemptRow, XpRow } from './learning-mappers-types';

function localizedTitle(row: TrackRow | ModuleRow, locale: string): string {
  if (locale === 'ca') return row.title_ca ?? row.title ?? '';
  const langTitle = row[`title_${locale}` as keyof typeof row] as string | undefined;
  return langTitle ?? row.title_ca ?? row.title ?? '';
}

function localizedDescription(row: TrackRow | ModuleRow, locale: string): string | null {
  if (locale === 'ca') return row.description_ca ?? row.description ?? null;
  const langDesc = row[`description_${locale}` as keyof typeof row] as string | undefined;
  return langDesc ?? row.description_ca ?? row.description ?? null;
}

export function mapTracks(tracks: TrackRow[], locale: string = 'ca'): LearningTrackRecord[] {
  return tracks.map((track) => ({
    id: track.id,
    slug: track.slug,
    title: localizedTitle(track, locale),
    description: localizedDescription(track, locale),
    icon: track.icon,
    color: track.color,
    orderIndex: track.order_index,
  }));
}

export function mapModules(modules: ModuleRow[], lessons: LessonRow[], locale: string = 'ca'): LearningModuleRecord[] {
  return modules.map((module) => ({
    id: module.id,
    trackId: module.track_id,
    parentModuleId: module.parent_module_id ?? null,
    slug: module.slug,
    title: localizedTitle(module, locale),
    description: localizedDescription(module, locale),
    level: (module.level as LearningModuleRecord['level']) ?? 'basic',
    orderIndex: module.order_index,
    lessons: lessons.filter((lesson) => lesson.module_id === module.id).map((l) => mapLesson(l, locale)),
  }));
}

export function mapLesson(lesson: LessonRow, locale: string = 'ca'): LearningLessonRecord {
  const title = locale === 'ca' 
    ? (lesson.title_ca ?? lesson.title ?? '')
    : (lesson[`title_${locale}` as keyof typeof lesson] as string | undefined) ?? lesson.title_ca ?? lesson.title ?? '';
  const objective = locale === 'ca'
    ? (lesson.objective_ca ?? lesson.objective ?? null)
    : (lesson[`objective_${locale}` as keyof typeof lesson] as string | undefined) ?? lesson.objective_ca ?? lesson.objective ?? null;

  return {
    id: lesson.id,
    slug: lesson.slug,
    title,
    objective,
    estimatedMinutes: lesson.estimated_minutes,
    xpReward: lesson.xp_reward,
    orderIndex: lesson.order_index,
  };
}

function localizedPrompt(step: StepRow, locale: string): string {
  if (locale === 'ca') return step.prompt_ca ?? step.prompt ?? '';
  const langPrompt = step[`prompt_${locale}` as keyof typeof step] as string | undefined;
  return langPrompt ?? step.prompt_ca ?? step.prompt ?? '';
}

function localizedExplanation(step: StepRow, locale: string): string | null {
  if (locale === 'ca') return step.explanation_ca ?? step.explanation ?? null;
  const langExpl = step[`explanation_${locale}` as keyof typeof step] as string | undefined;
  return langExpl ?? step.explanation_ca ?? step.explanation ?? null;
}

export function mapSteps(steps: StepRow[], locale: string = 'ca'): LearningStepRecord[] {
  return steps.map((step) => ({
    id: step.id,
    lessonId: step.lesson_id,
    type: step.type as LearningStepRecord['type'],
    prompt: localizedPrompt(step, locale),
    explanation: localizedExplanation(step, locale),
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

export function mapReviewItems(progress: ProgressRow[], lessons: LessonRow[], locale: string = 'ca') {
  const completedLessonIds = new Set(progress.filter((p) => p.completed).map((p) => p.lesson_id));
  return lessons
    .filter((lesson) => !completedLessonIds.has(lesson.id))
    .map((lesson) => locale === 'ca' 
      ? (lesson.title_ca ?? lesson.title ?? '')
      : (lesson[`title_${locale}` as keyof typeof lesson] as string | undefined) ?? lesson.title_ca ?? lesson.title ?? '')
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