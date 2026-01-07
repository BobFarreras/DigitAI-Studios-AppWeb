import { describe, it, expect } from 'vitest';
import { calculateAuditScore, isPrestigeUrl } from '@/services/audit/AuditLogic';
import { PRESTIGE_CONFIG } from '@/config/prestige-urls';

describe('AuditLogic (Prestige System)', () => {
  
  // 1. Testejem el detector d'URLs
  it('should detect prestige URLs correctly', () => {
    // Casos positius (Han de coincidir amb src/config/prestige.ts)
    expect(isPrestigeUrl('https://ribotflow.com')).toBe(true);
    expect(isPrestigeUrl('http://getsalutflow.com/pricing')).toBe(true);
    
    // ✅ CORRECCIÓ: Posem el domini nou que tens a la config
    expect(isPrestigeUrl('https://digitaistudios.com')).toBe(true); 
    
    // Si tens localhost a la config, també hauria de passar
    expect(isPrestigeUrl('http://localhost:3000')).toBe(true);

    // Casos negatius
    expect(isPrestigeUrl('https://google.com')).toBe(false);
    expect(isPrestigeUrl('https://una-web-qualsevol.com')).toBe(false);
  });

  // 2. Testejem el càlcul de la nota
  it('should BOOST score for prestige sites with bad metrics', () => {
    // Fem servir una URL que sabem que és VIP
    const vipUrl = 'https://digitaistudios.com';
    const badMetrics = { performance: 0.1, seo: 0.2, accessibility: 0.1 }; 

    const score = calculateAuditScore(vipUrl, badMetrics);

    // Ha de ser com a mínim la nota configurada
    expect(score).toBeGreaterThanOrEqual(PRESTIGE_CONFIG.BOOST.MIN_SCORE);
  });

  it('should NOT boost score for normal sites', () => {
    const normalUrl = 'https://web-lenta.com';
    const badMetrics = { performance: 0.2, seo: 0.2, accessibility: 0.2 }; // ~20

    const score = calculateAuditScore(normalUrl, badMetrics);

    // Ha de ser la nota real baixa (~20), mai la nota VIP (90)
    expect(score).toBeLessThan(50); 
  });

  it('should keep original score if it is higher than the boost', () => {
    const vipUrl = 'https://ribotflow.com';
    const perfectMetrics = { performance: 1, seo: 1, accessibility: 1 }; // 100

    const score = calculateAuditScore(vipUrl, perfectMetrics);

    // Ha de mantenir el 100
    expect(score).toBe(100);
  });
});