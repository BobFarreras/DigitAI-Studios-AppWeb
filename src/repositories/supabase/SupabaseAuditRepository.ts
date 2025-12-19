import { createClient, createAdminClient } from '@/lib/supabase/server';
import { IAuditRepository, AuditSummary } from '../interfaces/IAuditRepository';
import { AuditDTO } from '@/types/models';
import { Database } from '@/types/database.types';

// Tipus directe de la fila de la DB
type AuditRow = Database['public']['Tables']['web_audits']['Row'];

export class SupabaseAuditRepository implements IAuditRepository {

  private mapToDTO(row: AuditRow): AuditDTO {
    return {
      id: row.id,
      url: row.url,
      status: row.status as AuditDTO['status'],
      seoScore: row.seo_score,
      performanceScore: row.performance_score,
      createdAt: row.created_at ? new Date(row.created_at) : new Date(),
      // Fem un cast segur cap a un objecte genèric o unknown
      reportData: row.report_data as Record<string, unknown>,
    };
  }

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

  async getAuditById(id: string): Promise<AuditDTO | null> {
    const supabase = await createClient();
    const { data } = await supabase.from('web_audits').select('*').eq('id', id).single();
    return data ? this.mapToDTO(data) : null;
  }

  async createAudit(url: string, email: string): Promise<AuditDTO> {
    console.log(`[Repo] Creant auditoria per: ${email} - URL: ${url}`);

    const supabaseAdmin = createAdminClient();

    const { data, error } = await supabaseAdmin
      .from('web_audits')
      .insert({
        url,
        email,
        status: 'processing'
      })
      .select()
      .single();

    if (error) {
      console.error('[Repo] Error Supabase:', error);
      throw new Error(`Error creating audit: ${error.message}`);
    }

    console.log('[Repo] Auditoria creada OK:', data.id);
    return this.mapToDTO(data);
  }

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

    // Utilitzem Partial<AuditRow> per assegurar que els camps coincideixen amb la DB
    // Omitim 'id' i 'created_at' perquè no els tocarem
    const updatePayload: Partial<AuditRow> = { status };

    if (results) {
      if (results.seoScore !== undefined) updatePayload.seo_score = results.seoScore;
      if (results.performanceScore !== undefined) updatePayload.performance_score = results.performanceScore;

      if (results.reportData !== undefined) {
        // ✅ CORRECCIÓ CLAU:
        // En lloc de 'as any', fem un cast al tipus específic que Supabase espera per aquesta columna.
        // Això satisfà l'Eslint i manté la seguretat de tipus relativa a la DB.
        updatePayload.report_data = results.reportData as AuditRow['report_data'];
      }
    }

    const { error } = await supabaseAdmin
      .from('web_audits')
      .update(updatePayload)
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
  async getAuditsByUserId(userId: string): Promise<AuditDTO[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('web_audits')
      .select('*')
      .eq('user_id', userId) // 👈 Filtrem per ID, molt més robust
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(this.mapToDTO);
  }

  // CAS 1: Des del Dashboard (Tenim ID segur)
  async createAuditForUser(url: string, userId: string, email: string): Promise<AuditDTO> {
    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin
      .from('web_audits')
      .insert({
        url,
        user_id: userId, // ✅ Clau
        email: email,
        status: 'processing'
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToDTO(data);
  }

  // CAS 2: Des de la Landing (Només tenim Email)
  async createPublicAudit(url: string, email: string): Promise<AuditDTO> {
    const supabaseAdmin = createAdminClient();

    // Opcional: Buscar si ja existeix un usuari amb aquest email per lligar-ho?
    // Per ara, ho guardem sense user_id (o amb un user_id temporal si la taula ho requereix)
    // NOTA: Si la taula 'web_audits' té 'user_id' com NOT NULL, necessitem una estratègia aquí.
    // L'estratègia habitual és crear un usuari "fantasma" o deixar el camp nullable.
    // Assumint que user_id pot ser null o gestionem el registre després.

    const { data, error } = await supabaseAdmin
      .from('web_audits')
      .insert({
        url,
        email: email,
        status: 'processing'
        // user_id: null (si la DB ho permet)
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToDTO(data);
  }
  async getAllLight(): Promise<AuditSummary[]> {
    // ❌ ABANS: const supabase = await createClient();
    // Aquest client respecta RLS, per això només veus les teves.

    // ✅ ARA: Fem servir el client Admin (Service Role)
    // Aquest client té "superpoders" i ho veu tot.
    // És segur fer-ho aquí perquè l'Action 'getAdminAudits' ja ha verificat el login.
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


  // Per al detall (més endavant), sí que voldrem el report_data
  async getById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('web_audits')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }
}