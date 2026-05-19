/**
 * @file src/services/learning/admin-learning-content-service.ts
 * @updated 2026-05-19
 * @summary Admin learning content overview orchestration.
 * @scope Read-only content status and preview derivation.
 */
import type {
  AdminLearningLessonRecord,
  AdminLearningLessonCreate,
  AdminLearningLessonUpdate,
  AdminLearningModuleCreate,
  AdminLearningModuleRecord,
  AdminLearningModuleUpdate,
  AdminLearningStepCreate,
  AdminLearningStepUpdate,
  AdminLearningTrackCreate,
  AdminLearningTrackRecord,
  AdminLearningTrackUpdate,
  IAdminLearningContentRepository,
} from '@/repositories/interfaces/IAdminLearningContentRepository';
import type { LearningStepType } from '@/repositories/interfaces/ILearningRepository';
import { assertValidStepConfig } from './admin-learning-content-validation';

export type {
  AdminLearningLessonRecord,
  AdminLearningLessonCreate,
  AdminLearningLessonUpdate,
  AdminLearningModuleCreate,
  AdminLearningModuleRecord,
  AdminLearningModuleUpdate,
  AdminLearningStepCreate,
  AdminLearningStepUpdate,
  AdminLearningTrackCreate,
  AdminLearningTrackRecord,
  AdminLearningTrackUpdate,
  LearningStepType,
};

export type AdminLearningContentSummary = {
  tracks: number;
  modules: number;
  lessons: number;
  steps: number;
  inactiveLessons: number;
  activeLessons: number;
  averageStepsPerLesson: number;
};

export type AdminLearningContentData = {
  summary: AdminLearningContentSummary;
  tracks: AdminLearningTrackRecord[];
  previewLesson: AdminLearningLessonRecord | null;
};

export class AdminLearningContentService {
  constructor(private repository: IAdminLearningContentRepository) {}

  async getOverview(): Promise<AdminLearningContentData> {
    const tracks = await this.repository.listContent();
    return {
      summary: summarize(tracks),
      tracks,
      previewLesson: findPreviewLesson(tracks),
    };
  }

  async updateTrack(input: AdminLearningTrackUpdate) {
    await this.repository.updateTrack(input);
  }

  async createTrack(input: AdminLearningTrackCreate) {
    await this.repository.createTrack(input);
  }

  async createModule(input: AdminLearningModuleCreate) {
    await this.repository.createModule(input);
  }

  async createLesson(input: AdminLearningLessonCreate) {
    await this.repository.createLesson(input);
  }

  async createStep(input: AdminLearningStepCreate) {
    assertValidStepConfig(input.type, input.config);
    await this.repository.createStep(input);
  }

  async updateModule(input: AdminLearningModuleUpdate) {
    await this.repository.updateModule(input);
  }

  async updateLesson(input: AdminLearningLessonUpdate) {
    await this.repository.updateLesson(input);
  }

  async updateStep(input: AdminLearningStepUpdate) {
    assertValidStepConfig(input.type, input.config);
    await this.repository.updateStep(input);
  }
}

function summarize(tracks: AdminLearningTrackRecord[]): AdminLearningContentSummary {
  const modules = tracks.flatMap((track) => track.modules);
  const lessons = modules.flatMap((module) => module.lessons);
  const steps = lessons.reduce((total, lesson) => total + lesson.steps.length, 0);
  return {
    tracks: tracks.length,
    modules: modules.length,
    lessons: lessons.length,
    steps,
    inactiveLessons: lessons.filter((lesson) => !lesson.active).length,
    activeLessons: lessons.filter((lesson) => lesson.active).length,
    averageStepsPerLesson: lessons.length === 0 ? 0 : Math.round((steps / lessons.length) * 10) / 10,
  };
}

function findPreviewLesson(tracks: AdminLearningTrackRecord[]) {
  return tracks
    .flatMap((track) => track.modules)
    .flatMap((module) => module.lessons)
    .find((lesson) => lesson.steps.length > 0) ?? null;
}
