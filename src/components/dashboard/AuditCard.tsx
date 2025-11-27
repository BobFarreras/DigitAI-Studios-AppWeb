'use client';

import { Link } from '@/routing';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Globe } from 'lucide-react';

type AuditProps = {
  id: string;
  url: string;
  status: 'processing' | 'completed' | 'failed';
  seoScore: number | null;
  createdAt: string | Date;
};

export function AuditCard({ audit }: { audit: AuditProps }) {
  return (
    <Link href={`/dashboard/audits/${audit.id}`} className="block group h-full">
      {/* Estil Fosc + Light Adaptable (bg-card en light, fons fosc en dark) */}
      <Card className="bg-card dark:bg-[#0f111a]/50 border border-border dark:border-white/5 hover:border-primary/50 transition-all h-full shadow-sm hover:shadow-md group-hover:-translate-y-1 backdrop-blur-sm">
        <CardContent className="p-6 flex flex-col h-full">
          
          {/* Header Card */}
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-muted dark:bg-white/5 rounded-lg text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
              <Globe className="w-5 h-5" />
            </div>
            <StatusBadge status={audit.status} />
          </div>

          {/* Body Card */}
          <div className="flex-grow">
            <h3 className="text-lg font-bold text-foreground dark:text-white truncate mb-1" title={audit.url}>
              {audit.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
            </h3>
            <p className="text-xs text-muted-foreground dark:text-slate-500 mb-6">
              {new Date(audit.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Footer Card */}
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-border dark:border-white/5">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">SEO SCORE</span>
              <span className={`text-xl font-bold ${getScoreColor(audit.seoScore ?? 0)}`}>
                {audit.seoScore ?? '-'}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-muted dark:bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all text-muted-foreground">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Helpers locals
function StatusBadge({ status }: { status: string }) {
  const styles = {
    completed: 'text-green-600 bg-green-100 border-green-200 dark:text-green-400 dark:bg-green-500/10 dark:border-green-500/20',
    processing: 'text-blue-600 bg-blue-100 border-blue-200 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/20 animate-pulse',
    failed: 'text-red-600 bg-red-100 border-red-200 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/20'
  };
  const label = status === 'completed' ? 'Completada' : status === 'processing' ? 'Analitzant' : 'Error';

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border ${styles[status as keyof typeof styles] || 'text-muted-foreground bg-muted border-border'}`}>
      {label}
    </span>
  );
}

function getScoreColor(score: number) {
  if (score >= 90) return 'text-green-600 dark:text-green-400';
  if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}