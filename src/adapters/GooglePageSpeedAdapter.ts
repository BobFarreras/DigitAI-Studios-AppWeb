import { IWebScanner, ScanResult, AuditIssue } from './IWebScanner';
import { translateIssue } from '@/lib/audit-dictionary';

// 1. Definim el tipus per a l'audit "cru" que ve de l'API de Google
// Això evita els errors de "Unexpected any"
type LighthouseAuditRaw = {
  id: string;
  title: string;
  description: string;
  score: number | null;
  displayValue?: string;
  numericValue?: number;
  details?: unknown;
};

export class GooglePageSpeedAdapter implements IWebScanner {
    private apiKey?: string;
    private apiUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

    constructor(apiKey?: string) {
        this.apiKey = apiKey;
    }

    async scanUrl(url: string): Promise<ScanResult> {
        // 1. PRE-CHECK: Validem que la web existeix (evita 100% score en webs 404)
        try {
            const check = await fetch(url, { method: 'HEAD' });
            if (check.status >= 400) {
                throw new Error(`La web retorna un error ${check.status}. Verifica que sigui pública.`);
            }
        } catch (e) {
            console.error("Error connectant amb la web:", e);
            throw new Error(`No s'ha pogut accedir a la web: ${url}`);
        }

        // 2. PREPARAR URL API
        // Construïm la query string manualment per assegurar que els arrays (category) es passen bé
        const params = new URLSearchParams({
            url: url,
            strategy: 'mobile', // Mobile first, com Google vol
            locale: 'ca',       // Demanem els textos en català
        });

        let queryString = params.toString();
        
        // Afegim totes les categories d'anàlisi
        const categories = ['PERFORMANCE', 'SEO', 'ACCESSIBILITY', 'BEST_PRACTICES'];
        categories.forEach(cat => {
             queryString += `&category=${cat}`;
        });

        if (this.apiKey) {
            queryString += `&key=${this.apiKey}`;
        }

        // 3. CRIDA A GOOGLE
        const response = await fetch(`${this.apiUrl}?${queryString}`);

        if (!response.ok) {
            const errText = await response.text();
            // Gestionem errors comuns de l'API
            if (response.status === 400) throw new Error("URL invàlida o no analitzable.");
            if (response.status === 500) throw new Error("Error intern de Google PageSpeed. Prova més tard.");
            throw new Error(`Google API Error (${response.status}): ${errText}`);
        }

        const data = await response.json();
        
        // Verificació de seguretat per si l'API canvia l'estructura
        if (!data.lighthouseResult || !data.lighthouseResult.audits) {
             throw new Error("Format de resposta de Google inesperat.");
        }

        const lh = data.lighthouseResult;

        // 4. EXTRACCIÓ DE PUNTUACIONS (0-100)
        const scores = {
            performance: Math.round((lh.categories.performance?.score || 0) * 100),
            seo: Math.round((lh.categories.seo?.score || 0) * 100),
            accessibility: Math.round((lh.categories.accessibility?.score || 0) * 100),
            best_practices: Math.round((lh.categories['best-practices']?.score || 0) * 100),
        };

        // Fem un cast segur a un diccionari tipat
        const audits = lh.audits as Record<string, LighthouseAuditRaw>;

        // 5. EXTRACCIÓ DE CORE WEB VITALS (Per al Dashboard)
        // Això és el que faltava al codi antic i és vital per a la UI nova
        const metrics = {
            fcp: {
                value: audits['first-contentful-paint']?.displayValue,
                score: audits['first-contentful-paint']?.score,
                description: "Temps fins al primer contingut visible."
            },
            lcp: {
                value: audits['largest-contentful-paint']?.displayValue,
                score: audits['largest-contentful-paint']?.score,
                description: "Temps de càrrega de l'element més gran."
            },
            cls: {
                value: audits['cumulative-layout-shift']?.displayValue,
                score: audits['cumulative-layout-shift']?.score,
                description: "Estabilitat visual."
            },
            tbt: {
                value: audits['total-blocking-time']?.displayValue,
                score: audits['total-blocking-time']?.score,
                description: "Temps de bloqueig del navegador."
            },
            si: {
                value: audits['speed-index']?.displayValue,
                score: audits['speed-index']?.score,
                description: "Índex de velocitat visual."
            }
        };

        // 6. PROCESSAMENT D'ERRORS (ISSUES)
        // Filtrem qualsevol auditoria amb puntuació baixa (< 0.9)
        const issues: AuditIssue[] = Object.values(audits)
            .filter((a) => a.score !== null && a.score < 0.9 && a.details) 
            .map((a) => {
                // Traduïm el títol usant el nostre diccionari 'audit-dictionary.ts'
                const translated = translateIssue(a.id, a.title, a.description);
                return {
                    title: translated.title,
                    description: translated.description,
                    score: a.score || 0,
                    displayValue: a.displayValue
                };
            })
            // Ordenem per gravetat (score 0 primer)
            .sort((a, b) => a.score - b.score)
            .slice(0, 8); // Agafem els 8 pitjors

        // 7. RETORNAR RESULTAT FINAL
        return {
            seoScore: scores.seo,
            performanceScore: scores.performance,
            screenshot: lh.audits['final-screenshot']?.details?.data, // Base64
            issues: issues,
            metrics: metrics,
            reportData: data // Guardem el JSON original per si de cas
        };
    }
}