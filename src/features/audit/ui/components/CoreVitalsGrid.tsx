import { Zap, LayoutTemplate, MoveHorizontal, Clock, Gauge } from 'lucide-react';

// 1. Definició local del tipus de Google (Relaxada)
type LighthouseAudit = {
  id: string;
  title: string;
  description: string;
  score?: number | null; // 👈 AFEGIT EL '?' (Ara accepta undefined)
  displayValue?: string;
  numericValue?: number;
};

// 2. Tipus unificat exportat
export type AuditMetric = {
  score?: number | null; // 👈 També aquí
  value?: string;
  description?: string;
};

type CoreVitalsGridProps = {
  metrics?: {
    fcp?: AuditMetric;
    lcp?: AuditMetric;
    cls?: AuditMetric;
    tbt?: AuditMetric;
    si?: AuditMetric;
  };
  // Ara accepta el tipus relaxat
  googleAudits?: Record<string, LighthouseAudit>;
};

export function CoreVitalsGrid({ metrics, googleAudits }: CoreVitalsGridProps) {
  
  const getMetric = (key: string, googleKey: string): AuditMetric => {
    // 1. Prioritat: Dades normalitzades
    if (metrics && metrics[key as keyof typeof metrics]) {
      return metrics[key as keyof typeof metrics]!;
    }
    
    // 2. Fallback: Dades crues de Google
    if (googleAudits && googleAudits[googleKey]) {
      const audit = googleAudits[googleKey];
      return {
        score: audit.score,
        value: audit.displayValue,
        description: audit.title
      };
    }

    return { score: null, value: 'N/A', description: 'No disponible' };
  };

  const fcp = getMetric('fcp', 'first-contentful-paint');
  const lcp = getMetric('lcp', 'largest-contentful-paint');
  const cls = getMetric('cls', 'cumulative-layout-shift');
  const tbt = getMetric('tbt', 'total-blocking-time');
  const si = getMetric('si', 'speed-index');

  if (fcp.value === 'N/A' && lcp.value === 'N/A') return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
        Mètriques de Rendiment (Core Web Vitals)
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <MetricCard title="FCP" subtitle="First Contentful Paint" value={fcp.value || "N/A"} score={fcp.score} icon={Zap} tooltip="Temps fins primer contingut." />
        <MetricCard title="LCP" subtitle="Largest Contentful Paint" value={lcp.value || "N/A"} score={lcp.score} icon={LayoutTemplate} tooltip="Temps element més gran." />
        <MetricCard title="CLS" subtitle="Cumulative Layout Shift" value={cls.value || "N/A"} score={cls.score} icon={MoveHorizontal} tooltip="Estabilitat visual." />
        <MetricCard title="TBT" subtitle="Total Blocking Time" value={tbt.value || "N/A"} score={tbt.score} icon={Clock} tooltip="Temps de bloqueig." />
        <MetricCard title="SI" subtitle="Speed Index" value={si.value || "N/A"} score={si.score} icon={Gauge} tooltip="Índex de velocitat." />
      </div>
    </div>
  );
}

type MetricCardProps = {
    title: string;
    subtitle: string;
    value: string;
    score?: number | null;
    icon: React.ElementType;
    tooltip?: string;
};
  
function MetricCard({ title, subtitle, value, score, icon: Icon, tooltip }: MetricCardProps) {
    let colorClass = 'text-slate-500 dark:text-slate-400';
    let bgClass = 'bg-slate-100 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700';
    let iconColor = 'text-slate-400';

    // Comprovem que score sigui un número vàlid abans de comparar
    if (typeof score === 'number') {
        if (score >= 0.9) {
            colorClass = 'text-green-600 dark:text-green-400';
            bgClass = 'bg-green-50 border-green-200 dark:bg-green-500/10 dark:border-green-500/20';
            iconColor = 'text-green-500';
        } else if (score >= 0.5) {
            colorClass = 'text-yellow-600 dark:text-yellow-400';
            bgClass = 'bg-yellow-50 border-yellow-200 dark:bg-yellow-500/10 dark:border-yellow-500/20';
            iconColor = 'text-yellow-500';
        } else {
            colorClass = 'text-red-600 dark:text-red-400';
            bgClass = 'bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/20';
            iconColor = 'text-red-500';
        }
    }

    return (
        <div className={`p-4 rounded-xl border ${bgClass} flex flex-col items-center text-center transition-all hover:scale-[1.02] h-full justify-between`} title={tooltip}>
            <div className="flex flex-col items-center">
                <div className={`mb-3 p-2.5 rounded-full bg-background/50 ${iconColor}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-foreground mb-1">{title}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2 px-2 line-clamp-1">{subtitle}</span>
            </div>
            <span className={`text-2xl font-extrabold ${colorClass}`}>{value}</span>
        </div>
    )
}