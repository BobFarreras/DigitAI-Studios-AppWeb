import { SupabaseAuditRepository } from '@/repository/supabase-audit.repository';

// Singleton bàsic per a Next.js App Router
export const auditRepository = new SupabaseAuditRepository();

// Si en el futur tens un AuthService, el poses aquí:
// export const authService = new AuthService();