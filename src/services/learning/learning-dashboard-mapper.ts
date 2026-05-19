/**
 * @file src/services/learning/learning-dashboard-mapper.ts
 * @updated 2026-05-17
 * @summary Pure mapping rules for learning dashboard and track states.
 * @scope Domain state derivation; no repository or UI dependencies.
 */
import type {
  LearningDashboardSnapshot,
  LearningModuleRecord,
  LearningProgressRecord,
  LearningTrackRecord,
} from '@/repositories/interfaces/ILearningRepository';
import type {
  LearningDashboardBaseData,
  LearningItemStatus,
  LearningLessonNode,
  LearningTrackSummary,
} from './learning-dashboard-service';

export function mapDashboardData(
  email: string,
  snapshot: LearningDashboardSnapshot
): LearningDashboardBaseData {
  const userName = email.split('@')[0] || 'alumne';
  const tracks = mapTracks(snapshot);

  return {
    userName,
    xpTotal: snapshot.xpTotal,
    streakDays: snapshot.streakDays,
    lessonsDone: tracks.reduce((total, track) => total + track.lessonsDone, 0),
    weeklyMinutes: snapshot.weeklyMinutes,
    accuracy: snapshot.averageAccuracy ?? 0,
    continueLesson: findContinueLesson(snapshot.tracks, snapshot.modules, snapshot.progress),
    tracks,
    reviewItems: snapshot.reviewItems,
  };
}

function mapTracks(snapshot: LearningDashboardSnapshot): LearningTrackSummary[] {
  let hasActive = false;
  return snapshot.tracks.map((track) => {
    const modules = snapshot.modules.filter((item) => item.trackId === track.id);
    const lessons = modules.flatMap((item) => item.lessons);
    const lessonsDone = lessons.filter((lesson) => isCompleted(lesson.id, snapshot.progress)).length;
    const progress = lessons.length === 0 ? 0 : Math.round((lessonsDone / lessons.length) * 100);
    const status = resolveTrackStatus(progress, hasReview(lessons, snapshot.progress), hasActive);
    hasActive = hasActive || status === 'active';

    return {
      id: track.id,
      slug: track.slug,
      title: track.title,
      description: track.description ?? 'Ruta formativa DigitAI.',
      icon: track.icon ?? 'book',
      color: track.color ?? 'emerald',
      progress,
      lessonsDone,
      lessonsTotal: lessons.length,
      status,
      href: `/dashboard/learn/${track.slug}`,
      lessons: mapLessons(track, modules, snapshot.progress),
    };
  });
}

function mapLessons(
  track: LearningTrackRecord,
  modules: LearningModuleRecord[],
  progress: LearningProgressRecord[]
): LearningLessonNode[] {
  let previousUnlocked = true;
  return modules.flatMap((learningModule) =>
    learningModule.lessons.map((lesson) => {
      const completed = isCompleted(lesson.id, progress);
      const status = resolveLessonStatus(lesson.id, progress, previousUnlocked);
      previousUnlocked = completed;
      return {
        id: lesson.id,
        slug: lesson.slug,
        title: lesson.title,
        estimatedMinutes: lesson.estimatedMinutes,
        status,
        href: `/dashboard/learn/${track.slug}/${lesson.slug}`,
      };
    })
  );
}

function resolveLessonStatus(
  lessonId: string,
  progress: LearningProgressRecord[],
  previousUnlocked: boolean
): LearningItemStatus {
  if (needsReviewLesson(lessonId, progress)) return 'review';
  if (isCompleted(lessonId, progress)) return 'completed';
  return previousUnlocked ? 'active' : 'locked';
}

function resolveTrackStatus(
  progress: number,
  needsReview: boolean,
  hasActive: boolean
): LearningItemStatus {
  if (needsReview) return 'review';
  if (progress >= 100) return 'completed';
  if (progress > 0 || !hasActive) return 'active';
  return 'locked';
}

function findContinueLesson(
  tracks: LearningTrackRecord[],
  modules: LearningModuleRecord[],
  progress: LearningProgressRecord[]
) {
  for (const learningModule of modules) {
    const track = tracks.find((item) => item.id === learningModule.trackId);
    const lesson = learningModule.lessons.find((item) => !isCompleted(item.id, progress));
    if (lesson && track) {
      return {
        title: lesson.title,
        module: track.title,
        estimatedMinutes: lesson.estimatedMinutes,
        href: `/dashboard/learn/${track.slug}/${lesson.slug}`,
      };
    }
  }

  return {
    title: 'Repassa conceptes clau',
    module: 'Formacio DigitAI',
    estimatedMinutes: 5,
    href: '/dashboard/learn',
  };
}

function hasReview(lessons: Array<{ id: string }>, progress: LearningProgressRecord[]) {
  return lessons.some((lesson) => needsReviewLesson(lesson.id, progress));
}

function isCompleted(lessonId: string, progress: LearningProgressRecord[]) {
  return progress.some((item) => item.lessonId === lessonId && item.completed);
}

function needsReviewLesson(lessonId: string, progress: LearningProgressRecord[]) {
  return progress.some((item) => item.lessonId === lessonId && item.needsReview);
}
