/**
 * @file src/services/learning/learning-review-service.ts
 * @updated 2026-05-19
 * @summary Builds the advanced review screen from progress and wrong answers.
 * @scope Review prioritization only; repositories are injected.
 */
import type {
  ILearningRepository,
  LearningWeakSpotRecord,
} from '@/repositories/interfaces/ILearningRepository';
import type { LearningDashboardData } from './learning-dashboard-service';
import { LearningDashboardService } from './learning-dashboard-service';

export type LearningWeakSpot = LearningWeakSpotRecord & {
  href: string;
  priority: 'high' | 'medium' | 'low';
};

export type LearningReviewData = LearningDashboardData & {
  weakSpots: LearningWeakSpot[];
  reviewSummary: {
    weakSpotCount: number;
    repeatedMistakes: number;
    nextActionHref: string;
    nextActionLabel: string;
  };
};

export class LearningReviewService {
  private dashboard: LearningDashboardService;

  constructor(private repository: ILearningRepository) {
    this.dashboard = new LearningDashboardService(repository);
  }

  async getReviewData(userId: string, email: string): Promise<LearningReviewData> {
    const [dashboard, weakSpotRecords] = await Promise.all([
      this.dashboard.getDashboardData(userId, email),
      this.repository.getWeakSpots(userId),
    ]);
    const weakSpots = buildWeakSpots(weakSpotRecords);
    const next = weakSpots[0] ?? dashboard.reviewQueue[0];

    return {
      ...dashboard,
      weakSpots,
      reviewSummary: {
        weakSpotCount: weakSpots.length,
        repeatedMistakes: weakSpots.filter((item) => item.wrongCount > 1).length,
        nextActionHref: next?.href ?? '/dashboard/learn',
        nextActionLabel: weakSpots[0] ? 'Practicar pregunta prioritaria' : 'Continuar ruta',
      },
    };
  }
}

export function buildWeakSpots(records: LearningWeakSpotRecord[]): LearningWeakSpot[] {
  return [...records]
    .sort((left, right) => {
      if (right.wrongCount !== left.wrongCount) return right.wrongCount - left.wrongCount;
      return Date.parse(right.lastWrongAt) - Date.parse(left.lastWrongAt);
    })
    .slice(0, 6)
    .map((record) => ({
      ...record,
      href: `/dashboard/learn/${record.trackSlug}/${record.lessonSlug}`,
      priority: resolvePriority(record.wrongCount),
    }));
}

function resolvePriority(wrongCount: number): LearningWeakSpot['priority'] {
  if (wrongCount >= 3) return 'high';
  if (wrongCount === 2) return 'medium';
  return 'low';
}
