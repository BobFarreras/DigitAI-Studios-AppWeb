/**
 * @file src/actions/admin/learning-content.ts
 * @updated 2026-05-19
 * @summary Admin action for learning content inventory.
 * @scope Admin authorization and service orchestration only.
 */
'use server';

import { requireAdmin } from '@/lib/auth/admin-guard';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { SupabaseAdminLearningContentRepository } from '@/repositories/supabase/SupabaseAdminLearningContentRepository';
import {
  AdminLearningContentService,
  type AdminLearningContentData,
} from '@/services/learning/admin-learning-content-service';

const nullableText = z.string().max(4000).nullable();
const baseEntity = {
  id: z.string().uuid(),
  slug: z.string().min(1).max(80),
  title: z.string().min(1).max(140),
  active: z.boolean(),
  orderIndex: z.number().int().min(0).max(999),
};

const trackSchema = z.object({
  kind: z.literal('track'),
  ...baseEntity,
  description: nullableText,
  icon: z.string().max(40).nullable(),
  color: z.string().max(40).nullable(),
});

const moduleSchema = z.object({
  kind: z.literal('module'),
  ...baseEntity,
  description: nullableText,
  level: z.enum(['initiation', 'basic', 'intermediate', 'advanced']),
});

const lessonSchema = z.object({
  kind: z.literal('lesson'),
  ...baseEntity,
  objective: nullableText,
  estimatedMinutes: z.number().int().min(1).max(240),
  xpReward: z.number().int().min(1).max(500),
});

const stepTypes = ['multiple_choice', 'multi_select', 'true_false', 'order_steps', 'match_pairs',
  'fill_blank', 'code_choice', 'terminal_simulation', 'network_diagram', 'code_editor',
  'ai_prompt_review', 'security_triage', 'scenario'] as const;

const stepSchema = z.object({
  kind: z.literal('step'),
  id: z.string().uuid(),
  type: z.enum(stepTypes),
  prompt: z.string().min(1).max(4000),
  explanation: nullableText,
  config: z.record(z.string(), z.unknown()),
  orderIndex: z.number().int().min(0).max(999),
});

const updateSchema = z.discriminatedUnion('kind', [trackSchema, moduleSchema, lessonSchema, stepSchema]);

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
