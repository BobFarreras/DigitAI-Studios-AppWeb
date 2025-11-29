import { requireAdmin } from '@/lib/auth/admin-guard';
import { analyticsRepository } from '@/services/container';
import { TrafficChart } from '@/features/analytics/ui/TrafficChart';
import { TopPagesCard } from '@/features/analytics/ui/TopPagesCard';
import { DeviceChart } from '@/features/analytics/ui/DeviceChart';
import { BarListChart } from '@/features/analytics/ui/BarListChart';
import { VerticalBarChart } from '@/features/analytics/ui/VerticalBarChart';
import { UnifiedStatBar } from '@/features/analytics/ui/UnifiedStatBar';


export const revalidate = 60;

export default async function AdminAnalyticsPage() {
  await requireAdmin();

  const [dailyStats, adv] = await Promise.all([
    analyticsRepository.getLast7DaysStats(),
    analyticsRepository.getAdvancedStats()
  ]);

  const totalViews = dailyStats.reduce((acc, day) => acc + day.views, 0);
  const totalVisitors = dailyStats.reduce((acc, day) => acc + day.visitors, 0);

  return (
    // CANVI CLAU:
    // Mòbil: h-auto (alçada automàtica) + overflow-y-auto (scroll vertical)
    // Escriptori (lg): h-[calc(100vh-2rem)] (alçada fixa) + overflow-hidden (sense scroll global)
    <div className="flex flex-col gap-4 pb-4 h-auto overflow-y-auto lg:h-[calc(100vh-2rem)] lg:overflow-hidden">
      
      {/* 1. BARRA D'ESTAT UNIFICADA */}
      <div className="shrink-0">
         <UnifiedStatBar 
            views={totalViews} 
            visitors={totalVisitors} 
            events={totalViews} 
            avgTime="~45s" 
         />
      </div>

      {/* 2. GRAELLA PRINCIPAL */}
      {/* Mòbil: flex-col (un sota l'altre). Escriptori: grid (graella original) */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-4 min-h-0">
         
         {/* --- COLUMNA ESQUERRA --- */}
         <div className="lg:col-span-2 flex flex-col gap-4 lg:h-full lg:min-h-0">
            
            {/* A. Trànsit */}
            {/* Mòbil: Alçada fixa 300px. Escriptori: 50% de l'espai */}
            <div className="h-[300px] lg:h-1/2 lg:min-h-0">
                <TrafficChart data={dailyStats} />
            </div>

            {/* B. Detalls Importants */}
            {/* Mòbil: flex-col (stack). Escriptori: grid-cols-2 */}
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:h-1/2 lg:min-h-0">
                <div className="h-[300px] lg:h-full lg:min-h-0">
                    <TopPagesCard data={adv.topPages} />
                </div>
                <div className="h-[300px] lg:h-full lg:min-h-0">
                    <BarListChart title="Fonts de Trànsit" data={adv.referrers} />
                </div>
            </div>
         </div>

         {/* --- COLUMNA DRETA --- */}
         <div className="lg:col-span-1 flex flex-col gap-4 lg:h-full lg:min-h-0">
            
            {/* C. Dispositius */}
            <div className="h-[300px] lg:flex-1 lg:min-h-0">
               <DeviceChart data={adv.devices} />
            </div>

            {/* D. Països */}
            <div className="h-[300px] lg:flex-1 lg:min-h-0">
               <VerticalBarChart title="Top Països" data={adv.countries} />
            </div>

            {/* E. Navegadors */}
            <div className="h-[300px] lg:flex-1 lg:min-h-0">
               <BarListChart title="Navegadors" data={adv.browsers} />
            </div>
         </div>

      </div>
    </div>
  );
}