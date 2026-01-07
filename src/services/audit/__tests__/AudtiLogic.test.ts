import { describe, it, expect } from 'vitest';
import { calculateAuditScore, isPrestigeUrl } from '../AuditLogic';
import { PRESTIGE_CONFIG } from '@/config/prestige-urls';

describe('AuditLogic (Prestige System)', () => {
  
  // 1. Testejem el detector d'URLs
  it('should detect prestige URLs correctly', () => {
    // ✅ COINCIDÈNCIA EXACTA AMB src/config/prestige.ts
    
    // 1. RibotFlow
    expect(isPrestigeUrl('https://ribotflow.com')).toBe(true);
    
    // 2. DigitAi Studios (LA QUE FALLAVA)
    // Assegura't que poses .com, que és el que tens a la config ara
    expect(isPrestigeUrl('https://digitaistudios.com')).toBe(true); 
    
    // 3. Localhost (si el tens a la config)
    expect(isPrestigeUrl('http://localhost:3000')).toBe(true);

    // ❌ CASOS NEGATIUS (Han de donar false)
    expect(isPrestigeUrl('https://google.com')).toBe(false);
    expect(isPrestigeUrl('https://digitai.studios')).toBe(false); // Aquesta ja no és vàlida, ha de donar false
  });

  // 2. Testejem el càlcul de la nota (Boost)
  it('should BOOST score for prestige sites with bad metrics', () => {
    const vipUrl = 'https://digitaistudios.com';
    const badMetrics = { performance: 0.1, seo: 0.2, accessibility: 0.1 }; 

    const score = calculateAuditScore(vipUrl, badMetrics);

    // Ha de pujar la nota artificialment
    expect(score).toBeGreaterThanOrEqual(PRESTIGE_CONFIG.BOOST.MIN_SCORE);
  });

  // 3. Testejem webs normals
  it('should NOT boost score for normal sites', () => {
    const normalUrl = 'https://web-lenta.com';
    const badMetrics = { performance: 0.2, seo: 0.2, accessibility: 0.2 }; 

    const score = calculateAuditScore(normalUrl, badMetrics);

    // Ha de mantenir la nota baixa
    expect(score).toBeLessThan(50); 
  });

  // 4. Testejem que no baixi la nota si és excel·lent
  it('should keep original score if it is higher than the boost', () => {
    const vipUrl = 'https://ribotflow.com';
    const perfectMetrics = { performance: 1, seo: 1, accessibility: 1 }; // 100

    const score = calculateAuditScore(vipUrl, perfectMetrics);

    expect(score).toBe(100);
  });
});