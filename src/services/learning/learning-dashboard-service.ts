/**
 * @file src/services/learning/learning-dashboard-service.ts
 * @updated 2026-05-16
 * @summary Compose training dashboard data and XP policy.
 * @scope Pure learning domain logic; repositories are injected.
 */
import type {
  ILearningRepository,
  LearningDashboardSnapshot,
  LearningModuleRecord,
} from '@/repositories/interfaces/ILearningRepository';

export type LearningModuleStatus = 'active' | 'locked' | 'review';

export type LearningModuleSummary = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  progress: number;
  lessonsDone: number;
  lessonsTotal: number;
  status: LearningModuleStatus;
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
  modules: LearningModuleSummary[];
  reviewItems: string[];
};

export function calculateXpReward(baseXp: number, mistakeCount: number) {
  const multiplier = [1, 0.85, 0.7, 0.55, 0.4][mistakeCount] ?? 0.25;
  return Math.max(1, Math.round(baseXp * multiplier));
}

export class LearningDashboardService {
  constructor(private repository: ILearningRepository) {}

  async getDashboardData(userId: string, email: string) {
    return mapDashboardData(email, await this.repository.getDashboardSnapshot(userId));
  }
}

export function mapDashboardData(
  email: string,
  snapshot: LearningDashboardSnapshot
): LearningDashboardData {
  const userName = email.split('@')[0] || 'alumne';
  const modules = mapModules(snapshot);
  const lessonsDone = modules.reduce((total, module) => total + module.lessonsDone, 0);
  const continueLesson = findContinueLesson(snapshot.modules, snapshot.progress);

  return {
    userName,
    xpTotal: snapshot.xpTotal,
    streakDays: snapshot.streakDays,
    lessonsDone,
    weeklyMinutes: snapshot.weeklyMinutes,
    accuracy: snapshot.averageAccuracy ?? 0,
    continueLesson,
    modules,
    reviewItems: snapshot.reviewItems,
  };
}

function mapModules(snapshot: LearningDashboardSnapshot): LearningModuleSummary[] {
  let hasActive = false;
  return snapshot.modules.map((module) => {
    const lessonsDone = countCompletedLessons(module, snapshot);
    const lessonsTotal = module.lessons.length;
    const progress = lessonsTotal === 0 ? 0 : Math.round((lessonsDone / lessonsTotal) * 100);
    const needsReview = module.lessons.some((lesson) =>
      snapshot.progress.some((item) => item.lessonId === lesson.id && item.needsReview)
    );
    const status = resolveModuleStatus(progress, needsReview, hasActive);
    hasActive = hasActive || status === 'active';

    return {
      id: module.id,
      slug: module.slug,
      title: module.title,
      subtitle: module.description ?? 'Modul formatiu DigitAI.',
      progress,
      lessonsDone,
      lessonsTotal,
      status,
    };
  });
}

function countCompletedLessons(module: LearningModuleRecord, snapshot: LearningDashboardSnapshot) {
  return module.lessons.filter((lesson) =>
    snapshot.progress.some((item) => item.lessonId === lesson.id && item.completed)
  ).length;
}

function resolveModuleStatus(
  progress: number,
  needsReview: boolean,
  hasActive: boolean
): LearningModuleStatus {
  if (needsReview) return 'review';
  if (progress > 0 && progress < 100) return 'active';
  if (progress === 0 && !hasActive) return 'active';
  return progress >= 100 ? 'active' : 'locked';
}

function findContinueLesson(
  modules: LearningModuleRecord[],
  progress: LearningDashboardSnapshot['progress']
) {
  for (const learningModule of modules) {
    const lesson = learningModule.lessons.find((item) => {
      return !progress.some((entry) => entry.lessonId === item.id && entry.completed);
    });
    if (lesson) {
      return {
        title: lesson.title,
        module: learningModule.title,
        estimatedMinutes: lesson.estimatedMinutes,
        href: `/dashboard/learn/${learningModule.slug}/${lesson.slug}`,
      };
    }
  }

  return {
    title: 'Repassa conceptes clau',
    module: 'Formacio DigitAI',
    estimatedMinutes: 5,
    href: '/dashboard/learn',
  };
}
