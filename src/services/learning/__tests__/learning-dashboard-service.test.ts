/**
 * @file src/services/learning/__tests__/learning-dashboard-service.test.ts
 * @updated 2026-05-16
 * @summary Tests for learning dashboard service rules.
 * @scope Verifies pure training domain calculations and mapping.
 */

import { describe, expect, it } from 'vitest';
import {
  calculateXpReward,
  mapDashboardData,
} from '../learning-dashboard-service';
import type { LearningDashboardSnapshot } from '@/repositories/interfaces/ILearningRepository';

describe('calculateXpReward', () => {
  it('reduces XP as mistakes increase without returning zero', () => {
    expect(calculateXpReward(100, 0)).toBe(100);
    expect(calculateXpReward(100, 1)).toBe(85);
    expect(calculateXpReward(100, 2)).toBe(70);
    expect(calculateXpReward(100, 3)).toBe(55);
    expect(calculateXpReward(100, 4)).toBe(40);
    expect(calculateXpReward(100, 5)).toBe(25);
    expect(calculateXpReward(1, 5)).toBe(1);
  });
});

describe('mapDashboardData', () => {
  it('selects the first incomplete lesson as the continue action', () => {
    const snapshot: LearningDashboardSnapshot = {
      modules: [
        {
          id: 'module-1',
          slug: 'fonaments',
          title: 'Fonaments',
          description: 'Base digital.',
          orderIndex: 1,
          lessons: [
            { id: 'lesson-1', slug: 'intro', title: 'Intro', estimatedMinutes: 4, orderIndex: 1 },
            { id: 'lesson-2', slug: 'seguretat', title: 'Seguretat', estimatedMinutes: 6, orderIndex: 2 },
          ],
        },
      ],
      progress: [{ lessonId: 'lesson-1', completed: true, needsReview: false, bestScore: 80 }],
      xpTotal: 25,
      streakDays: 2,
      weeklyMinutes: 18,
      averageAccuracy: 80,
      reviewItems: [],
    };

    const data = mapDashboardData('alumne@example.com', snapshot);

    expect(data.lessonsDone).toBe(1);
    expect(data.modules[0].progress).toBe(50);
    expect(data.continueLesson).toEqual({
      title: 'Seguretat',
      module: 'Fonaments',
      estimatedMinutes: 6,
      href: '/dashboard/learn/fonaments/seguretat',
    });
  });
});
