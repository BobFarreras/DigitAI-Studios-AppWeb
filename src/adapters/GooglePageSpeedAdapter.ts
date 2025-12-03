import { IWebScanner, ScanResult, AuditIssue } from './IWebScanner';
import { translateIssue } from '@/lib/audit-dictionary';
// Assegura't que la ruta d'importació és correcta
import { PageSpeedResponseSchema } from './google/schemas';

export const AUDIT_TRANSLATIONS: Record<
    string, // id de l'auditoria
    Record<
        string, // locale, p.ex. 'ca', 'es', 'en'
        { title: string; description: string }
    >
> = {
    'is-on-https': {
        ca: {
            title: 'El lloc web no utilitza HTTPS segur',
            description: 'La teva web no és segura. Això espanta els clients i Google et penalitza greument.'
        },
        es: {
            title: 'El sitio web no usa HTTPS seguro',
            description: 'Tu web no es segura. Esto asusta a los clientes y Google te penaliza.'
        },
        en: {
            title: 'Website is not using secure HTTPS',
            description: 'Your website is not secure. This scares users and Google may penalize you.'
        }
    },
    // ... altres auditories
};

export class GooglePageSpeedAdapter implements IWebScanner {
    private apiKey?: string;
    private apiUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

    constructor(apiKey?: string) {
        this.apiKey = apiKey;
    }

    async scanUrl(url: string, locale: string = 'ca'): Promise<ScanResult> {
        const params = new URLSearchParams({
            url,
            strategy: 'mobile',
            locale, // ara ve de fora
        });
        try {
            const check = await fetch(url, { method: 'HEAD' });
            if (check.status >= 400) {
                throw new Error(`La web retorna un error ${check.status}.`);
            }
        } catch (e) {
            console.error("Error connectant amb la web:", e);
            throw new Error(`No s'ha pogut accedir a la web: ${url}`);
        }



        ['PERFORMANCE', 'SEO', 'ACCESSIBILITY', 'BEST_PRACTICES'].forEach(cat => {
            params.append('category', cat);
        });
        if (this.apiKey) {
            params.append('key', this.apiKey);
        }

        // 3. CRIDA A GOOGLE
        const response = await fetch(`${this.apiUrl}?${params.toString()}`);

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Google API Error (${response.status}): ${errText}`);
        }

        const rawJson = await response.json();

        // 🛡️ VALIDACIÓ ZOD
        const validation = PageSpeedResponseSchema.safeParse(rawJson);

        if (!validation.success) {
            console.error("❌ Dades invàlides de Google API:", validation.error);
            throw new Error("Error processant l'auditoria: L'estructura de dades de Google no és correcta.");
        }

        // Ara TypeScript sap perfectament què és 'data'
        const data = validation.data;
        const lh = data.lighthouseResult;

        // 4. EXTRACCIÓ DE PUNTUACIONS
        const scores = {
            performance: Math.round((lh.categories.performance?.score || 0) * 100),
            seo: Math.round((lh.categories.seo?.score || 0) * 100),
        };

        const audits = lh.audits;

        // 5. EXTRACCIÓ DE CORE WEB VITALS
        const getMetric = (key: string, desc: string) => {
            const audit = audits[key];
            return {
                value: audit?.displayValue,
                score: audit?.score ?? 0,
                description: desc
            };
        };

        const metrics = {
            fcp: getMetric('first-contentful-paint', "Temps fins al primer contingut visible."),
            lcp: getMetric('largest-contentful-paint', "Temps de càrrega de l'element més gran."),
            cls: getMetric('cumulative-layout-shift', "Estabilitat visual."),
            tbt: getMetric('total-blocking-time', "Temps de bloqueig del navegador."),
            si: getMetric('speed-index', "Índex de velocitat visual.")
        };

        // 6. PROCESSAMENT D'ERRORS (ISSUES)
        const issues: AuditIssue[] = Object.values(audits)
            .filter(a => typeof a.score === 'number' && a.score < 0.9)
            .map(a => {
                const cleanDescription = a.description?.split('[')[0].replace(/\.$/, '') || '';
                const translated = translateIssue(
                    a.id,
                    a.title || 'Unknown Issue',
                    a.description || '',
                    locale
                ); return {
                    id: a.id,
                    title: translated.title || a.title || 'Unknown Issue',
                    description: translated.description || cleanDescription,
                    score: a.score || 0,
                    displayValue: a.displayValue
                };
            })
            .sort((a, b) => a.score - b.score)
            .slice(0, 8);

        // 7. EXTRACCIÓ DE CAPTURA (Amb Type Guard)
        const screenshotAudit = audits['final-screenshot'];
        let screenshotData: string | undefined;

        // Verifiquem que 'details' existeixi i tingui la propietat 'data'
        if (screenshotAudit?.details && typeof screenshotAudit.details === 'object') {
            // Fem un cast segur perquè sabem que Google torna { type: 'screenshot', data: 'base64...' }
            const details = screenshotAudit.details as { data?: string };
            if (details.data) {
                screenshotData = details.data;
            }
        }

        return {
            seoScore: scores.seo,
            performanceScore: scores.performance,
            screenshot: screenshotData,
            issues: issues,
            metrics: metrics,
            reportData: data
        };
    }
}