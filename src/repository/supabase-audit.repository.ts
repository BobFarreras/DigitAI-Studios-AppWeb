import { createClient } from '@/lib/supabase/server';
import { IAuditRepository, AuditDTO } from '@/domain/audit';
import { Database } from '@/types/database.types';

// Tipus directe de la DB (el que genera Supabase)
type AuditRow = Database['public']['Tables']['web_audits']['Row'];

export class SupabaseAuditRepository implements IAuditRepository {
  
  // Mapper: Converteix de SQL (snake_case, nulls) a App (camelCase, Dates)
  // Aquí solucionem el teu error de TS(2769) centralitzadament
  private mapToDTO(row: AuditRow): AuditDTO {
    return {
      id: row.id,
      url: row.url,
      // Forcem el tipatge perquè sabem que l'enum coincideix, o fem switch si cal
      status: row.status as AuditDTO['status'], 
      seoScore: row.seo_score,
      performanceScore: row.performance_score,
      // ✅ SOLUCIÓ ERROR DATA: Validem si és null
      createdAt: row.created_at ? new Date(row.created_at) : new Date(),
      reportData: row.report_data,
    };
  }

  async getAuditsByUserEmail(email: string): Promise<AuditDTO[]> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('web_audits')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Error fetching audits: ${error.message}`);
    
    return data.map(this.mapToDTO);
  }

  async getAuditById(id: string): Promise<AuditDTO | null> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('web_audits')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    
    return this.mapToDTO(data);
  }

  async createAudit(url: string, email: string): Promise<AuditDTO> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('web_audits')
      .insert({
        url,
        email,
        status: 'processing'
      })
      .select()
      .single();

    if (error) throw new Error(`Error creating audit: ${error.message}`);
    
    return this.mapToDTO(data);
  }

  async updateStatus(id: string, status: AuditDTO['status'], data?: Record<string, unknown>): Promise<void> {
    const supabase = await createClient();
    // Aquí implementaries l'update...
    await supabase.from('web_audits').update({
        status: status,
        report_data: data ? JSON.parse(JSON.stringify(data)) : undefined
    }).eq('id', id);
  }
}