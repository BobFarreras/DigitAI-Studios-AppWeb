'use client';

import { useActionState, useState } from 'react';
import { submitContactForm } from '@/actions/contact';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from '@/routing';
import { Loader2, Send, Bot, AppWindow, Rocket, Shield, Users, AlertCircle, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

const initialState = {
  success: false,
  message: '',
  errors: {}
};

export function ContactSection() {
  const t = useTranslations('ContactSection');
  const [state, action, isPending] = useActionState(submitContactForm, initialState);
  const [serviceType, setServiceType] = useState('ia');
  const [termsAccepted, setTermsAccepted] = useState(false);

  return (
    // ✅ RESTAURAT: El fons original amb les transicions
    <section id="contacte" className="py-24 bg-background relative overflow-hidden transition-colors duration-300">
      
      {/* ✅ RESTAURAT: El degradat decoratiu (La "màgia" lila) */}
      <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      {/* FIX IPHONE: Afegim un "spot" de llum fosc darrere per assegurar contrast en mode dark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none opacity-50 dark:opacity-20" />

      <div className="container mx-auto px-6 md:px-10 lg:px-14 grid lg:grid-cols-2 gap-16 items-start relative z-10">
        
        {/* COLUMNA ESQUERRA (Text) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          viewport={{ once: true }}
          className="space-y-10"
        >
           <div>
             <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground leading-tight">
               {t('title_prefix')} <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-purple-500 pb-2">{t('title_highlight')}</span>
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
                 {/* FIX: Icona amb fons semitransparent més robust */}
                 <div className="mt-1 w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform backdrop-blur-sm">
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

        {/* COLUMNA DRETA: Formulari */}
        <motion.div 
           initial={{ opacity: 0, x: 20 }} 
           whileInView={{ opacity: 1, x: 0 }} 
           viewport={{ once: true }}
           // 🔥 EL FIX CLAU PER IPHONE 6/7 🔥
           // 1. Utilitzem bg-card/80 o bg-background/90 enlloc de transparent. 
           //    Això fa que el lila de sota es vegi (glass) però el text tingui contrast.
           // 2. backdrop-blur-md segueix actiu pels mòbils moderns.
           className="bg-white/80 dark:bg-[#0f111a]/90 border border-white/20 dark:border-primary/10 rounded-3xl p-8 lg:p-10 shadow-2xl relative overflow-hidden backdrop-blur-md"
        >
          {/* Glow interior */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>

          <form action={action} className="space-y-6 relative z-10">
            
            {/* SELECTOR DE SERVEI (ESTIL ORIGINAL) */}
            <div className="space-y-3 mb-6">
               <label className="text-sm font-semibold text-foreground ml-1">
                 En què et podem ajudar?
               </label>
               
               <div className="grid grid-cols-2 gap-3">
                 <button
                    type="button"
                    onClick={() => setServiceType('ia')}
                    className={cn(
                      "relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 hover:bg-accent/50 group",
                      serviceType === 'ia' 
                        ? "border-primary bg-primary/5 text-primary shadow-[0_0_0_1px_rgba(var(--primary),0.2)]" 
                        : "border-border bg-transparent text-muted-foreground hover:border-primary/30"
                    )}
                 >
                    <Bot className={cn("w-6 h-6 mb-2 transition-colors", serviceType === 'ia' ? "text-primary" : "text-muted-foreground group-hover:text-primary/70")} />
                    <span className="text-xs font-bold text-center">{t('options.ia')}</span>
                 </button>

                 <button
                    type="button"
                    onClick={() => setServiceType('web')}
                    className={cn(
                      "relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 hover:bg-accent/50 group",
                      serviceType === 'web' 
                        ? "border-primary bg-primary/5 text-primary shadow-[0_0_0_1px_rgba(var(--primary),0.2)]" 
                        : "border-border bg-transparent text-muted-foreground hover:border-primary/30"
                    )}
                 >
                    <AppWindow className={cn("w-6 h-6 mb-2 transition-colors", serviceType === 'web' ? "text-primary" : "text-muted-foreground group-hover:text-primary/70")} />
                    <span className="text-xs font-bold text-center">{t('options.web')}</span>
                 </button>
               </div>
               <input type="hidden" name="service" value={serviceType === 'ia' ? 'ia_automation' : 'web_app'} />
            </div>

            {/* INPUTS - AMB FONS REFORÇAT PER LLEGIBILITAT */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground ml-1">{t('form.name_label')}</label>
                <Input 
                  name="fullName" 
                  placeholder={t('form.name_placeholder')} 
                  required 
                  minLength={2} 
                  // FIX: background/50 a vegades es veu massa transparent. 
                  // Posem dark:bg-black/40 explícitament per crear contrast sobre el lila.
                  className="bg-white/50 dark:bg-black/40 border-input focus:border-primary h-12 text-foreground placeholder:text-muted-foreground/70 transition-all" 
                />
                <ErrorMessage errors={state.errors?.fullName} />
              </div>
              
              <div className="space-y-2">
                 <label className="text-sm font-medium text-foreground ml-1">{t('form.email_label')}</label>
                 <Input 
                   name="email" 
                   type="email" 
                   placeholder={t('form.email_placeholder')} 
                   required 
                   className="bg-white/50 dark:bg-black/40 border-input focus:border-primary h-12 text-foreground placeholder:text-muted-foreground/70 transition-all" 
                 />
                 <ErrorMessage errors={state.errors?.email} />
              </div>

              <div className="space-y-2">
                 <label className="text-sm font-medium text-foreground ml-1 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    {t('form.message_label')}
                 </label>
                 <textarea 
                   name="message" 
                   rows={4} 
                   placeholder={t('form.message_placeholder')}
                   required
                   minLength={10} 
                   className="w-full rounded-lg border border-input bg-white/50 dark:bg-black/40 px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none placeholder:text-muted-foreground/70"
                 />
                 <div className="flex justify-between items-start">
                    <ErrorMessage errors={state.errors?.message} />
                    <span className="text-[10px] text-muted-foreground ml-auto pt-1 opacity-70">Mín. 10 caràcters</span>
                 </div>
              </div>
            </div>

            {/* CHECKBOX */}
            <div className="space-y-2 pt-2">
                <div className="flex items-start space-x-3">
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
                    link: (chunks) => <Link href="/legal/privacitat" target="_blank" className="underline hover:text-primary transition-colors decoration-primary/30">{chunks}</Link>
                    })}
                </label>
                </div>
                <ErrorMessage errors={state.errors?.privacy} />
            </div>

            {/* BOTÓ (ESTIL ORIGINAL AMB GRADIENT) */}
            <div className="relative group pt-2">
                <Button 
                  type="submit" 
                  disabled={isPending || !termsAccepted || state.success} 
                  className={cn(
                    "w-full h-14 text-lg font-bold rounded-xl transition-all shadow-lg flex items-center justify-center",
                    termsAccepted && !state.success
                      ? "bg-linear-to-r from-primary to-purple-600 text-white hover:opacity-90 hover:shadow-primary/25 hover:scale-[1.01]" 
                      : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
                  )}
                >
                  {isPending ? (
                      <>
                        <Loader2 className="animate-spin mr-2" /> Enviant...
                      </>
                  ) : state.success ? (
                      "Enviat Correctament!"
                  ) : (
                      <>
                        {t('form.submit_button')} <Send className="ml-2 w-5 h-5" />
                      </>
                  )}
                </Button>
            </div>

            {/* MISSATGE GLOBAL */}
            {state?.message && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "text-center text-sm font-medium mt-4 p-3 rounded-lg border flex items-center justify-center gap-2",
                      state.success 
                        ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400" 
                        : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
                    )}
                >
                    {state.success ? null : <AlertCircle className="w-4 h-4" />}
                    {state.message}
                </motion.div>
            )}

          </form>
        </motion.div>

      </div>
    </section>
  );
}

function ErrorMessage({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return (
    <p className="text-xs font-medium text-destructive mt-1 animate-in slide-in-from-top-1 fade-in flex items-center gap-1">
      <AlertCircle className="w-3 h-3" /> {errors[0]}
    </p>
  );
}