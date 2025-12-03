'use client';

import { motion } from 'framer-motion';
import { AuditForm } from '@/features/audit/ui/AuditForm';
import { useTranslations } from 'next-intl';

export function AuditSection() {
  const t = useTranslations('AuditSection');

  return (
    <section id="audit" className="py-14 relative overflow-hidden bg-background transition-colors duration-300">
      
      {/* FONS DECORATIU */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 dark:bg-primary/10 blur-[120px] rounded-full pointer-events-none opacity-50" />

      <div className="container mx-auto px-4 relative z-10">
        
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-foreground leading-tight">
              {t('title_prefix')} <span className="text-red-500/80 line-through decoration-2">{t('title_cost')}</span> {t('title_connector')} <span className="gradient-text">{t('title_investment')}</span>?
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('description_stat')}
              <br className="hidden md:block" />
              {t('description_cta')}
            </p>
          </motion.div>
        </div>

        {/* FORMULARI */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-xl mx-auto transform hover:scale-[1.01] transition-transform duration-500"
        >
          <AuditForm />
        </motion.div>

      </div>
    </section>
  );
}