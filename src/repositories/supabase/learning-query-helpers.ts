/**
 * @file src/repositories/supabase/learning-query-helpers.ts
 * @updated 2026-05-20
 * @summary Shared query helpers for the Supabase learning repository.
 * @scope Data access utilities; no business rules.
 */
import type { PostgrestError } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabase/server';
import type { Tables } from '@/types/database.types';

type ModuleRow = Tables<'learning_modules'>;

export const publishedContent = { active: true, publication_status: 'published' };

export async function findLessonBySlug(modules: ModuleRow[], lessonSlug: string, locale: string = 'ca') {
  const supabase = createAdminClient();
  const moduleIds = modules.map((module) => module.id);
  if (moduleIds.length === 0) return null;

  const lesson = await supabase
    .from('learning_lessons')
    .select('*')
    .in('module_id', moduleIds)
    .eq('slug', lessonSlug)
    .match(publishedContent)
    .maybeSingle();
  assertNoError(lesson.error);
  if (!lesson.data) return null;

  const lessonData = lesson.data as Record<string, unknown>;
  const learningModule = modules.find((item) => item.id === lessonData.module_id) as Record<string, unknown> | undefined;

  const moduleTitle = locale === 'ca'
    ? (learningModule?.['title_ca'] as string | undefined) ?? (learningModule?.['title'] as string | undefined) ?? 'Formacio'
    : (learningModule?.[`title_${locale}`] as string | undefined) ?? (learningModule?.['title_ca'] as string | undefined) ?? (learningModule?.['title'] as string | undefined) ?? 'Formacio';

  return { ...lesson.data, moduleTitle };
}

export function assertNoError(error: PostgrestError | null) {
  if (error) throw new Error(error.message);
}