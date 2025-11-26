import { requireAdmin } from '@/lib/auth/admin-guard';
import { analyticsRepository } from '@/services/container';
import { TrafficChart } from '@/features/analytics/ui/TrafficChart';
import { TopPagesCard } from '@/features/analytics/ui/TopPagesCard';
import { DeviceChart } from '@/features/analytics/ui/DeviceChart';
import { BarListChart } from '@/features/analytics/ui/BarListChart';
import { VerticalBarChart } from '@/features/analytics/ui/VerticalBarChart';
import { Card } from '@/components/ui/card';
import { Users, Eye, MousePointerClick, Clock, TrendingUp } from 'lucide-react';
import React from 'react';

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
    // LAYOUT MAESTRE: Ocupa 100% alçada, sense scroll al body
    <div className="h-[calc(100vh-2rem)] flex flex-col gap-4 overflow-hidden pb-2">
      
      {/* 1. BARRA D'ESTAT UNIFICADA (KPIs) */}
      <div className="shrink-0">
         <UnifiedStatBar 
            views={totalViews} 
            visitors={totalVisitors} 
            events={totalViews} 
            avgTime="~45s" 
         />
      </div>

      {/* 2. GRAELLA PRINCIPAL (L'espai restant) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
         
         {/* --- COLUMNA ESQUERRA (Principal - 2/3) --- */}
         <div className="lg:col-span-2 flex flex-col gap-4 h-full min-h-0">
            
            {/* A. Trànsit (Ocupa la meitat de dalt) */}
            <div className="h-1/2 min-h-0">
                <TrafficChart data={dailyStats} />
            </div>

            {/* B. Detalls Importants (Ocupa la meitat de baix, dividit en 2) */}
            <div className="h-1/2 min-h-0 grid grid-cols-2 gap-4">
                {/* Top Pàgines (Onada) */}
                <div className="h-full min-h-0">
                    <TopPagesCard data={adv.topPages} />
                </div>
                {/* Fonts de Trànsit (Mogut aquí segons petició) */}
                <div className="h-full min-h-0">
                    <BarListChart title="Fonts de Trànsit" data={adv.referrers} />
                </div>
            </div>
         </div>

         {/* --- COLUMNA DRETA (Secundària - 1/3) --- */}
         <div className="lg:col-span-1 flex flex-col gap-4 h-full min-h-0">
            
            {/* C. Dispositius (33%) */}
            <div className="flex-1 min-h-0">
               <DeviceChart data={adv.devices} />
            </div>

            {/* D. Països (33% - Mogut aquí) */}
            <div className="flex-1 min-h-0">
               <VerticalBarChart title="Top Països" data={adv.countries} />
            </div>

            {/* E. Navegadors (33%) */}
            <div className="flex-1 min-h-0">
               <BarListChart title="Navegadors" data={adv.browsers} />
            </div>
         </div>

      </div>
    </div>
  );
}

// --- COMPONENT NOU: BARRA D'ESTAT UNIFICADA ---
interface UnifiedStatBarProps {
  views: number;
  visitors: number;
  events: number;
  avgTime: string;
}

function UnifiedStatBar({ views, visitors, events, avgTime }: UnifiedStatBarProps) {
  return (
    <Card className="bg-slate-900 border-slate-800 text-slate-200 p-4 flex items-center justify-between shadow-lg">
        
        {/* Títol Integrat */}
        <div className="flex items-center gap-3 pr-8 border-r border-slate-800">
            <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="text-primary h-6 w-6" />
            </div>
            <div>
                <h1 className="text-lg font-bold text-white leading-tight">Dashboard</h1>
                <p className="text-xs text-slate-500">Temps real</p>
            </div>
        </div>

        {/* Mètriques en línia */}
        <div className="flex-1 flex justify-around items-center">
            <StatItem label="Vistes (7d)" value={views} icon={<Eye className="h-4 w-4 text-blue-400" />} />
            <div className="h-8 w-px bg-slate-800" />
            <StatItem label="Usuaris" value={visitors} icon={<Users className="h-4 w-4 text-green-400" />} />
            <div className="h-8 w-px bg-slate-800" />
            <StatItem label="Events" value={events} icon={<MousePointerClick className="h-4 w-4 text-purple-400" />} />
            <div className="h-8 w-px bg-slate-800" />
            <StatItem label="Temps Mitjà" value={avgTime} icon={<Clock className="h-4 w-4 text-orange-400" />} />
        </div>
    </Card>
  );
}

interface StatItemProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
}

function StatItem({ label, value, icon }: StatItemProps) {
    return (
        <div className="flex flex-col items-center gap-1 min-w-[100px]">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold flex items-center gap-2">
                {icon} {label}
            </span>
            <span className="text-2xl font-bold text-white leading-none">
                {value}
            </span>
        </div>
    )
}