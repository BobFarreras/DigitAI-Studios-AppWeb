'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ProjectsCTA() {
  const t = useTranslations('ProjectsCTA');

  return (
    <section className="py-16 md:py-24 border-t border-border bg-muted/10">
       <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 md:mb-6">
             {t('title_prefix')} <span className="gradient-text">{t('title_highlight')}</span>{t('title_suffix')}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mb-8 md:mb-10 max-w-xl mx-auto px-4">
             {t('description')}
          </p>
          <Link href="/#contacte">
             <Button size="lg" className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg rounded-full gradient-bg text-white hover:opacity-90 shadow-xl w-full sm:w-auto transition-transform hover:scale-105">
                {t('button')} <ArrowRight className="ml-2 w-5 h-5" />
             </Button>
          </Link>
       </div>
    </section>
  );
}