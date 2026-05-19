/**
 * @file src/actions/admin/learning-content.ts
 * @updated 2026-05-19
 * @summary Admin action for learning content inventory.
 * @scope Admin authorization and service orchestration only.
 */
'use server';

import { requireAdmin } from '@/lib/auth/admin-guard';
import { SupabaseAdminLearningContentRepository } from '@/repositories/supabase/SupabaseAdminLearningContentRepository';
import {
  AdminLearningContentService,
  type AdminLearningContentData,
} from '@/services/learning/admin-learning-content-service';

type AdminLearningContentResult =
  | { success: true; data: AdminLearningContentData }
  | { success: false; error: string };

export async function getAdminLearningContent(): Promise<AdminLearningContentResult> {
  await requireAdmin();

  try {
    const service = new AdminLearningContentService(new SupabaseAdminLearningContentRepository());
    return { success: true, data: await service.getOverview() };
  } catch {
    return { success: false, error: 'No hem pogut carregar el contingut formatiu.' };
  }
}
