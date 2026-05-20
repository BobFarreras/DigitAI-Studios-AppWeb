/**
 * @file tests/integration/admin-learning-actions.test.ts
 * @updated 2026-05-20
 * @summary Integration tests for admin learning content server actions.
 * @scope Server action orchestration and validation only.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getAdminLearningContent,
  createAdminLearningContent,
  updateAdminLearningContent,
} from '@/actions/admin/learning-content';
import { AdminLearningContentService } from '@/services/learning/admin-learning-content-service';
import type { AdminLearningContentData } from '@/services/learning/admin-learning-content-service';

vi.mock('@/lib/auth/admin-guard', () => ({
  requireAdmin: vi.fn().mockResolvedValue({ id: 'admin-user-id', email: 'admin@test.com' }),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

const mockData: AdminLearningContentData = {
  summary: { tracks: 1, modules: 1, lessons: 2, steps: 3, inactiveLessons: 0, activeLessons: 2, averageStepsPerLesson: 1.5 },
  tracks: [{
    id: 'track-1',
    slug: 'digital',
    title: 'Digital',
    description: null,
    icon: null,
    color: null,
    active: true,
    publicationStatus: 'published',
    orderIndex: 1,
    modules: [{
      id: 'module-1',
      slug: 'base',
      title: 'Base',
      description: null,
      level: 'basic',
      active: true,
      publicationStatus: 'published',
      orderIndex: 1,
      lessons: [{
        id: 'lesson-1',
        slug: 'intro',
        title: 'Intro',
        objective: null,
        active: true,
        publicationStatus: 'published',
        xpReward: 10,
        estimatedMinutes: 5,
        orderIndex: 1,
        steps: [],
      }],
    }],
  }],
  previewLesson: null,
};

let getOverviewSpy: ReturnType<typeof vi.spyOn>;
let createTrackSpy: ReturnType<typeof vi.spyOn>;
let createStepSpy: ReturnType<typeof vi.spyOn>;

describe('Admin Learning Content Actions', () => {
  beforeEach(() => {
    const mockService = {
      getOverview: vi.fn().mockResolvedValue(mockData),
      createTrack: vi.fn().mockResolvedValue(undefined),
      createModule: vi.fn().mockResolvedValue(undefined),
      createLesson: vi.fn().mockResolvedValue(undefined),
      createStep: vi.fn().mockResolvedValue(undefined),
      updateTrack: vi.fn().mockResolvedValue(undefined),
      updateModule: vi.fn().mockResolvedValue(undefined),
      updateLesson: vi.fn().mockResolvedValue(undefined),
      updateStep: vi.fn().mockResolvedValue(undefined),
    };

    getOverviewSpy = vi.spyOn(AdminLearningContentService.prototype, 'getOverview').mockImplementation(mockService.getOverview);
    createTrackSpy = vi.spyOn(AdminLearningContentService.prototype, 'createTrack').mockImplementation(mockService.createTrack);
    createStepSpy = vi.spyOn(AdminLearningContentService.prototype, 'createStep').mockImplementation(mockService.createStep);
    vi.spyOn(AdminLearningContentService.prototype, 'updateTrack').mockImplementation(mockService.updateTrack);
    vi.spyOn(AdminLearningContentService.prototype, 'updateStep').mockImplementation(mockService.updateStep);
  });

  afterEach(() => {
    getOverviewSpy.mockRestore();
    createTrackSpy.mockRestore();
    createStepSpy.mockRestore();
  });

  describe('getAdminLearningContent', () => {
    it('returns content overview on success', async () => {
      const result = await getAdminLearningContent();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.summary.tracks).toBe(1);
      }
      expect(getOverviewSpy).toHaveBeenCalled();
    });
  });

  describe('createAdminLearningContent', () => {
    it('creates a new track with valid data', async () => {
      const input = {
        kind: 'track',
        slug: 'new-track',
        title: 'New Track',
        active: false,
        publicationStatus: 'draft' as const,
        orderIndex: 99,
        description: null,
        icon: null,
        color: null,
      };

      const result = await createAdminLearningContent(input);

      expect(result.success).toBe(true);
    });

    it('rejects invalid payload', async () => {
      const input = { kind: 'track' };

      const result = await createAdminLearningContent(input);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('invalid_payload');
      }
    });

    it('rejects step with config invalid at service level', async () => {
      const input = {
        kind: 'step',
        lessonId: 'lesson-1',
        type: 'multiple_choice',
        prompt: 'Question',
        explanation: null,
        config: { correctAnswer: 'A' },
        publicationStatus: 'draft' as const,
        orderIndex: 1,
      };

      const result = await createAdminLearningContent(input);

      expect(result.success).toBe(false);
    });
  });

  describe('updateAdminLearningContent', () => {
    it('rejects invalid payload for track', async () => {
      const input = { kind: 'track', id: 'track-1' };

      const result = await updateAdminLearningContent(input);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('invalid_payload');
      }
    });

    it('rejects step with invalid config at service level', async () => {
      const input = {
        kind: 'step',
        id: 'step-1',
        type: 'multiple_choice' as const,
        prompt: 'Question',
        explanation: null,
        config: { correctAnswer: 'A' },
        publicationStatus: 'published' as const,
        orderIndex: 1,
      };

      const result = await updateAdminLearningContent(input);

      expect(result.success).toBe(false);
    });

    it('parses valid track update input', async () => {
      const { trackUpdateSchema } = await import('@/actions/admin/learning-content-schemas');
      const input = {
        kind: 'track',
        id: '123e4567-e89b-12d3-a456-426614174000',
        slug: 'updated-track',
        title: 'Updated Track',
        active: true,
        publicationStatus: 'published' as const,
        orderIndex: 1,
        description: null,
        icon: null,
        color: null,
      };
      const result = trackUpdateSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });
});