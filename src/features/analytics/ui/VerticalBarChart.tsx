'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  title: string;
  data: { name: string; value: number; color?: string }[];
};

export function VerticalBarChart({ title, data }: Props) {
  return (
    // 1. Treiem 'col-span-2' perquè s'adapti a la columna del sidebar
    <Card className="bg-card border-border text-card-foreground h-full flex flex-col min-h-0 shadow-sm">
      <CardHeader className="py-2 px-3 shrink-0 border-b border-border/30">
        <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 p-0 relative">
        <div className="absolute inset-0 pt-2 pb-1 pr-2 pl-0">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart 
                data={data} 
                // 2. Ajustem marges: 'left: -20' era el problema. Posem 0 i deixem que YAxis gestioni l'ample.
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                
                <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10} 
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    // Trunquem a 3 lletres (codi país) o pocs caràcters per evitar solapament
                    tickFormatter={(value) => value.substring(0, 3).toUpperCase()}
                    dy={5}
                />
                
                <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    width={30} // Espai fix petit per als números de l'esquerra
                />
                
                <Tooltip 
                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
                    contentStyle={{ 
                        backgroundColor: 'hsl(var(--popover))', 
                        borderColor: 'hsl(var(--border))', 
                        color: 'hsl(var(--popover-foreground))', 
                        borderRadius: '6px', 
                        fontSize: '11px',
                        padding: '8px'
                    }}
                    itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                />
                
                <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={1000}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || '#10b981'} />
                    ))}
                </Bar>
            </BarChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}