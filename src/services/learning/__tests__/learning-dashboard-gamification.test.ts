/**
 * @file src/services/learning/__tests__/learning-dashboard-gamification.test.ts
 * @updated 2026-05-17
 * @summary Tests gamification data added to dashboard service output.
 * @scope Dashboard service orchestration only.
 */
import { describe, expect, it } from 'vitest';
import { LearningDashboardService } from '../learning-dashboard-service';
import type { ILearningRepository, LearningDashboardSnapshot } from '@/repositories/interfaces/ILearningRepository';

describe('LearningDashboardService gamification', () => {
  it('adds daily goal and achievements from persisted metrics', async () => {
    const service = new LearningDashboardService(new MemoryLearningRepository(snapshot));
    const data = await service.getDashboardData('user-1', 'alumne@example.com');

    expect(data.dailyGoal.completed).toBe(true);
    expect(data.achievements.every((item) => item.unlocked)).toBe(true);
    expect(data.tracks[0]?.reward?.status).toBe('unlocked');
    expect(data.xpHistory).toHaveLength(1);
  });
});

const snapshot: LearningDashboardSnapshot = {
  tracks: [{ id: 'track-1', slug: 'digital', title: 'Digital', description: null, icon: null, color: null, orderIndex: 1 }],
  modules: [{
    id: 'module-1',
    trackId: 'track-1',
    slug: 'base',
    title: 'Base',
    description: null,
    orderIndex: 1,
    lessons: [{ id: 'lesson-1', slug: 'intro', title: 'Intro', objective: null, estimatedMinutes: 4, xpReward: 10, orderIndex: 1 }],
  }],
  progress: [{ lessonId: 'lesson-1', completed: true, needsReview: false, bestScore: 100 }],
  xpTotal: 120,
  todayXp: 30,
  xpEvents: [{ id: 'xp-1', xp: 30, sourceType: 'lesson', createdAt: '2026-05-17T10:00:00.000Z' }],
  streakDays: 3,
  weeklyMinutes: 0,
  averageAccuracy: null,
  reviewItems: [],
};

class MemoryLearningRepository implements ILearningRepository {
  constructor(private data: LearningDashboardSnapshot) {}
  async getDashboardSnapshot() { return this.data; }
  async getLessonDetail() { return null; }
  async completeAttempt() {}
}
