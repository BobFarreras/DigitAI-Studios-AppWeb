'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Layers, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Dades dels projectes (sense canvis, només estructura)
const PROJECTS = [
  {
    id: 'ribotflow',
    title: 'RibotFlow',
    tagline: 'El Sistema Operatiu Integral',
    description: 'Plataforma de gestió "Tot en Un" que unifica CRM, facturació i xarxes socials. Elimina el caos de tenir la informació dispersa i utilitza IA per redactar correus i gestionar oportunitats.',
    stats: ['CRM + Facturació', 'Automatització IA', 'Control Financer'],
    tags: ['ERP', 'Business', 'IA', 'Supabase'],
    color: 'from-purple-500 to-pink-500',
    image: '@/assets/images/pantalla-ribotflow.jpg',
    link: 'https://ribotflow.com'
  },
  {
    id: 'salutflow',
    title: 'SalutFlow',
    tagline: 'El teu Centre Esportiu, Digitalitzat',
    description: 'Crea la teva pròpia App Web (PWA) en minuts sense programar. Gestiona reserves, pagaments recurrents (Stripe) i aforaments automàticament. Ideal per gimnasos i estudis.',
    stats: ['App PWA', 'Pagaments Stripe', 'Llistes d\'Espera'],
    tags: ['SaaS', 'Sport', 'PWA', 'Stripe'],
    color: 'from-cyan-400 to-blue-600',
    image: '@/assets/images/pantalla-salutflow.jpg',
    link: 'https://getsalutflow.com'
  }
];

export default function ProjectsPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background selection:bg-primary/30">

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-16 md:pt-48 md:pb-24 relative overflow-hidden">
         {/* Fons */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[1000px] h-[300px] md:h-[500px] bg-primary/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none opacity-50" />
         
         <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
            >
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] md:text-xs font-bold mb-6 uppercase tracking-widest">
                  <Sparkles className="w-3 h-3" />
                  DigitAI Innovation Lab
               </div>
               <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground leading-tight">
                  No només venem codi. <br className="hidden md:block" />
                  <span className="gradient-text">Construïm Empreses.</span>
               </h1>
               <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
                  Aquests són els nostres productes propis. Utilitzem la mateixa tecnologia i metodologia per als teus projectes que la que fem servir per escalar els nostres negocis.
               </p>
            </motion.div>
         </div>
      </section>

      {/* --- PROJECT SHOWCASE --- */}
      <section className="py-10 pb-20 md:pb-32">
         <div className="container mx-auto px-4 space-y-20 md:space-y-32">
            {PROJECTS.map((project, index) => (
               <div key={project.id} className={`flex flex-col lg:flex-row gap-8 md:gap-16 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                  
                  {/* COLUMNA VISUAL */}
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
                        {/* Header Navegador (Més petit en mòbil) */}
                        <div className="h-6 md:h-8 border-b border-border bg-muted/30 flex items-center px-3 gap-1.5 md:gap-2">
                           <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-red-500/50"></div>
                           <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-yellow-500/50"></div>
                           <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-green-500/50"></div>
                           <div className="ml-2 md:ml-4 px-2 py-0.5 rounded bg-background/50 text-[8px] md:text-[10px] text-muted-foreground font-mono border border-border w-full max-w-[150px] md:max-w-[200px] opacity-50 truncate">
                              https://{project.id}.com
                           </div>
                        </div>
                        
                        {/* Imatge (Aspect ratio adaptatiu) */}
                        <div className="aspect-4/3 md:aspect-video relative bg-slate-100 dark:bg-slate-900">
                           {project.image ? (
                              <Image 
                                 src={project.image} 
                                 alt={project.title} 
                                 fill 
                                 className="object-cover object-top" 
                                 sizes="(max-width: 768px) 100vw, 50vw"
                              /> 
                           ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/20">
                                 <Layers className="w-12 h-12 md:w-16 md:h-16 mb-4" />
                                 <span className="text-xs md:text-sm font-bold uppercase tracking-widest">Captura de {project.title}</span>
                              </div>
                           )}
                        </div>
                     </div>
                  </motion.div>

                  {/* COLUMNA TEXT */}
                  <motion.div 
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.8, delay: 0.2 }}
                     className="w-full lg:flex-1 space-y-6 md:space-y-8"
                  >
                     <div>
                        <div className={`inline-block px-3 py-1 rounded-lg bg-linear-to-r ${project.color} bg-opacity-10 text-[10px] md:text-xs font-bold text-white mb-4`}>
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
                           <div key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 font-medium">
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
                           <Button className="w-full sm:w-auto gradient-bg text-white border-0 shadow-lg hover:opacity-90">
                              Veure Web <ExternalLink className="ml-2 w-4 h-4" />
                           </Button>
                        </a>
                     </div>
                  </motion.div>

               </div>
            ))}
         </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 md:py-24 border-t border-border bg-muted/10">
         <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 md:mb-6">
               Tens una idea per al pròxim <span className="gradient-text">Gran Producte</span>?
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mb-8 md:mb-10 max-w-xl mx-auto px-4">
               Hem convertit les nostres idees en negocis rendibles. Ara deixa que t'ajudem a fer el mateix amb la teva.
            </p>
            <Link href="/#contacte">
               <Button size="lg" className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg rounded-full gradient-bg text-white hover:opacity-90 shadow-xl w-full sm:w-auto">
                  Parlem del teu Projecte <ArrowRight className="ml-2 w-5 h-5" />
               </Button>
            </Link>
         </div>
      </section>

    </main>
  );
}