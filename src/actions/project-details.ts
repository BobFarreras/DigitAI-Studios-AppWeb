/**
 * @file src/actions/project-details.ts
 * @updated 2026-05-08
 * @summary Server actions per src/actions/project-details.ts
 * @scope Operacions de servidor, validacio i orquestracio de capa aplicacio.
 */
'use server';

import { createClient } from '@/lib/supabase/server';
import { DashboardProjectRepository } from '@/repositories/supabase/DashboardProjectRepository';

export async function getAdminProjectDetails(projectId: string) {
  const supabase = await createClient();
  const repo = new DashboardProjectRepository(supabase);
  const project = await repo.getAdminProjectById(projectId);
  return { success: true, project };
}

