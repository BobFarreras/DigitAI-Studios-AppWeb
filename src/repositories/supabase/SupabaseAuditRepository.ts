import { createClient, createAdminClient } from '@/lib/supabase/server';
import { IAuditRepository, AuditSummary } from '../interfaces/IAuditRepository';
import { AuditDTO } from '@/types/models';
import { Database } from '@/types/database.types';

// Tipus directe de la fila de la DB
type AuditRow = Database['public']['Tables']['web_audits']['Row'];

export class SupabaseAuditRepository implements IAuditRepository {

  // --- HELPER PRIVAT PER MAPEJAR ---
  private mapToDTO(row: AuditRow): AuditDTO {
    return {
      id: row.id,
      url: row.url,
      email: row.email, // Important incloure l'email
      status: row.status as AuditDTO['status'],
      seoScore: row.seo_score,
      performanceScore: row.performance_score,
      createdAt: row.created_at ? new Date(row.created_at) : new Date(),
      // Cast segur del JSON
      reportData: row.report_data as Record<string, unknown>,
    };
  }

  // =================================================================
  // LECTURA (USER SIDE)
  // =================================================================

  async getAuditsByUserEmail(email: string): Promise<AuditDTO[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('web_audits')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(this.mapToDTO);
  }

  async getAuditsByUserId(userId: string): Promise<AuditDTO[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('web_audits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(this.mapToDTO);
  }

  async getAuditById(id: string): Promise<AuditDTO | null> {
    const supabase = await createClient();
    const { data } = await supabase.from('web_audits').select('*').eq('id', id).single();
    return data ? this.mapToDTO(data) : null;
  }

  // =================================================================
  // ESCRIPTURA (CREACIÓ)
  // =================================================================

  // Mètode genèric (per compatibilitat)
  async createAudit(url: string, email: string): Promise<AuditDTO> {
    return this.createPublicAudit(url, email);
  }

  // CAS 1: Amb Usuari Registrat (Guardem Org ID)
  async createAuditForUser(url: string, userId: string, email: string): Promise<AuditDTO> {
    const supabaseAdmin = createAdminClient();

    // 1. Busquem l'Organització de l'usuari
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('organization_id')
      .eq('id', userId)
      .single();

    const orgId = profile?.organization_id || null;

    // 2. Creem l'auditoria vinculada
    const { data, error } = await supabaseAdmin
      .from('web_audits')
      .insert({
        url,
        user_id: userId,
        email: email,
        organization_id: orgId, // ✅ Guardat correctament
        status: 'processing'
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToDTO(data);
  }

  // CAS 2: Pública / Leads (Sense Org ID encara)
  async createPublicAudit(url: string, email: string): Promise<AuditDTO> {
    const supabaseAdmin = createAdminClient();

    const { data, error } = await supabaseAdmin
      .from('web_audits')
      .insert({
        url,
        email: email,
        status: 'processing',
        organization_id: null, // Públic = Sense organització inicialment
        user_id: null
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToDTO(data);
  }

  // =================================================================
  // ACTUALITZACIÓ
  // =================================================================

  async updateStatus(
    id: string,
    status: AuditDTO['status'],
    results?: {
      seoScore?: number;
      performanceScore?: number;
      reportData?: Record<string, unknown>
    }
  ): Promise<void> {
    const supabaseAdmin = createAdminClient();

    const updatePayload: Partial<AuditRow> = { status };

    if (results) {
      if (results.seoScore !== undefined) updatePayload.seo_score = results.seoScore;
      if (results.performanceScore !== undefined) updatePayload.performance_score = results.performanceScore;
      if (results.reportData !== undefined) {
        updatePayload.report_data = results.reportData as AuditRow['report_data'];
      }
    }

    const { error } = await supabaseAdmin
      .from('web_audits')
      .update(updatePayload)
      .eq('id', id);

    if (error) throw new Error(error.message);
  }

  // =================================================================
  // ADMIN ONLY (BYPASS RLS)
  // =================================================================

  async getAllLight(): Promise<AuditSummary[]> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('web_audits')
      .select('id, created_at, url, email, seo_score, performance_score, status')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [AUDIT REPO] Error:', error);
      return [];
    }

    return data.map(row => ({
      id: row.id,
      url: row.url,
      email: row.email,
      status: row.status as AuditDTO['status'],
      seoScore: row.seo_score,
      performanceScore: row.performance_score,
      createdAt: row.created_at ? new Date(row.created_at) : new Date()
    }));
  }

  async getAuditByIdAdmin(id: string): Promise<AuditDTO | null> {
    const supabaseAdmin = createAdminClient();

    const { data, error } = await supabaseAdmin
      .from('web_audits')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error(`❌ Error fetching audit (Admin) [${id}]:`, error?.message);
      return null;
    }

    // ✅ MAPEIG MANUAL COMPLET
    return {
      id: data.id,
      url: data.url,
      email: data.email, // Afegit email
      status: data.status,
      seoScore: data.seo_score,
      performanceScore: data.performance_score,
      createdAt: data.created_at ? new Date(data.created_at) : new Date(), // Afegida data
      reportData: data.report_data as Record<string, unknown>
    } as AuditDTO;
  }

  async deleteAudit(id: string): Promise<void> {
    const supabaseAdmin = createAdminClient(); // Usem Admin per assegurar que podem esborrar qualsevol

    const { error } = await supabaseAdmin
      .from('web_audits')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`❌ Error deleting audit [${id}]:`, error.message);
      throw new Error("No s'ha pogut eliminar l'auditoria");
    }
  }
}