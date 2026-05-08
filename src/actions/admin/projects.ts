/**
 * @file src/actions/admin/projects.ts
 * @updated 2026-05-08
 * @summary Server actions per src/actions/admin/projects.ts
 * @scope Operacions de servidor, validacio i orquestracio de capa aplicacio.
 */
'use server';

import { createClient } from '@/lib/supabase/server';

export async function getAdminProjectsOverview() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from('projects')
    .select('*, organizations(plan)')
    .order('created_at', { ascending: false });

  return { success: true, projects: projects ?? [] };
}

export async function getAdminProjectOptions() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from('projects')
    .select('id, name')
    .order('created_at', { ascending: false });

  return { success: true, projects: projects ?? [] };
}

