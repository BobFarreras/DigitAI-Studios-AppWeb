import { createClient } from '@/lib/supabase/server'; 
import { IAnalyticsRepository } from '../interfaces/IAnalyticsRepository';
import { AnalyticsEventDTO } from '@/types/models';

export class SupabaseAnalyticsRepository implements IAnalyticsRepository {
  
  async trackEvent(event: AnalyticsEventDTO): Promise<void> {
    const supabase = await createClient();
    
    // ✅ CORRECCIÓ: Fem 'as any' al meta per satisfer el tipus Json de Supabase
    // i assegurem que les columnes coincideixen amb el que has generat.
    const { error } = await supabase.from('analytics_events').insert({
      event_name: event.event_name,
      path: event.path,
      session_id: event.session_id,
      meta: event.meta as import('@/types/database.types').Json // 👈 Cast correcte al tipus Json de Supabase
    });

    if (error) {
        console.error("Error tracking analytics:", error);
    }
  }

  async getEventsLast7Days(): Promise<AnalyticsEventDTO[]> {
    // ✅ CORRECCIÓ: Eliminem la variable 'supabase' si no l'usem encara
    // const supabase = await createClient(); 
    
    return []; // Retorn buit temporalment fins que implementem el dashboard
  }
}