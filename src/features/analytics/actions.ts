'use server';

import { headers } from 'next/headers';
import { analyticsRepository } from '@/services/container';
import { AnalyticsEventDTO } from '@/types/models';
import { UAParser } from 'ua-parser-js';

type AnalyticsPayload = {
  event_name: string;
  path: string;
  session_id: string;
  referrer?: string;
  duration?: number;
  meta?: Record<string, unknown>;
};

// 👇 1. DEFINIM EL TIPUS DE RETORN EXPLÍCITAMENT
type TrackEventResponse = {
  success: boolean;
  eventId: number | null; // Pot ser un número o null si falla
};

// 👇 2. APLIQUEM EL TIPUS A LA PROMESA DE LA FUNCIÓ
export async function trackEventAction(data: AnalyticsPayload): Promise<TrackEventResponse> {
  try {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';

    // Parseig del User Agent
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    const isDev = process.env.NODE_ENV === 'development';

    const country = headersList.get('x-vercel-ip-country') || (isDev ? 'ES' : null);
    const city = headersList.get('x-vercel-ip-city') || (isDev ? 'Girona' : null);

    const eventDTO: AnalyticsEventDTO = {
      event_name: data.event_name,
      path: data.path,
      session_id: data.session_id,
      referrer: data.referrer,
      duration: data.duration,
      meta: {
        ...data.meta,
        raw_ua: userAgent,
        screen_resolution: data.meta?.screen_width
      },
      geo: { country, city },
      device: {
        type: result.device.type || 'desktop',
        browser: result.browser.name || 'Unknown',
        os: result.os.name || 'Unknown'
      }
    };

    // Deleguem al repositori
    const eventId = await analyticsRepository.trackEvent(eventDTO);

    // 👇 3. RETORNEM L'OBJECTE AMB LA FORMA CORRECTA
    return { success: true, eventId };

  } catch (err) {
    console.error("💥 Error en analytics action:", err);
    // 👇 4. RETORNEM UN FALLBACK SEGUR EN CAS D'ERROR
    return { success: false, eventId: null };
  }
}

// L'acció d'actualitzar durada es manté igual
export async function updateSessionDurationAction(eventId: number, duration: number) {
  try {
    await analyticsRepository.updateDuration(eventId, duration);
    return { success: true };
  } catch (err) {
    console.error("💥 Error en analytics action:", err)
    return { success: false };
  }
}