/**
 * @file src/services/learning/learning-answer-grading.ts
 * @updated 2026-05-17
 * @summary Pure grading helpers for learning lesson answers.
 * @scope Deterministic answer checking and score calculation only.
 */
import type {
  LearningLessonDetailRecord,
  LearningStepRecord,
} from '@/repositories/interfaces/ILearningRepository';
import { calculateXpReward } from './learning-dashboard-service';

export type LessonAnswerInput = {
  stepId: string;
  value: unknown;
  hintUsed: boolean;
  timeSpentSeconds: number;
};

export type StepAnswerCheck = {
  stepId: string;
  isCorrect: boolean;
  explanation: string | null;
};

export function gradeLesson(detail: LearningLessonDetailRecord, answers: LessonAnswerInput[]) {
  const graded = detail.steps.map((step) => {
    const answer = answers.find((item) => item.stepId === step.id);
    const isCorrect = answer ? isAnswerCorrect(step, answer.value) : false;
    return {
      stepId: step.id,
      answer: answer?.value ?? null,
      isCorrect,
      hintUsed: answer?.hintUsed ?? false,
      timeSpentSeconds: answer?.timeSpentSeconds ?? 0,
    };
  });
  const correctCount = graded.filter((item) => item.isCorrect).length;
  const mistakeCount = detail.steps.length - correctCount;
  const accuracy = Math.round((correctCount / Math.max(1, detail.steps.length)) * 100);
  const requiresReview = mistakeCount >= 5 || accuracy < 70;

  return {
    score: accuracy,
    correctCount,
    mistakeCount,
    accuracy,
    requiresReview,
    xpAwarded: calculateXpReward(detail.lesson.xpReward, mistakeCount),
    timeSpentSeconds: graded.reduce((total, item) => total + item.timeSpentSeconds, 0),
    answers: graded,
  };
}

export function checkStepAnswer(step: LearningStepRecord, value: unknown): StepAnswerCheck {
  return {
    stepId: step.id,
    isCorrect: isAnswerCorrect(step, value),
    explanation: step.explanation,
  };
}

function isAnswerCorrect(step: LearningStepRecord, value: unknown) {
  const correct = step.config.correctAnswer;
  if (step.type === 'order_steps') return compareArrays(value, correct);
  if (step.type === 'match_pairs') return compareRecords(value, correct);
  return value === correct;
}

function compareArrays(value: unknown, correct: unknown) {
  return Array.isArray(value) && Array.isArray(correct)
    && value.length === correct.length
    && value.every((item, index) => item === correct[index]);
}

function compareRecords(value: unknown, correct: unknown) {
  if (!isRecord(value) || !isRecord(correct)) return false;
  return Object.keys(correct).every((key) => value[key] === correct[key]);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
