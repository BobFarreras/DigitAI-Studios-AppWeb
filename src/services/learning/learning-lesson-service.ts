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
import { checkStepAnswer, gradeLesson, type LessonAnswerInput } from './learning-answer-grading';

export { gradeLesson };
export type { LessonAnswerInput, StepAnswerCheck } from './learning-answer-grading';

export type LearningRunnerStep = Omit<LearningStepRecord, 'config'> & {
  config: Record<string, unknown>;
};

export type LearningRunnerData = {
  trackSlug: string;
  trackTitle: string;
  moduleTitle: string;
  lesson: LearningLessonDetailRecord['lesson'];
  steps: LearningRunnerStep[];
  locale: string;
};

export class LearningLessonService {
  constructor(private repository: ILearningRepository) {}

  async getRunner(trackSlug: string, lessonSlug: string, locale: string = 'ca'): Promise<LearningRunnerData | null> {
    const detail = await this.repository.getLessonDetail(trackSlug, lessonSlug);
    if (!detail) return null;

    return {
      trackSlug: detail.trackSlug,
      trackTitle: detail.trackTitle,
      moduleTitle: detail.moduleTitle,
      lesson: detail.lesson,
      steps: detail.steps.map(sanitizeStep),
      locale,
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

  async checkAnswer(trackSlug: string, lessonSlug: string, stepId: string, value: unknown) {
    const detail = await this.repository.getLessonDetail(trackSlug, lessonSlug);
    if (!detail) return null;

    const step = detail.steps.find((item) => item.id === stepId);
    return step ? checkStepAnswer(step, value) : null;
  }
}

function sanitizeStep(step: LearningStepRecord): LearningRunnerStep {
  const publicConfig = { ...step.config };
  delete publicConfig.correctAnswer;
  return { ...step, config: publicConfig };
}
