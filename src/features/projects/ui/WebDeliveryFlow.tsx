/**
 * @file src/features/projects/ui/WebDeliveryFlow.tsx
 * @updated 2026-08-20
 * @summary Flux professional des del briefing fins a l'operacio web.
 * @scope Guia privada de lliurament web.
 */
"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { TechLogo } from "./TechLogo";

const steps = [
  { number: "01", title: "Descoberta", copy: "Objectiu, públic, contingut, integracions, criteris d’èxit i límit de pressupost.", result: "Brief + abast signat" },
  { number: "02", title: "Disseny", copy: "Arquitectura d’informació, fluxos, prototip i revisió abans d’escriure codi.", result: "UI validada" },
  { number: "03", title: "Construcció", copy: "Repo des de template, PRs, tests, migrations i secrets separats per entorn.", result: "Preview revisable" },
  { number: "04", title: "Llançament", copy: "Staging, migració de domini, checklist SEO, seguretat, rendiment i rollback.", result: "Producció estable" },
  { number: "05", title: "Operació", copy: "Errors, uptime, analítica, backups, actualitzacions i informe de consum.", result: "SLA i manteniment" },
];

export function WebDeliveryFlow() {
  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.035] p-5 sm:p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Pipeline repetible</p><h3 className="mt-2 text-2xl sm:text-3xl">De la idea a una producció operable</h3></div><div className="flex flex-wrap gap-2"><TechLogo tech="github" compact /><TechLogo tech="vercel" compact /><TechLogo tech="sentry" compact /></div></div>
      <div className="grid gap-3 lg:grid-cols-5">{steps.map((step, index) => <motion.div key={step.number} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.09 }} className="relative rounded-2xl border border-white/10 bg-black/20 p-4">
        {index < steps.length - 1 && <ArrowRight className="absolute -right-5 top-7 z-10 hidden h-5 w-5 text-white/25 lg:block" />}<span className="text-xs font-semibold text-violet-300">{step.number}</span><h4 className="mt-3 text-lg">{step.title}</h4><p className="mt-2 min-h-20 text-xs leading-relaxed text-white/45">{step.copy}</p><span className="mt-4 flex items-center gap-2 text-xs text-emerald-300"><CheckCircle2 className="h-3.5 w-3.5" />{step.result}</span>
      </motion.div>)}</div>
    </div>
  );
}
