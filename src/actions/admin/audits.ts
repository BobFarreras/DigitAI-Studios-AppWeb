'use server';

import { createClient } from '@/lib/supabase/server';
// 👇 AQUESTA ÉS LA CLAU: Importem del container, no la classe directament
import { auditService } from '@/services/container'; 
import { redirect } from 'next/navigation';

export async function getAdminAudits() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect('/auth/login');

  try {
    // Ara 'auditService' ja té els 3 arguments injectats des del container
    const audits = await auditService.getDashboardAudits();
    return { success: true, data: audits };
  } catch (error) {
    console.error('Error fetching audits:', error);
    return { success: false, error: "Error carregant auditories" };
  }
}