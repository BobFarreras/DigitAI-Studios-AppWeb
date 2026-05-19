/**
 * @file src/services/learning/admin-learning-content-service.ts
 * @updated 2026-05-19
 * @summary Admin learning content overview orchestration.
 * @scope Read-only content status and preview derivation.
 */
import type {
  AdminLearningLessonRecord,
  AdminLearningTrackRecord,
  IAdminLearningContentRepository,
} from '@/repositories/interfaces/IAdminLearningContentRepository';

export type AdminLearningContentSummary = {
  tracks: number;
  modules: number;
  lessons: number;
  steps: number;
  inactiveLessons: number;
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
}

function summarize(tracks: AdminLearningTrackRecord[]): AdminLearningContentSummary {
  const modules = tracks.flatMap((track) => track.modules);
  const lessons = modules.flatMap((module) => module.lessons);
  return {
    tracks: tracks.length,
    modules: modules.length,
    lessons: lessons.length,
    steps: lessons.reduce((total, lesson) => total + lesson.steps.length, 0),
    inactiveLessons: lessons.filter((lesson) => !lesson.active).length,
  };
}

function findPreviewLesson(tracks: AdminLearningTrackRecord[]) {
  return tracks
    .flatMap((track) => track.modules)
    .flatMap((module) => module.lessons)
    .find((lesson) => lesson.steps.length > 0) ?? null;
}
