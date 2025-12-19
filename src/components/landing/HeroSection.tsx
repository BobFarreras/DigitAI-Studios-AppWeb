'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function HeroSection() {
  const t = useTranslations('Hero');
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  // Estat per controlar si la imatge falla

  const YOUTUBE_VIDEO_ID = "yjhoVKwSpA4";

  return (
    <section id="inici" className="pt-32 pb-20 min-h-screen flex items-center hero-pattern overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-6 md:px-10 lg:px-14 grid lg:grid-cols-2 gap-16 items-center">

        {/* COLUMNA ESQUERRA (IGUAL) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            {t('title_start')} <span className="gradient-text">{t('title_highlight_1')}</span>.<br />
            {t('title_middle')} <span className="text-foreground">{t('title_highlight_2')}</span>.
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg">
            {t('subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="#contacte">
              <Button size="lg">{t('cta_primary')}</Button>
            </Link>
            <Link href="#audit">
              <Button variant="outline" size="lg">{t('cta_secondary')}</Button>
            </Link>
          </div>
        </motion.div>

        {/* COLUMNA DRETA: Marc del Vídeo */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* CANVI CLAU: Hem tret 'aspect-video' d'aquí. 
            Ara deixem que el contingut dicti l'alçada.
          */}
          <div className="relative w-full bg-card rounded-xl border border-border shadow-2xl overflow-hidden group flex flex-col">

            {/* BARRA SUPERIOR */}
            <div className="h-8 shrink-0 border-b border-border bg-muted/50 flex items-center px-4 gap-2 z-20 relative select-none">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>

            </div>

            {/* CANVI CLAU 2: Posem 'aspect-video' AQUÍ.
               Això força que l'àrea visual sigui exactament 16:9, perfecte per YouTube i fotos.
            */}
            <div className="relative w-full aspect-video bg-black">

              {!isVideoLoaded ? (
                <button
                  onClick={() => setIsVideoLoaded(true)}
                  className="relative w-full h-full group cursor-pointer block focus:outline-none"
                  aria-label="Reproduir vídeo"
                >

                  <div className="absolute inset-0 bg-linear-to-br from-indigo-900 via-slate-900 to-black flex items-center justify-center">
                    <span className="text-white/20 font-bold text-4xl tracking-widest">DIGITAI STUDIOS</span>
                  </div>


                  {/* Overlay del botó Play */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors z-10">
                    <PlayCircle className="w-20 h-20 text-white/90 drop-shadow-2xl scale-100 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </button>
              ) : (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&mute=0&rel=0&modestbranding=1&controls=1`}
                  title="DigitAI Hero Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              )}
            </div>
          </div>



        </motion.div>
      </div>
    </section>
  );
}