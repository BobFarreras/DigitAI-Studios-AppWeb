'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  data: { path: string; views: number }[];
};

export function TopPagesCard({ data }: Props) {
  // Ordenar i limitar
  const sortedData = [...data].sort((a, b) => b.views - a.views);
  const maxViews = sortedData[0]?.views || 0;

  return (
    <Card className="bg-card border-border text-card-foreground h-full flex flex-col shadow-sm overflow-hidden">
      <CardHeader className="py-3 px-4 shrink-0 border-b border-border/40 bg-muted/10">
        <div className="flex justify-between items-center">
             <CardTitle className="text-sm font-bold">Pàgines Més Visitades</CardTitle>
             <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Vistes</span>
        </div>
      </CardHeader>
      
      {/* Scrollable Area */}
      <CardContent className="flex-1 overflow-y-auto p-0 min-h-0 custom-scrollbar">
        <div className="flex flex-col">
           {sortedData.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">Sense dades</div>
           ) : (
               sortedData.map((page, index) => {
                    const percentage = maxViews > 0 ? (page.views / maxViews) * 100 : 0;
                    return (
                      <div key={index} className="group px-4 py-2.5 border-b border-border/20 last:border-0 hover:bg-muted/30 transition-colors relative">
                        {/* Contingut Text */}
                        <div className="flex justify-between text-xs mb-1.5 relative z-10 font-medium">
                          <span className="truncate pr-4 w-[85%]" title={page.path}>
                            {page.path}
                          </span>
                          <span className="text-foreground font-mono tabular-nums w-[15%] text-right">
                            {page.views}
                          </span>
                        </div>
                        
                        {/* Barra de Progrés (Background) */}
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                             className="h-full bg-primary/70 group-hover:bg-primary transition-all duration-500 rounded-full"
                             style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
               })
           )}
        </div>
      </CardContent>
    </Card>
  );
}