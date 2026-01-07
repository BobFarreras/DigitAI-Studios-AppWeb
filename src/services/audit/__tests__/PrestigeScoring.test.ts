import { describe, it, expect } from 'vitest';
import { calculateAuditScore, isPrestigeUrl } from '../AuditLogic'; // (Ho crearem al Pas 3)
import { PRESTIGE_CONFIG } from '@/config/prestige-urls';

describe('Prestige Logic', () => {
  
  it('detects prestige URLs correctly', () => {
    expect(isPrestigeUrl('https://ribotflow.com/pricing')).toBe(true);
    expect(isPrestigeUrl('https://random-site.com')).toBe(false);
  });

  it('boosts score for prestige sites even with bad metrics', () => {
    const badMetrics = { performance: 0.1, seo: 0.2, accessibility: 0.1 }; // Mitjana real: 13
    
    // Per a una web normal
    const normalScore = calculateAuditScore('https://bad-site.com', badMetrics);
    expect(normalScore).toBeLessThan(50);

    // Per a una web VIP
    const vipScore = calculateAuditScore('https://ribotflow.com', badMetrics);
    expect(vipScore).toBeGreaterThanOrEqual(PRESTIGE_CONFIG.BOOST.MIN_SCORE);
  });
});