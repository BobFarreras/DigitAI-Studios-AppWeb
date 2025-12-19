'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ExternalLink, Layers } from 'lucide-react';
import type { Project } from '@/types/models';
import { useTranslations, useLocale } from 'next-intl';

interface Props {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: Props) {
  const isReversed = index % 2 !== 0;
  const t = useTranslations('ProjectCard');
  const locale = useLocale();

  const adaptiveSet = project.adaptiveImages
    ? (project.adaptiveImages[locale] || project.adaptiveImages['default'])
    : null;

  return (
    <div className={`flex flex-col lg:flex-row gap-8 md:gap-16 items-start ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
      
      {/* --- COLUMNA VISUAL --- */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full lg:flex-1 relative group"
      >
        {/* Glow */}
        <div className={`absolute inset-0 bg-linear-to-r ${project.color} opacity-20 blur-[60px] group-hover:opacity-30 transition-opacity duration-500 pointer-events-none`}></div>

        {/* Marc Navegador */}
        <div className="relative rounded-xl border border-border bg-card shadow-2xl overflow-hidden transform transition-transform duration-500 group-hover:scale-[1.02] md:group-hover:-translate-y-2">
          
          {/* Header */}
          <div className="h-6 md:h-8 border-b border-border bg-muted/30 flex items-center px-3 gap-1.5 md:gap-2 relative z-20">
            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-red-500/50"></div>
            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-yellow-500/50"></div>
            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-green-500/50"></div>
            <div className="ml-2 md:ml-4 px-2 py-0.5 rounded bg-background/50 text-[8px] md:text-[10px] text-muted-foreground font-mono border border-border w-full max-w-37.5 md:max-w-50 opacity-50 truncate">
              https://{project.id}.com
            </div>
          </div>

          {/* CONTENIDOR HÍBRID:
             - Mòbil: w-full h-auto (S'adapta a la imatge, NO TALLA)
             - Desktop (md): md:aspect-video (Força format gran panoràmic)
          */}
          <div className="relative w-full h-auto md:aspect-video bg-muted/20 overflow-hidden group-hover:shadow-inner transition-all">
            {adaptiveSet ? (
              <>
                {/* LIGHT MODE */}
                <div className="block dark:hidden w-full h-full">
                    <Image
                        src={adaptiveSet.light}
                        alt={`${project.imageAlt} (Light)`}
                        width={1200}
                        height={900}
                        // LA MÀGIA DEL CSS:
                        // Mòbil: w-full h-auto (es veu tota)
                        // Desktop: h-full object-cover (omple el requadre gran, retalla si cal per omplir)
                        className="w-full h-auto md:h-full md:object-cover md:object-top transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        placeholder="blur"
                    />
                </div>
                {/* DARK MODE */}
                <div className="hidden dark:block w-full h-full">
                    <Image
                        src={adaptiveSet.dark}
                        alt={`${project.imageAlt} (Dark)`}
                        width={1200}
                        height={900}
                        className="w-full h-auto md:h-full md:object-cover md:object-top transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        placeholder="blur"
                    />
                </div>
              </>
            ) : project.image ? (
              <Image
                src={project.image}
                alt={project.imageAlt}
                width={1200}
                height={900}
                className="w-full h-auto md:h-full md:object-cover md:object-top transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                placeholder="blur"
              />
            ) : (
              <div className="aspect-video flex flex-col items-center justify-center text-muted-foreground/30">
                <Layers className="w-12 h-12 md:w-16 md:h-16 mb-4" />
                <span className="text-xs md:text-sm font-bold uppercase tracking-widest">Captura de {project.title}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* --- COLUMNA TEXT --- */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full lg:flex-1 space-y-6 md:space-y-8 py-2"
      >
        <div>
          <div className={`inline-block px-3 py-1 rounded-lg bg-linear-to-r ${project.color} bg-opacity-10 text-[10px] md:text-xs font-bold text-white mb-4 shadow-sm`}>
            {project.tags[0]}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{project.title}</h2>
          <p className={`text-lg md:text-xl font-medium bg-linear-to-r ${project.color} bg-clip-text text-transparent`}>
            {t(`${project.id}.tagline`)}
          </p>
        </div>

        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          {t(`${project.id}.description`)}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-foreground font-medium">
              <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-linear-to-r ${project.color}`}></div>
              {t(`${project.id}.stats.${i}`)}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {project.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-0.5 md:px-3 md:py-1 rounded-full border border-border bg-muted/20 text-[10px] md:text-xs font-medium text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-4 pt-4">
          <a href={project.link} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto gradient-bg text-white border-0 shadow-lg hover:opacity-90 transition-transform hover:-translate-y-1">
              {t('view_web')} <ExternalLink className="ml-2 w-4 h-4" />
            </Button>
          </a>
        </div>
      </motion.div>

    </div>
  );
}