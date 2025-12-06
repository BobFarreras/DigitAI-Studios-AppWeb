'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  data: { name: string; value: number; fill: string }[];
};

export function DeviceChart({ data }: Props) {
  return (
    <Card className="bg-card border-border text-card-foreground col-span-2 h-full flex flex-col min-h-0">
      <CardHeader>
        <CardTitle>Dispositiusss</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <div className="h-full flex flex-col min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} stroke="rgba(0,0,0,0.2)" />
                ))}
              </Pie>
              <Tooltip 
                 contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                 itemStyle={{ color: '#fff' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}