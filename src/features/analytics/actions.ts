'use server';

import { analyticsRepository } from '@/services/container';
import { AnalyticsEventDTO } from '@/types/models';
import { headers } from 'next/headers';
// ✅ CORRECCIÓ: Afegim claus { } per importar la classe correctament
import { UAParser } from 'ua-parser-js';

export async function trackEventAction(data: AnalyticsEventDTO) {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  
  // Ara sí que funcionarà el 'new'
  const parser = new UAParser(userAgent);
  const deviceResult = parser.getResult();

  // Detecció de Geolocalització (Vercel o Fallback)
  const country = headersList.get('x-vercel-ip-country') || 'Unknown';
  const city = headersList.get('x-vercel-ip-city') || 'Unknown';

  // Preparem l'objecte complet
  const enrichedData: AnalyticsEventDTO = {
    ...data,
    geo: {
      country,
      city
    },
    device: {
      type: deviceResult.device.type || 'desktop',
      browser: deviceResult.browser.name || 'Unknown',
      os: deviceResult.os.name || 'Unknown'
    }
  };

  await analyticsRepository.trackEvent(enrichedData);
}