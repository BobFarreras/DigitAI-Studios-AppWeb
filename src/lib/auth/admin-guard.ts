import { createClient } from '@/lib/supabase/server';
import { getServerEnv } from '@/config/server-env';
import { notFound, redirect } from 'next/navigation';

/**
 * Aquesta funció actua com un tallafocs.
 * Si l'usuari no és l'Admin, atura l'execució i llança un 404.
 */
export async function requireAdmin() {
  const serverEnv = getServerEnv();
  const supabase = await createClient();
  
  // 1. Obtenim l'usuari
  const { data: { user }, error } = await supabase.auth.getUser();

  // 2. Si no està loguejat -> Al login
  if (error || !user) {
    redirect('/auth/login');
  }

  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('role, organization_id')
    .eq('id', user.id)
    .eq('organization_id', serverEnv.NEXT_PUBLIC_MAIN_ORG_ID);

  if (profileError || !profiles || profiles.length === 0) {
    notFound();
  }

  const isOrgAdmin = profiles.some((profile) => profile.role === 'admin');
  const isFallbackSuperAdmin = !!serverEnv.ADMIN_EMAIL && user.email === serverEnv.ADMIN_EMAIL;

  if (!isOrgAdmin && !isFallbackSuperAdmin) {
    console.warn(`⚠️ ALERTA DE SEGURETAT: L'usuari ${user.email} ha intentat accedir a l'admin.`);
    notFound();
  }

  return user;
}
