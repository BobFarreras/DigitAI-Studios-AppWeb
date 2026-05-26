/**
 * @file src/services/learning/__tests__/learning-dashboard-service.test.ts
 * @updated 2026-05-17
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
          trackId: 'track-1',
          parentModuleId: null,
          slug: 'fonaments',
          title: 'Fonaments',
          description: 'Base digital.',
          level: 'basic',
          orderIndex: 1,
          lessons: [
            { id: 'lesson-1', slug: 'intro', title: 'Intro', objective: null, estimatedMinutes: 4, xpReward: 10, orderIndex: 1 },
            { id: 'lesson-2', slug: 'seguretat', title: 'Seguretat', objective: null, estimatedMinutes: 6, xpReward: 10, orderIndex: 2 },
          ],
        },
      ],
      tracks: [
        {
          id: 'track-1',
          slug: 'iniciacio-digital',
          title: 'Iniciacio Digital',
          description: 'Base digital.',
          icon: 'sparkles',
          color: 'emerald',
          orderIndex: 1,
        },
      ],
      progress: [{ lessonId: 'lesson-1', completed: true, needsReview: false, bestScore: 80 }],
      xpTotal: 25,
      todayXp: 15,
      xpEvents: [],
      streakDays: 2,
      weeklyMinutes: 18,
      averageAccuracy: 80,
      reviewItems: [],
    };

    const data = mapDashboardData('alumne@example.com', snapshot);

    expect(data.lessonsDone).toBe(1);
    expect(data.tracks[0].progress).toBe(50);
    expect(data.continueLesson).toEqual({
      title: 'Seguretat',
      module: 'Iniciacio Digital',
      estimatedMinutes: 6,
      href: '/dashboard/learn/iniciacio-digital/seguretat',
    });
  });

  it('locks the next track until the current track is completed', () => {
    const snapshot: LearningDashboardSnapshot = {
      tracks: [
        { id: 'track-1', slug: 'digital', title: 'Digital', description: null, icon: null, color: null, orderIndex: 1 },
        { id: 'track-2', slug: 'sistemes', title: 'Sistemes', description: null, icon: null, color: null, orderIndex: 2 },
      ],
      modules: [
        {
          id: 'module-1',
          trackId: 'track-1',
          parentModuleId: null,
          slug: 'base',
          title: 'Base',
          description: null,
          level: 'basic',
          orderIndex: 1,
          lessons: [{ id: 'lesson-1', slug: 'intro', title: 'Intro', objective: null, estimatedMinutes: 4, xpReward: 10, orderIndex: 1 }],
        },
        {
          id: 'module-2',
          trackId: 'track-2',
          parentModuleId: null,
          slug: 'xarxes',
          title: 'Xarxes',
          description: null,
          level: 'basic',
          orderIndex: 1,
          lessons: [{ id: 'lesson-2', slug: 'ip', title: 'IP', objective: null, estimatedMinutes: 5, xpReward: 10, orderIndex: 1 }],
        },
      ],
      progress: [],
      xpTotal: 0,
      todayXp: 0,
      xpEvents: [],
      streakDays: 0,
      weeklyMinutes: 0,
      averageAccuracy: null,
      reviewItems: [],
    };

    const data = mapDashboardData('a@b.cat', snapshot);

    expect(data.tracks[0].status).toBe('active');
    expect(data.tracks[1].status).toBe('locked');
    expect(data.tracks[0].lessons[0].status).toBe('active');
  });
});
