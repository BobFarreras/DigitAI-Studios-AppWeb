'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  data: { name: string; value: number; fill: string }[];
};

export function DeviceChart({ data }: Props) {
  if (!data || data.length === 0) {
      return (
        <Card className="bg-card border-border h-full flex items-center justify-center text-muted-foreground text-xs p-4">
            Sense dades
        </Card>
      )
  }

  return (
    <Card className="bg-card border-border text-card-foreground h-full flex flex-col shadow-sm">
      <CardHeader className="py-2 px-3 shrink-0 border-b border-border/30">
        <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Dispositius</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 p-0 relative">
        <ResponsiveContainer width="100%" height="100%">
            {/* ✅ CORRECCIÓ: Afegim 'left' i 'right' a 0 */}
            <PieChart margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="40%" 
                outerRadius="65%"
                paddingAngle={3}
                dataKey="value"
                stroke="hsl(var(--card))"
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                 contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '6px', color: 'hsl(var(--popover-foreground))', fontSize: '11px' }}
                 itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={28} 
                iconType="circle" 
                iconSize={6}
                wrapperStyle={{ fontSize: '10px', paddingTop: '0px' }}
              />
            </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}