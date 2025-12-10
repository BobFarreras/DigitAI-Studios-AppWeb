// FITXER: src/app/actions/get-users.ts

'use server'

// 👇 1. Importem createAdminClient (el que té la clau de servei)
import { createClient, createAdminClient } from '@/lib/supabase/server';
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

export async function getAdminUsersList(): Promise<UserProfile[]> {
  // Client normal per verificar qui fa la petició (AUTH)
  const supabaseAuth = await createClient();
  
  // 👇 2. Client ADMIN per fer les consultes a la DB (DADES)
  // Aquest client se salta les Policies RLS, evitant la recursió infinita.
  const supabaseAdmin = createAdminClient();

  // A. Verificar sessió actual
  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
  if (authError || !user) redirect('/auth/login');

  if (!MAIN_ORG_ID) {
      console.error("❌ ERROR CRÍTIC: Manca NEXT_PUBLIC_MAIN_ORG_ID al .env");
      return [];
  }

  // B. 🛡️ SUPER ADMIN CHECK MANUAL
  // Fem servir el client Admin per llegir el perfil sense activar polítiques recursives
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

  // C. Obtenir dades (Amb client Admin)
  const { data: profiles, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('organization_id', MAIN_ORG_ID)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return profiles as UserProfile[];
}