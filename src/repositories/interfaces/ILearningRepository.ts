/**
 * @file src/repositories/interfaces/ILearningRepository.ts
 * @updated 2026-05-17
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

export type LearningPublicationStatus = 'draft' | 'published';

export type LearningStepType =
  | 'content'
  | 'multiple_choice'
  | 'multi_select'
  | 'true_false'
  | 'order_steps'
  | 'match_pairs'
  | 'fill_blank'
  | 'code_choice'
  | 'terminal_simulation'
  | 'network_diagram'
  | 'code_editor'
  | 'ai_prompt_review'
  | 'security_triage'
  | 'scenario';

export type LearningStepRecord = {
  id: string;
  lessonId: string;
  type: LearningStepType;
  prompt: string;
  explanation: string | null;
  config: Record<string, unknown>;
  media: Record<string, unknown> | null;
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
  parentModuleId: string | null;
  slug: string;
  title: string;
  description: string | null;
  level: 'initiation' | 'basic' | 'intermediate' | 'advanced';
  orderIndex: number;
  lessons: LearningLessonRecord[];
};

export type LearningProgressRecord = {
  lessonId: string;
  completed: boolean;
  needsReview: boolean;
  bestScore: number;
};

export type LearningXpEventRecord = {
  id: string;
  xp: number;
  sourceType: string;
  createdAt: string;
};

export type LearningDashboardSnapshot = {
  tracks: LearningTrackRecord[];
  modules: LearningModuleRecord[];
  progress: LearningProgressRecord[];
  xpTotal: number;
  todayXp: number;
  xpEvents: LearningXpEventRecord[];
  streakDays: number;
  weeklyMinutes: number;
  averageAccuracy: number | null;
  reviewItems: string[];
};

export type LearningWeakSpotRecord = {
  stepId: string;
  lessonId: string;
  lessonSlug: string;
  lessonTitle: string;
  trackSlug: string;
  trackTitle: string;
  prompt: string;
  type: LearningStepType;
  wrongCount: number;
  lastWrongAt: string;
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
  getWeakSpots(userId: string): Promise<LearningWeakSpotRecord[]>;
  getLessonDetail(trackSlug: string, lessonSlug: string): Promise<LearningLessonDetailRecord | null>;
  completeAttempt(input: LearningAttemptCompletion): Promise<void>;
}
