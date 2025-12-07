import { requireAdmin } from '@/lib/auth/admin-guard';
import { analyticsRepository } from '@/services/container';
import { TrafficChart } from '@/features/analytics/ui/TrafficChart';
import { TopPagesCard } from '@/features/analytics/ui/TopPagesCard';
import { DeviceChart } from '@/features/analytics/ui/DeviceChart';
import { BarListChart } from '@/features/analytics/ui/BarListChart';
import { VerticalBarChart } from '@/features/analytics/ui/VerticalBarChart';
import { UnifiedStatBar } from '@/features/analytics/ui/UnifiedStatBar';

export const revalidate = 60;

function formatDuration(seconds: number): string {
  if (!seconds || seconds === 0) return '0s';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}m ${s}s`;
}

export default async function AdminAnalyticsPage() {
  await requireAdmin();

  const [dailyStats, adv] = await Promise.all([
    analyticsRepository.getLast7DaysStats(),
    analyticsRepository.getAdvancedStats()
  ]);

  const totalViews = dailyStats.reduce((acc, day) => acc + day.views, 0);
  const totalVisitors = dailyStats.reduce((acc, day) => acc + day.visitors, 0);
  const grandTotalDuration = dailyStats.reduce((acc, day) => acc + (day.totalDuration || 0), 0);
  const averageTimeSeconds = totalVisitors > 0 ? grandTotalDuration / totalVisitors : 0;

return (
    <div className="flex flex-col gap-4 h-[calc(100vh-2rem)] p-4 overflow-hidden bg-background text-foreground">
      
      {/* 1. KPI HEADER */}
      <div className="shrink-0">
         <UnifiedStatBar 
            views={totalViews} 
            visitors={totalVisitors} 
            events={totalViews} 
            avgTime={formatDuration(averageTimeSeconds)} 
         />
      </div>

      {/* 2. DASHBOARD GRID (Modificat per donar més espai a la dreta) */}
      {/* Canviem a grid-cols-3: 2/3 esquerra, 1/3 dreta */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
         
         {/* --- ZONA PRINCIPAL (Columna Esquerra i Centre - 66%) --- */}
         <div className="lg:col-span-2 flex flex-col gap-4 h-full min-h-0">
            
            {/* A. GRÀFIC TRÀNSIT */}
            <div className="flex-[2] min-h-0 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <TrafficChart data={dailyStats} />
            </div>

            {/* B. DETALLS */}
            <div className="flex-[3] grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
                <div className="min-h-0 overflow-hidden">
                    <TopPagesCard data={adv.topPages} />
                </div>
                <div className="min-h-0 overflow-hidden">
                    <BarListChart title="Fonts de Trànsit" data={adv.referrers} />
                </div>
            </div>
         </div>

         {/* --- SIDEBAR DRET (Columna Dreta - 33%) --- */}
         <div className="lg:col-span-1 flex flex-col gap-4 h-full min-h-0 overflow-y-auto custom-scrollbar pr-1">
            
            <div className="flex-1 min-h-[200px]"> {/* Augmentem una mica l'alçada mínima */}
               <DeviceChart data={adv.devices} />
            </div>

            <div className="flex-1 min-h-[200px]">
               <VerticalBarChart title="Top Països" data={adv.countries} />
            </div>

            <div className="flex-1 min-h-[200px]">
               <BarListChart title="Navegadors" data={adv.browsers} />
            </div>
         </div>

      </div>
    </div>
  );
}