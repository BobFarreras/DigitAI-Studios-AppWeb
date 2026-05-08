'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
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

const MAIN_ORG_ID = process.env.NEXT_PUBLIC_MAIN_ORG_ID;

async function requireAdminContext() {
  const supabaseAuth = await createClient();
  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
  if (authError || !user) redirect('/auth/login');

  if (!MAIN_ORG_ID) {
    throw new Error("Falta NEXT_PUBLIC_MAIN_ORG_ID al .env");
  }

  const supabaseAdmin = createAdminClient();
  const isSuperAdmin = user.email === process.env.ADMIN_EMAIL;

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

  return { supabaseAdmin, user };
}

export async function getAdminUsersList(): Promise<UserProfile[]> {
  try {
    const { supabaseAdmin } = await requireAdminContext();
    const { data: profiles, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('organization_id', MAIN_ORG_ID!)
      .order('created_at', { ascending: false });

    if (error) return [];
    return profiles as UserProfile[];
  } catch {
    return [];
  }
}

export async function deleteUserFromOrg(userId: string) {
  try {
    const { supabaseAdmin } = await requireAdminContext();
    const { error } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId)
      .eq('organization_id', MAIN_ORG_ID!);

    if (error) {
      return { success: false, message: 'Error a la base de dades.' };
    }

    revalidatePath('/admin/users');
    return { success: true, message: "Usuari eliminat de l'organització correctament." };
  } catch {
    return { success: false, message: 'No tens permisos o falta configuració.' };
  }
}
