'use client';
import { Smartphone, Globe, BrainCircuit, Users } from 'lucide-react';

const SERVICES = [
  {
    icon: Globe,
    title: "AppWebs & Plataformes",
    desc: "Més enllà d'una web. Creem SAAS, portals de clients i eines internes que optimitzen processos."
  },
  {
    icon: Smartphone,
    title: "Desenvolupament d'Apps",
    desc: "Tens una idea? La convertim en una App nativa (iOS/Android) amb React Native. Disseny i rendiment top."
  },
  {
    icon: BrainCircuit,
    title: "Automatització IA",
    desc: "Implementem agents d'IA que atenen clients, gestionen agendes i eliminen la feina administrativa."
  },
  {
    icon: Users,
    title: "Formació & Consultoria",
    desc: "No et donem només l'eina, t'ensenyem a usar-la. Formació in-company per potenciar el teu equip."
  }
];

export function ServicesGrid() {
  return (
    <section className="py-24 bg-white/[0.02]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
           <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-white">
             Solucions Digitals <span className="gradient-text">360°</span>
           </h2>
           <p className="text-slate-400 max-w-2xl mx-auto">
             Cobrim tot el cicle de vida digital del teu negoci. Des de la idea fins a l'expansió.
           </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
           {SERVICES.map((s, i) => (
             <div key={i} className="p-6 rounded-2xl border border-white/10 bg-white/[0.01] hover:bg-white/[0.03] transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                   <s.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
}