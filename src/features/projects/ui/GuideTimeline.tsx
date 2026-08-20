/**
 * @file src/features/projects/ui/GuideTimeline.tsx
 * @updated 2026-08-20
 * @summary Roadmap vertical animat amb decisions, eines i resultats.
 * @scope Presentacio responsive de fases.
 */
"use client";

import { motion } from "framer-motion";
import { ArrowDown, Check } from "lucide-react";
import { phases } from "../data/infrastructure-guide";
import { TechLogo } from "./TechLogo";

export function GuideTimeline() {
  return <section className="relative mx-auto max-w-6xl">
    <div className="absolute bottom-16 left-[27px] top-16 w-px bg-gradient-to-b from-violet-500 via-cyan-400 to-emerald-400 md:left-1/2" />
    {phases.map((phase, index) => <motion.article key={phase.number} initial={{ opacity: 0, y: 38 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-12% 0px" }} transition={{ duration: 0.75 }} className={`relative mb-10 grid pl-16 md:grid-cols-2 md:gap-20 md:pl-0 ${index % 2 ? "" : "md:[&>div]:col-start-2"}`}>
      <span className="absolute left-0 top-0 z-10 grid h-14 w-14 place-items-center rounded-full border border-violet-400/40 bg-[#0a0a0f] font-mono text-sm text-violet-300 md:left-1/2 md:-translate-x-1/2">{phase.number}</span>
      <div className={`rounded-[26px] border border-white/10 bg-white/[0.035] p-6 ${index % 2 ? "md:col-start-1 md:row-start-1" : ""}`}>
        <p className="text-xs uppercase tracking-[0.18em] text-violet-300">{phase.owner}</p><h3 className="mt-3 text-2xl tracking-[-0.03em] text-white">{phase.title}</h3><p className="mt-3 text-sm leading-relaxed text-white/55">{phase.goal}</p>
        <div className="mt-5 flex flex-wrap gap-2">{phase.tech.map((tech) => <TechLogo key={tech} tech={tech} compact />)}</div>
        <ul className="mt-6 space-y-3">{phase.actions.map((action) => <li key={action} className="flex gap-3 text-sm text-white/70"><Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />{action}</li>)}</ul>
        <div className="mt-6 border-t border-white/10 pt-4 text-sm font-medium text-emerald-300">Resultat · {phase.result}</div>
      </div>
      {index < phases.length - 1 && <ArrowDown className="absolute -bottom-7 left-[19px] h-4 w-4 text-cyan-400 md:left-1/2 md:-translate-x-1/2" />}
    </motion.article>)}
  </section>;
}
