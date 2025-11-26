import { createClient } from '@/lib/supabase/server';
import { AnalyticsEventDTO } from '@/types/models';
// 👇 1. Importem els tipus de la DB
import { Database } from '@/types/database.types';
import { IAnalyticsRepository, DailyStats, PageStat, DeviceStat, CountryStat } from '../interfaces/IAnalyticsRepository';
// 👇 2. Creem un àlies per al tipus d'inserció d'aquesta taula concreta
// Això ens permet accedir al tipus real de la columna 'meta'
type AnalyticsInsert = Database['public']['Tables']['analytics_events']['Insert'];

export class SupabaseAnalyticsRepository implements IAnalyticsRepository {

  async trackEvent(event: AnalyticsEventDTO): Promise<void> {
    const supabase = await createClient();

    // Mapegem el DTO a les columnes de la DB
    const { error } = await supabase.from('analytics_events').insert({
      event_name: event.event_name,
      path: event.path,
      session_id: event.session_id,
      meta: event.meta as AnalyticsInsert['meta'],

      // NOVES COLUMNS
      country: event.geo?.country,
      city: event.geo?.city,
      browser: event.device?.browser,
      os: event.device?.os,
      device_type: event.device?.type,
      referrer: event.referrer,
      duration_seconds: event.duration || 0
    });

    if (error) console.error("Error tracking:", error);
  }

  async getLast7DaysStats(): Promise<DailyStats[]> {
    const supabase = await createClient();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data, error } = await supabase
      .from('analytics_events')
      .select('created_at, session_id')
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    if (error || !data) return [];

    const statsMap = new Map<string, { views: number; sessions: Set<string> }>();

    // Inicialitzem els dies a 0
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
      statsMap.set(key, { views: 0, sessions: new Set() });
    }

    data.forEach((row) => {
      // TypeScript sap que created_at pot ser null, per això el check és correcte
      if (row.created_at) {
        const date = new Date(row.created_at);
        const key = date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });

        if (statsMap.has(key)) {
          const entry = statsMap.get(key)!;
          entry.views++;
          if (row.session_id) entry.sessions.add(row.session_id);
        }
      }
    });

    return Array.from(statsMap.entries()).map(([date, val]) => ({
      date,
      views: val.views,
      visitors: val.sessions.size
    }));
  }

  // Afegeix aquest nou mètode dins la classe:
  async getAdvancedStats(): Promise<{ topPages: PageStat[]; devices: DeviceStat[]; countries: CountryStat[] }> {
    const supabase = await createClient();
    
    // 1. Agafem dades dels últims 30 dies
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabase
      .from('analytics_events')
      .select('path, device_type, country, session_id')
      .gte('created_at', thirtyDaysAgo.toISOString());

    if (error || !data) return { topPages: [], devices: [], countries: [] };

    // 2. PROCESSAMENT DE DADES (Agregació JS)
    
    // A) Top Pages
    const pagesMap = new Map<string, number>();
    // B) Devices
    const devicesMap = new Map<string, number>();
    // C) Countries (Fem servir Set per comptar usuaris únics per país, no clics)
    const countryMap = new Map<string, Set<string>>();

    data.forEach(row => {
      // Pages
      const cleanPath = row.path || '/';
      pagesMap.set(cleanPath, (pagesMap.get(cleanPath) || 0) + 1);

      // Devices (normalitzem noms)
      const dev = row.device_type === 'mobile' ? 'Mòbil' : row.device_type === 'tablet' ? 'Tauleta' : 'PC';
      devicesMap.set(dev, (devicesMap.get(dev) || 0) + 1);

      // Countries
      const country = row.country === 'Unknown' ? 'Desconegut' : row.country;
      if (country) {
          if (!countryMap.has(country)) countryMap.set(country, new Set());
          if (row.session_id) countryMap.get(country)!.add(row.session_id);
      }
    });

    // 3. FORMATAR PER A GRÀFICS

    // Top 5 Pàgines
    const topPages: PageStat[] = Array.from(pagesMap.entries())
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    // Dispositius
    const COLORS = ['#8884d8', '#00C49F', '#FFBB28']; // Lila, Verd, Groc
    const devices: DeviceStat[] = Array.from(devicesMap.entries())
      .map(([name, value], index) => ({ 
          name, 
          value, 
          fill: COLORS[index % COLORS.length] 
      }));

    // Top Països
    const countries: CountryStat[] = Array.from(countryMap.entries())
      .map(([country, set]) => ({ country, visitors: set.size }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 5);

    return { topPages, devices, countries };
  }

}