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
  objective: string | null;
  estimatedMinutes: number;
  xpReward: number;
  orderIndex: number;
};

export type LearningStepType =
  | 'multiple_choice'
  | 'true_false'
  | 'order_steps'
  | 'match_pairs'
  | 'scenario';

export type LearningStepRecord = {
  id: string;
  lessonId: string;
  type: LearningStepType;
  prompt: string;
  explanation: string | null;
  config: Record<string, unknown>;
  orderIndex: number;
};

export type LearningLessonDetailRecord = {
  trackSlug: string;
  trackTitle: string;
  moduleTitle: string;
  lesson: LearningLessonRecord;
  steps: LearningStepRecord[];
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

export type LearningPersistedAnswer = {
  stepId: string;
  answer: unknown;
  isCorrect: boolean;
  hintUsed: boolean;
  timeSpentSeconds: number;
};

export type LearningAttemptCompletion = {
  userId: string;
  lessonId: string;
  status: 'completed' | 'needs_review';
  score: number;
  correctCount: number;
  mistakeCount: number;
  timeSpentSeconds: number;
  requiresReview: boolean;
  xpAwarded: number;
  accuracy: number;
  answers: LearningPersistedAnswer[];
};

export interface ILearningRepository {
  getDashboardSnapshot(userId: string): Promise<LearningDashboardSnapshot>;
  getLessonDetail(trackSlug: string, lessonSlug: string): Promise<LearningLessonDetailRecord | null>;
  completeAttempt(input: LearningAttemptCompletion): Promise<void>;
}
