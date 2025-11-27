import { notFound } from 'next/navigation';
import { auditRepository } from '@/services/container';
import { ScanResult } from '@/adapters/IWebScanner';

import { AuditHeader } from '@/features/audit/ui/components/AuditHeader';
import { ScoreGrid } from '@/features/audit/ui/components/ScoreGrid';
import { CoreVitalsGrid, AuditMetric } from '@/features/audit/ui/components/CoreVitalsGrid'; 
import { IssuesList } from '@/features/audit/ui/components/IssuesList';
import { MobilePreview } from '@/features/audit/ui/components/MobilePreviw';

type LighthouseMetric = AuditMetric & {
  id: string;
  title: string;
  description: string;
  details?: { data?: string };
  displayValue?: string;
  numericValue?: number;
  score: number | null; // 👈 ABANS era number | null | undefined
};

type GoogleLighthouseResponse = {
  lighthouseResult?: {
    audits: Record<string, LighthouseMetric>
  };
  audits?: Record<string, LighthouseMetric>;
};

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export default async function AuditDetailsPage({ params }: Props) {
  const { id } = await params;
  const audit = await auditRepository.getAuditById(id);

  if (!audit) notFound();

  if (audit.status === 'processing') {
    return <div className="p-8 text-center">Carregant resultats...</div>;
  }

  // Cast de tipus per manipular les dades
  const report = audit.reportData as unknown as ScanResult;
  const googleData = audit.reportData as unknown as GoogleLighthouseResponse;
  
  // Obtenim les auditories crues
  const googleAudits = googleData?.lighthouseResult?.audits || googleData?.audits || {};

  // Lògica de filtratge d'errors
  let displayIssues = report.issues || [];
  if (displayIssues.length === 0 && Object.keys(googleAudits).length > 0) {
    displayIssues = Object.values(googleAudits)
      .filter(a => {
        const score = a.score ?? 1;
        return score < 0.9 && a.score !== null; // Filtrem nulls
      })
      .map(a => ({
        title: a.title || 'Problema detectat',
        description: a.description || '',
        score: a.score ?? 0,
        displayValue: a.displayValue
      }));
  }

  const seoScore = audit.seoScore ?? 0;
  const perfScore = audit.performanceScore ?? 0;
  
  // Busquem la captura de pantalla
  const screenshotData = report.screenshot || googleAudits['final-screenshot']?.details?.data || '';

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto">

      <AuditHeader
        url={audit.url}
        date={new Date(audit.createdAt)}
        pdfData={{
          url: audit.url,
          date: new Date(audit.createdAt).toLocaleDateString(),
          scores: {
            seo: seoScore,
            perf: perfScore,
            a11y: 85, 
            best: 92
          },
          screenshot: screenshotData,
          issues: displayIssues
        }}
      />

      <ScoreGrid seo={seoScore} perf={perfScore} />

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-10">
          
          {/* ✅ CORRECCIÓ 2: Ara googleAudits és compatible perquè hem arreglat el tipus a dalt */}
          <CoreVitalsGrid
            metrics={report.metrics}
            googleAudits={googleAudits}
          />
          
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