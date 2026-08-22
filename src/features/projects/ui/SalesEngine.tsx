/**
 * @file src/features/projects/ui/SalesEngine.tsx
 * @updated 2026-08-22
 * @summary Sistema repetible per captar, qualificar i convertir clients.
 * @scope Guia comercial privada.
 */
"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Target } from "lucide-react";

const pipeline = [
  { title: "ICP", question: "A qui ajudem?", action: "Sector, mida, procés car i responsable amb poder de decisió.", output: "1 perfil prioritari" },
  { title: "Oferta", question: "Quin resultat venem?", action: "Problema, resultat, termini, límits i rang de preu; no una llista de tecnologies.", output: "Oferta productitzada" },
  { title: "Captació", question: "Com ens descobreixen?", action: "Referències, outbound selectiu, casos d’èxit, contingut i partners.", output: "Leads traçables" },
  { title: "Diagnòstic", question: "Val la pena avançar?", action: "Dolor, procés actual, dades, urgència, pressupost i decisors.", output: "Lead qualificat" },
  { title: "Proposta", question: "Què aprovarem?", action: "Abast, fases, arquitectura, responsabilitats, preu, recurrència i acceptació.", output: "Sí / no clar" },
  { title: "Expansió", question: "Com creix el compte?", action: "Mesurar resultat, manteniment trimestral, referència i següent cas d’ús.", output: "MRR + confiança" },
];
const channels = [
  ["Referències", "Demanar introducció després d’un resultat mesurable"], ["Outbound", "20 comptes molt ben estudiats abans que 500 missatges genèrics"], ["Contingut", "Casos reals: abans, solució, impacte i arquitectura"], ["Partners", "Agències, consultories i proveïdors que ja tenen el client"],
];

export function SalesEngine() {
  return <section><div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-xs uppercase tracking-[.2em] text-amber-300">06 · Clients i leads</p><h2 className="mt-4 text-4xl tracking-[-.05em] sm:text-6xl">Un motor comercial, no vendes improvisades.</h2><p className="mt-5 text-white/50">El comercial ven impacte i prioritza. El tècnic valida viabilitat i risc. Cap proposta surt sense una reunió de diagnòstic.</p><div className="mt-7 rounded-3xl border border-amber-300/20 bg-amber-300/[.06] p-5"><Target className="h-6 w-6 text-amber-300" /><strong className="mt-4 block">Regla de focus inicial</strong><p className="mt-2 text-sm leading-relaxed text-white/55">Un sector, un problema repetit i una oferta principal durant 90 dies. La personalització arriba després de validar la demanda.</p></div></div>
    <div className="grid gap-3 sm:grid-cols-2">{channels.map(([title, copy], index) => <motion.article key={title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .08 }} className="rounded-2xl border border-white/10 bg-white/[.035] p-5"><span className="font-mono text-xs text-violet-300">0{index + 1}</span><h3 className="mt-3 text-xl">{title}</h3><p className="mt-2 text-xs leading-relaxed text-white/45">{copy}</p></motion.article>)}</div></div>
    <div className="mt-10 overflow-x-auto pb-3"><div className="flex min-w-[1050px] items-stretch gap-2">{pipeline.map((step, index) => <div key={step.title} className="flex flex-1 items-center gap-2"><article className="h-full flex-1 rounded-2xl border border-white/10 bg-black/20 p-4"><span className="text-[10px] text-cyan-300">PAS {index + 1}</span><h3 className="mt-2 text-lg">{step.title}</h3><p className="mt-1 text-xs font-medium text-white/65">{step.question}</p><p className="mt-3 text-xs leading-relaxed text-white/40">{step.action}</p><span className="mt-4 flex items-center gap-2 text-[10px] text-emerald-300"><CheckCircle2 className="h-3.5 w-3.5" />{step.output}</span></article>{index < pipeline.length - 1 && <ArrowRight className="h-4 w-4 shrink-0 text-white/20" />}</div>)}</div></div>
  </section>;
}
