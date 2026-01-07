'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { auditService } from '@/services/container';
import { revalidatePath } from 'next/cache'; // 👈 IMPORTANT
// --- HELPER PRIVAT PER VERIFICAR ROL (MULTI-PERFIL / MULTI-ORG) ---
async function verifyAdminAccess() {
  // 1. Verifiquem la SESSIÓ
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { isAuthorized: false, user: null };
  }

  // 2. Utilitzem CLIENT ADMIN per saltar RLS
  const supabaseAdmin = createAdminClient();

  // 3. ⚠️ CANVI CLAU: No usem .single(). Demanem TOTS els perfils d'aquest usuari.
  const { data: profiles, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('role, organization_id')
    .eq('id', user.id);

  if (profileError || !profiles || profiles.length === 0) {
    console.warn(`⚠️ [AdminCheck] Cap perfil trobat per l'usuari: ${user.id}`);

    // FALLBACK: Mirem les metadades per si de cas
    if (user.user_metadata?.role === 'admin') {
      console.log("✅ [AdminCheck] Accés concedit via Metadata (Fallback)");
      return { isAuthorized: true, user };
    }

    return { isAuthorized: false, user };
  }

  // 4. LÒGICA INTEL·LIGENT:
  // Busquem si en ALGUN dels perfils l'usuari és 'admin'.
  // Això soluciona el problema de tenir múltiples organitzacions.
  const adminProfile = profiles.find(p => p.role === 'admin');
  const isAdmin = !!adminProfile;

  if (isAdmin) {
    console.log(`✅ [AdminCheck] Accés Admin concedit via Organització: ${adminProfile?.organization_id}`);
  } else {
    console.log(`⛔ [AdminCheck] L'usuari té ${profiles.length} perfils però cap és admin.`);
  }

  return { isAuthorized: isAdmin, user };
}

// --- LES ACCIONS (Això no canvia, només criden a la funció de dalt) ---

export async function getAdminAudits() {
  const { isAuthorized } = await verifyAdminAccess();
  if (!isAuthorized) return { success: false, error: "⛔ ACCÉS DENEGAT" };

  try {
    const audits = await auditService.getDashboardAudits();
    return { success: true, data: audits };
  } catch (error) {
    console.error('💥 [ACTION] Error:', error);
    return { success: false, error: "Error de servidor" };
  }
}

export async function getAdminAuditById(id: string) {
  const { isAuthorized } = await verifyAdminAccess();
  if (!isAuthorized) return { success: false, error: "⛔ ACCÉS DENEGAT" };

  try {
    const audit = await auditService.getAdminAuditDetails(id);
    if (!audit) return { success: false, error: "Auditoria no trobada" };
    return { success: true, data: audit };
  } catch (error) {
     console.error('💥 [ACTION] Error:', error);
    return { success: false, error: "Error de servidor" };
  }
}
// ✅ NOVA ACCIÓ PER ELIMINAR
export async function deleteAdminAudit(id: string) {
  const { isAuthorized } = await verifyAdminAccess();

  if (!isAuthorized) {
    return { success: false, error: "⛔ ACCÉS DENEGAT" };
  }

  try {
    await auditService.deleteAuditAsAdmin(id);

    // 👇 Màgia de Next.js: Recarrega les dades de la ruta /admin
    revalidatePath('/admin');

    return { success: true };
  } catch (error) {
    console.error('Error deleting audit:', error);
    return { success: false, error: "Error eliminant l'auditoria" };
  }
}