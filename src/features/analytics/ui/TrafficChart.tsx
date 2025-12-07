'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  data: { date: string; visitors: number; views: number }[];
};

export function TrafficChart({ data }: Props) {
  return (
    // NOTA: Eliminem el <Card> pare si ja l'hem posat al layout, 
    // però si el deixem, li traiem la vora per no duplicar.
    <div className="h-full w-full flex flex-col">      
      <div className="py-3 px-4 shrink-0 border-b border-border/40">
        <h3 className="text-sm font-bold text-foreground">Trànsit (Últims 7 dies)</h3>
      </div>
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
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
              
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
              
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} 
                dy={10}
                interval="preserveStartEnd"
              />
              
              <Tooltip
                contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))', 
                    color: 'hsl(var(--foreground))',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              
              <Area type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" name="Vistes" />
              <Area type="monotone" dataKey="visitors" stroke="#82ca9d" strokeWidth={2} fillOpacity={1} fill="url(#colorVisitors)" name="Usuaris" />
            </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}