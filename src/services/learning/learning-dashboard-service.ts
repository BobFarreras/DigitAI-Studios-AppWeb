/**
 * @file src/services/learning/learning-dashboard-service.ts
 * @updated 2026-05-16
 * @summary Compose training dashboard data and XP policy.
 * @scope Pure learning domain logic; repositories are injected.
 */
import type { ILearningRepository } from '@/repositories/interfaces/ILearningRepository';
import type { Achievement, TrackReward, XpHistoryItem } from './learning-gamification-service';
import {
  buildAchievements,
  buildDailyGoal,
  buildTrackReward,
  buildXpHistory,
} from './learning-gamification-service';
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
  reward?: TrackReward;
  href: string;
  lessons: LearningLessonNode[];
};

export type LearningReviewQueueItem = {
  id: string;
  title: string;
  trackTitle: string;
  href: string;
};

export type LearningDashboardBaseData = {
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

export type LearningDashboardData = LearningDashboardBaseData & {
  dailyGoal: ReturnType<typeof buildDailyGoal>;
  achievements: Achievement[];
  xpHistory: XpHistoryItem[];
  reviewQueue: LearningReviewQueueItem[];
};

export function calculateXpReward(baseXp: number, mistakeCount: number) {
  const multiplier = [1, 0.85, 0.7, 0.55, 0.4][mistakeCount] ?? 0.25;
  return Math.max(1, Math.round(baseXp * multiplier));
}

export { mapDashboardData } from './learning-dashboard-mapper';

export class LearningDashboardService {
  constructor(private repository: ILearningRepository) {}

  async getDashboardData(userId: string, email: string) {
    const snapshot = await this.repository.getDashboardSnapshot(userId);
    const data = mapDashboardData(email, snapshot);
    const tracks = data.tracks.map((track) => ({
      ...track,
      reward: buildTrackReward(track),
    }));
    return {
      ...data,
      tracks,
      dailyGoal: buildDailyGoal(snapshot.todayXp),
      xpHistory: buildXpHistory(snapshot.xpEvents),
      reviewQueue: buildReviewQueue(tracks),
      achievements: buildAchievements({
        xpTotal: data.xpTotal,
        streakDays: data.streakDays,
        lessonsDone: data.lessonsDone,
      }),
    };
  }
}

export function getTrackDetail(data: LearningDashboardData, slug: string) {
  return data.tracks.find((track) => track.slug === slug) ?? null;
}

function buildReviewQueue(tracks: LearningTrackSummary[]): LearningReviewQueueItem[] {
  return tracks.flatMap((track) =>
    track.lessons
      .filter((lesson) => lesson.status === 'review')
      .map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        trackTitle: track.title,
        href: lesson.href,
      }))
  );
}
