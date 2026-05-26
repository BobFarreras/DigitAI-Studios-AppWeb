/**
 * @file src/services/learning/__tests__/learning-review-service.test.ts
 * @updated 2026-05-19
 * @summary Tests for advanced learning review prioritization.
 * @scope Pure review service helpers.
 */
import { describe, expect, it } from 'vitest';
import type { LearningWeakSpotRecord } from '@/repositories/interfaces/ILearningRepository';
import { buildWeakSpots } from '../learning-review-service';

describe('buildWeakSpots', () => {
  it('orders weak spots by repeated mistakes and recency', () => {
    const spots = buildWeakSpots([
      weakSpot('step-1', 1, '2026-05-18T10:00:00.000Z'),
      weakSpot('step-2', 3, '2026-05-17T10:00:00.000Z'),
      weakSpot('step-3', 3, '2026-05-19T10:00:00.000Z'),
    ]);

    expect(spots.map((spot) => spot.stepId)).toEqual(['step-3', 'step-2', 'step-1']);
    expect(spots[0]).toMatchObject({
      priority: 'high',
      href: '/dashboard/learn/iniciacio/intro',
    });
    expect(spots[2].priority).toBe('low');
  });
});

function weakSpot(stepId: string, wrongCount: number, lastWrongAt: string): LearningWeakSpotRecord {
  return {
    stepId,
    wrongCount,
    lastWrongAt,
    lessonId: 'lesson-1',
    lessonSlug: 'intro',
    lessonTitle: 'Intro',
    trackSlug: 'iniciacio',
    trackTitle: 'Iniciacio',
    prompt: `Pregunta ${stepId}`,
    type: 'multiple_choice',
  };
}
