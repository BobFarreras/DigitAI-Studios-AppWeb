/**
 * @file src/actions/admin/leads.ts
 * @updated 2026-05-08
 * @summary Server actions per src/actions/admin/leads.ts
 * @scope Operacions de servidor, validacio i orquestracio de capa aplicacio.
 */
'use server';

import { createClient } from '@/lib/supabase/server';
import { ContactService } from '@/services/ContactService';
import { SupabaseContactRepository } from '@/repositories/supabase/SupabaseContactRepository'; // Assegura't del path
import { NodemailerAdapter } from '@/adapters/nodemailer/NodemailerAdapter';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache'; // 👈 IMPORTANT
// Definim el tipus de resposta específica per al detall
type GetLeadDetailResponse =
  | { success: true; lead: Lead }
  | { success: false; error: string };
// --- DEFINICIÓ DE TIPUS (Clean Architecture) ---
type Lead = {
  id: string;
  created_at: string;
  full_name: string | null;
  email: string;
  service: string | null;
  message: string | null;
  source: string | null;
};

type Metadata = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// Aquest és el tipus "discriminat". Si success és true, tenim dades. Si és false, tenim error.
export type GetLeadsResponse =
  | { success: true; leads: Lead[]; metadata: Metadata }
  | { success: false; error: string };

// --- IMPLEMENTACIÓ ---

const repository = new SupabaseContactRepository();
const mailer = new NodemailerAdapter();
const contactService = new ContactService(repository, mailer);

export async function getAdminLeads(page: number = 1): Promise<GetLeadsResponse> {
  const supabase = await createClient();

  // 1. SEGURETAT
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect('/auth/login');

  // 2. RECUPERAR DADES
  try {
    const result = await contactService.getDashboardLeads(page);

    // Retornem l'objecte complet marcat com a èxit
    return {
      success: true,
      leads: result.leads,
      metadata: result.metadata
    };

  } catch (error) {
    console.error('💥 [ACTION] Error:', error);
    return { success: false, error: "Error carregant els missatges" };
  }
}

// 👇 NOVA ACCIÓ
export async function getAdminLeadById(id: string): Promise<GetLeadDetailResponse> {
  const supabase = await createClient();

  // 1. Seguretat
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect('/auth/login');

  // 2. Recuperar dades
  try {
    const lead = await contactService.getLeadDetails(id);

    if (!lead) {
      return { success: false, error: "No s'ha trobat el missatge." };
    }

    return { success: true, lead };
  } catch (error) {
    console.error('💥 [ACTION] Error:', error);
    return { success: false, error: "Error de servidor recuperant el missatge." };
  }
}

export async function deleteAdminLead(id: string) {
  const supabase = await createClient();

  // 1. Seguretat
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect('/auth/login');

  try {
    // 2. Esborrar
    await contactService.deleteLead(id);
    console.log(`✅ [ACTION] Eliminat a Supabase. Ara revalidant paths...`);
    // 3. Revalidar (Refrescar la UI del servidor)
    // Això fa que la llista s'actualitzi sola a '/admin/missatges'
    revalidatePath('/[locale]/admin/missatges', 'page');

    return { success: true };
  } catch (error) {
    console.error('💥 [ACTION] Error eliminant:', error);
    return { success: false, error: "No s'ha pogut eliminar el missatge." };
  }
}
