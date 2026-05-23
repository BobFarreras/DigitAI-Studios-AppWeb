/**
 * @file src/actions/track-module-tree.ts
 * @updated 2026-05-22
 * @summary Server action to fetch hierarchical module tree for a learning track.
 * @scope Auth gate and orchestration for track module path display.
 */
'use server';

import { createClient } from '@/lib/supabase/server';
import { SupabaseLearningRepository } from '@/repositories/supabase/SupabaseLearningRepository';
import {
  LearningDashboardService,
  type LearningDashboardData,
} from '@/services/learning/learning-dashboard-service';
import {
  buildModuleTree,
  type LearningModuleTreeNode,
} from '@/services/learning/learning-module-tree-service';

type TrackModuleTreeResult =
  | {
      success: true;
      data: LearningDashboardData;
      tree: LearningModuleTreeNode[];
    }
  | { success: false; authRequired: true }
  | { success: false; error: string };

export async function getTrackModuleTree(
  trackSlug: string,
  locale: string = 'ca'
): Promise<TrackModuleTreeResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { success: false, authRequired: true as const };
  }

  try {
    const repo = new SupabaseLearningRepository(locale);
    const service = new LearningDashboardService(repo);
    const [data, snapshot] = await Promise.all([
      service.getDashboardData(user.id, user.email),
      repo.getDashboardSnapshot(user.id),
    ]);

    const track = data.tracks.find((t) => t.slug === trackSlug);
    if (!track) {
      return { success: false, error: 'Track not found' };
    }

    // Filter modules to only those belonging to this track (including nested submodules)
    const trackModules = snapshot.modules.filter((m) => m.trackId === track.id);

    const completedLessonIds = new Set(
      snapshot.progress
        .filter((p) => p.completed)
        .map((p) => p.lessonId)
    );
    const completedModuleIds = new Set(
      snapshot.modules
        .filter((m) => m.lessons.length > 0 && m.lessons.every((l) => completedLessonIds.has(l.id)))
        .map((m) => m.id)
    );

    const tree = buildModuleTree(trackModules, trackSlug, completedLessonIds, completedModuleIds);

    return { success: true, data, tree };
  } catch {
    return { success: false, error: 'No hem pogut carregar el mapa del curs.' };
  }
}
