// 1. Importem les Classes (els plànols)
import { SupabaseAuditRepository } from '@/repositories/supabase/SupabaseAuditRepository';
import { SupabasePostRepository } from '@/repositories/supabase/SupabasePostRepository';
import { SupabaseAnalyticsRepository } from '@/repositories/supabase/SupabaseAnalyticsRepository';

import { AuditService } from '@/services/AuditService';
import { PostService } from '@/services/PostService';

import { PageSpeedAdapter } from '@/adapters/google/PageSpeedAdapter';

// ---------------------------------------------------------------------------
// 2. Instanciem els Repositoris (Capa de Dades)
// ---------------------------------------------------------------------------
export const auditRepository = new SupabaseAuditRepository();
export const postRepository = new SupabasePostRepository(); // 👈 Aquí neix la instància
// 👇 Instanciem Analytics
export const analyticsRepository = new SupabaseAnalyticsRepository();
// ---------------------------------------------------------------------------
// 3. Instanciem els Adaptadors (Capa Externa)
// ---------------------------------------------------------------------------
const googleKey = process.env.GOOGLE_PAGESPEED_API_KEY || '';
export const webScanner = new PageSpeedAdapter(googleKey);

// ---------------------------------------------------------------------------
// 4. Instanciem els Serveis (Capa de Negoci)
//    Aquí fem la Injecció de Dependències
// ---------------------------------------------------------------------------
export const auditService = new AuditService(auditRepository, webScanner);

// El PostService necessita el postRepository per funcionar
export const postService = new PostService(postRepository);

