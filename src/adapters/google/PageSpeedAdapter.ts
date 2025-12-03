import { IWebScanner, ScanResult, AuditIssue } from '@/adapters/IWebScanner';

export class PageSpeedAdapter implements IWebScanner {
  private apiKey: string;
  private apiUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async scanUrl(url: string): Promise<ScanResult> {
    // Demanem categories: PERFORMANCE, SEO, BEST_PRACTICES, ACCESSIBILITY
    const endpoint = `${this.apiUrl}?url=${encodeURIComponent(url)}&key=${this.apiKey}&category=PERFORMANCE&category=SEO&category=ACCESSIBILITY&strategy=mobile`;

    const response = await fetch(endpoint);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const lighthouse = data.lighthouseResult;

    // 1. Extraure Puntuacions
    const performanceScore = Math.round((lighthouse.categories.performance?.score || 0) * 100);
    const seoScore = Math.round((lighthouse.categories.seo?.score || 0) * 100);

    // 2. Extraure la Captura de Pantalla (Base64)
    // Google la torna a 'lighthouse.audits["final-screenshot"].details.data'
    const screenshot = lighthouse.audits['final-screenshot']?.details?.data;

    // 3. Extraure Problemes (Issues)
    // Busquem audits que tinguin un score baix (< 0.9) i que siguin rellevants
    const issues: AuditIssue[] = [];
    const auditsObj = lighthouse.audits;

    // Llista d'IDs d'auditoria que ens interessen (Google en té molts)
    const criticalAudits = [
        'first-contentful-paint',
        'largest-contentful-paint',
        'cumulative-layout-shift',
        'server-response-time',
        'render-blocking-resources',
        'uses-optimized-images',
        'meta-description',
        'document-title',
        'link-text'
    ];

    criticalAudits.forEach((key) => {
        const audit = auditsObj[key];
        // Si existeix i la puntuació no és perfecta (< 0.9) o és informativa
        if (audit && typeof audit.score === 'number' && audit.score < 0.9) {
            issues.push({
                id: key,
                title: audit.title,
                description: audit.description,
                score: audit.score,
                displayValue: audit.displayValue
            });
        }
    });

    return {
      seoScore,
      performanceScore,
      screenshot, // Ara tenim la foto!
      issues,     // Ara tenim la llista de problemes!
      reportData: data // Guardem l'original per si de cas
    };
  }
}