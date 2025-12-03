'use server';

import { headers } from 'next/headers';
// 👇 AQUEST ÉS EL CANVI CLAU: Importem el repositori instanciat
import { analyticsRepository } from '@/services/container'; 
import { AnalyticsEventDTO } from '@/types/models';

type AnalyticsPayload = {
  event_name: string;
  path: string;
  session_id: string;
  referrer?: string;
  duration?: number;
  meta?: Record<string, unknown>;
};

export async function trackEventAction(data: AnalyticsPayload) {
  try {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'unknown';
    
    // Construïm el DTO (Data Transfer Object) net
    const eventDTO: AnalyticsEventDTO = {
        event_name: data.event_name,
        path: data.path,
        session_id: data.session_id,
        referrer: data.referrer,
        duration: data.duration,
        meta: {
            ...data.meta,
            userAgent: userAgent
        },
        // Geo i Device es podrien extreure aquí si tinguéssim una llibreria de IP/UserAgent,
        // però per ara ho deixem que ho gestioni el repositori o es quedi en blanc.
        device: {
            type: 'unknown', // O extreure del userAgent
            browser: 'unknown',
            os: 'unknown'
        }
    };

    // 👇 Deleguem la feina bruta al Repositori
    await analyticsRepository.trackEvent(eventDTO);

    return { success: true };
  } catch (err) {
    console.error("💥 Error en analytics action:", err);
    // No retornem l'error real al client per seguretat
    return { success: false };
  }
}