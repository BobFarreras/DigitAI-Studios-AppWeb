/**
 * @file src/repositories/supabase/learning-persistence.ts
 * @updated 2026-05-17
 * @summary Persistence helpers for completed learning attempts.
 * @scope Supabase writes for attempts, answers, progress and XP.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { LearningAttemptCompletion } from '@/repositories/interfaces/ILearningRepository';
import { calculateNextStreak } from '@/services/learning/learning-gamification-service';
import type { Database, Json } from '@/types/database.types';

export async function persistAttemptCompletion(
  supabase: SupabaseClient<Database>,
  input: LearningAttemptCompletion
) {
  const attempt = await supabase.from('learning_attempts').insert({
    user_id: input.userId,
    lesson_id: input.lessonId,
    status: input.status,
    score: input.score,
    correct_count: input.correctCount,
    mistake_count: input.mistakeCount,
    time_spent_seconds: input.timeSpentSeconds,
    requires_review: input.requiresReview,
    xp_awarded: input.xpAwarded,
    accuracy: input.accuracy,
    completed_at: new Date().toISOString(),
  }).select('id').single();
  if (attempt.error || !attempt.data) throw new Error(attempt.error?.message ?? 'attempt_failed');

  await persistAnswers(supabase, input, attempt.data.id);
  await persistProgress(supabase, input);
  await persistXp(supabase, input);
  await persistStreak(supabase, input.userId);
}

async function persistAnswers(
  supabase: SupabaseClient<Database>,
  input: LearningAttemptCompletion,
  attemptId: string
) {
  const result = await supabase.from('learning_step_answers').insert(
    input.answers.map((answer) => ({
      attempt_id: attemptId,
      step_id: answer.stepId,
      answer: answer.answer as Json,
      is_correct: answer.isCorrect,
      hint_used: answer.hintUsed,
      time_spent_seconds: answer.timeSpentSeconds,
    }))
  );
  if (result.error) throw new Error(result.error.message);
}

async function persistProgress(
  supabase: SupabaseClient<Database>,
  input: LearningAttemptCompletion
) {
  const existing = await supabase
    .from('learning_progress')
    .select('*')
    .eq('user_id', input.userId)
    .eq('lesson_id', input.lessonId)
    .maybeSingle();
  if (existing.error) throw new Error(existing.error.message);

  const bestScore = Math.max(existing.data?.best_score ?? 0, input.score);
  const completed = Boolean(existing.data?.completed) || (bestScore >= 60 && !input.requiresReview);
  const result = await supabase.from('learning_progress').upsert({
    user_id: input.userId,
    lesson_id: input.lessonId,
    best_score: bestScore,
    completed,
    completed_at: completed ? new Date().toISOString() : existing.data?.completed_at ?? null,
    attempts_count: (existing.data?.attempts_count ?? 0) + 1,
    needs_review: input.requiresReview && !completed,
  }, { onConflict: 'user_id,lesson_id' });
  if (result.error) throw new Error(result.error.message);
}

async function persistXp(supabase: SupabaseClient<Database>, input: LearningAttemptCompletion) {
  const result = await supabase.from('learning_xp_events').insert({
    user_id: input.userId,
    source_type: 'lesson',
    source_id: input.lessonId,
    xp: input.xpAwarded,
  });
  if (result.error) throw new Error(result.error.message);
}

async function persistStreak(supabase: SupabaseClient<Database>, userId: string) {
  const existing = await supabase.from('learning_streaks').select('*').eq('user_id', userId).maybeSingle();
  if (existing.error) throw new Error(existing.error.message);

  const next = calculateNextStreak(existing.data ? {
    currentStreak: existing.data.current_streak,
    longestStreak: existing.data.longest_streak,
    lastActivityDate: existing.data.last_activity_date,
  } : null, currentDate());

  const result = await supabase.from('learning_streaks').upsert({
    user_id: userId,
    current_streak: next.currentStreak,
    longest_streak: next.longestStreak,
    last_activity_date: next.lastActivityDate,
  });
  if (result.error) throw new Error(result.error.message);
}

function currentDate() {
  return new Date().toISOString().slice(0, 10);
}
