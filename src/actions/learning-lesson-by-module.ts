/**
 * @file src/actions/learning-lesson-by-module.ts
 * @updated 2026-05-22
 * @summary Server action to get a lesson by module slug (instead of track slug).
 * @scope Finds the track from the module, then delegates to lesson service.
 */
'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { createClient } from '@/lib/supabase/server';
import { SupabaseLearningRepository } from '@/repositories/supabase/SupabaseLearningRepository';
import {
  LearningLessonService,
  type LearningRunnerData,
} from '@/services/learning/learning-lesson-service';

async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getLearningLessonByModule(
  moduleSlug: string,
  lessonSlug: string,
  locale: string = 'ca'
): Promise<
  | { success: true; data: LearningRunnerData }
  | { success: false; authRequired?: true; error: string }
> {
  const user = await getCurrentUser();
  if (!user) return { success: false, authRequired: true, error: 'auth_required' };

  // Find the track for this module
  const admin = createAdminClient();
  const modResult = await admin
    .from('learning_modules')
    .select('track_id')
    .eq('slug', moduleSlug)
    .maybeSingle();

  if (modResult.error || !modResult.data) {
    return { success: false, error: 'module_not_found' };
  }

  const trackResult = await admin
    .from('learning_tracks')
    .select('slug')
    .eq('id', modResult.data.track_id)
    .maybeSingle();

  if (trackResult.error || !trackResult.data) {
    return { success: false, error: 'track_not_found' };
  }

  const service = new LearningLessonService(new SupabaseLearningRepository(locale));
  const data = await service.getRunner(trackResult.data.slug, lessonSlug, locale);
  if (!data) return { success: false, error: 'lesson_not_found' };

  return { success: true, data };
}
