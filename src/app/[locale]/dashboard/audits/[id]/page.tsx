import { notFound } from 'next/navigation';
import { auditRepository } from '@/services/container';
import { ScanResult } from '@/adapters/IWebScanner';

import { AuditHeader } from '@/features/audit/ui/components/AuditHeader';
import { ScoreGrid } from '@/features/audit/ui/components/ScoreGrid';
import { CoreVitalsGrid, AuditMetric } from '@/features/audit/ui/components/CoreVitalsGrid'; // 👈 Importem el tipus del component
import { IssuesList } from '@/features/audit/ui/components/IssuesList';
import { MobilePreview } from '@/features/audit/ui/components/MobilePreviw';

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

// 1. Definim el tipus que coincideixi amb el del component CoreVitalsGrid
type LighthouseMetric = AuditMetric & { 
    title?: string; 
    description?: string;
    details?: { data?: string }; // Añadimos la propiedad 'details' opcional
};

type GoogleLighthouseResponse = {
  lighthouseResult?: { 
    audits: Record<string, LighthouseMetric> 
  };
  audits?: Record<string, LighthouseMetric>;
};

export default async function AuditDetailsPage({ params }: Props) {
  const { id } = await params;
  const audit = await auditRepository.getAuditById(id);

  if (!audit) notFound();

  if (audit.status === 'processing') {
     return <div>Carregant...</div>;
  }

  const report = audit.reportData as unknown as ScanResult;
  const googleData = audit.reportData as unknown as GoogleLighthouseResponse;
  
  // Ara googleAudits compleix amb el tipus que espera CoreVitalsGrid
  const googleAudits = googleData?.lighthouseResult?.audits || googleData?.audits || {};

  // 2. LÒGICA DE FILTRATGE SEGURA (Sense errors d'undefined)
  let displayIssues = report.issues || [];
  
  if (displayIssues.length === 0 && Object.keys(googleAudits).length > 0) {
      displayIssues = Object.values(googleAudits)
          .filter(a => {
              // ✅ CORRECCIÓ: Si score no existeix, assumim que és 1 (perfecte) per no mostrar-lo com error
              const score = a.score ?? 1; 
              // Mostrem si la nota és dolenta (<0.9) o és 0 (error greu)
              return score < 0.9;
          })
          .map(a => ({
              title: a.title || 'Problema detectat',
              description: a.description || '',
              score: a.score ?? 0, // Si és null, posem 0
              displayValue: a.displayValue
          }));
  }

  // ✅ CORRECCIÓ 3: Extracció segura de les puntuacions globals
  // El JSON a vegades guarda les categories a 'lighthouseResult.categories'
  // Però si només tens 'audits', potser no tens el resum. 
  // Fem servir fallback segur:
  const seoScore = audit.seoScore ?? 0;
  const perfScore = audit.performanceScore ?? 0;

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto">
      
      <AuditHeader url={audit.url} date={new Date(audit.createdAt)} />

      <ScoreGrid seo={seoScore} perf={perfScore} />

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
         <div className="lg:col-span-2 space-y-10">
            {/* Ara els tipus coincideixen perfectament */}
            <CoreVitalsGrid audits={googleAudits} />
            
            <IssuesList issues={displayIssues} />
         </div>

         <div className="lg:col-span-1">
            <div className="sticky top-8">
                {/* Busquem la captura al lloc correcte del JSON */}
                <MobilePreview 
                    screenshot={
                        report.screenshot || 
                        googleAudits['final-screenshot']?.details?.data || 
                        ''
                    } 
                />
            </div>
         </div>
      </div>

    </div>
  );
}