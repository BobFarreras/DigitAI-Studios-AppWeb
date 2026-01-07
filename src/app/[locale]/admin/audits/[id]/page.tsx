import { getAdminAuditById } from '@/actions/admin/audits';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

// 👇 REUTILITZACIÓ DE COMPONENTS UI (La mateixa UI que l'usuari)
import { AuditHeader } from '@/features/audit/ui/components/AuditHeader';
import { ScoreGrid } from '@/features/audit/ui/components/ScoreGrid';
import { CoreVitalsGrid, AuditMetric } from '@/features/audit/ui/components/CoreVitalsGrid';
import { IssuesList } from '@/features/audit/ui/components/IssuesList';
import { MobilePreview } from '@/features/audit/ui/components/MobilePreviw';
import { BusinessOpportunities } from '@/features/audit/ui/components/BusinessOpportunities';
import { AuditIssue } from '@/adapters/IWebScanner';
import { BusinessSuggestion } from '@/types/ai';

// TIPUS HELPER (Copiats de l'altre costat o importats si els tens en un fitxer compartit)
type LighthouseAudit = {
  id: string; title: string; details: string; description: string; score: number | null; displayValue?: string; numericValue?: number;
};
interface GoogleRawData {
  lighthouseResult?: { audits: Record<string, LighthouseAudit> };
  audits?: Record<string, LighthouseAudit>;
  issues?: AuditIssue[];
  screenshot?: string;
  suggestions?: BusinessSuggestion[];
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminAuditDetailPage({ params }: Props) {
  const { id } = await params;
  
  // 1. Cridem l'acció d'Admin
  const response = await getAdminAuditById(id);

  // 2. Gestió d'Errors (Igual que tenies)
  if (!response.success || !response.data) {
    return (
      <div className="container mx-auto py-20 px-6 flex flex-col items-center justify-center text-center space-y-6">
        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full">
            <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">Error d'Accés ({response.error})</h1>
        <Link href="/admin" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            Tornar a l'Admin
        </Link>
      </div>
    );
  }

  const audit = response.data;
  
  // 3. TRANSFORMACIÓ DE DADES (Lògica idèntica a AuditDetailsPage)
  const rawData = audit.reportData as unknown as GoogleRawData;
  const googleAudits = rawData?.lighthouseResult?.audits || rawData?.audits || {};
  const suggestions: BusinessSuggestion[] = rawData?.suggestions || [];

  const extract = (key: string): AuditMetric => {
    const a = googleAudits[key];
    if (!a) return { score: null, value: 'N/A', description: '' };
    return {
      score: a.score,
      value: a.displayValue || (a.numericValue ? a.numericValue.toFixed(2) : 'N/A'),
      description: a.title
    };
  };

  const metrics = {
    fcp: extract('first-contentful-paint'),
    lcp: extract('largest-contentful-paint'),
    cls: extract('cumulative-layout-shift'),
    tbt: extract('total-blocking-time'),
    si: extract('speed-index')
  };

  let displayIssues: AuditIssue[] = rawData?.issues || [];
  if (displayIssues.length === 0 && Object.keys(googleAudits).length > 0) {
    displayIssues = Object.entries(googleAudits)
      .filter(([, a]) => { const score = a.score ?? 1; return score < 0.9 && a.score !== null; })
      .map(([key, a]) => ({
        id: key, title: a.title || 'Problema', description: a.description || '', score: a.score ?? 0,
        displayValue: a.displayValue, impact: (a.score === 0 ? 'high' : 'medium'), type: (a.score === 0 ? "error" : "warning") as "error" | "warning"
      }))
      .sort((a, b) => (a.score || 0) - (b.score || 0))
      .slice(0, 8);
  }

  type ScreenshotDetails = { data?: string };
  const screenshotData = rawData?.screenshot || (googleAudits['final-screenshot']?.details as ScreenshotDetails)?.data || '';
  const seoScore = audit.seoScore ?? 0;
  const perfScore = audit.performanceScore ?? 0;

  // 4. RENDERITZAT (Reutilitzant components UI)
  return (
    <div className="container mx-auto py-10 px-6 space-y-8 max-w-7xl">
        
        {/* HEADER EXTRA D'ADMIN */}
        <div className="flex justify-between items-center mb-6">
            <Link href="/admin" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Tornar a la Bústia
            </Link>
            <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold border border-amber-200">
                MODE ADMIN (Vista Prèvia)
            </span>
        </div>

        {/* --- INICI CONTINGUT REUTILITZAT --- */}
        
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

        {/* --- FI CONTINGUT REUTILITZAT --- */}
    </div>
  );
}