/**
 * @file src/actions/dashboard-home.ts
 * @updated 2026-05-20
 * @summary Server action for the user training dashboard.
 * @scope Auth gate and application orchestration for dashboard home.
 */
'use server';

import { createClient } from '@/lib/supabase/server';
import { SupabaseLearningRepository } from '@/repositories/supabase/SupabaseLearningRepository';
import {
  LearningDashboardService,
  type LearningDashboardData,
} from '@/services/learning/learning-dashboard-service';

type DashboardHomeResult =
  | { success: true; data: LearningDashboardData }
  | { success: false, authRequired: true }
  | { success: false; error: string };

export async function getDashboardHomeData(locale: string = 'ca'): Promise<DashboardHomeResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { success: false, authRequired: true as const };
  }

  try {
    const service = new LearningDashboardService(new SupabaseLearningRepository(locale));
    const data = await service.getDashboardData(user.id, user.email);

    return { success: true, data };
  } catch {
    return { success: false, error: 'No hem pogut carregar la formacio.' };
  }
}

