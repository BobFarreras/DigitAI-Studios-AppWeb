/**
 * @file src/services/learning/learning-lesson-service.ts
 * @updated 2026-05-16
 * @summary Lesson runner loading, answer validation and scoring.
 * @scope Pure lesson orchestration; persistence is delegated to repository.
 */
import type {
  ILearningRepository,
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

export type LearningRunnerStep = Omit<LearningStepRecord, 'config'> & {
  config: Record<string, unknown>;
};

export type LearningRunnerData = {
  trackSlug: string;
  trackTitle: string;
  moduleTitle: string;
  lesson: LearningLessonDetailRecord['lesson'];
  steps: LearningRunnerStep[];
};

export class LearningLessonService {
  constructor(private repository: ILearningRepository) {}

  async getRunner(trackSlug: string, lessonSlug: string): Promise<LearningRunnerData | null> {
    const detail = await this.repository.getLessonDetail(trackSlug, lessonSlug);
    if (!detail) return null;

    return {
      trackSlug: detail.trackSlug,
      trackTitle: detail.trackTitle,
      moduleTitle: detail.moduleTitle,
      lesson: detail.lesson,
      steps: detail.steps.map(sanitizeStep),
    };
  }

  async submitLesson(
    userId: string,
    trackSlug: string,
    lessonSlug: string,
    answers: LessonAnswerInput[]
  ) {
    const detail = await this.repository.getLessonDetail(trackSlug, lessonSlug);
    if (!detail) throw new Error('lesson_not_found');

    const result = gradeLesson(detail, answers);
    await this.repository.completeAttempt({
      userId,
      lessonId: detail.lesson.id,
      status: result.requiresReview ? 'needs_review' : 'completed',
      score: result.score,
      correctCount: result.correctCount,
      mistakeCount: result.mistakeCount,
      timeSpentSeconds: result.timeSpentSeconds,
      requiresReview: result.requiresReview,
      xpAwarded: result.xpAwarded,
      accuracy: result.accuracy,
      answers: result.answers,
    });

    return result;
  }
}

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

function sanitizeStep(step: LearningStepRecord): LearningRunnerStep {
  const publicConfig = { ...step.config };
  delete publicConfig.correctAnswer;
  return { ...step, config: publicConfig };
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
