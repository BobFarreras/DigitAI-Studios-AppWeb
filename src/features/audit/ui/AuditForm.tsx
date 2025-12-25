'use client';

import { useActionState } from 'react'; // Next.js 15+ (si uses 14, canvia a useFormState)
import { processWebAudit } from '@/actions/audit'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

export function AuditForm() {
  const [state, action, isPending] = useActionState(processWebAudit, { message: '', errors: {} });
  const t = useTranslations('AuditForm');

  return (
    <div className="w-full">
      <div className="border border-border rounded-2xl p-8 bg-white/50 dark:bg-white/2 backdrop-blur-xl shadow-xl dark:shadow-2xl transition-all duration-300">
        
        <h3 className="text-xl font-bold text-center text-foreground mb-6 flex items-center justify-center gap-2">
          <Search className="w-5 h-5 text-primary" />
          {t('title')}
        </h3>
        
        <form action={action} className="space-y-4">
          
          <div className="space-y-1">
            <div className="relative flex items-center group">
              
              {/* PREFIX VISUAL (No s'envia, només decora) */}
              <div className="absolute left-3 flex items-center pointer-events-none select-none z-10">
                <span className="text-muted-foreground text-sm font-medium bg-slate-100 dark:bg-white/10 px-2 py-1 rounded border border-border/50">
                  https://
                </span>
              </div>

              {/* INPUT REAL */}
              <Input 
                name="url" 
                placeholder="digitaistudios.com" 
                className={cn(
                  "pl-20 bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-foreground h-12 transition-all",
                  "focus:border-primary/50 placeholder:text-muted-foreground",
                  state.errors?.url && "border-red-500 focus:border-red-500"
                )}
              />
            </div>

            {state.errors?.url && (
              <p className="text-red-500 text-xs flex items-center gap-1 mt-1 ml-1 animate-in slide-in-from-top-1">
                <AlertCircle className="w-3 h-3" /> {state.errors.url[0]}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Input 
              name="email" 
              placeholder={t('placeholder_email')} 
              className={cn(
                "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-foreground h-12 transition-all",
                "focus:border-primary/50 placeholder:text-muted-foreground",
                state.errors?.email && "border-red-500 focus:border-red-500"
              )}
            />
            {state.errors?.email && (
              <p className="text-red-500 text-xs flex items-center gap-1 mt-1 ml-1 animate-in slide-in-from-top-1">
                <AlertCircle className="w-3 h-3" /> {state.errors.email[0]}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={isPending} 
            className="w-full h-12 mt-2 text-base font-semibold rounded-lg gradient-bg text-white border-0 hover:opacity-90 shadow-lg shadow-primary/20 transition-all"
          >
            {isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t('cta_loading')}</>
            ) : (
              t('cta_button')
            )}
          </Button>
          
          {state.message && (
            <p className={cn(
              "text-center text-sm mt-4 p-2 rounded-lg border border-border/50",
              state.errors && Object.keys(state.errors).length > 0 ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"
            )}>
              {state.message}
            </p>
          )}
        </form>
      </div>
      
      <p className="text-center text-xs text-muted-foreground mt-4 opacity-60">
        {t('privacy_note')}
      </p>
    </div>
  );
}