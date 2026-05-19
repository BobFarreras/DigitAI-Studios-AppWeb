/**
 * @file src/repositories/interfaces/IAdminLearningContentRepository.ts
 * @updated 2026-05-19
 * @summary Admin learning content repository contract.
 * @scope Read-only content inventory records for admin services.
 */
import type { LearningStepType } from './ILearningRepository';

export type AdminLearningStepRecord = {
  id: string;
  type: LearningStepType;
  prompt: string;
  orderIndex: number;
};

export type AdminLearningLessonRecord = {
  id: string;
  slug: string;
  title: string;
  active: boolean;
  xpReward: number;
  estimatedMinutes: number;
  orderIndex: number;
  steps: AdminLearningStepRecord[];
};

export type AdminLearningModuleRecord = {
  id: string;
  slug: string;
  title: string;
  active: boolean;
  orderIndex: number;
  lessons: AdminLearningLessonRecord[];
};

export type AdminLearningTrackRecord = {
  id: string;
  slug: string;
  title: string;
  active: boolean;
  orderIndex: number;
  modules: AdminLearningModuleRecord[];
};

export interface IAdminLearningContentRepository {
  listContent(): Promise<AdminLearningTrackRecord[]>;
}
