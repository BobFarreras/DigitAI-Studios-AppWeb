/**
 * @file src/components/landing/v2/ContactSectionV2.tsx
 * @updated 2026-05-14
 * @summary Seccio de contacte V2 amb formulari connectat a l'action existent.
 * @scope Presentacio i captura de dades; no altera la logica backend d'enviament.
 */
'use client';

import { useActionState, useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AppWindow, Bot, CheckCircle2, Loader2, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { submitContactForm } from '@/actions/contact';
import { BrandRevealText } from '@/components/ui/brand-reveal';
import { Link } from '@/routing';
import { cn } from '@/lib/utils';

const initialState = { success: false, message: '', errors: {} };
const services = [
  { value: 'ia_automation', key: 'automation', icon: Bot },
  { value: 'web_app', key: 'software', icon: AppWindow },
] as const;

export function ContactSectionV2() {
  const t = useTranslations('LandingV2.contact');
  const [state, action, pending] = useActionState(submitContactForm, initialState);
  const [service, setService] = useState<(typeof services)[number]['value']>('ia_automation');

  return (
    <section id="contacte" className="relative z-10 min-h-[100svh] px-4 py-[76px] text-[#08090a] dark:text-[#f7f8f8] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100svh-152px)] w-full max-w-7xl flex-col justify-center">
        <div className="mx-auto mb-9 max-w-6xl text-center sm:mb-10">
          <h2 className="text-balance text-[clamp(31px,7.4vw,42px)] font-[590] leading-[1.03] sm:text-[clamp(42px,5vw,58px)] lg:text-[clamp(48px,4.1vw,66px)]">
            {t('titleStrong')}
            <BrandRevealText className="max-md:!hidden text-[#383b3f] dark:text-[#8a8f98] md:!inline-grid">
              {' '}{t('titleMuted')}
            </BrandRevealText>
          </h2>
        </div>

        <div className="group grid overflow-hidden border border-[#d0d6e0] bg-white/34 backdrop-blur-[2px] [filter:grayscale(1)_saturate(.08)_contrast(.94)_brightness(.96)] transition-all duration-500 hover:bg-white/56 hover:[filter:grayscale(0)_saturate(.9)_contrast(1)_brightness(1)] dark:border-[#23252a] dark:bg-[#08090a]/34 dark:hover:bg-[#0f1011]/68 lg:grid-cols-[0.82fr_1.18fr]">
          <motion.div initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} viewport={{ once: true, amount: 0.25 }} className="linear-panel border-0 p-5 sm:p-7 lg:p-8">
            <div className="flex h-full flex-col justify-between gap-8">
              <div>
                <motion.div initial={{ opacity: 0, scale: 0.72 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.12, duration: 0.38 }} viewport={{ once: true }} className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-[7px] border border-[#d0d6e0] bg-white/70 transition-colors duration-500 group-hover:border-[#6f7f88]/65 dark:border-[#323334] dark:bg-[#161718]">
                  <Sparkles className="h-5 w-5 text-[#8a8f98] transition-colors group-hover:text-[#7b8b93]" />
                </motion.div>
                <p className="max-w-xl text-[18px] font-[560] leading-[1.45] text-[#383b3f] dark:text-[#d0d6e0] sm:text-[20px]">
                  {t('lead')}
                </p>
              </div>
              <div className="grid gap-3">
                <Info delay={0.18} icon={<Mail className="h-4 w-4" />} label={t('proof.response')} value={t('proof.responseValue')} />
                <Info delay={0.26} icon={<ShieldCheck className="h-4 w-4" />} label={t('proof.privacy')} value={t('proof.privacyValue')} />
                <Info delay={0.34} icon={<CheckCircle2 className="h-4 w-4" />} label={t('proof.next')} value={t('proof.nextValue')} />
              </div>
            </div>
          </motion.div>

          <motion.form action={action} initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }} viewport={{ once: true, amount: 0.25 }} className="linear-panel border-0 border-t p-5 dark:border-[#23252a] sm:p-7 lg:border-l lg:border-t-0 lg:p-8">
            <div className="grid gap-3 sm:grid-cols-2">
              {services.map((item) => {
                const Icon = item.icon, active = service === item.value;
                return (
                  <button key={item.value} type="button" onClick={() => setService(item.value)} className={cn('flex items-center gap-3 rounded-[7px] border px-4 py-3 text-left transition-colors duration-300', active ? 'border-[#383b3f] bg-[#383b3f] text-white dark:border-[#d0d6e0] dark:bg-[#d0d6e0] dark:text-[#08090a]' : 'border-[#d0d6e0] text-[#62666d] hover:border-[#7b8b93]/65 hover:text-[#08090a] dark:border-[#323334] dark:text-[#8a8f98] dark:hover:text-[#f7f8f8]')}>
                    <Icon className={cn('h-5 w-5 transition-colors', active ? 'text-current' : 'text-[#8a8f98] group-hover:text-[#7b8b93]')} />
                    <span className="text-[13px] font-[650]">{t(`services.${item.key}`)}</span>
                  </button>
                );
              })}
            </div>
            <input type="hidden" name="service" value={service} />

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field name="fullName" label={t('form.name')} placeholder={t('form.namePlaceholder')} error={state.errors?.fullName} />
              <Field name="email" type="email" label={t('form.email')} placeholder={t('form.emailPlaceholder')} error={state.errors?.email} />
              <div className="sm:col-span-2">
                <label className="mb-2 block text-[13px] font-[650]">{t('form.message')}</label>
                <textarea name="message" required minLength={10} rows={5} placeholder={t('form.messagePlaceholder')} className="w-full resize-none rounded-[7px] border border-[#d0d6e0] bg-white/70 px-4 py-3 text-[14px] outline-none transition-colors placeholder:text-[#8a8f98] focus:border-[#7b8b93] dark:border-[#323334] dark:bg-[#08090a]/78" />
                <Error errors={state.errors?.message} />
              </div>
            </div>

            <label className="mt-5 flex items-start gap-3 text-[12px] leading-[1.45] text-[#62666d] dark:text-[#8a8f98]">
              <input name="privacy" value="on" required type="checkbox" className="mt-0.5 h-4 w-4 rounded border-[#d0d6e0] accent-[#08090a] dark:border-[#323334] dark:accent-[#f7f8f8]" />
              <span>{t.rich('privacy', { link: (chunks) => <Link href="/legal/privacitat" className="underline underline-offset-2 hover:text-[#08090a] dark:hover:text-[#f7f8f8]">{chunks}</Link> })}</span>
            </label>
            <Error errors={state.errors?.privacy} />

            <button type="submit" disabled={pending || state.success} className="mt-5 flex h-12 w-full items-center justify-center rounded-[6px] bg-[#08090a] px-4 text-[14px] font-[650] text-[#f7f8f8] transition-all hover:bg-[#383b3f] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#f7f8f8] dark:text-[#08090a] dark:hover:bg-[#d0d6e0]">
              <span className="inline-flex items-center justify-center">{pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('form.sending')}</> : state.success ? t('form.sent') : t('form.submit')}</span>
            </button>
            {state.message ? <p className={cn('mt-3 rounded-[7px] border px-3 py-2 text-center text-[12px] font-[590]', state.success ? 'border-[#27a644]/25 bg-[#27a644]/10 text-[#1f7a37]' : 'border-red-500/25 bg-red-500/10 text-red-600')}>{state.message}</p> : null}
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Info({ icon, label, value, delay }: { icon: ReactNode; label: string; value: string; delay: number }) {
  return <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.38 }} viewport={{ once: true }} className="flex items-center gap-3 rounded-[7px] border border-[#d0d6e0] bg-white/54 p-3 transition-colors duration-500 group-hover:border-[#7b8b93]/45 dark:border-[#323334] dark:bg-[#161718]/70"><span className="text-[#8a8f98] transition-colors duration-500 group-hover:text-[#7b8b93]">{icon}</span><div><p className="text-[11px] font-[650] uppercase text-[#8a8f98]">{label}</p><p className="text-[14px] font-[590]">{value}</p></div></motion.div>;
}

function Field({ name, type = 'text', label, placeholder, error }: { name: string; type?: string; label: string; placeholder: string; error?: string[] }) {
  return <div><label className="mb-2 block text-[13px] font-[650]">{label}</label><input name={name} type={type} required placeholder={placeholder} className="h-11 w-full rounded-[7px] border border-[#d0d6e0] bg-white/70 px-4 text-[14px] outline-none transition-colors placeholder:text-[#8a8f98] focus:border-[#7b8b93] dark:border-[#323334] dark:bg-[#08090a]/78" /><Error errors={error} /></div>;
}

function Error({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1 text-[11px] font-[590] text-red-600">{errors[0]}</p>;
}
