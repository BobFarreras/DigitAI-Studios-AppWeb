/**
 * @file src/repositories/interfaces/ILearningRepository.ts
 * @updated 2026-05-16
 * @summary Repository contract for the user learning dashboard.
 * @scope Data shapes passed from persistence into learning services.
 */

export type LearningLessonRecord = {
  id: string;
  slug: string;
  title: string;
  estimatedMinutes: number;
  orderIndex: number;
};

export type LearningTrackRecord = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  orderIndex: number;
};

export type LearningModuleRecord = {
  id: string;
  trackId: string;
  slug: string;
  title: string;
  description: string | null;
  orderIndex: number;
  lessons: LearningLessonRecord[];
};

export type LearningProgressRecord = {
  lessonId: string;
  completed: boolean;
  needsReview: boolean;
  bestScore: number;
};

export type LearningDashboardSnapshot = {
  tracks: LearningTrackRecord[];
  modules: LearningModuleRecord[];
  progress: LearningProgressRecord[];
  xpTotal: number;
  streakDays: number;
  weeklyMinutes: number;
  averageAccuracy: number | null;
  reviewItems: string[];
};

export interface ILearningRepository {
  getDashboardSnapshot(userId: string): Promise<LearningDashboardSnapshot>;
}
