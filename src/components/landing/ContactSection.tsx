'use client';

import { useActionState } from 'react'; // React 19 / Next 16 hook
import { submitContactForm } from '@/actions/contact';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Bot, Code2, Loader2, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export function ContactSection() {
  const [state, action, isPending] = useActionState(submitContactForm, null);

  return (
    <section id="contacte" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
           <h2 className="text-4xl font-bold mb-6">Comença la teva <span className="gradient-text">transformació</span></h2>
           <p className="text-muted-foreground mb-8 text-lg">
             Contacta amb nosaltres per una auditoria gratuïta.
           </p>
           {/* ... Llista de beneficis (Rocket, Shield, etc) ... */}
        </motion.div>

        {/* Form Card */}
        <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            className="glass-effect p-8 rounded-3xl shadow-2xl"
        >
          <form action={action} className="space-y-6">
            
            {/* Service Selection (Hidden Input logic or generic buttons that set hidden input) */}
            <div className="grid grid-cols-2 gap-4">
               <label className="cursor-pointer">
                  <input type="radio" name="service" value="Automatització" className="peer sr-only" required />
                  <div className="p-4 border rounded-xl peer-checked:border-primary peer-checked:bg-primary/10 flex flex-col items-center gap-2 hover:bg-muted/50 transition-colors">
                     <Bot className="w-6 h-6" />
                     <span className="font-medium">IA & Bots</span>
                  </div>
               </label>
               <label className="cursor-pointer">
                  <input type="radio" name="service" value="Web" className="peer sr-only" />
                   <div className="p-4 border rounded-xl peer-checked:border-primary peer-checked:bg-primary/10 flex flex-col items-center gap-2 hover:bg-muted/50 transition-colors">
                     <Code2 className="w-6 h-6" />
                     <span className="font-medium">Webs</span>
                  </div>
               </label>
            </div>
            {state?.errors?.service && <p className="text-red-500 text-sm">{state.errors.service}</p>}

            <Input name="fullName" placeholder="Nom complet" required className="bg-background/50" />
            <Input name="email" type="email" placeholder="Email corporatiu" required className="bg-background/50" />
            
            <textarea 
              name="message" 
              rows={4} 
              placeholder="Explica'ns el teu projecte..." 
              className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />

            <div className="flex items-center space-x-2">
              <Checkbox id="privacy" name="privacy" value="on" required />
              <label htmlFor="privacy" className="text-sm text-muted-foreground">
                Accepto la política de privacitat.
              </label>
            </div>

            <Button type="submit" disabled={isPending} className="w-full gradient-bg text-lg h-12">
               {isPending ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 w-5 h-5" />}
               Enviar Missatge
            </Button>

            {state?.message && (
                <p className={`text-center text-sm font-medium ${state.success ? 'text-green-600' : 'text-red-600'}`}>
                    {state.message}
                </p>
            )}

          </form>
        </motion.div>

      </div>
    </section>
  );
}