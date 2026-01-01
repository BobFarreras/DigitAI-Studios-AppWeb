'use client';

import { motion } from 'framer-motion';

import { useTranslations } from 'next-intl';

export function ProjectsHero() {
  const t = useTranslations('ProjectsHero');

  return (
    <section className="pt-32 pb-16 md:pt-48 md:pb-24 relative overflow-hidden">
      {/* Fons decoratiu */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 md:w-250 h-75 md:h-125 bg-primary/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none opacity-50" />
      
      {/* ✅ CORRECCIÓ: Padding responsiu */}
      <div className="container mx-auto px-6 md:px-10 lg:px-14 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
  
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground leading-tight">
            {t('title_prefix')} <br className="hidden md:block" />
            <span className="gradient-text">{t('title_highlight')}</span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            {t('description')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}