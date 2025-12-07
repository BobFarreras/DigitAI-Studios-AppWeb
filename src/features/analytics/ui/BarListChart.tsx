'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  title: string;
  data: { name: string; value: number; color?: string }[];
};

export function BarListChart({ title, data }: Props) {
  return (
    <Card className="bg-card border-border text-card-foreground h-full flex flex-col shadow-sm">      
      <CardHeader className="py-2 px-3 shrink-0 border-b border-border/30">
        <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 px-2 pb-0 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            layout="vertical" 
            data={data} 
            margin={{ left: 0, right: 10, bottom: 0, top: 0 }} 
            barCategoryGap={8} // Espai entre barres
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              width={75} // Amplada reservada pel text esquerre
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => val.length > 9 ? `${val.substring(0, 9)}..` : val}
            />
            <Tooltip 
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }} 
                contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', fontSize: '11px', color: 'hsl(var(--popover-foreground))', borderRadius: '6px' }} 
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={10} animationDuration={1000}>
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