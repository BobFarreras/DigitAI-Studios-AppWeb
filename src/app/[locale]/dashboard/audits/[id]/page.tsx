import { notFound } from 'next/navigation';
import { auditRepository } from '@/services/container';
import { AuditHeader } from '@/features/audit/ui/components/AuditHeader';
import { ScoreGrid } from '@/features/audit/ui/components/ScoreGrid';
// Importem CoreVitalsGrid i el seu tipus
import { CoreVitalsGrid, AuditMetric } from '@/features/audit/ui/components/CoreVitalsGrid';
import { IssuesList } from '@/features/audit/ui/components/IssuesList';
import { MobilePreview } from '@/features/audit/ui/components/MobilePreviw';
// Tipus d'errors (Adaptats)
import { AuditIssue } from '@/adapters/IWebScanner';

// Tipus per llegir el JSON de Google
type LighthouseAudit = {
  id: string;
  title: string;
  description: string;
  score: number | null;
  displayValue?: string;
  numericValue?: number;
  details?: unknown; 
};

interface GoogleRawData {
  lighthouseResult?: { audits: Record<string, LighthouseAudit> };
  audits?: Record<string, LighthouseAudit>;
  issues?: AuditIssue[];
  screenshot?: string;
}

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export default async function AuditDetailsPage({ params }: Props) {
  const { id } = await params;
  const audit = await auditRepository.getAuditById(id);

  if (!audit) notFound();

  if (audit.status === 'processing') {
    return <div className="p-12 text-center text-foreground">Carregant resultats...</div>;
  }

  // 1. Recuperar dades
  const rawData = audit.reportData as unknown as GoogleRawData;
  const googleAudits = rawData?.lighthouseResult?.audits || rawData?.audits || {};

  // 2. Helper per extreure mètriques segures
  const extract = (key: string): AuditMetric => {
    const a = googleAudits[key];
    if (!a) return { score: null, value: 'N/A', description: '' };
    return {
      score: a.score,
      value: a.displayValue || (a.numericValue ? a.numericValue.toFixed(2) : 'N/A'),
      description: a.title
    };
  };

  // 3. Construir l'objecte de mètriques pel Grid
  const metrics = {
    fcp: extract('first-contentful-paint'),
    lcp: extract('largest-contentful-paint'),
    cls: extract('cumulative-layout-shift'),
    tbt: extract('total-blocking-time'),
    si: extract('speed-index')
  };

  // 4. Processar Issues (Errors)
  let displayIssues: AuditIssue[] = rawData?.issues || [];

  if (displayIssues.length === 0 && Object.keys(googleAudits).length > 0) {
    displayIssues = Object.values(googleAudits)
      .filter((a: LighthouseAudit) => {
        const score = a.score ?? 1;
        // Filtrem score < 0.9 i que no sigui només informatiu (score null)
        return score < 0.9 && a.score !== null;
      })
      .map((a: LighthouseAudit) => ({
        title: a.title || 'Problema detectat',
        description: a.description || '',
        score: a.score ?? 0,
        displayValue: a.displayValue,
        // Assignem valors per defecte si falten a la interfície
        impact: (a.score === 0 ? 'high' : 'medium') as 'high' | 'medium' | 'low',
        type: (a.score === 0 ? 'error' : 'warning') as 'error' | 'warning'
      }))
      .sort((a, b) => (a.score || 0) - (b.score || 0))
      .slice(0, 8); // Top 8 errors
  }

  // 5. Captura
  type ScreenshotDetails = { data?: string };
  const screenshotData = 
      rawData?.screenshot || 
      (googleAudits['final-screenshot']?.details as ScreenshotDetails)?.data || 
      '';

  const seoScore = audit.seoScore ?? 0;
  const perfScore = audit.performanceScore ?? 0;

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto">
      
      <AuditHeader 
        url={audit.url} 
        date={new Date(audit.createdAt)}
        pdfData={{
          url: audit.url,
          date: new Date(audit.createdAt).toLocaleDateString(),
          scores: { seo: seoScore, perf: perfScore, a11y: 85, best: 92 },
          screenshot: screenshotData,
          issues: displayIssues
        }}
      />

      <ScoreGrid seo={seoScore} perf={perfScore} />

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
         <div className="lg:col-span-2 space-y-10">
            {/* Passem l'objecte metrics net */}
            <CoreVitalsGrid metrics={metrics} />
            <IssuesList issues={displayIssues} />
         </div>

         <div className="lg:col-span-1">
            <div className="sticky top-8">
                <MobilePreview screenshot={screenshotData} />
            </div>
         </div>
      </div>

    </div>
  );
}