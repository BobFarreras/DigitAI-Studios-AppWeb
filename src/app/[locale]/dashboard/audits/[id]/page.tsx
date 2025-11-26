import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from 'lucide-react'; // O el teu component de UI
import { MOCK_REPORT } from '@/lib/mock-audit';

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export default async function AuditDetailsPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const t = await getTranslations('Dashboard');

  // 1. Obtenim les dades de l'auditoria
  const { data: audit, error } = await supabase
    .from('web_audits')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !audit) {
    notFound();
  }

  // 2. SIMULACIÓ: Si està "processing", la completem automàticament
  // (En producció, això ho faria una Edge Function en background)
  let report = audit.report_data as typeof MOCK_REPORT | null;
  
  if (audit.status === 'processing') {
    // Actualitzem la DB per fer veure que s'ha acabat
    await supabase.from('web_audits').update({
      status: 'completed',
      seo_score: MOCK_REPORT.scores.seo,
      performance_score: MOCK_REPORT.scores.performance,
      report_data: MOCK_REPORT
    }).eq('id', id);
    
    report = MOCK_REPORT; // Usem les dades mockejades per renderitzar ara
  }

  return (
    <div className="space-y-6">
      {/* Capçalera */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:underline">
            ← Tornar al llistat
          </Link>
          <h1 className="text-3xl font-bold mt-2">Informe: {audit.url}</h1>
        </div>
        <Button variant="outline">Descarregar PDF</Button>
      </div>

      {/* Targetes de Puntuació (Score Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ScoreCard title="SEO" score={report?.scores.seo ?? 0} />
        <ScoreCard title="Performance" score={report?.scores.performance ?? 0} />
        <ScoreCard title="Accessibilitat" score={report?.scores.accessibility ?? 0} />
        <ScoreCard title="Best Practices" score={report?.scores.best_practices ?? 0} />
      </div>

      {/* Detalls dels errors */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Problemes Detectats</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {report?.issues.map((issue, i) => (
                <li key={i} className="flex items-start gap-3 p-3 border rounded-lg">
                  <span className={`w-3 h-3 mt-1.5 rounded-full ${
                    issue.type === 'error' ? 'bg-red-500' : 
                    issue.type === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <p className="font-medium">{issue.message}</p>
                    <p className="text-xs text-muted-foreground uppercase">{issue.impact} impact</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tecnologies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {report?.technologies.map((tech) => (
                <span key={tech} className="px-2 py-1 bg-slate-100 rounded text-sm font-medium text-slate-700">
                  {tech}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Petit component auxiliar per les puntuacions
function ScoreCard({ title, score }: { title: string; score: number }) {
  // Color segons la nota
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