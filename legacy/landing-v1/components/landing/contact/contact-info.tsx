'use client';

import { Rocket, Shield, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function ContactInfo() {
  const t = useTranslations('ContactSection');

  const features = [
    { icon: Rocket, title: t('features.agile.title'), desc: t('features.agile.desc') },
    { icon: Shield, title: t('features.tech.title'), desc: t('features.tech.desc') },
    { icon: Users, title: t('features.partners.title'), desc: t('features.partners.desc') }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }} 
      whileInView={{ opacity: 1, x: 0 }} 
      viewport={{ once: true }}
      className="space-y-10"
    >
      <div>
        <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground leading-tight">
          {t('title_prefix')} <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-purple-500 pb-2">{t('title_highlight')}</span>
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
          {t('description')}
        </p>
      </div>

      <div className="space-y-8">
        {features.map((item, i) => (
          <div key={i} className="flex gap-5 items-start group">
            {/* 🔥 FIX VISUAL:
                1. Eliminat 'bg-primary/10' -> Ara és 'bg-slate-100 dark:bg-zinc-800' (Sòlid i net).
                2. Eliminat 'backdrop-blur-sm' -> Millora rendiment i claredat.
                3. La icona es manté 'text-primary' per donar el toc de color sobre el gris.
            */}
            <div className="mt-1 w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs">
              <item.icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-xl mb-1">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}