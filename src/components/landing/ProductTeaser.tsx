'use client';

import { ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import ribotFlowImg from '@/assets/images/ribotflow.png';
import salutFlowImg from '@/assets/images/salutflow.png';

export function ProductTeaser() {
    const t = useTranslations('ProductTeaser');

    return (
        <section className="py-24 container mx-auto px-6 md:px-10 lg:px-14">

            {/* FONS CARD:
                1. Light: 'bg-linear-to-br from-slate-50 via-white to-slate-50' (Molt neutre, sense blau).
                2. Dark: 'dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900'. (Negre net, sense primary/10).
                3. Borde: Més suau.
            */}
            <div className="rounded-3xl bg-linear-to-br from-slate-50 via-white to-slate-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 border border-slate-200 dark:border-white/10 p-8 md:p-12 overflow-hidden relative transition-colors duration-300 shadow-2xl shadow-slate-200/50 dark:shadow-none">

                {/* BLOB FIX: Reduït opacitat dràsticament (40% -> 10% en dark) */}
                <div className="absolute top-0 right-0 w-125 h-125 bg-blue-400/5 dark:bg-primary/5 blur-[100px] rounded-full opacity-30 dark:opacity-10 pointer-events-none"></div>

                <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">

                    {/* TEXT CONTENT */}
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                            {t('title_prefix')} <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-purple-400">
                                {t('title_highlight')}
                            </span>
                        </h2>

                        <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed">
                            {t.rich('description', {
                                strong: (chunks) => <strong>{chunks}</strong>,
                                br: () => <br />
                            })}
                        </p>

                        <Link href="/projectes" className="inline-flex items-center font-bold text-foreground hover:text-primary transition-colors group">
                            {t('cta')}
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* MOCKUP VISUAL (Sense canvis de lògica, només colors de fons ajustats per no ser liles) */}
                    <div className="relative h-100 w-full flex items-center justify-center perspective-1000">

                        {/* CARD 1: RIBOTFLOW */}
                        <motion.div
                            initial={{ opacity: 0, x: -20, rotate: -5 }}
                            whileInView={{ opacity: 1, x: 0, rotate: -6 }}
                            viewport={{ once: true }}
                            // Fons ajustat: dark:bg-[#0f111a] -> dark:bg-zinc-900
                            className="absolute left-4 top-10 w-3/4 h-64 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-white/10 shadow-xl z-10 overflow-hidden"
                        >
                            <div className="h-12 border-b border-slate-100 dark:border-white/5 flex items-center justify-between px-4 bg-slate-50/50 dark:bg-white/5">
                                <div className="relative h-12 w-34">
                                    <Image src={ribotFlowImg} alt="RibotFlow Logo" fill className="object-contain object-left" placeholder="blur" />
                                </div>
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-white/20"></div>
                                    <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-white/20"></div>
                                </div>
                            </div>
                            <div className="p-4 space-y-3 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                                <div className="flex gap-4">
                                    <div className="w-1/3 h-20 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10"></div>
                                    <div className="w-2/3 h-20 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10"></div>
                                </div>
                                <div className="h-16 w-full rounded-lg bg-slate-50 dark:bg-white/5"></div>
                            </div>
                        </motion.div>

                        {/* CARD 2: SALUTFLOW */}
                        <motion.div
                            initial={{ opacity: 0, x: 20, rotate: 5, y: 20 }}
                            whileInView={{ opacity: 1, x: 20, rotate: 3, y: 40 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            // Fons ajustat
                            className="absolute right-4 top-24 w-3/4 h-64 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-white/10 shadow-2xl z-20 overflow-hidden backdrop-blur-sm"
                        >
                            <div className="h-12 border-b border-slate-100 dark:border-white/5 flex items-center justify-between px-4 bg-slate-50/50 dark:bg-white/5">
                                <div className="relative h-22 w-48">
                                    <Image src={salutFlowImg} alt="SalutFlow Logo" fill className="object-contain object-left" placeholder="blur" />
                                </div>
                                <ExternalLink className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="p-4 space-y-3">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="h-4 w-1/3 bg-blue-100 dark:bg-primary/20 rounded"></div>
                                    <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/10"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-10 w-full rounded border-l-4 border-blue-500 bg-slate-50 dark:bg-white/5 flex items-center px-3">
                                        <div className="h-2 w-1/2 bg-slate-200 dark:bg-white/20 rounded"></div>
                                    </div>
                                    <div className="h-10 w-full rounded border-l-4 border-green-500 bg-slate-50 dark:bg-white/5 flex items-center px-3">
                                        <div className="h-2 w-2/3 bg-slate-200 dark:bg-white/20 rounded"></div>
                                    </div>
                                    <div className="h-10 w-full rounded border-l-4 border-purple-500 bg-slate-50 dark:bg-white/5 flex items-center px-3">
                                        <div className="h-2 w-1/3 bg-slate-200 dark:bg-white/20 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}