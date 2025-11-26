'use server';

import { analyticsRepository } from '@/services/container'; // 👈 Importem del container
import { AnalyticsEventDTO } from '@/types/models';

export async function trackEventAction(data: AnalyticsEventDTO) {
  // Simplement deleguem al repositori
  // No cal try/catch aquí si el repositori ja gestiona l'error o volem que sigui silenciós
  await analyticsRepository.trackEvent(data);
}