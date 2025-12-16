import { requireAdmin } from '@/lib/auth/admin-guard';
import { analyticsRepository } from '@/services/container';
import { TrafficChart } from '@/features/analytics/ui/TrafficChart';
import { TopPagesCard } from '@/features/analytics/ui/TopPagesCard';
import { DeviceChart } from '@/features/analytics/ui/DeviceChart';
import { BarListChart } from '@/features/analytics/ui/BarListChart';
import { VerticalBarChart } from '@/features/analytics/ui/VerticalBarChart';
import { UnifiedStatBar } from '@/features/analytics/ui/UnifiedStatBar';
// Això fa que la pàgina no es guardi a la caché estàtica per sempre (per veure dades noves)
export const dynamic = 'force-dynamic';
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
    // FIX 1: Canviem h-screen per h-auto en mòbil (scroll) i fix en LG
    <div className="flex flex-col gap-4 h-auto lg:h-[calc(100vh-2rem)] p-4 overflow-y-auto lg:overflow-hidden bg-background text-foreground">
      
      {/* 1. KPI HEADER */}
      <div className="shrink-0">
         <UnifiedStatBar 
            views={totalViews} 
            visitors={totalVisitors} 
            events={totalViews} 
            avgTime={formatDuration(averageTimeSeconds)} 
         />
      </div>

      {/* 2. DASHBOARD GRID */}
      {/* FIX 2: En mòbil es veurà tot en columna (block). En LG serà grid. */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
         
         {/* --- ZONA PRINCIPAL (Esquerra) --- */}
         <div className="lg:col-span-2 flex flex-col gap-4 h-auto lg:h-full min-h-0">
            
            {/* A. GRÀFIC TRÀNSIT */}
            {/* FIX 3: Alçada fixa en mòbil (h-80), flexible en desktop (flex-[2]) */}
            <div className="h-80 lg:h-auto lg:flex-2 min-h-0 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <TrafficChart data={dailyStats} />
            </div>

            {/* B. DETALLS (Top Pages & Referrers) */}
            {/* FIX 4: Alçada automàtica en mòbil, flexible en desktop */}
            <div className="h-auto lg:flex-3 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
                {/* FIX 5: Alçada fixa per als cards en mòbil */}
                <div className="h-80 lg:h-auto min-h-0 overflow-hidden">
                    <TopPagesCard data={adv.topPages} />
                </div>
                <div className="h-80 lg:h-auto min-h-0 overflow-hidden">
                    <BarListChart title="Fonts de Trànsit" data={adv.referrers} />
                </div>
            </div>
         </div>

         {/* --- SIDEBAR DRET --- */}
         <div className="lg:col-span-1 flex flex-col gap-4 h-auto lg:h-full min-h-0 lg:overflow-y-auto custom-scrollbar pr-1">
            
            <div className="h-64 lg:flex-1 lg:min-h-50">
               <DeviceChart data={adv.devices} />
            </div>

            <div className="h-64 lg:flex-1 lg:min-h-50">
               <VerticalBarChart title="Top Països" data={adv.countries} />
            </div>

            <div className="h-64 lg:flex-1 lg:min-h-50">
               <BarListChart title="Navegadors" data={adv.browsers} />
            </div>
         </div>

      </div>
    </div>
  );
}