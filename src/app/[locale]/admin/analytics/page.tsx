import { requireAdmin } from '@/lib/auth/admin-guard';
import { analyticsRepository } from '@/services/container';
import { TrafficChart } from '@/features/analytics/ui/TrafficChart';
import { TopPagesCard } from '@/features/analytics/ui/TopPagesCard';
import { DeviceChart } from '@/features/analytics/ui/DeviceChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Eye, MousePointerClick, Clock } from 'lucide-react';
import React from 'react';

export const revalidate = 60;

type KPICardProps = { title: string; value: string | number; icon: React.ReactNode };

export default async function AdminAnalyticsPage() {
  await requireAdmin();

  // 1. Cridem les dades en paral·lel per velocitat
  const [dailyStats, advancedStats] = await Promise.all([
    analyticsRepository.getLast7DaysStats(),
    analyticsRepository.getAdvancedStats()
  ]);

  const totalViews = dailyStats.reduce((acc, day) => acc + day.views, 0);
  const totalVisitors = dailyStats.reduce((acc, day) => acc + day.visitors, 0);

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-white">Analítiques</h1>
        <p className="text-slate-400">Visió general del trànsit sense cookies.</p>
      </div>

      {/* 1. KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <KPICard title="Vistes (7d)" value={totalViews} icon={<Eye className="text-blue-400 h-4 w-4" />} />
        <KPICard title="Usuaris (7d)" value={totalVisitors} icon={<Users className="text-green-400 h-4 w-4" />} />
        <KPICard title="Events" value={totalViews} icon={<MousePointerClick className="text-purple-400 h-4 w-4" />} />
        {/* Aquí podries posar el temps mitjà si el tens calculat */}
        <KPICard title="Temps Mitjà" value="--" icon={<Clock className="text-orange-400 h-4 w-4" />} />
      </div>

      {/* 2. GRÀFIC PRINCIPAL (Línies) */}
      <div className="grid md:grid-cols-1">
         <TrafficChart data={dailyStats} />
      </div>

      {/* 3. DETALLS (Grid 3 columnes: 2 per Pàgines, 1 per Dispositius) */}
      <div className="grid md:grid-cols-3 gap-6">
         
         {/* Top Pàgines (Ocupa 2 columnes) */}
         <div className="md:col-span-2">
            <TopPagesCard data={advancedStats.topPages} />
         </div>

         {/* Dispositius (Ocupa 1 columna) */}
         <div className="md:col-span-1">
            <DeviceChart data={advancedStats.devices} />
         </div>
      </div>
      
      {/* 4. PAÏSOS (Simple llista o gràfic futur) */}
      <Card className="bg-slate-900 border-slate-800 text-slate-200">
          <CardHeader><CardTitle>Top Països</CardTitle></CardHeader>
          <CardContent>
             <div className="flex gap-4 flex-wrap">
                {advancedStats.countries.map(c => (
                    <div key={c.country} className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full text-sm">
                        <span>{c.country === 'Unknown' ? '🌍' : '📍'}</span>
                        <span className="font-medium">{c.country}</span>
                        <span className="text-slate-400 ml-1">({c.visitors})</span>
                    </div>
                ))}
                {advancedStats.countries.length === 0 && <span className="text-slate-500">Sense dades geogràfiques</span>}
             </div>
          </CardContent>
      </Card>
    </div>
  );
}

function KPICard({ title, value, icon }: KPICardProps) {
  return (
    <Card className="bg-slate-900 border-slate-800 text-slate-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-400">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
      </CardContent>
    </Card>
  );
}