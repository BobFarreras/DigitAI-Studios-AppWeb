/**
 * @file src/actions/dashboard-review.ts
 * @updated 2026-05-20
 * @summary Server action for the advanced learning review screen.
 * @scope Auth gate and application orchestration for review data.
 */
'use server';

import { createClient } from '@/lib/supabase/server';
import { SupabaseLearningRepository } from '@/repositories/supabase/SupabaseLearningRepository';
import {
  LearningReviewService,
  type LearningReviewData,
} from '@/services/learning/learning-review-service';

type DashboardReviewResult =
  | { success: true; data: LearningReviewData }
  | { success: false; authRequired: true }
  | { success: false; error: string };

export async function getDashboardReviewData(locale: string = 'ca'): Promise<DashboardReviewResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { success: false, authRequired: true };
  }

  try {
    const service = new LearningReviewService(new SupabaseLearningRepository(locale));
    const data = await service.getReviewData(user.id, user.email);
    return { success: true, data };
  } catch {
    return { success: false, error: 'No hem pogut carregar el repas.' };
  }
}
