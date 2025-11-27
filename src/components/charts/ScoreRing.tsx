'use client';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export function ScoreRing({ score, label }: { score: number; label: string }) {
  // Color dinàmic
  const color = score >= 90 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  
  const data = [{ name: 'Score', value: score, fill: color }];

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="relative w-[120px] h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                    innerRadius="80%" 
                    outerRadius="100%" 
                    barSize={10} 
                    data={data} 
                    startAngle={90} 
                    endAngle={-270}
                >
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background dataKey="value" cornerRadius={10} />
                </RadialBarChart>
            </ResponsiveContainer>
            {/* Text al centre */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold" style={{ color }}>{score}</span>
            </div>
        </div>
        <p className="mt-2 text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</p>
    </div>
  );
}