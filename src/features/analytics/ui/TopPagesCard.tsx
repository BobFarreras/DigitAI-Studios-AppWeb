import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  data: { path: string; views: number }[];
};

export function TopPagesCard({ data }: Props) {
  // Calculem el màxim per fer les barres de progrés relatives
  const maxViews = Math.max(...data.map(d => d.views), 1);

  return (
    <Card className="bg-slate-900 border-slate-800 text-slate-200">
      <CardHeader>
        <CardTitle>Pàgines més visitades (30d)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((page) => (
          <div key={page.path} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="truncate max-w-[250px] font-medium text-slate-300" title={page.path}>
                {page.path}
              </span>
              <span className="text-slate-400">{page.views} vistes</span>
            </div>
            {/* Barra de progrés manual simple */}
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${(page.views / maxViews) * 100}%` }}
              />
            </div>
          </div>
        ))}

        {data.length === 0 && (
            <p className="text-center text-slate-500 py-4">Encara no hi ha dades suficients.</p>
        )}
      </CardContent>
    </Card>
  );
}