'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  title: string;
  data: { name: string; value: number; color?: string }[];
};

export function BarListChart({ title, data }: Props) {
  // 🔍 CONSOLE LOG PER DEPURAR
  console.log(`[BarListChart] Dades rebudes per "${title}":`, data);

  // Protecció contra dades buides o nul·les
  const safeData = Array.isArray(data) ? data : [];

  return (
    <Card className="bg-card border-border text-card-foreground flex flex-col shadow-sm h-full">      
      <CardHeader className="py-3 px-4 shrink-0 border-b border-border/30">
        <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 p-4 min-h-62.5"> 
        <div className="w-full h-full min-h-50">
            {safeData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground border-2 border-dashed border-muted/50 rounded-lg">
                    {/* Missatge visible si no hi ha dades */}
                    Sense dades per {title}
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    layout="vertical" 
                    data={safeData} 
                    margin={{ left: 0, right: 10, bottom: 0, top: 0 }} 
                    barCategoryGap={12}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={80}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 500 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => val.length > 10 ? `${val.substring(0, 10)}..` : val}
                    />
                    <Tooltip 
                        cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }} 
                        contentStyle={{ 
                            backgroundColor: 'hsl(var(--popover))', 
                            borderColor: 'hsl(var(--border))', 
                            fontSize: '12px', 
                            color: 'hsl(var(--popover-foreground))', 
                            borderRadius: '6px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }} 
                        itemStyle={{ padding: 0 }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16} animationDuration={800}>
                      {safeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || '#6366f1'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
            )}
        </div>
      </CardContent>
    </Card>
  );
}