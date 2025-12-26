import { notFound } from 'next/navigation';
import { auditRepository } from '@/services/container';
import { AuditHeader } from '@/features/audit/ui/components/AuditHeader';
import { ScoreGrid } from '@/features/audit/ui/components/ScoreGrid';
import { CoreVitalsGrid, AuditMetric } from '@/features/audit/ui/components/CoreVitalsGrid';
import { IssuesList } from '@/features/audit/ui/components/IssuesList';
import { MobilePreview } from '@/features/audit/ui/components/MobilePreviw';
import { AuditIssue } from '@/adapters/IWebScanner';
import { getTranslations } from 'next-intl/server'; // Importem el hook de servidor
import { BusinessOpportunities } from '@/features/audit/ui/components/BusinessOpportunities'; // 👈 IMPORT NOU
import { BusinessSuggestion } from '@/types/ai'; // 👈 IMPORT NOU
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
  suggestions?: BusinessSuggestion[]; // 👈 AFEGIT (Pot venir dins reportData segons com ho guardis)
}

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export default async function AuditDetailsPage({ params }: Props) {
  const { id } = await params;
  const t = await getTranslations('AuditDetails'); // Namespace AuditDetails
  const audit = await auditRepository.getAuditById(id);

  if (!audit) notFound();

  if (audit.status === 'processing') {
    return <div className="p-12 text-center text-foreground">{t('processing_message')}</div>;
  }

  // 1. Recuperar dades
  const rawData = audit.reportData as unknown as GoogleRawData;
  const googleAudits = rawData?.lighthouseResult?.audits || rawData?.audits || {};
  // 👇 RECUPEREM ELS SUGGERIMENTS (assegurem array buit si no n'hi ha)
  // Nota: Si a l'AuditService vas guardar 'suggestions' al nivell arrel de JSON, ajusta-ho aquí.
  // Assumim que està dins reportData per simplicitat del tipus rawData.
  const suggestions: BusinessSuggestion[] = rawData?.suggestions || [];
  // 2. Helper
  const extract = (key: string): AuditMetric => {
    const a = googleAudits[key];
    if (!a) return { score: null, value: 'N/A', description: '' };
    return {
      score: a.score,
      value: a.displayValue || (a.numericValue ? a.numericValue.toFixed(2) : 'N/A'),
      description: a.title
    };
  };

  // 3. Mètriques
  const metrics = {
    fcp: extract('first-contentful-paint'),
    lcp: extract('largest-contentful-paint'),
    cls: extract('cumulative-layout-shift'),
    tbt: extract('total-blocking-time'),
    si: extract('speed-index')
  };

  // 4. Issues
  let displayIssues: AuditIssue[] = rawData?.issues || [];

  if (displayIssues.length === 0 && Object.keys(googleAudits).length > 0) {
    displayIssues = Object.entries(googleAudits)
      .filter(([, a]) => {
        const score = a.score ?? 1;
        return score < 0.9 && a.score !== null;
      })
      .map(([key, a]) => ({
        id: key, // IMPORTANT: Passem l'ID per traduir
        title: a.title || 'Problema detectat',
        description: a.description || '',
        score: a.score ?? 0,
        displayValue: a.displayValue,
        impact: (a.score === 0 ? 'high' : 'medium'),
        type: (a.score === 0 ? "error" : "warning") as "error" | "warning"
      }))
      .sort((a, b) => (a.score || 0) - (b.score || 0))
      .slice(0, 8);
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
      {/* 👇 AFEGIM EL COMPONENT D'OPORTUNITATS AQUÍ (DESTACAT) */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        <BusinessOpportunities suggestions={suggestions} />
      </div>
      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-10">
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