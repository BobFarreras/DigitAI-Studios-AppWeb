/**
 * @file src/actions/dashboard-profile.ts
 * @updated 2026-05-20
 * @summary Server action for the authenticated student profile screen.
 * @scope Auth gate and orchestration for profile learning metrics.
 */
'use server';

import { createClient } from '@/lib/supabase/server';
import { SupabaseLearningRepository } from '@/repositories/supabase/SupabaseLearningRepository';
import { LearningDashboardService } from '@/services/learning/learning-dashboard-service';
import {
  buildLearningProfile,
  type LearningProfileData,
} from '@/services/learning/learning-profile-service';

type DashboardProfileResult =
  | { success: true; data: LearningProfileData }
  | { success: false; authRequired: true }
  | { success: false; error: string };

export async function getDashboardProfileData(locale: string = 'ca'): Promise<DashboardProfileResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { success: false, authRequired: true };
  }

  try {
    const service = new LearningDashboardService(new SupabaseLearningRepository(locale));
    const dashboard = await service.getDashboardData(user.id, user.email);
    return { success: true, data: buildLearningProfile(dashboard, locale) };
  } catch {
    return { success: false, error: 'No hem pogut carregar el perfil formatiu.' };
  }
}
