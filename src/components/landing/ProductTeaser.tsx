'use client';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function ProductTeaser() {
  return (
    <section className="py-24 container mx-auto px-4">
      <div className="rounded-3xl bg-linear-to-br from-primary/10 via-background to-background border border-primary/20 p-8 md:p-12 overflow-hidden relative">
        
        {/* Efecte de fons */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full opacity-30 pointer-events-none"></div>

        <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
           <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
                 🚀 INNOVATION LAB
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                 No només venem software. <br/>
                 <span className="gradient-text">Creem Productes.</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8">
                 Descobreix <strong>SalutFlow</strong> i <strong>RibotFlow</strong>, les nostres plataformes pròpies que estan revolucionant la gestió de clíniques i negocis. 
                 <br/><br/>
                 Utilitzem la mateixa tecnologia per als teus projectes que per als nostres.
              </p>
              <Link href="/projectes" className="inline-flex items-center text-white font-medium hover:text-primary transition-colors">
                 Veure els nostres productes <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
           </div>
           
           {/* Mockup visual abstracte (Caixes de vidre) */}
           <div className="relative h-[300px] lg:h-[400px] w-full">
              <div className="absolute top-10 left-10 w-3/4 h-3/4 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                 <div className="h-4 w-1/3 bg-white/10 rounded mb-4"></div>
                 <div className="space-y-2">
                    <div className="h-3 w-full bg-white/5 rounded"></div>
                    <div className="h-3 w-5/6 bg-white/5 rounded"></div>
                    <div className="h-3 w-4/6 bg-white/5 rounded"></div>
                 </div>
                 <div className="mt-8 flex gap-4">
                    <div className="h-20 w-1/2 bg-primary/10 rounded-xl border border-primary/20"></div>
                    <div className="h-20 w-1/2 bg-white/5 rounded-xl border border-white/10"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}