/**
 * @file tests/integration/learning-lesson-flow.test.tsx
 * @updated 2026-05-16
 * @summary Integration tests for the complete learning lesson service flow.
 * @scope Verifies runner loading, answer sanitization, grading and persistence contract.
 */
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type React from 'react';
import type {
  ILearningRepository,
  LearningAttemptCompletion,
  LearningDashboardSnapshot,
  LearningLessonDetailRecord,
} from '@/repositories/interfaces/ILearningRepository';
import { LearningLessonService } from '@/services/learning/learning-lesson-service';
import { LearningLessonRunner } from '@/features/learning/ui/LearningLessonRunner';

vi.mock('@/routing', () => ({
  Link: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href?.toString()} {...props}>{children}</a>
  ),
}));

vi.mock('@/actions/learning-lesson', () => ({
  submitLearningLesson: vi.fn(),
}));

class MemoryLearningRepository implements ILearningRepository {
  public completedAttempt: LearningAttemptCompletion | null = null;

  constructor(private detail: LearningLessonDetailRecord) {}

  async getDashboardSnapshot(): Promise<LearningDashboardSnapshot> {
    throw new Error('not used');
  }

  async getLessonDetail() {
    return this.detail;
  }

  async completeAttempt(input: LearningAttemptCompletion) {
    this.completedAttempt = input;
  }
}

const lessonDetail: LearningLessonDetailRecord = {
  trackSlug: 'iniciacio-digital',
  trackTitle: 'Iniciacio Digital',
  moduleTitle: 'Fonaments digitals',
  lesson: {
    id: 'lesson-1',
    slug: 'que-es-un-sistema-operatiu',
    title: 'Que es un sistema operatiu',
    objective: 'Entendre capes basiques',
    estimatedMinutes: 5,
    xpReward: 10,
    orderIndex: 1,
  },
  steps: [
    {
      id: 'step-choice',
      lessonId: 'lesson-1',
      type: 'multiple_choice',
      prompt: 'Que coordina?',
      explanation: null,
      config: { options: ['Hardware', 'Cafetera'], correctAnswer: 'Hardware' },
      orderIndex: 1,
    },
    {
      id: 'step-order',
      lessonId: 'lesson-1',
      type: 'order_steps',
      prompt: 'Ordena capes',
      explanation: null,
      config: { options: ['Hardware', 'SO'], correctAnswer: ['Hardware', 'SO'] },
      orderIndex: 2,
    },
    {
      id: 'step-match',
      lessonId: 'lesson-1',
      type: 'match_pairs',
      prompt: 'Relaciona',
      explanation: null,
      config: {
        options: [{ left: 'SO', right: ['Coordinar recursos', 'Cable'] }],
        correctAnswer: { SO: 'Coordinar recursos' },
      },
      orderIndex: 3,
    },
  ],
};

describe('LearningLessonService integration flow', () => {
  it('loads a runner without leaking correct answers', async () => {
    const service = new LearningLessonService(new MemoryLearningRepository(lessonDetail));
    const runner = await service.getRunner('iniciacio-digital', 'que-es-un-sistema-operatiu');

    expect(runner?.steps).toHaveLength(3);
    expect(runner?.steps[0].config.options).toEqual(['Hardware', 'Cafetera']);
    expect(runner?.steps.some((step) => 'correctAnswer' in step.config)).toBe(false);
  });

  it('grades mixed interactions and persists the completed attempt', async () => {
    const repository = new MemoryLearningRepository(lessonDetail);
    const service = new LearningLessonService(repository);

    const result = await service.submitLesson('user-1', 'iniciacio-digital', 'que-es-un-sistema-operatiu', [
      { stepId: 'step-choice', value: 'Hardware', hintUsed: false, timeSpentSeconds: 3 },
      { stepId: 'step-order', value: ['Hardware', 'SO'], hintUsed: false, timeSpentSeconds: 8 },
      { stepId: 'step-match', value: { SO: 'Coordinar recursos' }, hintUsed: false, timeSpentSeconds: 7 },
    ]);

    expect(result.score).toBe(100);
    expect(repository.completedAttempt?.status).toBe('completed');
    expect(repository.completedAttempt?.answers.every((answer) => answer.isCorrect)).toBe(true);
    expect(repository.completedAttempt?.xpAwarded).toBe(10);
  });

  it('does not crash when a lesson has no published steps', () => {
    render(<LearningLessonRunner data={{ ...lessonDetail, lesson: lessonDetail.lesson, steps: [] }} />);

    expect(screen.getByText('Llico en preparacio')).toBeInTheDocument();
  });
});
