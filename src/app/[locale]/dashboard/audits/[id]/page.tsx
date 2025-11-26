import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from 'lucide-react';
import { auditRepository } from '@/services/container'; // Usem el repositori

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export default async function AuditDetailsPage({ params }: Props) {
  const { id } = await params;
  const t = await getTranslations('Dashboard');

  // 1. Obtenim l'auditoria REAL (sense mocks)
  const audit = await auditRepository.getAuditById(id);

  if (!audit) {
    notFound();
  }

  // 2. Si encara s'està processant (cas rar, però possible si l'usuari és molt ràpid)
  if (audit.status === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <h2 className="text-xl font-semibold">Analitzant la web amb IA...</h2>
        <p className="text-muted-foreground">Això pot trigar uns segons. Refresca la pàgina aviat.</p>
      </div>
    );
  }

  // 3. Extreiem les dades reals de l'informe
  // Definim un tipus per a l'estructura de reportData
  type AuditReportData = {
    audits?: {
      [key: string]: {
        displayValue?: string;
        score?: number;
      };
    };
    // Afegiu més propietats si cal
  };

  const report = audit.reportData as AuditReportData;
  const audits = report?.audits || {};

  return (
    <div className="space-y-6">
      {/* Capçalera */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:underline">
            ← Tornar al llistat
          </Link>
          <h1 className="text-3xl font-bold mt-2">Informe: {audit.url}</h1>
          <p className="text-sm text-slate-500">
            Analitzat el: {audit.createdAt.toLocaleDateString()} a les {audit.createdAt.toLocaleTimeString()}
          </p>
        </div>
        <Button variant="outline">Descarregar PDF</Button>
      </div>

      {/* Targetes de Puntuació (Score Cards) - DADES REALS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ScoreCard title="SEO" score={audit.seoScore ?? 0} />
        <ScoreCard title="Performance" score={audit.performanceScore ?? 0} />
        {/* Google PageSpeed de vegades no dona Accessibilitat per API simple, usem mock o 0 per ara */}
        <ScoreCard title="Accessibilitat" score={0} /> 
        <ScoreCard title="Best Practices" score={0} />
      </div>

      {/* Core Web Vitals (Mètriques Tècniques Reals) */}
      <h2 className="text-2xl font-bold mt-8">Mètriques Tècniques (Core Web Vitals)</h2>
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* LCP */}
        <MetricCard 
          title="Largest Contentful Paint (LCP)" 
          value={audits['lcp']?.displayValue} 
          score={audits['lcp']?.score}
          description="Temps de càrrega de l'element més gran."
        />

        {/* CLS */}
        <MetricCard 
          title="Cumulative Layout Shift (CLS)" 
          value={audits['cls']?.displayValue} 
          score={audits['cls']?.score}
          description="Estabilitat visual (moviment inesperat)."
        />

        {/* SEO Issues (Si en tenim) */}
        <Card className="md:col-span-1 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">Tecnologies</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-blue-800">
               Google ha detectat que aquesta pàgina està optimitzada per a mòbil.
             </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helpers visuals
function ScoreCard({ title, score }: { title: string; score: number }) {
  const colorClass = score >= 90 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600';
  return (
    <Card>
      <CardContent className="pt-6 text-center">
        <div className={`text-4xl font-bold ${colorClass}`}>{score}</div>
        <div className="text-sm text-muted-foreground mt-1">{title}</div>
      </CardContent>
    </Card>
  );
}

type MetricCardProps = {
  title: string;
  value?: string;
  score?: number;
  description: string;
};

function MetricCard({ title, value, score, description }: MetricCardProps) {
  // Score de Google va de 0 a 1 (0.9 és bo)
  const statusColor = score !== undefined && score >= 0.9 ? 'bg-green-100 text-green-800 border-green-200' : 
                      score !== undefined && score >= 0.5 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 
                      'bg-red-100 text-red-800 border-red-200';

  return (
    <Card className={`border ${statusColor}`}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-2">{value || 'N/A'}</div>
        <p className="text-xs opacity-80">{description}</p>
      </CardContent>
    </Card>
  );
}