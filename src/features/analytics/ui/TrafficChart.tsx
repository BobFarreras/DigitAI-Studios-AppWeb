'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  data: { date: string; visitors: number; views: number }[];
};

export function TrafficChart({ data }: Props) {
  return (
    // CANVI: Treiem bg-slate-900 i text-slate-200. Usem el sistema de temes.
    <Card className="bg-card border-border text-card-foreground col-span-2 h-full flex flex-col min-h-0">      
      <CardHeader>
        <CardTitle>Trànsit (Últims 7 dies)</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pb-2 px-2">
        <div className="h-full flex flex-col min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              
              {/* Grid subtil adaptable */}
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
              
              {/* Eixos adaptables */}
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              
              {/* Tooltip amb colors del tema (Variables CSS) */}
              <Tooltip
                contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))', 
                    color: 'hsl(var(--foreground))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Area type="monotone" dataKey="views" stroke="#8884d8" fillOpacity={1} fill="url(#colorViews)" name="Vistes" />
              <Area type="monotone" dataKey="visitors" stroke="#82ca9d" fillOpacity={1} fill="url(#colorVisitors)" name="Usuaris" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}