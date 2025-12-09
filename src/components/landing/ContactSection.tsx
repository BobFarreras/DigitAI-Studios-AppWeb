'use client';

import { useActionState, useState } from 'react';
import { submitContactForm } from '@/actions/contact';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from '@/routing';
import { Loader2, Send, Bot, Code2, Rocket, Shield, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function ContactSection() {
  const t = useTranslations('ContactSection');
  const [state, action, isPending] = useActionState(submitContactForm, { success: false });
  const [serviceType, setServiceType] = useState('ia'); // 'ia' o 'web'
  
  // Estat del checkbox
  const [termsAccepted, setTermsAccepted] = useState(false);

  return (
    <section id="contacte" className="py-24 bg-background relative overflow-hidden transition-colors duration-300 px-14">
      
      {/* Fons decoratiu */}
      <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-start relative z-10">
        
        {/* COLUMNA ESQUERRA: Text i Punts */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          viewport={{ once: true }}
          className="space-y-10"
        >
           <div>
             <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground leading-tight">
               {t('title_prefix')} <span className="gradient-text">{t('title_highlight')}</span>
             </h2>
             <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
               {t('description')}
             </p>
           </div>

           <div className="space-y-8">
              {[
                { icon: Rocket, title: t('features.agile.title'), desc: t('features.agile.desc') },
                { icon: Shield, title: t('features.tech.title'), desc: t('features.tech.desc') },
                { icon: Users, title: t('features.partners.title'), desc: t('features.partners.desc') }
              ].map((item, i) => (
                <div key={i} className="flex gap-5 items-start group">
                  <div className="mt-1 w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-xl mb-1">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
           </div>
        </motion.div>

        {/* COLUMNA DRETA: Formulari Adaptable */}
        <motion.div 
           initial={{ opacity: 0, x: 20 }} 
           whileInView={{ opacity: 1, x: 0 }} 
           viewport={{ once: true }}
           className="bg-card border border-border rounded-3xl p-8 lg:p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Glow interior */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>

          <form action={action} className="space-y-6 relative z-10">
            
            {/* SELECTOR TIPUS (TOGGLE) */}
            <div className="grid grid-cols-2 gap-4 mb-8">
               <button
                  type="button"
                  onClick={() => setServiceType('ia')}
                  className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-3 ${
                    serviceType === 'ia' 
                      ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary shadow-inner' 
                      : 'border-border bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:border-primary/30'
                  }`}
               >
                  <Bot className="w-7 h-7" />
                  <span className="font-bold text-sm">{t('options.ia')}</span>
               </button>
               <button
                  type="button"
                  onClick={() => setServiceType('web')}
                  className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-3 ${
                    serviceType === 'web' 
                      ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary shadow-inner' 
                      : 'border-border bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:border-primary/30'
                  }`}
               >
                  <Code2 className="w-7 h-7" />
                  <span className="font-bold text-sm">{t('options.web')}</span>
               </button>
               <input type="hidden" name="service" value={serviceType === 'ia' ? 'Automatització i IA' : 'Creació Web'} />
            </div>

            {/* INPUTS */}
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground ml-1">{t('form.name_label')}</label>
                <Input 
                  name="fullName" 
                  placeholder={t('form.name_placeholder')} 
                  required 
                  className="bg-background border-input focus:border-primary h-12 text-foreground placeholder:text-muted-foreground/50" 
                />
              </div>
              
              <div className="space-y-2">
                 <label className="text-sm font-bold text-foreground ml-1">{t('form.email_label')}</label>
                 <Input 
                   name="email" 
                   type="email" 
                   placeholder={t('form.email_placeholder')} 
                   required 
                   className="bg-background border-input focus:border-primary h-12 text-foreground placeholder:text-muted-foreground/50" 
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-sm font-bold text-foreground ml-1">{t('form.message_label')}</label>
                 <textarea 
                   name="message" 
                   rows={4} 
                   placeholder={t('form.message_placeholder')}
                   className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none placeholder:text-muted-foreground/50"
                 />
              </div>
            </div>

            {/* CHECKBOX LEGAL CONTROLAT */}
            <div className="flex items-start space-x-3 pt-2">
              <Checkbox 
                id="privacy-contact" 
                name="privacy" 
                value="on" 
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                required 
                className="mt-1 border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary" 
              />
              <label htmlFor="privacy-contact" className="text-sm text-muted-foreground leading-snug cursor-pointer select-none">
                {t.rich('privacy_text', {
                  link: (chunks) => <Link href="/legal/privacitat" target="_blank" className="underline hover:text-primary transition-colors">{chunks}</Link>
                })}
              </label>
            </div>

            {/* BOTÓ AMB ESTAT DISABLED I TOOLTIP */}
            <div className="relative group">
                <Button 
                  type="submit" 
                  // Desactivem si està enviant (isPending) O si NO ha acceptat termes
                  disabled={isPending || !termsAccepted} 
                  className={`w-full h-14 text-lg font-bold rounded-xl transition-all shadow-lg shadow-primary/25 flex items-center justify-center ${
                     termsAccepted 
                     ? 'gradient-bg text-white hover:opacity-90' 
                     : 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'
                  }`}
                >
                  {isPending ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 w-5 h-5" />}
                  {t('form.submit_button')}
                </Button>
                
                {/* Tooltip flotant si intenten passar per sobre sense acceptar */}
                {!termsAccepted && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-3 py-1.5 rounded-md shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-medium z-20">
                        {t('tooltip_privacy')}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45"></div>
                    </div>
                )}
            </div>

            {state?.message && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-center text-sm font-medium mt-4 p-3 rounded-lg border ${
                        state.success 
                        ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' 
                        : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
                    }`}
                >
                    {state.message}
                </motion.div>
            )}

          </form>
        </motion.div>

      </div>
    </section>
  );
}