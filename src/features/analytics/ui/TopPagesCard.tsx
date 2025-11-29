'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  data: { path: string; views: number }[];
};

export function TopPagesCard({ data }: Props) {
  // 1. Ordenem per vistes (de més a menys) per seguretat
  const sortedData = [...data].sort((a, b) => b.views - a.views);
  
  // 2. Calculem el màxim per fer les barres relatives (regla de 3)
  const maxViews = sortedData[0]?.views || 0;

  return (
    <Card className="bg-slate-900 border-slate-800 text-slate-200 h-full flex flex-col min-h-0">
      <CardHeader className="pb-2 pt-4 px-4 shrink-0">
        <div className="flex justify-between items-center">
             <CardTitle className="text-sm font-medium text-slate-400">Top Pàgines</CardTitle>
             <span className="text-xs text-slate-500 font-mono">Vistes</span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 min-h-0 pb-2 px-2">
        {/* CONTENIDOR SCROLLABLE:
            - h-full: Ocupa tot l'espai disponible
            - overflow-y-auto: Activa l'scroll vertical si no hi cap
            - pr-2: Un petit marge a la dreta perquè l'scroll no tapi text
        */}
        <div className="h-full w-full overflow-y-auto pr-2 custom-scrollbar">
          
          {sortedData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-500 text-xs">
              Sense dades suficients
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {sortedData.map((page, index) => {
                // Calculem el % d'amplada de la barra
                const percentage = maxViews > 0 ? (page.views / maxViews) * 100 : 0;

                return (
                  <div key={index} className="group">
                    {/* Fila superior: URL i Número */}
                    <div className="flex justify-between text-xs mb-1">
                      <span className="truncate pr-4 text-slate-300 font-medium" title={page.path}>
                        {page.path}
                      </span>
                      <span className="text-slate-400 font-mono tabular-nums">
                        {page.views}
                      </span>
                    </div>
                    
                    {/* Barra de progrés visual */}
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500 ease-out group-hover:bg-indigo-400"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}