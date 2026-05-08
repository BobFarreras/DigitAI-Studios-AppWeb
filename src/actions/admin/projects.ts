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
