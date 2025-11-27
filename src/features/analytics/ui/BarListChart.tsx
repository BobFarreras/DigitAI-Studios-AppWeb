'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  title: string;
  data: { name: string; value: number; color?: string }[];
};

export function BarListChart({ title, data }: Props) {
 return (
    <Card className="bg-slate-900 border-slate-800 text-slate-200 h-full flex flex-col min-h-0">
      <CardHeader className="pb-2 pt-4 px-4 shrink-0">
        <CardTitle className="text-sm font-medium text-slate-400">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pb-2 px-2">
        <ResponsiveContainer width="100%" height="100%">
          {/* layout="vertical" fa les barres horitzontals */}
          <BarChart layout="vertical" data={data} margin={{ left: 0, right: 30, bottom: 0, top: 0 }} barCategoryGap={4}>
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={100} 
              tick={{ fill: '#94a3b8', fontSize: 14 }} 
              interval={0}
              tickLine={false}
              axisLine={false}
              // Trunquem textos llargs
              tickFormatter={(val) => val.length > 12 ? `${val.substring(0, 12)}...` : val}
            />
            <Tooltip cursor={{fill: '#334155', opacity: 0.2}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px', color: '#fff' }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
               {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || '#6366f1'} />
               ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}