'use server'

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export type UserProfile = {
  id: string;
  email: string;
  role: 'admin' | 'client' | 'lead';
  created_at: string;
  full_name: string | null;
};

export async function getAdminUsersList(): Promise<UserProfile[]> {
  const supabase = await createClient();
 
  // 1. Verificar sessió actual
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect('/auth/login');

  // 2. 🛡️ SUPER ADMIN CHECK
  // Si el correu és el de la variable d'entorn, ets admin SI o SI.
  const isSuperAdmin = user.email === process.env.ADMIN_EMAIL;

  if (!isSuperAdmin) {
    // Si no ets el Super Admin per variable, comprovem la base de dades
    const { data: currentUserProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (currentUserProfile?.role !== 'admin') {
      redirect('/'); // Fora d'aquí
    }
  }

  // 3. Obtenir dades
  // NOTA IMPORTANT: Encara que el codi et deixi passar, el RLS (Row Level Security) 
  // de Supabase et pot bloquejar les dades si el teu rol a la DB no és 'admin'.
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return profiles as UserProfile[];
}