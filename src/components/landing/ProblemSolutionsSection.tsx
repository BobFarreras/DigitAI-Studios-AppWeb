'use client';
import { Check, X } from 'lucide-react';

export function ProblemSolutionSection() {
  return (
    <section className="py-24 container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white">
            El web tradicional <span className="text-red-400">ha mort</span>.
          </h2>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Molts proveïdors et venen una plantilla de Wordpress lenta i insegura. 
            A DigitAI Studios no fem webs "estàtiques", creem ecosistemes vius que treballen per tu.
          </p>
        </div>
        
        <div className="grid gap-4">
          {/* COMPARATIVA VISUAL */}
          <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5">
             <h3 className="font-bold text-red-400 mb-4 flex items-center gap-2">
               <X className="w-5 h-5" /> Web Tradicional / Wordpress Antic
             </h3>
             <ul className="space-y-2 text-slate-400 text-sm">
                <li className="flex gap-2"><span className="text-red-500/50">⚠</span> Carrega lenta (+3s) = Perds clients</li>
                <li className="flex gap-2"><span className="text-red-500/50">⚠</span> Inseguretat i manteniment constant</li>
                <li className="flex gap-2"><span className="text-red-500/50">⚠</span> No té IA ni automatització</li>
             </ul>
          </div>

          <div className="p-6 rounded-2xl border border-primary/30 bg-primary/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-20 h-20 bg-primary/20 blur-2xl rounded-full"></div>
             <h3 className="font-bold text-white mb-4 flex items-center gap-2">
               <Check className="w-5 h-5 text-primary" /> Ecosistema DigitAI
             </h3>
             <ul className="space-y-2 text-slate-300 text-sm">
                <li className="flex gap-2"><span className="text-primary">✓</span> Velocitat instantània (Next.js)</li>
                <li className="flex gap-2"><span className="text-primary">✓</span> Seguretat Enterprise i Escalat infinit</li>
                <li className="flex gap-2"><span className="text-primary">✓</span> Integració amb Chatbots i CRM</li>
             </ul>
          </div>
        </div>
      </div>
    </section>
  );
}