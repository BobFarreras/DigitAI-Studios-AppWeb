'use server';

import { createAdminClient, createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const MAIN_ORG_ID = process.env.NEXT_PUBLIC_MAIN_ORG_ID;

export async function deleteUserFromOrg(userId: string) {
  // 1. Seguretat: Verifiquem que qui crida és Admin
  const supabaseAuth = await createClient();
  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();

  if (authError || !user) redirect('/auth/login');

  const supabaseAdmin = createAdminClient();
  
  // Verifiquem si l'usuari actual és admin de l'organització
  // (O si és el super-admin del .env)
  const isSuperAdmin = user.email === process.env.ADMIN_EMAIL;
  
  if (!isSuperAdmin) {
    const { data: currentUserProfile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .eq('organization_id', MAIN_ORG_ID!)
      .single();

    if (currentUserProfile?.role !== 'admin') {
      return { success: false, message: 'No tens permisos.' };
    }
  }

  if (!MAIN_ORG_ID) return { success: false, message: 'Falta configuració d\'organització.' };

  // 2. EXECUTEM L'ELIMINACIÓ
  // Eliminem NOMÉS de la taula profiles i NOMÉS d'aquesta organització
  const { error } = await supabaseAdmin
    .from('profiles')
    .delete()
    .eq('id', userId)
    .eq('organization_id', MAIN_ORG_ID);

  if (error) {
    console.error('Error eliminant perfil:', error);
    return { success: false, message: 'Error a la base de dades.' };
  }

  // 3. Refresquem la UI
  revalidatePath('/admin/users');
  return { success: true, message: 'Usuari eliminat de l\'organització correctament.' };
}