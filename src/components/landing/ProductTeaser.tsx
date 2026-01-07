'use client';

import { useState, useEffect } from 'react';
import { ArrowRight} from 'lucide-react';
import Link from 'next/link';
import Image, { type StaticImageData } from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { useTheme } from 'next-themes';

// Importem dades i tipus
import { PROJECTS} from '@/features/projects/data/projects-data';
import type { Project } from '@/types/models';

export function ProductTeaser() {
    const t = useTranslations('ProductTeaser');
    const locale = useLocale();
    const { resolvedTheme } = useTheme();

    const [mounted, setMounted] = useState(false);
    const [activeIndex, setActiveIndex] = useState(1);
    const [isMobile, setIsMobile] = useState(false);

    // ✅ CORRECCIÓ: Utilitzem setTimeout per evitar "Synchronous setState warning"
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);

        // Movem la inicialització al final de la pila d'execució
        const timer = setTimeout(() => {
            setMounted(true);
            checkMobile(); // Comprovem mòbil inicialment
        }, 0);

        // Afegim el listener
        window.addEventListener('resize', checkMobile);

        // Neteja
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    // --- HELPER IMATGES ---
    const getProjectImage = (project: Project): StaticImageData => {
        if (!mounted) return project.image;
        if (!project.adaptiveImages) return project.image;
        const isDark = resolvedTheme === 'dark';
        const localeImages = project.adaptiveImages[locale] || project.adaptiveImages.default;
        if (!localeImages) return project.image;
        return isDark ? (localeImages.dark || project.image) : (localeImages.light || project.image);
    };

    // --- NAVIGATION ---
    const nextProject = () => setActiveIndex((prev) => (prev + 1) % PROJECTS.length);
    const prevProject = () => setActiveIndex((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length);

    // Calcular posició relativa (-1, 0, 1...)
    const getRelativePosition = (index: number) => {
        const len = PROJECTS.length;
        let diff = (index - activeIndex + len) % len;
        if (diff > len / 2) diff -= len;
        return diff;
    };

    return (
        <section className="py-8 md:py-24 container mx-auto px-6 md:px-10 lg:px-14 overflow-hidden">

            <div className="flex flex-col lg:flex-row items-center">

                {/* --- 1. TEXT A L'ESQUERRA --- */}
                <div className="w-full lg:w-5/12 relative z-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                        {t('title_prefix')} <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-purple-500">
                            {t('title_highlight')}
                        </span>
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
                        {t.rich('description', {
                            strong: (chunks) => <strong className="text-foreground">{chunks}</strong>,
                            br: () => <br />
                        })}
                    </p>
                    <Link href="/projectes" className="inline-flex items-center font-bold text-foreground hover:text-primary transition-colors group">
                        {t('cta')}
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* --- 2. VISUALS (DRETA) --- */}
                <div className="w-full lg:w-7/12 flex flex-col items-center justify-center relative">

                    {/* ZONA DE CARTES:
                       - Mòbil: h-[280px] (Reduït per eliminar espai buit)
                       - Desktop: h-[450px] (Ampli pel ventall)
                    */}
                    <div className="relative w-full h-60 lg:h-112.5 flex items-center justify-center perspective-1000">
                        <AnimatePresence initial={false}>
                            {PROJECTS.map((project, index) => {
                                const position = getRelativePosition(index);
                                const isActive = position === 0;

                                // LÒGICA VISUAL (Mòbil Pila / Desktop Ventall)
                                const x = isMobile ? position * 15 : position * 180;
                                const y = isMobile ? Math.abs(position) * -10 : Math.abs(position) * 40;
                                const rotate = isMobile ? position * 2 : position * 15;
                                const scale = isActive ? 1 : 0.85;
                                const zIndex = isActive ? 50 : 10 - Math.abs(position);
                                const opacity = isActive ? 1 : 0.5;

                                return (
                                    <motion.div
                                        key={project.id}
                                        className="absolute origin-bottom touch-none"
                                        initial={false}
                                        animate={{ x, y, rotate, scale, zIndex, opacity }}
                                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                                        style={{
                                            width: isMobile ? '85%' : '400px',
                                            aspectRatio: '16/9'
                                        }}
                                    >
                                        <div
                                            onClick={() => isActive ? null : (position > 0 ? nextProject() : prevProject())}
                                            className={`relative w-full h-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 cursor-pointer
                                                ${isActive ? 'ring-2 ring-primary/20' : 'hover:brightness-110 grayscale-[0.3]'}
                                            `}
                                        >
                                            {/* LINK REAL (Només carta central) */}
                                            {isActive && <Link href="/projectes" className="absolute inset-0 " />}

                                            {/* GLOW (Només activa) */}
                                            {isActive && (
                                                <div className={`absolute -inset-10 bg-linear-to-r ${project.color} opacity-40 blur-[50px] animate-pulse -z-10`}></div>
                                            )}

                                            {/* IMATGE */}
                                            <div className="relative w-full h-full bg-slate-900">
                                                <Image
                                                    src={getProjectImage(project)}
                                                    alt={project.imageAlt}
                                                    fill
                                                    className="object-cover object-top"
                                                    priority={isActive}
                                                />

                                                {!isActive && <div className="absolute inset-0 bg-black/40 transition-opacity" />}

                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* --- LOGO NAVIGATION (Sense Fletxes) --- */}
                    <div className="flex gap-3 md:gap-4 bg-slate-100 dark:bg-white/5 p-2 rounded-full border border-slate-200 dark:border-white/5 backdrop-blur-sm mt-0 z-30">
                        {PROJECTS.map((project, idx) => {
                            const isActive = idx === activeIndex;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`
                                        relative rounded-full overflow-hidden transition-all duration-300 flex items-center justify-center bg-white dark:bg-black/40
                                        ${isActive
                                            ? 'w-10 h-10 md:w-12 md:h-12 ring-2 ring-primary shadow-lg scale-110 opacity-100 grayscale-0'
                                            : 'w-8 h-8 md:w-10 md:h-10 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 scale-100'
                                        }
                                    `}
                                    aria-label={`Seleccionar ${project.title}`}
                                >
                                    <div className="relative w-full h-full p-1.5">
                                        <Image
                                            src={project.logo}
                                            alt={project.title}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
}