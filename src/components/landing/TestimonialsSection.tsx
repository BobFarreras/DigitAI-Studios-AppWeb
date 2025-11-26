'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Globe, Smartphone, Zap, Users, Code, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Testimonial } from '@/lib/data';

type Props = {
  testimonials: Testimonial[];
};

export function TestimonialsSection({ testimonials }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = 3; 

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getVisibleItems = () => {
    const items = [];
    for (let i = 0; i < itemsToShow; i++) {
      items.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return items;
  };

  return (
    <section id="testimonis" className="py-16 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        
        {/* CAPÇALERA */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
           <div className="max-w-2xl">
          
              <h2 className="text-3xl lg:text-5xl font-bold text-foreground leading-tight">
                No ens creguis a nosaltres. <br/>
                Mira el que hem <span className="gradient-text">Construït</span>.
              </h2>
           </div>

           {/* CONTROLS */}
           <div className="flex gap-3">
              <button onClick={prevSlide} className="p-3 rounded-full border border-border bg-card hover:bg-primary hover:text-white transition-all shadow-sm">
                 <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={nextSlide} className="p-3 rounded-full border border-border bg-card hover:bg-primary hover:text-white transition-all shadow-sm">
                 <ChevronRight className="w-6 h-6" />
              </button>
           </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6">
          <AnimatePresence mode='popLayout'>
            {getVisibleItems().map((item, i) => (
              <motion.div
                key={`${item.id}-${i}`} 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="h-[450px] perspective-1000"
              >
                 <TestimonialCard item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}

// --- TARGETA INDIVIDUAL (EFECTE CARPETA/FITXER) ---

function TestimonialCard({ item }: { item: Testimonial }) {
   return (
      <div className="relative w-full h-full group">
         
         {/* CAPA 1: EL PROJECTE (FITXER) */}
         {/* MILLORA 1: Ara puja molt més (-translate-y-24) perquè es vegi bé la web/app.
            Afegim z-index dinàmic perquè al pujar es posi per sobre si calgués, 
            però mantenim l'efecte de "sortir de la carpeta".
         */}
         <div className="absolute inset-x-4 top-4 bottom-20  transition-all duration-500 cubic-bezier(0.25, 0.8, 0.25, 1) group-hover:-translate-y-20 ">
            <div className="w-full h-full rounded-t-xl overflow-hidden border border-primary/20 bg-slate-900 dark:bg-black shadow-2xl group-hover:shadow-primary/20">
               {item.projectType === 'web' && <MockupWeb url={item.projectUrl} image={item.image} title={item.company} />}
               {item.projectType === 'app' && <MockupApp image={item.image} title={item.company} />}
               {item.projectType === 'automation' && <MockupAutomation />}
            </div>
         </div>

         {/* CAPA 2: EL TESTIMONI (CARPETA) */}
         <div className="absolute bottom-0 left-0 right-0 h-[280px] bg-card border border-border rounded-2xl p-8 shadow-xl z-10 transition-transform duration-500 group-hover:translate-y-6 flex flex-col">
            
            <Quote className="absolute top-6 right-6 text-primary/10 w-12 h-12 rotate-180" />

            <div className="flex items-center gap-3 mb-4">
               <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary/20 to-blue-500/20 border border-primary/30 flex items-center justify-center text-lg font-bold text-primary">
                  {item.name.charAt(0)}
               </div>
               <div>
                  <div className="font-bold text-foreground">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.company}</div>
               </div>
            </div>

            <div className="flex gap-1 mb-4">
               {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 dark:text-slate-700'}`} />
               ))}
            </div>

            <p className="text-base text-muted-foreground leading-relaxed overflow-hidden text-ellipsis">
               "{item.text}"
            </p>
            
            <div className="mt-auto pt-4 border-t border-border flex justify-between items-center opacity-50">
               <span className="text-[10px] uppercase tracking-widest font-bold">Projecte Realitzat</span>
               <div className="w-16 h-1 bg-foreground/10 rounded-full"></div>
            </div>
         </div>
      </div>
   )
}

// --- MOCKUPS VISUALS ---

function MockupWeb({ url, image, title }: { url?: string, image?: string, title: string }) {
   const Wrapper = url ? Link : 'div';
   return (
    
      <Wrapper href={url || '#'} target={url ? "_blank" : undefined} className="block w-full h-full cursor-pointer group/mockup">
         <div className="w-full h-full bg-slate-50 dark:bg-[#0f111a] flex flex-col relative">
            
            {/* MILLORA 2: OVERLAY AMB BOTÓ "VISITAR" */}
            {url && (
               <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover/mockup:opacity-100 transition-opacity duration-300">
                  <span className="bg-white text-black px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 shadow-lg transform scale-90 group-hover/mockup:scale-100 transition-transform">
                     Visitar Web <ExternalLink className="w-3 h-3" />
                  </span>
               </div>
            )}

            {/* Barra navegador */}
            <div className="h-6 bg-slate-200 dark:bg-white/10 flex items-center px-3 gap-1.5 z-10">
               <div className="w-2 h-2 rounded-full bg-red-400/80"></div>
               <div className="w-2 h-2 rounded-full bg-yellow-400/80"></div>
               <div className="w-2 h-2 rounded-full bg-green-400/80"></div>
            </div>
            
            <div className="flex-1 relative w-full">
                {image ? (
                   <Image src={image} alt={title} fill className="object-cover object-top" />
                ) : (
                   <div className="flex flex-col items-center justify-center h-full gap-2 bg-white dark:bg-black/50">
                      <Globe className="w-8 h-8 text-blue-500/20" />
                      <span className="text-xs text-muted-foreground font-bold">{title} Web</span>
                   </div>
                )}
            </div>
         </div>
      </Wrapper>
   )
}

function MockupApp({ image, title }: { image?: string, title: string }) {
   return (
      <div className="w-full h-full bg-slate-800 dark:bg-black flex items-end justify-center p-4 pb-0 group/mockup relative">
         
         {/* MILLORA 2: OVERLAY APP */}
         <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover/mockup:opacity-100 transition-opacity duration-300 rounded-t-xl">
             <span className="bg-white text-black px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 shadow-lg">
                Veure App <ExternalLink className="w-3 h-3" />
             </span>
         </div>

         <div className="w-32 h-full bg-black border-2 border-slate-700 rounded-t-xl overflow-hidden relative">
            {image ? (
                <Image src={image} alt={title} fill className="object-cover" />
            ) : (
                <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center">
                   <Smartphone className="w-6 h-6 text-primary" />
                   <span className="text-[10px] text-slate-400 mt-2">{title} App</span>
                </div>
            )}
         </div>
      </div>
   )
}

// ✅ L'ANIMACIÓ D'AUTOMATITZACIÓ (Responsive)
function MockupAutomation() {
   return (
      <div className="w-full h-full bg-[#1a1d2d] relative overflow-hidden group/mockup">
         {/* Overlay per coherència (opcional en automation, però queda bé) */}
         <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover/mockup:opacity-100 transition-opacity duration-300">
             <span className="bg-white text-black px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 shadow-lg">
                Veure Flux <Zap className="w-3 h-3" />
             </span>
         </div>

         <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] bg-size-[12px_12px]"></div>
         
         <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
               <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0.5" />
               </linearGradient>
            </defs>
            <path 
               d="M 20 30 C 50 30, 50 70, 80 70" 
               stroke="url(#lineGradient)" 
               strokeWidth="1.5" 
               fill="none" 
               vectorEffect="non-scaling-stroke" 
            />
            <motion.circle 
               r="3" 
               fill="#a855f7"
               animate={{ offsetDistance: ["0%", "100%"] }}
               transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
               style={{ offsetPath: "path('M 20 30 C 50 30, 50 70, 80 70')" }}
            />
         </svg>

         <div className="absolute left-[20%] top-[30%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(168,85,247,0.4)] backdrop-blur-sm">
            <Users className="w-5 h-5 text-purple-400" />
         </div>
         
         <div className="absolute left-[80%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-green-500/20 border border-green-500 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(34,197,94,0.4)] backdrop-blur-sm">
            <Code className="w-5 h-5 text-green-400" />
         </div>
      </div>
   )
}