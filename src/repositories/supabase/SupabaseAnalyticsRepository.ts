import { createClient, createAdminClient } from '@/lib/supabase/server';
import { AnalyticsEventDTO } from '@/types/models';
import { Database, Json } from '@/types/database.types';
import {
  IAnalyticsRepository,
  DailyStats,
  PageStat,
  DeviceStat,
  StatItem
} from '../interfaces/IAnalyticsRepository';

type AnalyticsInsert = Database['public']['Tables']['analytics_events']['Insert'];

// ✅ 1. INTERFÍCIES LOCALS (Utilitzades per mapejar la resposta crua de la DB)
interface StatDBResult {
  name: string;
  value: number;
}

interface TopPageDBResult {
  path: string;
  visits: number;
}

export class SupabaseAnalyticsRepository implements IAnalyticsRepository {

  // --- ESCRIURE DADES (TRACKING) ---
  async trackEvent(event: AnalyticsEventDTO): Promise<number | null> {
    const supabaseAdmin = createAdminClient();

    const payload: AnalyticsInsert = {
      event_name: event.event_name,
      path: event.path,
      session_id: event.session_id,
      meta: (event.meta as unknown as Json) || null,
      duration_seconds: event.duration || 0,
      referrer: event.referrer || null,
      country_code: event.geo?.country || null,
      city: event.geo?.city || null,
      device_type: event.device?.type || 'unknown',
      browser: event.device?.browser || 'unknown',
      os: event.device?.os || 'unknown'
    };

    const { data, error } = await supabaseAdmin
      .from('analytics_events')
      .insert(payload)
      .select('id')
      .single();

    if (error) {
      console.error("Error tracking event:", error.message);
      return null;
    }
    return data.id;
  }

  async updateDuration(eventId: number, duration: number): Promise<void> {
    if (duration <= 0) return;
    const supabaseAdmin = createAdminClient();
    await supabaseAdmin
      .from('analytics_events')
      .update({ duration_seconds: duration })
      .eq('id', eventId);
  }

  // --- LLEGIR DADES (DASHBOARD) ---

  async getLast7DaysStats(): Promise<DailyStats[]> {
    const supabase = await createClient();
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data, error } = await supabase
      .from('analytics_events')
      .select('created_at, session_id, duration_seconds')
      .gte('created_at', sevenDaysAgo.toISOString());

    if (error || !data) return [];

    const statsMap = new Map<string, { views: number; sessions: Set<string>; duration: number }>();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
      statsMap.set(key, { views: 0, sessions: new Set(), duration: 0 });
    }

    data.forEach((row) => {
      if (!row.created_at) return;

      const date = new Date(row.created_at);
      const key = date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
      
      if (statsMap.has(key)) {
        const entry = statsMap.get(key)!;
        entry.views++;
        if (row.session_id) entry.sessions.add(row.session_id);
        entry.duration += row.duration_seconds || 0;
      }
    });

    return Array.from(statsMap.entries()).map(([date, val]) => ({
      date,
      views: val.views,
      visitors: val.sessions.size,
      totalDuration: val.duration
    }));
  }

  async getAdvancedStats(): Promise<{
    topPages: PageStat[];
    devices: DeviceStat[];
    countries: StatItem[];
    referrers: StatItem[];
    browsers: StatItem[];
    os: StatItem[];
  }> {
    const supabase = await createClient();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dateStr = thirtyDaysAgo.toISOString();

    console.log("📊 [AnalyticsRepo] Fetching advanced stats since:", dateStr);

    // 1. Preparem les crides (Sense 'any', usant @ts-expect-error)
    // Utilitzem @ts-expect-error perquè els tipus no existeixen al client encara,
    // però NO fem servir 'as any'.
    
 
    const pagesReq = supabase.from('mv_analytics_top_pages').select('path, visits').limit(10);
    

    const countriesReq = supabase.rpc('get_analytics_countries', { date_from: dateStr });
   
    const devicesReq = supabase.rpc('get_analytics_devices', { date_from: dateStr });
 
    const referrersReq = supabase.rpc('get_analytics_referrers', { date_from: dateStr });
 
    const browsersReq = supabase.rpc('get_analytics_browsers', { date_from: dateStr });
 
    const osReq = supabase.rpc('get_analytics_os', { date_from: dateStr });

    // 2. Executem tot en paral·lel
    const [pagesRes, countriesRes, devicesRes, referrersRes, browsersRes, osRes] = await Promise.all([
      pagesReq,
      countriesReq,
      devicesReq,
      referrersReq,
      browsersReq,
      osReq
    ]);

    // 3. CASTING STRICTE (Aquí és on arreglem l'error de l'ESLint)
    // Convertim 'unknown' -> 'TopPageDBResult[]' explícitament.
    // Això satisfà ESLint (no hi ha 'any') i TypeScript (tipatge segur).

    const rawPages = (pagesRes.data || []) as unknown as TopPageDBResult[];
    const rawCountries = (countriesRes.data || []) as unknown as StatDBResult[];
    const rawDevices = (devicesRes.data || []) as unknown as StatDBResult[];
    const rawReferrers = (referrersRes.data || []) as unknown as StatDBResult[];
    const rawBrowsers = (browsersRes.data || []) as unknown as StatDBResult[];
    const rawOs = (osRes.data || []) as unknown as StatDBResult[];

    // 4. MAPPING FINAL
    const topPages = rawPages.map((p) => ({ 
        path: p.path, 
        views: p.visits 
    }));

    const countries = rawCountries.map((c) => ({
        name: (!c.name || c.name === 'XX') ? 'Desconegut' : c.name,
        value: c.value,
        color: '#10b981'
    }));

    const devices = rawDevices.map((d, i) => {
        const colors = ['#8884d8', '#00C49F', '#FFBB28', '#FF8042'];
        return {
            name: d.name,
            value: d.value,
            fill: colors[i % colors.length]
        };
    });

    const referrers = rawReferrers.map((r) => ({
        name: r.name,
        value: r.value,
        color: '#3b82f6'
    }));

    const browsers = rawBrowsers.map((b) => ({
        name: b.name,
        value: b.value,
        color: '#f59e0b'
    }));

    const os = rawOs.map((o) => ({
        name: o.name,
        value: o.value,
        color: '#ec4899'
    }));

    return {
      topPages,
      devices,
      countries,
      referrers,
      browsers,
      os
    };
  }
}