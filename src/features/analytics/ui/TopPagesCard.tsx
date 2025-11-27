'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  data: { path: string; views: number }[];
};

export function TopPagesCard({ data }: Props) {
  return (
    <Card className="bg-slate-900 border-slate-800 text-slate-200 h-full flex flex-col min-h-0">
      <CardHeader className="pb-2 pt-4 px-4 shrink-0">
        <CardTitle className="text-sm font-medium text-slate-400">Top Pàgines (Vistes)</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pb-2 px-2">
        <div className="h-full w-full">
          {/* Si no hi ha dades, mostrem missatge */}
          {data.length === 0 ? (
             <div className="flex items-center justify-center h-full text-slate-500 text-xs">
               Sense dades suficients
             </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                {/* 1. GRADIENT LILA/BLAU (Igual que Traffic) */}
                <defs>
                  <linearGradient id="colorPagesWave" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                
                {/* Eix X: Les rutes (Paths) */}
                <XAxis 
                  dataKey="path" 
                  stroke="#94a3b8" 
                  fontSize={13} 
                  tickLine={false} 
                  axisLine={false}
                  interval={0} // Intentem mostrar-les totes
                  // Trunquem el text perquè càpiga a l'eix
                  tickFormatter={(val) => val.length > 8 ? `..${val.slice(-8)}` : val}
                />
                
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9', borderRadius: '8px', fontSize: '12px' }}
                />
                
                {/* 2. L'ONADA (Area) */}
                <Area 
                  type="monotone" // Això fa la corba suau
                  dataKey="views" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorPagesWave)" 
                  name="Vistes"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}