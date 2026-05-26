/**
 * @file src/actions/admin/learning-content.ts
 * @updated 2026-05-19
 * @summary Admin action for learning content inventory.
 * @scope Admin authorization and service orchestration only.
 */
'use server';

import { requireAdmin } from '@/lib/auth/admin-guard';
import { revalidatePath } from 'next/cache';
import { SupabaseAdminLearningContentRepository } from '@/repositories/supabase/SupabaseAdminLearningContentRepository';
import {
  AdminLearningContentService,
  type AdminLearningContentData,
} from '@/services/learning/admin-learning-content-service';
import { createSchema, updateSchema } from './learning-content-schemas';

type AdminLearningContentResult =
  | { success: true; data: AdminLearningContentData }
  | { success: false; error: string };

type AdminLearningUpdateResult = { success: true } | { success: false; error: string };

export async function getAdminLearningContent(): Promise<AdminLearningContentResult> {
  await requireAdmin();

  try {
    const service = new AdminLearningContentService(new SupabaseAdminLearningContentRepository());
    return { success: true, data: await service.getOverview() };
  } catch {
    return { success: false, error: 'No hem pogut carregar el contingut formatiu.' };
  }
}

export async function createAdminLearningContent(input: unknown): Promise<AdminLearningUpdateResult> {
  await requireAdmin();
  const parsed = createSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: 'invalid_payload' };

  try {
    const service = new AdminLearningContentService(new SupabaseAdminLearningContentRepository());
    if (parsed.data.kind === 'track') await service.createTrack(parsed.data);
    if (parsed.data.kind === 'module') await service.createModule(parsed.data);
    if (parsed.data.kind === 'lesson') await service.createLesson(parsed.data);
    if (parsed.data.kind === 'step') await service.createStep(parsed.data);
    revalidatePath('/admin/learning');
    return { success: true };
  } catch {
    return { success: false, error: 'create_failed' };
  }
}

export async function updateAdminLearningContent(input: unknown): Promise<AdminLearningUpdateResult> {
  await requireAdmin();
  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: 'invalid_payload' };

  try {
    const service = new AdminLearningContentService(new SupabaseAdminLearningContentRepository());
    if (parsed.data.kind === 'track') {
      await service.updateTrack(parsed.data);
    }
    if (parsed.data.kind === 'module') {
      await service.updateModule(parsed.data);
    }
    if (parsed.data.kind === 'lesson') {
      await service.updateLesson(parsed.data);
    }
    if (parsed.data.kind === 'step') {
      await service.updateStep(parsed.data);
    }
    revalidatePath('/admin/learning');
    return { success: true };
  } catch {
    return { success: false, error: 'update_failed' };
  }
}
