import { SupabaseAuditRepository } from '@/repositories/supabase/SupabaseAuditRepository';
import { PageSpeedAdapter } from '@/adapters/google/PageSpeedAdapter';
import { AuditService } from '@/services/AuditService';

// 1. Repositori (DB)
export const auditRepository = new SupabaseAuditRepository();

// 2. Escàner (Google)
// Assegura't de tenir la variable d'entorn, o posa un string buit per fallar controladament
const googleKey = process.env.GOOGLE_PAGESPEED_API_KEY || '';
export const webScanner = new PageSpeedAdapter(googleKey);

// 3. Servei (El que utilitzarem a les Actions)
export const auditService = new AuditService(auditRepository, webScanner);