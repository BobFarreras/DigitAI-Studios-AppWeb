/**
 * @file src/actions/dashboard-projects.ts
 * @updated 2026-05-08
 * @summary Server actions per src/actions/dashboard-projects.ts
 * @scope Operacions de servidor, validacio i orquestracio de capa aplicacio.
 */
'use server';

import { createClient } from '@/lib/supabase/server';
import { DashboardProjectRepository } from '@/repositories/supabase/DashboardProjectRepository';
import { DashboardProjectService } from '@/services/DashboardProjectService';

export async function getDashboardProjects() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, authRequired: true as const };
  }

  const service = new DashboardProjectService(new DashboardProjectRepository(supabase));
  const projects = await service.getProjectsForDashboard(user.id);
  return { success: true, projects };
}

export async function getDashboardProjectDetail(projectId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, authRequired: true as const };
  }

  const service = new DashboardProjectService(new DashboardProjectRepository(supabase));
  const context = await service.getProjectDetailContext(user.id, projectId);
  return { success: true, ...context };
}

