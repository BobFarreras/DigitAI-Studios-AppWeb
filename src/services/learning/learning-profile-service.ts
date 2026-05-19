/**
 * @file src/services/learning/learning-profile-service.ts
 * @updated 2026-05-19
 * @summary Derives student profile metrics from the learning dashboard model.
 * @scope Pure profile calculations; no persistence or UI rendering.
 */
import type {
  LearningDashboardData,
  LearningItemStatus,
  LearningTrackSummary,
} from './learning-dashboard-service';

export type LearningProfileTrack = {
  id: string;
  title: string;
  progress: number;
  lessonsDone: number;
  lessonsTotal: number;
  status: LearningItemStatus;
  href: string;
};

export type LearningProfileData = {
  userName: string;
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  xpTotal: number;
  streakDays: number;
  dailyGoalProgress: number;
  lessonsDone: number;
  lessonsTotal: number;
  completedTracks: number;
  activeTracks: number;
  reviewLessons: number;
  accuracy: number;
  weeklyMinutes: number;
  strongestTrack: LearningProfileTrack | null;
  tracks: LearningProfileTrack[];
};

const levelSize = 100;

export function buildLearningProfile(data: LearningDashboardData): LearningProfileData {
  const tracks = data.tracks.map(toProfileTrack);
  const lessonsTotal = tracks.reduce((total, track) => total + track.lessonsTotal, 0);
  const level = Math.floor(data.xpTotal / levelSize) + 1;
  const currentLevelXp = data.xpTotal % levelSize;

  return {
    userName: data.userName,
    level,
    currentLevelXp,
    nextLevelXp: levelSize,
    xpTotal: data.xpTotal,
    streakDays: data.streakDays,
    dailyGoalProgress: data.dailyGoal.progress,
    lessonsDone: data.lessonsDone,
    lessonsTotal,
    completedTracks: tracks.filter((track) => track.progress >= 100).length,
    activeTracks: tracks.filter((track) => track.status === 'active' || track.status === 'review').length,
    reviewLessons: data.reviewQueue.length,
    accuracy: data.accuracy,
    weeklyMinutes: data.weeklyMinutes,
    strongestTrack: findStrongestTrack(tracks),
    tracks,
  };
}

function toProfileTrack(track: LearningTrackSummary): LearningProfileTrack {
  return {
    id: track.id,
    title: track.title,
    progress: track.progress,
    lessonsDone: track.lessonsDone,
    lessonsTotal: track.lessonsTotal,
    status: track.status,
    href: track.href,
  };
}

function findStrongestTrack(tracks: LearningProfileTrack[]) {
  const started = tracks.filter((track) => track.lessonsDone > 0);
  const candidates = started.length > 0 ? started : tracks;
  return [...candidates].sort((left, right) => right.progress - left.progress)[0] ?? null;
}
