/**
 * @file src/services/learning/__tests__/learning-gamification-service.test.ts
 * @updated 2026-05-17
 * @summary Tests pure learning gamification rules.
 * @scope Streaks, daily goals and achievements only.
 */
import { describe, expect, it } from 'vitest';
import {
  buildAchievements,
  buildDailyGoal,
  buildTrackReward,
  buildXpHistory,
  calculateNextStreak,
} from '../learning-gamification-service';

describe('learning gamification rules', () => {
  it('continues, preserves and resets streaks deterministically', () => {
    expect(calculateNextStreak(null, '2026-05-17')).toMatchObject({ currentStreak: 1, longestStreak: 1 });
    expect(calculateNextStreak({ currentStreak: 2, longestStreak: 4, lastActivityDate: '2026-05-16' }, '2026-05-17'))
      .toMatchObject({ currentStreak: 3, longestStreak: 4 });
    expect(calculateNextStreak({ currentStreak: 3, longestStreak: 4, lastActivityDate: '2026-05-17' }, '2026-05-17'))
      .toMatchObject({ currentStreak: 3, longestStreak: 4 });
    expect(calculateNextStreak({ currentStreak: 3, longestStreak: 4, lastActivityDate: '2026-05-15' }, '2026-05-17'))
      .toMatchObject({ currentStreak: 1, longestStreak: 4 });
  });

  it('builds a capped daily XP goal', () => {
    expect(buildDailyGoal(12, 30)).toEqual({ targetXp: 30, earnedXp: 12, progress: 40, completed: false });
    expect(buildDailyGoal(45, 30)).toEqual({ targetXp: 30, earnedXp: 45, progress: 100, completed: true });
  });

  it('derives achievements from persisted progress metrics', () => {
    const achievements = buildAchievements({ xpTotal: 120, streakDays: 3, lessonsDone: 1 });

    expect(achievements.every((item) => item.unlocked)).toBe(true);
  });

  it('derives route rewards and XP history from real progress inputs', () => {
    expect(buildTrackReward({ lessonsDone: 2, lessonsTotal: 2 }).status).toBe('unlocked');
    expect(buildTrackReward({ lessonsDone: 1, lessonsTotal: 2 }).status).toBe('locked');
    expect(buildXpHistory([{ id: 'xp-1', xp: 10, sourceType: 'lesson', createdAt: '2026-05-17T10:00:00.000Z' }])[0])
      .toMatchObject({ label: 'Llico completada', xp: 10 });
  });
});
