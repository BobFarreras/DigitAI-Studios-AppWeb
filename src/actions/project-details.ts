'use server';

import { createClient } from '@/lib/supabase/server';
import { DashboardProjectRepository } from '@/repositories/supabase/DashboardProjectRepository';

export async function getAdminProjectDetails(projectId: string) {
  const supabase = await createClient();
  const repo = new DashboardProjectRepository(supabase);
  const project = await repo.getAdminProjectById(projectId);
  return { success: true, project };
}
