import { Card } from '@/components/ui/card';
import { Users, Eye, MousePointerClick, Clock, TrendingUp } from 'lucide-react';

interface UnifiedStatBarProps {
  views: number;
  visitors: number;
  events: number;
  avgTime: string;
}

interface StatItemProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
}

export function UnifiedStatBar({ views, visitors, events, avgTime }: UnifiedStatBarProps) {
  return (
    <Card className="bg-slate-900 border-slate-800 text-slate-200 p-4 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
            {/* Títol: Al mòbil a dalt, a l'escriptori a l'esquerra amb vora */}
            <div className="flex items-center gap-3 lg:pr-8 lg:border-r lg:border-slate-800 pb-4 lg:pb-0 border-b border-slate-800 lg:border-b-0">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="text-primary h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-white leading-tight">Dashboard</h1>
                    <p className="text-xs text-slate-500">Temps real</p>
                </div>
            </div>

            {/* Mètriques: Grid 2x2 al mòbil, Flex row a l'escriptori */}
            <div className="flex-1 grid grid-cols-2 gap-y-6 lg:flex lg:justify-around lg:items-center">
                <StatItem label="Vistes (7d)" value={views} icon={<Eye className="h-4 w-4 text-blue-400" />} />
                
                {/* Separador només en escriptori */}
                <div className="hidden lg:block h-8 w-px bg-slate-800" />
                
                <StatItem label="Usuaris" value={visitors} icon={<Users className="h-4 w-4 text-green-400" />} />
                
                <div className="hidden lg:block h-8 w-px bg-slate-800" />
                
                <StatItem label="Events" value={events} icon={<MousePointerClick className="h-4 w-4 text-purple-400" />} />
                
                <div className="hidden lg:block h-8 w-px bg-slate-800" />
                
                <StatItem label="Temps Mitjà" value={avgTime} icon={<Clock className="h-4 w-4 text-orange-400" />} />
            </div>
        </div>
    </Card>
  );
}

// StatItem es queda igual
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