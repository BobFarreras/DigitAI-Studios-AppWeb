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
    // CANVI: bg-card i border-border (s'adapten automàticament)
    <Card className="bg-card border-border text-card-foreground p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
            {/* Títol */}
            <div className="flex items-center gap-3 lg:pr-8 lg:border-r border-border pb-4 lg:pb-0 border-b lg:border-b-0">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="text-primary h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-lg font-bold leading-tight">Dashboard</h1>
                    <p className="text-xs text-muted-foreground">Temps real</p>
                </div>
            </div>

            {/* Mètriques */}
            <div className="flex-1 grid grid-cols-2 gap-y-6 lg:flex lg:justify-around lg:items-center">
                <StatItem label="Vistes (7d)" value={views} icon={<Eye className="h-4 w-4 text-blue-500" />} />
                
                <div className="hidden lg:block h-8 w-px bg-border" />
                
                <StatItem label="Usuaris" value={visitors} icon={<Users className="h-4 w-4 text-green-500" />} />
                
                <div className="hidden lg:block h-8 w-px bg-border" />
                
                <StatItem label="Events" value={events} icon={<MousePointerClick className="h-4 w-4 text-purple-500" />} />
                
                <div className="hidden lg:block h-8 w-px bg-border" />
                
                <StatItem label="Temps Mitjà" value={avgTime} icon={<Clock className="h-4 w-4 text-orange-500" />} />
            </div>
        </div>
    </Card>
  );
}

function StatItem({ label, value, icon }: StatItemProps) {
    return (
        <div className="flex flex-col items-center gap-1 min-w-[100px]">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-2">
                {icon} {label}
            </span>
            <span className="text-2xl font-bold leading-none">
                 {value}
            </span>
        </div>
    )
}