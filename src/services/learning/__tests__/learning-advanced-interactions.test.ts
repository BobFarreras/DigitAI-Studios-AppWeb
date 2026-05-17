/**
 * @file src/services/learning/__tests__/learning-advanced-interactions.test.ts
 * @updated 2026-05-17
 * @summary Tests grading for advanced lesson interaction types.
 * @scope Pure grading coverage for expert interactions only.
 */
import { describe, expect, it } from 'vitest';
import { gradeLesson } from '../learning-lesson-service';
import type { LearningLessonDetailRecord, LearningStepType } from '@/repositories/interfaces/ILearningRepository';

const step = (id: string, type: LearningStepType, correctAnswer: unknown) => ({
  id,
  lessonId: 'lesson-1',
  type,
  prompt: id,
  explanation: null,
  config: { correctAnswer },
  orderIndex: Number(id.replace('step-', '')),
});

const lesson: LearningLessonDetailRecord = {
  trackSlug: 'advanced',
  trackTitle: 'Advanced',
  moduleTitle: 'Expert',
  lesson: {
    id: 'lesson-1',
    slug: 'advanced',
    title: 'Advanced',
    objective: null,
    estimatedMinutes: 8,
    xpReward: 20,
    orderIndex: 1,
  },
  steps: [
    step('step-1', 'terminal_simulation', 'nslookup digitai.studio'),
    step('step-2', 'network_diagram', 'DNS'),
    step('step-3', 'code_editor', 'const safe = schema.parse(input);'),
    step('step-4', 'ai_prompt_review', ['Objectiu concret', 'Format de sortida']),
    step('step-5', 'security_triage', 'Alta'),
  ],
};

describe('advanced interaction grading', () => {
  it('grades terminal, network, code editor, prompt review and triage', () => {
    const result = gradeLesson(lesson, [
      { stepId: 'step-1', value: ' NSLOOKUP digitai.studio ', hintUsed: false, timeSpentSeconds: 4 },
      { stepId: 'step-2', value: 'DNS', hintUsed: false, timeSpentSeconds: 4 },
      { stepId: 'step-3', value: 'const safe = schema.parse(input);', hintUsed: false, timeSpentSeconds: 4 },
      { stepId: 'step-4', value: ['Format de sortida', 'Objectiu concret'], hintUsed: false, timeSpentSeconds: 4 },
      { stepId: 'step-5', value: 'Alta', hintUsed: false, timeSpentSeconds: 4 },
    ]);

    expect(result.score).toBe(100);
    expect(result.requiresReview).toBe(false);
  });
});
