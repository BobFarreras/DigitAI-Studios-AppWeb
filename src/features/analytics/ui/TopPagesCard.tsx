'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  data: { path: string; views: number }[];
};

export function TopPagesCard({ data }: Props) {
  const sortedData = [...data].sort((a, b) => b.views - a.views);
  const maxViews = sortedData[0]?.views || 0;

  return (
    <Card className="bg-card border-border text-card-foreground h-full flex flex-col min-h-0">
      <CardHeader className="pb-2 pt-4 px-4 shrink-0">
        <div className="flex justify-between items-center">
             <CardTitle className="text-sm font-medium">Top Pàgines</CardTitle>
             <span className="text-xs text-muted-foreground font-mono">Vistes</span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 min-h-0 pb-2 px-2">
        <div className="h-full w-full overflow-y-auto pr-2 custom-scrollbar">
          {sortedData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
              Sense dades suficients
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {sortedData.map((page, index) => {
                const percentage = maxViews > 0 ? (page.views / maxViews) * 100 : 0;

                return (
                  <div key={index} className="group">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="truncate pr-4 font-medium" title={page.path}>
                        {page.path}
                      </span>
                      <span className="text-muted-foreground font-mono tabular-nums">
                        {page.views}
                      </span>
                    </div>
                    
                    {/* Barra de fons (muted) i Barra de progrés (primary) */}
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary/70 rounded-full transition-all duration-500 ease-out group-hover:bg-primary"
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