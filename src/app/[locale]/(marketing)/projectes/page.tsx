'use client';


import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Layers, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// DADES REALS DELS PROJECTES (Adaptades del teu text)
const PROJECTS = [
  {
    id: 'ribotflow',
    title: 'RibotFlow',
    tagline: 'El Sistema Operatiu Integral',
    description: 'Plataforma de gestió "Tot en Un" que unifica CRM, facturació i xarxes socials. Elimina el caos de tenir la informació dispersa i utilitza IA per redactar correus i gestionar oportunitats.',
    stats: [
      'CRM + Facturació + Màrqueting',
      'Automatització amb IA',
      'Control Financer en temps real'
    ],
    tags: ['ERP', 'Business', 'IA', 'Supabase'],
    color: 'from-purple-500 to-pink-500', // Gradient RibotFlow
    image: '/images/projects/pantalla-ribotflow.jpg', // Assegura't que la imatge existeix
    link: 'https://ribotflow.com'
  },
  {
    id: 'salutflow',
    title: 'SalutFlow',
    tagline: 'El teu Centre Esportiu, Digitalitzat',
    description: 'Crea la teva pròpia App Web (PWA) en minuts sense programar. Gestiona reserves, pagaments recurrents (Stripe) i aforaments automàticament. Ideal per gimnasos i estudis.',
    stats: [
      'App Instal·lable (PWA)',
      'Cobraments amb Stripe',
      'Gestió de Llistes d\'Espera'
    ],
    tags: ['SaaS', 'Sport & Health', 'PWA', 'Stripe'],
    color: 'from-cyan-400 to-blue-600', // Gradient SalutFlow
    image: '/images/projects/pantalla-salutflow.jpg', // Assegura't que la imatge existeix
    link: 'https://getsalutflow.com'
  }
];

export default function ProjectsPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background selection:bg-primary/30">

      {/* --- HERO SECTION: "INNOVATION LAB" --- */}
      <section className="pt-40 pb-20 relative overflow-hidden">
         {/* Fons decoratiu */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none opacity-50" />
         
         <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
            >
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold mb-6 uppercase tracking-widest">
                  <Sparkles className="w-3 h-3" />
                  DigitAI Innovation Lab
               </div>
               <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-foreground leading-tight">
                  No només venem codi. <br />
                  <span className="gradient-text">Construïm Empreses.</span>
               </h1>
               <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Aquests són els nostres productes propis. Utilitzem la mateixa tecnologia i metodologia per als teus projectes que la que fem servir per escalar els nostres negocis.
               </p>
            </motion.div>
         </div>
      </section>

      {/* --- PROJECT SHOWCASE --- */}
      <section className="py-10 pb-32">
         <div className="container mx-auto px-4 space-y-32">
            {PROJECTS.map((project, index) => (
               <div key={project.id} className={`flex flex-col lg:flex-row gap-16 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                  
                  {/* COLUMNA VISUAL (Mockup) */}
                  <motion.div 
                     initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.8 }}
                     className="flex-1 w-full relative group"
                  >
                     {/* Glow del projecte */}
                     <div className={`absolute inset-0 bg-linear-to-r ${project.color} opacity-20 blur-[80px] group-hover:opacity-30 transition-opacity duration-500 pointer-events-none`}></div>
                     
                     {/* Marc del Navegador (Mockup) */}
                     <div className="relative rounded-xl border border-border bg-card shadow-2xl overflow-hidden transform transition-transform duration-500 group-hover:scale-[1.02] group-hover:-translate-y-2">
                        {/* Header Navegador */}
                        <div className="h-8 border-b border-border bg-muted/30 flex items-center px-4 gap-2">
                           <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                           <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                           <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                           <div className="ml-4 px-3 py-0.5 rounded bg-background/50 text-[10px] text-muted-foreground font-mono border border-border w-full max-w-[200px] opacity-50 truncate">
                              https://{project.id}.com
                           </div>
                        </div>
                        
                        {/* Contingut (Imatge o Fallback) */}
                        <div className="aspect-video relative bg-slate-100 dark:bg-slate-900">
                           {project.image ? (
                              <Image 
                                src={project.image} 
                                alt={project.title} 
                                fill 
                                className="object-cover object-top" 
                              /> 
                           ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/20">
                                 <Layers className="w-16 h-16 mb-4" />
                                 <span className="text-sm font-bold uppercase tracking-widest">Captura de {project.title}</span>
                              </div>
                           )}
                        </div>
                     </div>
                  </motion.div>

                  {/* COLUMNA TEXT (Info) */}
                  <motion.div 
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.8, delay: 0.2 }}
                     className="flex-1 space-y-8"
                  >
                     <div>
                        <div className={`inline-block px-3 py-1 rounded-lg bg-linear-to-r ${project.color} bg-opacity-10 text-xs font-bold text-white mb-4`}>
                           {project.tags[0]}
                        </div>
                        <h2 className="text-4xl font-bold text-foreground mb-2">{project.title}</h2>
                        <p className={`text-xl font-medium bg-linear-to-r ${project.color} bg-clip-text text-transparent`}>
                           {project.tagline}
                        </p>
                     </div>

                     <p className="text-lg text-muted-foreground leading-relaxed">
                        {project.description}
                     </p>

                     {/* Stats Grid */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {project.stats.map((stat, i) => (
                           <div key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 font-medium">
                              <div className={`w-2 h-2 rounded-full bg-linear-to-r ${project.color}`}></div>
                              {stat}
                           </div>
                        ))}
                     </div>

                     <div className="flex flex-wrap gap-2 pt-2">
                        {project.tags.map((tag) => (
                           <span key={tag} className="px-3 py-1 rounded-full border border-border bg-muted/20 text-xs font-medium text-muted-foreground">
                              {tag}
                           </span>
                        ))}
                     </div>

                     <div className="flex gap-4 pt-4">
                        <a href={project.link} target="_blank" rel="noreferrer">
                           <Button className="gradient-bg text-white border-0 shadow-lg hover:opacity-90">
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
      <section className="py-24 border-t border-border bg-muted/10">
         <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">
               Tens una idea per al pròxim <span className="gradient-text">Gran Producte</span>?
            </h2>
            <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
               Hem convertit les nostres idees en negocis rendibles. Ara deixa que t'ajudem a fer el mateix amb la teva.
            </p>
            <Link href="/#contacte">
               <Button size="lg" className="h-14 px-8 text-lg rounded-full gradient-bg text-white hover:opacity-90 shadow-xl">
                  Parlem del teu Projecte <ArrowRight className="ml-2 w-5 h-5" />
               </Button>
            </Link>
         </div>
      </section>

    </main>
  );
}