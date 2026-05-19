/**
 * @file src/actions/admin/learning-content-schemas.ts
 * @updated 2026-05-19
 * @summary Zod schemas for admin learning content actions.
 * @scope Input validation schemas only.
 */
import { z } from 'zod';

const nullableText = z.string().max(4000).nullable();
const slug = z.string().min(1).max(80);
const title = z.string().min(1).max(140);
const orderIndex = z.number().int().min(0).max(999);
const active = z.boolean();
const id = z.string().uuid();
const level = z.enum(['initiation', 'basic', 'intermediate', 'advanced']);

const stepTypes = ['multiple_choice', 'multi_select', 'true_false', 'order_steps', 'match_pairs',
  'fill_blank', 'code_choice', 'terminal_simulation', 'network_diagram', 'code_editor',
  'ai_prompt_review', 'security_triage', 'scenario'] as const;

const baseUpdate = { id, slug, title, active, orderIndex };
const baseCreate = { slug, title, active, orderIndex };

export const trackUpdateSchema = z.object({
  kind: z.literal('track'), ...baseUpdate,
  description: nullableText, icon: z.string().max(40).nullable(), color: z.string().max(40).nullable(),
});
export const trackCreateSchema = z.object({
  kind: z.literal('track'), ...baseCreate,
  description: nullableText, icon: z.string().max(40).nullable(), color: z.string().max(40).nullable(),
});
export const moduleUpdateSchema = z.object({
  kind: z.literal('module'), ...baseUpdate,
  description: nullableText, level,
});
export const moduleCreateSchema = z.object({
  kind: z.literal('module'), ...baseCreate,
  trackId: id, description: nullableText, level,
});
export const lessonUpdateSchema = z.object({
  kind: z.literal('lesson'), ...baseUpdate,
  objective: nullableText, estimatedMinutes: z.number().int().min(1).max(240), xpReward: z.number().int().min(1).max(500),
});
export const lessonCreateSchema = z.object({
  kind: z.literal('lesson'), ...baseCreate,
  moduleId: id, objective: nullableText, estimatedMinutes: z.number().int().min(1).max(240), xpReward: z.number().int().min(1).max(500),
});
export const stepUpdateSchema = z.object({
  kind: z.literal('step'), id, type: z.enum(stepTypes),
  prompt: z.string().min(1).max(4000), explanation: nullableText,
  config: z.record(z.string(), z.unknown()), orderIndex,
});
export const stepCreateSchema = z.object({
  kind: z.literal('step'), lessonId: id, type: z.enum(stepTypes),
  prompt: z.string().min(1).max(4000), explanation: nullableText,
  config: z.record(z.string(), z.unknown()), orderIndex,
});

export const updateSchema = z.discriminatedUnion('kind', [trackUpdateSchema, moduleUpdateSchema, lessonUpdateSchema, stepUpdateSchema]);
export const createSchema = z.discriminatedUnion('kind', [trackCreateSchema, moduleCreateSchema, lessonCreateSchema, stepCreateSchema]);
