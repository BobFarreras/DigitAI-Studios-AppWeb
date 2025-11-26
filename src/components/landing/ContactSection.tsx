'use client';

import { useActionState, useState } from 'react';
import { submitContactForm } from '@/actions/contact'; // Assegura't que la ruta és correcta
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Send, Bot, Code2, Rocket, Shield, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export function ContactSection() {
  const [state, action, isPending] = useActionState(submitContactForm, { success: false });
  const [serviceType, setServiceType] = useState('ia'); // 'ia' o 'web'

  return (
    <section id="contacte" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-start">
        
        {/* COLUMNA ESQUERRA: Text i Punts (Igual que imatge 2) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          viewport={{ once: true }}
          className="space-y-8"
        >
           <div>
             <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
               Comença la teva <span className="text-[#8b5cf6]">transformació</span>
             </h2>
             <p className="text-slate-400 text-lg leading-relaxed">
               Contacta amb nosaltres per una auditoria gratuïta. Descobreix com podem revolucionar el teu negoci.
             </p>
           </div>

           <div className="space-y-6">
              {[
                { icon: Rocket, title: "Implementació ràpida", desc: "En menys de 72 hores" },
                { icon: Shield, title: "Suport 24/7", desc: "Sempre aquí per ajudar-te" },
                { icon: Users, title: "Equip expert", desc: "Professionals en apps i automatitzacions" }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="mt-1 w-10 h-10 rounded-full bg-[#6366f1]/20 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-[#8b5cf6]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{item.title}</h3>
                    <p className="text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
           </div>
        </motion.div>

        {/* COLUMNA DRETA: Formulari (Igual que imatge 4) */}
        <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            className="border border-white/10 rounded-2xl p-8 bg-transparent" // ✅ Fons transparent/negre, vora fina
        >
          <form action={action} className="space-y-6">
            
            {/* SELECTOR TIPUS TOGGLE */}
            <div className="grid grid-cols-2 gap-4 mb-8">
               <button
                  type="button"
                  onClick={() => setServiceType('ia')}
                  className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                    serviceType === 'ia' 
                      ? 'border-white bg-white/5 text-white' 
                      : 'border-white/10 text-slate-400 hover:bg-white/5'
                  }`}
               >
                  <Bot className="w-6 h-6" />
                  <span className="font-medium">IA & Bots</span>
               </button>
               <button
                  type="button"
                  onClick={() => setServiceType('web')}
                  className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                    serviceType === 'web' 
                      ? 'border-white bg-white/5 text-white' 
                      : 'border-white/10 text-slate-400 hover:bg-white/5'
                  }`}
               >
                  <Code2 className="w-6 h-6" />
                  <span className="font-medium">Webs</span>
               </button>
               {/* Input amagat per enviar el valor al server action */}
               <input type="hidden" name="service" value={serviceType === 'ia' ? 'Automatització i IA' : 'Creació Web'} />
            </div>

            {/* INPUTS ESTILITZATS */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white ml-1">Nom complet</label>
                <Input name="fullName" placeholder="" required className="bg-transparent border-white/10 focus:border-[#8b5cf6] h-12 text-white" />
              </div>
              
              <div className="space-y-2">
                 <label className="text-sm font-medium text-white ml-1">Email corporatiu</label>
                 <Input name="email" type="email" placeholder="" required className="bg-transparent border-white/10 focus:border-[#8b5cf6] h-12 text-white" />
              </div>

              <div className="space-y-2">
                 <label className="text-sm font-medium text-white ml-1">Explica'ns el teu projecte...</label>
                 <textarea 
                    name="message" 
                    rows={4} 
                    className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white focus:outline-none focus:border-[#8b5cf6] transition-colors resize-none"
                 />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="privacy" name="privacy" value="on" required className="border-white/20 data-[state=checked]:bg-[#8b5cf6] data-[state=checked]:border-[#8b5cf6]" />
              <label htmlFor="privacy" className="text-sm text-slate-400">
                Accepto la política de privacitat.
              </label>
            </div>

            <Button type="submit" disabled={isPending} className="w-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] hover:opacity-90 text-white font-bold h-12 rounded-lg text-lg transition-all">
               {isPending ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 w-5 h-5" />}
               Enviar Missatge
            </Button>

            {state?.message && (
                <p className={`text-center text-sm font-medium mt-4 ${state.success ? 'text-green-400' : 'text-red-400'}`}>
                    {state.message}
                </p>
            )}

          </form>
        </motion.div>

      </div>
    </section>
  );
}