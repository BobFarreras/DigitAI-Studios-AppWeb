import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// ✅ CORRECCIÓ 1: Definim un tipus que accepti null
export type AuditMetric = {
  score?: number | null; // Ara accepta null
  displayValue?: string;
};

type Props = {
  // Ara 'audits' fa servir aquest tipus permissiu
  audits: Record<string, AuditMetric>;
};

export function CoreVitalsGrid({ audits }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="w-2 h-8 bg-primary rounded-full"></span>
        Core Web Vitals
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        <MetricCard 
            title="LCP (Càrrega)" 
            value={audits['largest-contentful-paint']?.displayValue} 
            score={audits['largest-contentful-paint']?.score}
            description="Temps fins que es veu l'element més gran."
        />
        <MetricCard 
            title="CLS (Estabilitat)" 
            value={audits['cumulative-layout-shift']?.displayValue} 
            score={audits['cumulative-layout-shift']?.score}
            description="Quant es mou la pantalla mentre carrega."
        />
        <MetricCard 
            title="FCP (Velocitat)" 
            value={audits['first-contentful-paint']?.displayValue} 
            score={audits['first-contentful-paint']?.score}
            description="Quan es comença a veure contingut."
        />
      </div>
    </div>
  );
}

// ✅ CORRECCIÓ 2: Actualitzem també les props de la targeta individual
type MetricCardProps = {
  title: string;
  value?: string;
  score?: number | null; // Acceptem null aquí també
  description: string;
};

function MetricCard({ title, value, score, description }: MetricCardProps) {
  // ✅ CORRECCIÓ 3: Si és null o undefined, el tractem com a 0 per als càlculs
  const safeScore = score ?? 0;

  const statusClass = safeScore >= 0.9 ? 'border-green-500/20 bg-green-500/5 text-green-400' : 
                      safeScore >= 0.5 ? 'border-yellow-500/20 bg-yellow-500/5 text-yellow-400' : 
                      'border-red-500/20 bg-red-500/5 text-red-400';

  return (
    <Card className={`border ${statusClass} backdrop-blur-sm transition-all hover:scale-[1.02]`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-slate-200">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-2 tracking-tight font-mono">{value || 'N/A'}</div>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}