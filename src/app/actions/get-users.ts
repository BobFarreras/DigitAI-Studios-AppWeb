// FITXER: src/app/actions/get-users.ts

'use server'

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export type UserProfile = {
  id: string;
  email: string;
  role: 'admin' | 'client' | 'lead';
  created_at: string;
  full_name: string | null;
  organization_id: string; // Afegim això per debug si cal
};

// Recuperem la variable d'entorn
const MAIN_ORG_ID = process.env.NEXT_PUBLIC_MAIN_ORG_ID;

export async function getAdminUsersList(): Promise<UserProfile[]> {
  const supabase = await createClient();
 
  // 1. Verificar sessió actual
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect('/auth/login');

  // 2. 🛡️ SUPER ADMIN CHECK
  const isSuperAdmin = user.email === process.env.ADMIN_EMAIL;

  if (!isSuperAdmin) {
    // Si no ets el Super Admin, comprovem si tens rol admin dins de l'organització principal
    const { data: currentUserProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .eq('organization_id', MAIN_ORG_ID!) // 👈 Forcem la comprovació a l'org principal
      .single();

    if (currentUserProfile?.role !== 'admin') {
      redirect('/'); 
    }
  }

  if (!MAIN_ORG_ID) {
      console.error("❌ ERROR CRÍTIC: Manca NEXT_PUBLIC_MAIN_ORG_ID al .env");
      return [];
  }

  // 3. Obtenir dades FILTRADES per la Main Org
  // 🔥 AQUI ESTÀ LA SOLUCIÓ: .eq('organization_id', MAIN_ORG_ID)
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('organization_id', MAIN_ORG_ID) // 👈 Filtre estricte
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return profiles as UserProfile[];
}