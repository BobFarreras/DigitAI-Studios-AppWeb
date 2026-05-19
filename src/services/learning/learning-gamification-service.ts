/**
 * @file src/services/learning/learning-gamification-service.ts
 * @updated 2026-05-17
 * @summary Pure gamification rules for streaks, daily goals and achievements.
 * @scope Deterministic calculations only; no persistence or UI.
 */
export type StreakState = {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
};

export type TrackReward = {
  label: string;
  status: 'locked' | 'unlocked';
  detail: string;
};

export type XpHistoryItem = {
  id: string;
  label: string;
  xp: number;
  dateLabel: string;
};

export function calculateNextStreak(state: StreakState | null, activityDate: string): StreakState {
  const previous = state?.lastActivityDate ?? null;
  const current = nextStreakCount(state?.currentStreak ?? 0, previous, activityDate);
  return {
    currentStreak: current,
    longestStreak: Math.max(state?.longestStreak ?? 0, current),
    lastActivityDate: activityDate,
  };
}

export function buildDailyGoal(todayXp: number, targetXp = 30) {
  return {
    targetXp,
    earnedXp: todayXp,
    progress: Math.min(100, Math.round((todayXp / targetXp) * 100)),
    completed: todayXp >= targetXp,
  };
}

export function buildAchievements(input: { xpTotal: number; streakDays: number; lessonsDone: number }) {
  return [
    achievement('first_lesson', 'Primer pas', 'Completa la primera llico.', input.lessonsDone >= 1),
    achievement('xp_100', 'Cent XP', 'Arriba a 100 XP acumulats.', input.xpTotal >= 100),
    achievement('streak_3', 'Tres dies seguits', 'Mantingues una ratxa de 3 dies.', input.streakDays >= 3),
  ];
}

export function buildTrackReward(input: { lessonsDone: number; lessonsTotal: number }): TrackReward {
  const completed = input.lessonsTotal > 0 && input.lessonsDone >= input.lessonsTotal;
  return {
    label: completed ? 'Cofre desbloquejat' : 'Cofre de ruta',
    status: completed ? 'unlocked' : 'locked',
    detail: completed ? 'Ruta completada amb progres real.' : `${input.lessonsDone}/${input.lessonsTotal} llicons completades.`,
  };
}

export function buildXpHistory(events: Array<{ id: string; xp: number; sourceType: string; createdAt: string }>): XpHistoryItem[] {
  return events.map((event) => ({
    id: event.id,
    label: sourceLabel(event.sourceType),
    xp: event.xp,
    dateLabel: formatDate(event.createdAt),
  }));
}

function achievement(id: string, title: string, description: string, unlocked: boolean): Achievement {
  return { id, title, description, unlocked };
}

function sourceLabel(sourceType: string) {
  if (sourceType === 'lesson') return 'Llico completada';
  if (sourceType === 'review') return 'Reforc';
  return 'Activitat';
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ca-ES', { day: '2-digit', month: 'short' }).format(new Date(value));
}

function nextStreakCount(current: number, previousDate: string | null, activityDate: string) {
  if (previousDate === activityDate) return Math.max(1, current);
  if (previousDate && daysBetween(previousDate, activityDate) === 1) return current + 1;
  return 1;
}

function daysBetween(previousDate: string, activityDate: string) {
  const previous = Date.parse(`${previousDate}T00:00:00.000Z`);
  const current = Date.parse(`${activityDate}T00:00:00.000Z`);
  return Math.round((current - previous) / 86_400_000);
}
