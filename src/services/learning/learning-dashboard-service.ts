/**
 * @file src/services/learning/learning-dashboard-service.ts
 * @updated 2026-05-16
 * @summary Compose training dashboard data and XP policy.
 * @scope Pure learning domain logic; repositories are injected.
 */
import type { ILearningRepository } from '@/repositories/interfaces/ILearningRepository';
import { mapDashboardData } from './learning-dashboard-mapper';

export type LearningItemStatus = 'active' | 'locked' | 'review' | 'completed';

export type LearningLessonNode = {
  id: string;
  slug: string;
  title: string;
  estimatedMinutes: number;
  status: LearningItemStatus;
  href: string;
};

export type LearningTrackSummary = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  progress: number;
  lessonsDone: number;
  lessonsTotal: number;
  status: LearningItemStatus;
  href: string;
  lessons: LearningLessonNode[];
};

export type LearningDashboardData = {
  userName: string;
  xpTotal: number;
  streakDays: number;
  lessonsDone: number;
  weeklyMinutes: number;
  accuracy: number;
  continueLesson: {
    title: string;
    module: string;
    estimatedMinutes: number;
    href: string;
  };
  tracks: LearningTrackSummary[];
  reviewItems: string[];
};

export function calculateXpReward(baseXp: number, mistakeCount: number) {
  const multiplier = [1, 0.85, 0.7, 0.55, 0.4][mistakeCount] ?? 0.25;
  return Math.max(1, Math.round(baseXp * multiplier));
}

export { mapDashboardData } from './learning-dashboard-mapper';

export class LearningDashboardService {
  constructor(private repository: ILearningRepository) {}

  async getDashboardData(userId: string, email: string) {
    return mapDashboardData(email, await this.repository.getDashboardSnapshot(userId));
  }
}

export function getTrackDetail(data: LearningDashboardData, slug: string) {
  return data.tracks.find((track) => track.slug === slug) ?? null;
}
