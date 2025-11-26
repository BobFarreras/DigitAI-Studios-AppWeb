import { IWebScanner, ScanResult } from '../IWebScanner';

export class PageSpeedAdapter implements IWebScanner {
  private apiKey: string;
  private baseUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async scanUrl(url: string): Promise<ScanResult> {
    // Construïm la URL de l'API de Google
    // Demanem categories: PERFORMANCE i SEO
    const endpoint = `${this.baseUrl}?url=${encodeURIComponent(url)}&key=${this.apiKey}&category=PERFORMANCE&category=SEO&strategy=MOBILE`;

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        // Important: Next.js guarda caché dels fetchs. Aquí volem dades fresques.
        cache: 'no-store' 
      });

      if (!response.ok) {
        throw new Error(`Google API Error: ${response.statusText}`);
      }

      const data = await response.json();

      // MAPPING: Traduïm la resposta complexa de Google al nostre format simple
      const lighthouse = data.lighthouseResult;
      
      return {
        // Google torna 0-1, nosaltres volem 0-100
        performanceScore: Math.round((lighthouse.categories.performance?.score || 0) * 100),
        seoScore: Math.round((lighthouse.categories.seo?.score || 0) * 100),
        
        // Guardem algunes dades extra interessants pel report
        reportData: {
            finalUrl: lighthouse.finalUrl,
            timing: lighthouse.timing,
            audits: {
                // Agafem només auditories clau per no omplir la DB de brossa
                'lcp': lighthouse.audits['largest-contentful-paint'],
                'cls': lighthouse.audits['cumulative-layout-shift'],
                'seo-issues': lighthouse.audits['meta-description'] // Exemple
            }
        }
      };

    } catch (error) {
      console.error('[PageSpeedAdapter] Error scanning:', error);
      // Retornem 0 en cas d'error per no trencar el flux, o fem throw segons preferència
      throw error;
    }
  }
}