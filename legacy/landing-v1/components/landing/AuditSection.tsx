'use client';

import { motion } from 'framer-motion';
import { AuditForm } from '@/features/audit/ui/AuditForm';
import { useTranslations } from 'next-intl';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Link } from '@/routing'; 
import { LayoutDashboard, ArrowRight } from 'lucide-react';

interface Props {
  currentUser?: User | null;
}

export function AuditSection({ currentUser }: Props) {
  const t = useTranslations('AuditSection');
  const userName = currentUser?.email?.split('@')[0] || 'User';

  return (
    <section id="audit" className="py-14 relative overflow-hidden bg-background transition-colors duration-300">
      
      {/* FIX FONS: 
         1. Reduït 'via-primary/5' a 'via-purple-500/1'.
         Gairebé invisible, només per trencar el pla.
      */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-purple-500/1 to-transparent pointer-events-none" />
      
      {/* FIX SPOTLIGHT: 
         1. Reduït opacitat del 50% al 15% (Light) i 5% (Dark).
         Ara no molesta a la vista.
      */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-500/10 dark:bg-primary/10 blur-[120px] rounded-full pointer-events-none opacity-15 dark:opacity-5" />

      <div className="container mx-auto px-4 relative z-10">
        
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-foreground leading-tight">
              {t('title_prefix')} <span className="text-red-500/80 line-through decoration-2">{t('title_cost')}</span> {t('title_connector')} <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-purple-500 pb-2">{t('title_investment')}</span>?
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('description_stat')}
              <br className="hidden md:block" />
              {t('description_cta')}
            </p>
          </motion.div>
        </div>

        {/* LOGICA CONDICIONAL DE UI */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-xl mx-auto transform hover:scale-[1.01] transition-transform duration-500"
        >
          {currentUser ? (
            // Targeta Loguejat - Fons més net
            <div className="p-8 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/10 shadow-2xl text-center space-y-6">
                <div className="w-16 h-16 bg-slate-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto text-primary mb-4 border border-slate-100 dark:border-zinc-800">
                    <LayoutDashboard className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-foreground">
                        {t('logged_title', { name: userName })} 
                    </h3>
                    <p className="text-muted-foreground mt-2">
                        {t('logged_desc')}
                    </p>
                </div>
                
                <Link href="/dashboard/new-audit">
                    <Button className="w-full h-12 text-lg font-bold rounded-xl gradient-bg text-white hover:opacity-90 shadow-lg">
                        {t('btn_dashboard')} <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </Link>
                
                <p className="text-xs text-muted-foreground">
                    {t('logged_footer')}
                </p>
            </div>
          ) : (
            <AuditForm />
          )}
        </motion.div>

      </div>
    </section>
  );
}