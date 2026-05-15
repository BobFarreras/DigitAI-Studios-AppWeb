/**
 * @file src/actions/admin/users.ts
 * @updated 2026-05-08
 * @summary Server actions per src/actions/admin/users.ts
 * @scope Operacions de servidor, validacio i orquestracio de capa aplicacio.
 */
'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { getServerEnv } from '@/config/server-env';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type UserProfile = {
  id: string;
  email: string;
  role: 'admin' | 'client' | 'lead';
  created_at: string;
  full_name: string | null;
  organization_id: string;
};

async function requireAdminContext() {
  const serverEnv = getServerEnv();
  const MAIN_ORG_ID = serverEnv.NEXT_PUBLIC_MAIN_ORG_ID;
  const supabaseAuth = await createClient();
  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
  if (authError || !user) redirect('/auth/login');

  const supabaseAdmin = createAdminClient();
  const isSuperAdmin = !!serverEnv.ADMIN_EMAIL && user.email === serverEnv.ADMIN_EMAIL;

  if (!isSuperAdmin) {
    const { data: currentUserProfile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .eq('organization_id', MAIN_ORG_ID)
      .single();

    if (currentUserProfile?.role !== 'admin') {
      redirect('/');
    }
  }

  return { supabaseAdmin, user, MAIN_ORG_ID };
}

export async function getAdminUsersList(): Promise<UserProfile[]> {
  try {
    const { supabaseAdmin, MAIN_ORG_ID } = await requireAdminContext();
    const { data: profiles, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('organization_id', MAIN_ORG_ID)
      .order('created_at', { ascending: false });

    if (error) return [];
    return profiles as UserProfile[];
  } catch {
    return [];
  }
}

export async function deleteUserFromOrg(userId: string) {
  try {
    const { supabaseAdmin, user, MAIN_ORG_ID } = await requireAdminContext();
    if (user.id === userId) return { success: false, message: 'No pots eliminar el teu propi usuari.' };

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id,email,organization_id')
      .eq('id', userId)
      .eq('organization_id', MAIN_ORG_ID)
      .maybeSingle();

    if (!profile) return { success: false, message: 'Usuari no trobat en aquesta organització.' };

    await deleteUserData(userId, MAIN_ORG_ID);
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError && !isMissingAuthUser(authError.message)) {
      return { success: false, message: `Error eliminant Auth: ${authError.message}` };
    }

    revalidatePath('/admin/users');
    return { success: true, message: "Usuari i dades associades eliminats correctament." };
  } catch {
    return { success: false, message: 'No tens permisos o falta configuració.' };
  }
}

async function deleteUserData(userId: string, organizationId: string) {
  const supabase = createAdminClient();
  const { data: projects } = await supabase
    .from('projects')
    .select('id')
    .eq('client_id', userId)
    .eq('organization_id', organizationId);
  const projectIds = projects?.map((project) => project.id) ?? [];

  if (projectIds.length > 0) {
    const { data: campaigns } = await supabase
      .from('test_campaigns')
      .select('id')
      .in('project_id', projectIds);
    const campaignIds = campaigns?.map((campaign) => campaign.id) ?? [];

    if (campaignIds.length > 0) {
      const { data: tasks } = await supabase
        .from('test_tasks')
        .select('id')
        .in('campaign_id', campaignIds);
      const taskIds = tasks?.map((task) => task.id) ?? [];

      if (taskIds.length > 0) await supabase.from('test_results').delete().in('task_id', taskIds);
      await supabase.from('test_assignments').delete().in('campaign_id', campaignIds);
      await supabase.from('test_tasks').delete().in('campaign_id', campaignIds);
      await supabase.from('test_campaigns').delete().in('id', campaignIds);
    }

    await supabase.from('project_members').delete().in('project_id', projectIds);
    await supabase.from('projects').delete().in('id', projectIds);
  }

  const { data: orders } = await supabase
    .from('orders')
    .select('id')
    .eq('user_id', userId)
    .eq('organization_id', organizationId);
  const orderIds = orders?.map((order) => order.id) ?? [];
  if (orderIds.length > 0) await supabase.from('order_items').delete().in('order_id', orderIds);

  await supabase.from('orders').delete().eq('user_id', userId).eq('organization_id', organizationId);
  await supabase.from('bookings').delete().eq('user_id', userId).eq('organization_id', organizationId);
  await supabase.from('web_audits').delete().eq('user_id', userId).eq('organization_id', organizationId);
  await supabase.from('social_connections').delete().eq('user_id', userId).eq('organization_id', organizationId);
  await supabase.from('test_results').delete().eq('user_id', userId);
  await supabase.from('test_assignments').delete().eq('user_id', userId);
  await supabase.from('project_members').delete().eq('user_id', userId);
  await supabase.from('profiles').delete().eq('id', userId).eq('organization_id', organizationId);
}

function isMissingAuthUser(message: string) {
  return message.toLowerCase().includes('user not found');
}

