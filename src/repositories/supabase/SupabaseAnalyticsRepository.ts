import { createClient, createAdminClient } from '@/lib/supabase/server'; // 👈 Afegim createAdminClient
import { AnalyticsEventDTO } from '@/types/models';
import { Database, Json } from '@/types/database.types';
import {
  IAnalyticsRepository,
  DailyStats,
  PageStat,
  DeviceStat,

  StatItem // 👈 Assegura't d'importar aquest tipus nou que vam crear
} from '../interfaces/IAnalyticsRepository';

type AnalyticsInsert = Database['public']['Tables']['analytics_events']['Insert'];

export class SupabaseAnalyticsRepository implements IAnalyticsRepository {

  // 🟢 CORRECCIÓ: Ara prometem retornar un número (ID) o null
  async trackEvent(event: AnalyticsEventDTO): Promise<number | null> {
    const supabaseAdmin = createAdminClient();

    const payload: AnalyticsInsert = {
      event_name: event.event_name,
      path: event.path,
      session_id: event.session_id,
      meta: (event.meta as unknown as Json) || null,
      duration_seconds: event.duration || 0,
      referrer: event.referrer || null,
      country: event.geo?.country || null,
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
      console.error("Error al Repositori:", error.message);
      return null; // ✅ Ara això és vàlid
    }

    return data.id; // ✅ Ara això és vàlid
  }
  // 👇 NOU MÈTODE
  async updateDuration(eventId: number, duration: number): Promise<void> {
    const supabaseAdmin = createAdminClient();

    // Evitem actualitzacions absurdes (ex: 0 segons o negatius)
    if (duration <= 0) return;

    await supabaseAdmin
      .from('analytics_events')
      .update({ duration_seconds: duration })
      .eq('id', eventId);
  }
  async getLast7DaysStats(): Promise<DailyStats[]> {
    const supabase = await createClient();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 1. AFEGIM duration_seconds A LA QUERY
    const { data, error } = await supabase
      .from('analytics_events')
      .select('created_at, session_id, duration_seconds')
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    if (error || !data) return [];

    // Map per agrupar per dia
    const statsMap = new Map<string, { views: number; sessions: Set<string>; duration: number }>();

    // Inicialitzem els últims 7 dies a 0
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
      statsMap.set(key, { views: 0, sessions: new Set(), duration: 0 });
    }

    data.forEach((row) => {
      if (row.created_at) {
        const date = new Date(row.created_at);
        const key = date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });

        if (statsMap.has(key)) {
          const entry = statsMap.get(key)!;
          entry.views++;
          if (row.session_id) entry.sessions.add(row.session_id);
          // 2. ACUMULEM LA DURADA
          entry.duration += row.duration_seconds || 0;
        }
      }
    });

    return Array.from(statsMap.entries()).map(([date, val]) => ({
      date,
      views: val.views,
      visitors: val.sessions.size,
      totalDuration: val.duration // 👈 Retornem la suma
    }));
  }

  // 🛠️ MÈTODE CORREGIT AMB TOTS ELS TIPUS DE RETORN
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

    // 1. Seleccionem TOTS els camps necessaris
    // IMPORTANT: Assegura't que aquests camps existeixen a la DB i als tipus generats
    // Si 'referrer' no existeix, regenera els tipus (npx supabase gen types...)
    const { data, error } = await supabase
      .from('analytics_events')
      .select('path, device_type, country, session_id, referrer, browser, os')
      .gte('created_at', thirtyDaysAgo.toISOString());

    if (error || !data) {
      return { topPages: [], devices: [], countries: [], referrers: [], browsers: [], os: [] };
    }

    // 2. Inicialitzem els Maps
    const pagesMap = new Map<string, number>();
    const devicesMap = new Map<string, number>();
    const countryMap = new Map<string, Set<string>>(); // Set per usuaris únics
    const referrerMap = new Map<string, number>();
    const browserMap = new Map<string, number>();
    const osMap = new Map<string, number>();

    // 3. Processem les dades
    data.forEach(row => {
      // Pages
      const cleanPath = row.path || '/';
      pagesMap.set(cleanPath, (pagesMap.get(cleanPath) || 0) + 1);

      // Devices
      const dev = row.device_type === 'mobile' ? 'Mòbil' : row.device_type === 'tablet' ? 'Tauleta' : 'PC';
      devicesMap.set(dev, (devicesMap.get(dev) || 0) + 1);

      // Countries (Set)
      const country = row.country === 'Unknown' ? 'Desconegut' : row.country;
      if (country) {
        if (!countryMap.has(country)) countryMap.set(country, new Set());
        if (row.session_id) countryMap.get(country)!.add(row.session_id);
      }

      // Referrers
      let ref = row.referrer || 'Directe';
      try {
        if (ref.startsWith('http')) ref = new URL(ref).hostname.replace('www.', '');
      } catch { }
      referrerMap.set(ref, (referrerMap.get(ref) || 0) + 1);

      // Browsers
      const browser = row.browser || 'Altres';
      browserMap.set(browser, (browserMap.get(browser) || 0) + 1);

      // OS
      const os = row.os || 'Altres';
      osMap.set(os, (osMap.get(os) || 0) + 1);
    });

    // 4. Funcions auxiliars per formatar a StatItem[]
    const toStatArray = (map: Map<string, number>, colors: string[]): StatItem[] =>
      Array.from(map.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value], i) => ({ name, value, color: colors[i % colors.length] }));

    // 5. Generem els arrays finals
    const referrers = toStatArray(referrerMap, ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe']);
    const browsers = toStatArray(browserMap, ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#fef3c7']);
    const os = toStatArray(osMap, ['#ec4899', '#f472b6', '#fbcfe8', '#fce7f3', '#fdf2f8']);

    const countries: StatItem[] = Array.from(countryMap.entries())
      .map(([name, set]) => ({
        name: name === 'Unknown' ? '🌍 Desconegut' : name,
        value: set.size,
        color: '#10b981'
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const topPages: PageStat[] = Array.from(pagesMap.entries())
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 15);

    const deviceColors = ['#8884d8', '#00C49F', '#FFBB28'];
    const devices: DeviceStat[] = Array.from(devicesMap.entries())
      .map(([name, value], index) => ({
        name,
        value,
        fill: deviceColors[index % deviceColors.length]
      }));

    // ✅ CORRECCIÓ FINAL: Retornem TOTS els camps que la interfície espera
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