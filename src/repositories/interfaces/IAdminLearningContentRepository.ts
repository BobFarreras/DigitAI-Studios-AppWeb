/**
 * @file src/repositories/interfaces/IAdminLearningContentRepository.ts
 * @updated 2026-05-19
 * @summary Admin learning content repository contract.
 * @scope Read-only content inventory records for admin services.
 */
import type { LearningStepType } from './ILearningRepository';

export type LearningPublicationStatus = 'draft' | 'published';

export type AdminLearningStepRecord = {
  id: string;
  type: LearningStepType;
  prompt: string;
  explanation: string | null;
  config: Record<string, unknown>;
  publicationStatus: LearningPublicationStatus;
  orderIndex: number;
};

export type AdminLearningLessonRecord = {
  id: string;
  slug: string;
  title: string;
  objective: string | null;
  active: boolean;
  publicationStatus: LearningPublicationStatus;
  xpReward: number;
  estimatedMinutes: number;
  orderIndex: number;
  steps: AdminLearningStepRecord[];
};

export type AdminLearningModuleRecord = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  level: string;
  active: boolean;
  publicationStatus: LearningPublicationStatus;
  orderIndex: number;
  lessons: AdminLearningLessonRecord[];
};

export type AdminLearningTrackRecord = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  active: boolean;
  publicationStatus: LearningPublicationStatus;
  orderIndex: number;
  modules: AdminLearningModuleRecord[];
};

export interface IAdminLearningContentRepository {
  listContent(): Promise<AdminLearningTrackRecord[]>;
  createTrack(input: AdminLearningTrackCreate): Promise<void>;
  createModule(input: AdminLearningModuleCreate): Promise<void>;
  createLesson(input: AdminLearningLessonCreate): Promise<void>;
  createStep(input: AdminLearningStepCreate): Promise<void>;
  updateTrack(input: AdminLearningTrackUpdate): Promise<void>;
  updateModule(input: AdminLearningModuleUpdate): Promise<void>;
  updateLesson(input: AdminLearningLessonUpdate): Promise<void>;
  updateStep(input: AdminLearningStepUpdate): Promise<void>;
}

export type AdminLearningTrackUpdate = Omit<AdminLearningTrackRecord, 'modules'>;
export type AdminLearningModuleUpdate = Omit<AdminLearningModuleRecord, 'lessons'>;
export type AdminLearningLessonUpdate = Omit<AdminLearningLessonRecord, 'steps'>;
export type AdminLearningStepUpdate = AdminLearningStepRecord;
export type AdminLearningTrackCreate = Omit<AdminLearningTrackUpdate, 'id'>;
export type AdminLearningModuleCreate = Omit<AdminLearningModuleUpdate, 'id'> & { trackId: string };
export type AdminLearningLessonCreate = Omit<AdminLearningLessonUpdate, 'id'> & { moduleId: string };
export type AdminLearningStepCreate = Omit<AdminLearningStepUpdate, 'id'> & { lessonId: string };
