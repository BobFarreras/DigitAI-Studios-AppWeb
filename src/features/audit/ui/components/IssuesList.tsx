'use client'; // Important: useTranslations funciona en Client Components o Server Components, però aquí ja és client.

import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { AuditIssue } from '@/adapters/IWebScanner';
import { useTranslations } from 'next-intl';

type Props = { issues: AuditIssue[] };

export function IssuesList({ issues }: Props) {
  const t = useTranslations('AuditIssues'); // namespace 'AuditIssues'

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
           <AlertTriangle className="text-yellow-500" />
           {/* Pots traduir també aquest títol si vols */}
           Accions Recomanades
        </h2>
        <span className="bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold px-3 py-1 rounded-full border border-red-500/20">
           {issues?.length || 0} Errors Crítics
        </span>
      </div>
      
      <div className="grid gap-4">
        {issues?.map((issue, index) => {
           // LÒGICA DE TRADUCCIÓ INTEL·LIGENT
           // 1. Mirem si tenim traducció per aquest ID específic (ex: 'server-response-time.title')
           // 2. Si no, fem servir el text original que ve de Google (fallback)
           
           const hasTranslation = t.has(`${issue.id}.title`);
           const title = hasTranslation ? t(`${issue.id}.title`) : issue.title;
           const description = hasTranslation ? t(`${issue.id}.description`) : issue.description;

           return (
             <Card key={index} className="bg-card border border-border hover:border-primary/50 transition-colors group shadow-sm">
                <CardContent className="p-5 flex gap-4">
                   <div className="shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                   </div>
                   <div className="flex-1">
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-lg mb-1">
                          {title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                          {description}
                      </p>
                      {issue.displayValue && (
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-500/5 border border-red-500/10 text-xs font-mono text-red-600 dark:text-red-400">
                              <span>Dada:</span>
                              <span className="font-bold">{issue.displayValue}</span>
                          </div>
                      )}
                   </div>
                </CardContent>
             </Card>
           );
        })}
        
        {(!issues || issues.length === 0) && (
            <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed border-border">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Increïble! No hem trobat errors crítics.</p>
            </div>
        )}
      </div>
    </div>
  );
}