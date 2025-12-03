'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ExternalLink, Layers } from 'lucide-react';
import type { Project } from '../data/projects-data';

interface Props {
    project: Project;
    index: number;
}

export function ProjectCard({ project, index }: Props) {
    const isReversed = index % 2 !== 0;

    return (
        <div className={`flex flex-col lg:flex-row gap-8 md:gap-16 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}>

            {/* --- COLUMNA VISUAL (Mockup) --- */}
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
                    <div className="h-6 md:h-8 border-b border-border bg-muted/30 flex items-center px-3 gap-1.5 md:gap-2">
                        <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-red-500/50"></div>
                        <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-yellow-500/50"></div>
                        <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-green-500/50"></div>
                        <div className="ml-2 md:ml-4 px-2 py-0.5 rounded bg-background/50 text-[8px] md:text-[10px] text-muted-foreground font-mono border border-border w-full max-w-[150px] md:max-w-[200px] opacity-50 truncate">
                            https://{project.id}.com
                        </div>
                    </div>

                    {/* Imatge */}
                    <div className="aspect-4/3 md:aspect-video relative bg-muted/20 overflow-hidden group-hover:shadow-inner transition-all">
                        {project.image ? (
                            <Image
                                src={project.image}
                                alt={project.imageAlt}
                                fill
                                // Canviem a 'object-top' per defecte (per webs), però si són apps, potser millor 'object-center'
                                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                placeholder="blur"
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/30">
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
                className="w-full lg:flex-1 space-y-6 md:space-y-8"
            >
                <div>
                    <div className={`inline-block px-3 py-1 rounded-lg bg-linear-to-r ${project.color} bg-opacity-10 text-[10px] md:text-xs font-bold text-white mb-4 shadow-sm`}>
                        {project.tags[0]}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{project.title}</h2>
                    <p className={`text-lg md:text-xl font-medium bg-linear-to-r ${project.color} bg-clip-text text-transparent`}>
                        {project.tagline}
                    </p>
                </div>

                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    {project.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {project.stats.map((stat, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-foreground font-medium">
                            <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-linear-to-r ${project.color}`}></div>
                            {stat}
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
                            Veure Web <ExternalLink className="ml-2 w-4 h-4" />
                        </Button>
                    </a>
                </div>
            </motion.div>

        </div>
    );
}