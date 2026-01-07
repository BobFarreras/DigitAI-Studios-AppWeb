'use client';

import { useSearchParams } from 'next/navigation';
import { FileText, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function AuditReadyBanner() {
  const t = useTranslations('Auth.audit_banner');
  const searchParams = useSearchParams();
  
  const isAuditReady = searchParams.get('trigger') === 'audit_ready';
  const email = searchParams.get('email') || 'el teu correu';

  if (!isAuditReady) return null;

  return (
    <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30 shadow-sm animate-in slide-in-from-top-2 duration-500">
      <div className="flex items-start gap-4">
        
        <div className="mt-1 rounded-full bg-emerald-100 p-1.5 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400 shrink-0">
          <CheckCircle2 className="h-5 w-5" />
        </div>

        <div className="space-y-2">
          <div>
            <h3 className="font-bold text-emerald-950 dark:text-emerald-50 text-base leading-none mb-1">
              {t('title')}
            </h3>
            
            <p className="text-sm text-emerald-800 dark:text-emerald-300 leading-snug">
              {/* ✅ CORRECCIÓ: Usem claus diferents per a la variable i l'etiqueta */}
              {t.rich('sent_to', {
                email: email, // 1. La variable {email} del JSON
                highlight: (chunks) => ( // 2. L'etiqueta <highlight> del JSON
                  <span className="font-semibold underline decoration-emerald-300/50 mx-1">
                    {chunks}
                  </span>
                )
              })}
            </p>
          </div>
          
          <div className="flex items-start gap-2 rounded-lg bg-white/80 dark:bg-black/40 p-2.5 text-xs font-medium text-emerald-900 dark:text-emerald-200 border border-emerald-100 dark:border-emerald-800/50">
            <FileText className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            <span>{t('unlock_report')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}