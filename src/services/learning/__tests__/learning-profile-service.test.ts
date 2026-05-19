/**
 * @file src/services/learning/__tests__/learning-profile-service.test.ts
 * @updated 2026-05-19
 * @summary Tests for derived student profile metrics.
 * @scope Pure profile service behavior.
 */
import { describe, expect, it } from 'vitest';
import type { LearningDashboardData } from '../learning-dashboard-service';
import { buildLearningProfile } from '../learning-profile-service';

describe('buildLearningProfile', () => {
  it('derives level, totals and strongest track from dashboard data', () => {
    const data = {
      userName: 'alumne',
      xpTotal: 245,
      streakDays: 4,
      lessonsDone: 3,
      weeklyMinutes: 42,
      accuracy: 81,
      continueLesson: { title: 'Xarxes', module: 'Sistemes', estimatedMinutes: 8, href: '/x' },
      reviewItems: ['Ports'],
      reviewQueue: [{ id: 'lesson-2', title: 'Ports', trackTitle: 'Sistemes', href: '/review' }],
      dailyGoal: { earnedXp: 20, targetXp: 50, progress: 40, completed: false },
      achievements: [],
      xpHistory: [],
      tracks: [
        track('track-1', 'Digital', 50, 2, 4, 'active'),
        track('track-2', 'Sistemes', 75, 1, 2, 'review'),
      ],
    } satisfies LearningDashboardData;

    const profile = buildLearningProfile(data);

    expect(profile.level).toBe(3);
    expect(profile.currentLevelXp).toBe(45);
    expect(profile.lessonsTotal).toBe(6);
    expect(profile.activeTracks).toBe(2);
    expect(profile.reviewLessons).toBe(1);
    expect(profile.strongestTrack?.title).toBe('Sistemes');
  });
});

function track(
  id: string,
  title: string,
  progress: number,
  lessonsDone: number,
  lessonsTotal: number,
  status: LearningDashboardData['tracks'][number]['status']
): LearningDashboardData['tracks'][number] {
  return {
    id,
    title,
    progress,
    lessonsDone,
    lessonsTotal,
    status,
    slug: id,
    description: title,
    icon: 'book',
    color: 'emerald',
    href: `/dashboard/learn/${id}`,
    lessons: [],
  };
}
