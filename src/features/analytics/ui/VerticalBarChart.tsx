'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  title: string;
  data: { name: string; value: number; color?: string }[];
};

export function VerticalBarChart({ title, data }: Props) {
  return (
    <Card className="bg-slate-900 border-slate-800 text-slate-200 h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-slate-300">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="name" 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
              interval={0} // Mostra totes les etiquetes
              // Si els noms són llargs, els trunquem
              tickFormatter={(value) => value.length > 6 ? `${value.substring(0, 6)}..` : value}
            />
            <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{ fill: '#334155', opacity: 0.2 }}
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9', borderRadius: '8px', fontSize: '12px' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || '#10b981'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}