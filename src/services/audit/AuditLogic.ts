import { PRESTIGE_CONFIG } from '@/config/prestige-urls';
import { AuditMetrics } from '@/types/audit';

// Helper reutilitzable per detectar VIPs
export function isPrestigeUrl(url: string): boolean {
  try {
    const cleanUrl = url.toLowerCase();
    return PRESTIGE_CONFIG.URLS.some(domain => cleanUrl.includes(domain));
  } catch {
    return false;
  }
}

// Funció principal (Sense 'any')
export function calculateAuditScore(url: string, metrics: AuditMetrics): number {
  // 1. Càlcul base
  let rawScore = (metrics.performance + metrics.seo + metrics.accessibility) / 3 * 100;

  // 2. Comprovació Prestigi
  if (isPrestigeUrl(url)) {
    console.log(`🚀 [AuditLogic] Applying Prestige Boost to: ${url}`);
    
    // Apliquem lògica de boost: Màxim entre la nota real o la mínima VIP
    rawScore = Math.max(rawScore, PRESTIGE_CONFIG.BOOST.MIN_SCORE);
  }

  return Math.round(rawScore);
}