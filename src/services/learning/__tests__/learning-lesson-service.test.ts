/**
 * @file src/services/learning/__tests__/learning-lesson-service.test.ts
 * @updated 2026-05-16
 * @summary Tests for lesson runner grading and answer shapes.
 * @scope Verifies pure validation for interactive learning steps.
 */
import { describe, expect, it } from 'vitest';
import { gradeLesson } from '../learning-lesson-service';
import { checkStepAnswer } from '../learning-answer-grading';
import type { LearningLessonDetailRecord } from '@/repositories/interfaces/ILearningRepository';

const lesson: LearningLessonDetailRecord = {
  trackSlug: 'iniciacio-digital',
  trackTitle: 'Iniciacio Digital',
  moduleTitle: 'Seguretat',
  lesson: {
    id: 'lesson-1',
    slug: 'contrasenyes',
    title: 'Contrasenyes',
    objective: 'Validar respostes',
    estimatedMinutes: 6,
    xpReward: 20,
    orderIndex: 1,
  },
  steps: [
    {
      id: 'step-1',
      lessonId: 'lesson-1',
      type: 'multiple_choice',
      prompt: 'Pregunta',
      explanation: null,
      config: { correctAnswer: 'a' },
      orderIndex: 1,
    },
    {
      id: 'step-2',
      lessonId: 'lesson-1',
      type: 'order_steps',
      prompt: 'Ordena',
      explanation: null,
      config: { correctAnswer: ['check', 'login'] },
      orderIndex: 2,
    },
    {
      id: 'step-3',
      lessonId: 'lesson-1',
      type: 'match_pairs',
      prompt: 'Relaciona',
      explanation: null,
      config: { correctAnswer: { dns: 'domini', ip: 'adreca' } },
      orderIndex: 3,
    },
  ],
};

describe('gradeLesson', () => {
  it('grades choice, order and match interactions', () => {
    const result = gradeLesson(lesson, [
      { stepId: 'step-1', value: 'a', hintUsed: false, timeSpentSeconds: 4 },
      { stepId: 'step-2', value: ['check', 'login'], hintUsed: false, timeSpentSeconds: 8 },
      { stepId: 'step-3', value: { dns: 'domini', ip: 'adreca' }, hintUsed: false, timeSpentSeconds: 10 },
    ]);

    expect(result.score).toBe(100);
    expect(result.xpAwarded).toBe(20);
    expect(result.requiresReview).toBe(false);
  });

  it('marks low accuracy attempts as review', () => {
    const result = gradeLesson(lesson, [
      { stepId: 'step-1', value: 'b', hintUsed: false, timeSpentSeconds: 4 },
    ]);

    expect(result.score).toBe(0);
    expect(result.requiresReview).toBe(true);
    expect(result.xpAwarded).toBe(11);
  });

  it('checks a single step without exposing the correct answer', () => {
    const check = checkStepAnswer(lesson.steps[0], 'b');

    expect(check).toEqual({
      stepId: 'step-1',
      isCorrect: false,
      explanation: null,
    });
    expect(check).not.toHaveProperty('correctAnswer');
  });
});
