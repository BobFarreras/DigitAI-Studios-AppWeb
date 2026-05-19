/**
 * @file src/services/learning/__tests__/admin-learning-content-service.test.ts
 * @updated 2026-05-19
 * @summary Tests admin learning content overview rules.
 * @scope Service orchestration with in-memory repository only.
 */
import { describe, expect, it } from 'vitest';
import type {
  AdminLearningTrackRecord,
  IAdminLearningContentRepository,
} from '@/repositories/interfaces/IAdminLearningContentRepository';
import { AdminLearningContentService } from '../admin-learning-content-service';

describe('AdminLearningContentService', () => {
  it('summarizes content and exposes a lesson preview', async () => {
    const service = new AdminLearningContentService(new MemoryRepository(content));
    const overview = await service.getOverview();

    expect(overview.summary).toMatchObject({
      tracks: 1,
      modules: 1,
      lessons: 2,
      steps: 1,
      inactiveLessons: 1,
    });
    expect(overview.previewLesson?.title).toBe('Intro');
  });
});

const content: AdminLearningTrackRecord[] = [{
  id: 'track-1',
  slug: 'digital',
  title: 'Digital',
  active: true,
  orderIndex: 1,
  modules: [{
    id: 'module-1',
    slug: 'base',
    title: 'Base',
    active: true,
    orderIndex: 1,
    lessons: [
      {
        id: 'lesson-1',
        slug: 'intro',
        title: 'Intro',
        active: true,
        xpReward: 10,
        estimatedMinutes: 5,
        orderIndex: 1,
        steps: [{ id: 'step-1', type: 'multiple_choice', prompt: 'Pregunta?', orderIndex: 1 }],
      },
      {
        id: 'lesson-2',
        slug: 'draft',
        title: 'Draft',
        active: false,
        xpReward: 10,
        estimatedMinutes: 5,
        orderIndex: 2,
        steps: [],
      },
    ],
  }],
}];

class MemoryRepository implements IAdminLearningContentRepository {
  constructor(private tracks: AdminLearningTrackRecord[]) {}
  async listContent() { return this.tracks; }
}
