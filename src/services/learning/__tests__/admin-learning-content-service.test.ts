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
      activeLessons: 1,
      averageStepsPerLesson: 0.5,
    });
    expect(overview.previewLesson?.title).toBe('Intro');
  });

  it('rejects invalid editable step config before persistence', async () => {
    const repository = new MemoryRepository(content);
    const service = new AdminLearningContentService(repository);

    await expect(service.updateStep({
      id: 'step-1',
      type: 'multiple_choice',
      prompt: 'Pregunta?',
      explanation: null,
      config: { correctAnswer: 'A' },
      orderIndex: 1,
    })).rejects.toThrow('invalid_options');
  });
});

const content: AdminLearningTrackRecord[] = [{
  id: 'track-1',
  slug: 'digital',
  title: 'Digital',
  description: null,
  icon: null,
  color: null,
  active: true,
  orderIndex: 1,
  modules: [{
    id: 'module-1',
    slug: 'base',
    title: 'Base',
    description: null,
    level: 'basic',
    active: true,
    orderIndex: 1,
    lessons: [
      {
        id: 'lesson-1',
        slug: 'intro',
        title: 'Intro',
        objective: null,
        active: true,
        xpReward: 10,
        estimatedMinutes: 5,
        orderIndex: 1,
        steps: [{
          id: 'step-1',
          type: 'multiple_choice',
          prompt: 'Pregunta?',
          explanation: null,
          config: { options: ['A', 'B'], correctAnswer: 'A' },
          orderIndex: 1,
        }],
      },
      {
        id: 'lesson-2',
        slug: 'draft',
        title: 'Draft',
        objective: null,
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
  async updateTrack() {}
  async updateModule() {}
  async updateLesson() {}
  async updateStep() {}
}
