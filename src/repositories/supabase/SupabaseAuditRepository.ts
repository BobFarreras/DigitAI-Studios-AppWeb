import { createClient, createAdminClient } from '@/lib/supabase/server'; // 👈 Importa l'Admin
import { IAuditRepository } from '../interfaces/IAuditRepository';
import { AuditDTO } from '@/types/models';
import { Database } from '@/types/database.types';

type AuditRow = Database['public']['Tables']['web_audits']['Row'];

export class SupabaseAuditRepository implements IAuditRepository {
  
  private mapToDTO(row: AuditRow): AuditDTO {
    // ... (el mateix codi de mapToDTO que tenies)
    return {
      id: row.id,
      url: row.url,
      status: row.status as AuditDTO['status'],
      seoScore: row.seo_score,
      performanceScore: row.performance_score,
      createdAt: row.created_at ? new Date(row.created_at) : new Date(),
      reportData: row.report_data,
    };
  }

  // ... (getAuditsByUserEmail i getAuditById es queden igual, usant createClient normal)
  async getAuditsByUserEmail(email: string): Promise<AuditDTO[]> {
      const supabase = await createClient(); // Client normal (respecta RLS)
      // ... resta del codi
      const { data, error } = await supabase.from('web_audits').select('*').eq('email', email).order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data.map(this.mapToDTO);
  }

  async getAuditById(id: string): Promise<AuditDTO | null> {
      const supabase = await createClient(); // Client normal
      // ... resta del codi
      const { data } = await supabase.from('web_audits').select('*').eq('id', id).single();
      return data ? this.mapToDTO(data) : null;
  }

  // 👇 AQUÍ ESTÀ LA MÀGIA I ELS CONSOLES
  async createAudit(url: string, email: string): Promise<AuditDTO> {
    console.log(`[Repo] Creant auditoria per: ${email} - URL: ${url}`);
    
    // Usem el CLIENT ADMIN per saltar-nos la restricció de lectura
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
      console.error('[Repo] Error Supabase:', error); // Log d'error
      throw new Error(`Error creating audit: ${error.message}`);
    }
    
    console.log('[Repo] Auditoria creada OK:', data.id); // Log d'èxit
    return this.mapToDTO(data);
  }

  async updateStatus(id: string, status: AuditDTO['status'], data?: AuditDTO['reportData']): Promise<void> {
     // Aquest també pot necessitar Admin si l'actualitza un worker, 
     // però si ho fa l'usuari, usa createClient()
     const supabaseAdmin = createAdminClient(); 
     await supabaseAdmin.from('web_audits').update({
        status: status,
        report_data: data as Database['public']['Tables']['web_audits']['Row']['report_data'] // type assertion to Json | undefined
     }).eq('id', id);
  }
}