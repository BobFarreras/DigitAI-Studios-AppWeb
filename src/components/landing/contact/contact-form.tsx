'use client';

import { useActionState, useState } from 'react';
import { submitContactForm } from '@/actions/contact';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from '@/routing';
import { Loader2, Send, Bot, AppWindow, AlertCircle, MessageSquare, type LucideIcon } from 'lucide-react'; // ✅ Afegit type LucideIcon
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

const initialState = { success: false, message: '', errors: {} };

export function ContactForm() {
  const t = useTranslations('ContactSection');
  const [state, action, isPending] = useActionState(submitContactForm, initialState);
  const [serviceType, setServiceType] = useState('ia');
  const [termsAccepted, setTermsAccepted] = useState(false);

  return (
    <motion.div 
       initial={{ opacity: 0, x: 20 }} 
       whileInView={{ opacity: 1, x: 0 }} 
       viewport={{ once: true }}
       className={cn(
         "bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/10 rounded-3xl p-8 lg:p-10 shadow-2xl relative overflow-hidden",
         "md:bg-white/90 md:dark:bg-[#0f111a]/95 md:backdrop-blur-xl"
       )}
    >
      <form action={action} className="space-y-6 relative z-10">
        
        {/* SELECTOR DE SERVEI */}
        <div className="space-y-3 mb-6">
         
           
           <div className="grid grid-cols-2 gap-3">
             <ServiceButton 
               active={serviceType === 'ia'} 
               onClick={() => setServiceType('ia')} 
               icon={Bot} 
               label={t('options.ia')} 
             />
             <ServiceButton 
               active={serviceType === 'web'} 
               onClick={() => setServiceType('web')} 
               icon={AppWindow} 
               label={t('options.web')} 
             />
           </div>
           <input type="hidden" name="service" value={serviceType === 'ia' ? 'ia_automation' : 'web_app'} />
        </div>

        {/* INPUTS */}
        <div className="space-y-4">
          <FormInput name="fullName" label={t('form.name_label')} placeholder={t('form.name_placeholder')} error={state.errors?.fullName} />
          <FormInput name="email" type="email" label={t('form.email_label')} placeholder={t('form.email_placeholder')} error={state.errors?.email} />
          
          <div className="space-y-2">
             <label className="text-sm font-medium text-foreground ml-1 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-muted-foreground" /> {t('form.message_label')}
             </label>
             <textarea 
               name="message" rows={4} required minLength={10} placeholder={t('form.message_placeholder')}
               className="w-full rounded-lg border border-input bg-slate-50 dark:bg-zinc-900 px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none placeholder:text-muted-foreground/70"
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
                id="privacy-contact" name="privacy" value="on" required checked={termsAccepted} onCheckedChange={(c) => setTermsAccepted(c as boolean)}
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

        {/* BOTÓ */}
        <div className="relative group pt-2">
            <Button 
              type="submit" disabled={isPending || !termsAccepted || state.success} 
              className={cn(
                "w-full h-14 text-lg font-bold rounded-xl transition-all shadow-lg flex items-center justify-center",
                termsAccepted && !state.success
                  ? "bg-linear-to-r from-primary to-purple-600 text-white hover:opacity-90 hover:shadow-primary/25 hover:scale-[1.01]" 
                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
              )}
            >
              {isPending ? <><Loader2 className="animate-spin mr-2" /> Enviant...</> : state.success ? "Enviat Correctament!" : <>{t('form.submit_button')} <Send className="ml-2 w-5 h-5" /></>}
            </Button>
        </div>

        {/* MISSATGES */}
        {state?.message && (
            <div className={cn("text-center text-sm font-medium mt-4 p-3 rounded-lg border flex items-center justify-center gap-2", state.success ? "bg-green-500/10 border-green-500/20 text-green-600" : "bg-red-500/10 border-red-500/20 text-red-600")}>
                {state.success ? null : <AlertCircle className="w-4 h-4" />} {state.message}
            </div>
        )}
      </form>
    </motion.div>
  );
}

// --- SUBCOMPONENTS TIPATS CORRECTAMENT ---

interface ServiceButtonProps {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon; // ✅ Tipatge correcte per icones de Lucide
  label: string;
}

function ServiceButton({ active, onClick, icon: Icon, label }: ServiceButtonProps) {
  return (
    <button type="button" onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 group",
        active 
          // 🔥 FIX LIGHT MODE:
          // Abans: bg-primary/5 (Això feia la taca lila).
          // Ara: bg-slate-50 (Gris molt net).
          // El 'dark:bg-zinc-900' es manté perquè vas dir que en dark mode estava perfecte.
          ? "border-primary bg-slate-50 dark:bg-zinc-900 text-primary shadow-sm ring-1 ring-primary/20" 
          : "border-border bg-transparent dark:bg-zinc-950 text-muted-foreground hover:bg-slate-50 dark:hover:bg-zinc-900 hover:border-primary/30"
      )}
    >
      <Icon className={cn("w-6 h-6 mb-2 transition-colors", active ? "text-primary" : "text-muted-foreground group-hover:text-primary/70")} />
      <span className="text-xs font-bold text-center">{label}</span>
    </button>
  );
}

interface FormInputProps {
  name: string;
  type?: string;
  label: string;
  placeholder: string;
  error?: string[];
}

function FormInput({ name, type = "text", label, placeholder, error }: FormInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground ml-1">{label}</label>
      <Input name={name} type={type} placeholder={placeholder} required 
        className="bg-slate-50 dark:bg-zinc-900 border-input focus:border-primary h-12 text-foreground placeholder:text-muted-foreground/70 transition-all" 
      />
      <ErrorMessage errors={error} />
    </div>
  );
}

function ErrorMessage({ errors }: { errors?: string[] }) {
  if (!errors || !errors.length) return null;
  return <p className="text-xs font-medium text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors[0]}</p>;
}