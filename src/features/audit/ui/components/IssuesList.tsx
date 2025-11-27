import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface Issue {
  title: string;
  description: string;
  displayValue?: string;
}

type Props = { issues: Issue[] };

export function IssuesList({ issues }: Props) {
  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
           <AlertTriangle className="text-yellow-500" />
           Accions Recomanades
        </h2>
        <span className="bg-red-500/10 text-red-400 text-xs font-bold px-3 py-1 rounded-full border border-red-500/20">
           {issues?.length || 0} Errors Crítics
        </span>
      </div>
      
      <div className="grid gap-4">
        {issues?.map((issue, index) => (
           <Card key={index} className="bg-[#0f111a] border border-slate-800 hover:border-slate-700 transition-colors group">
              <CardContent className="p-5 flex gap-4">
                 <div className="shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                 </div>
                 <div className="flex-1">
                    <h3 className="font-bold text-slate-200 group-hover:text-white transition-colors text-lg mb-1">
                        {issue.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed mb-3">
                        {issue.description}
                    </p>
                    {issue.displayValue && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-500/5 border border-red-500/10 text-xs font-mono text-red-400">
                            <span>Impacte:</span>
                            <span className="font-bold">{issue.displayValue}</span>
                        </div>
                    )}
                 </div>
              </CardContent>
           </Card>
        ))}
        
        {(!issues || issues.length === 0) && (
            <div className="text-center py-12 bg-[#0f111a]/50 rounded-xl border border-dashed border-slate-800">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4 opacity-50" />
                <p className="text-slate-400">Increïble! No hem trobat errors crítics.</p>
            </div>
        )}
      </div>
    </div>
  );
}