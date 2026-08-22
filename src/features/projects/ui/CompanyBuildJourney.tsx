/**
 * @file src/features/projects/ui/CompanyBuildJourney.tsx
 * @updated 2026-08-22
 * @summary Construccio immersiva de l'empresa per etapes de maduresa.
 * @scope Narrativa animada de la guia privada.
 */
"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Building2, Check, CircleDollarSign } from "lucide-react";
import { useRef, useState } from "react";
import type { TechKey } from "../data/infrastructure-guide";
import { TechLogo } from "./TechLogo";

const stages: Array<{ level: string; title: string; moment: string; budget: string; color: string; tech: TechKey[]; build: string[]; rule: string }> = [
  { level: "00", title: "Fonaments", moment: "Abans del primer client", budget: "Cost mínim corporatiu", color: "cyan", tech: ["github", "cloudflare"], build: ["Domini, correu i gestor de secrets", "GitHub Organization gratuïta", "Plantilla de projecte i procés comercial"], rule: "Els actius neixen a nom de l’empresa, mai en comptes personals." },
  { level: "01", title: "Laboratori", moment: "Validar sense estructura excessiva", budget: "VPS + domini", color: "violet", tech: ["hostinger", "n8n", "ollama"], build: ["Una VPS per eines internes i demos", "n8n Community només per operació interna", "Ollama per proves i tasques petites"], rule: "Ollama no és cost zero: consumeix CPU/GPU i no substitueix una API fiable en producció." },
  { level: "02", title: "Primer client", moment: "Separar propietat i risc", budget: "Infra repercutida al client", color: "amber", tech: ["vercel", "supabase", "sentry"], build: ["Comptes i domini propietat del client", "Supabase Free només per prototip", "Producció comercial en hosting adequat"], rule: "Vercel Hobby és personal/no comercial; utilitzem Pro, Cloudflare o hosting contractat." },
  { level: "03", title: "Empresa escalable", moment: "Quan hi ha recurrència", budget: "Cost per client + marge", color: "emerald", tech: ["postgres", "redis", "openai"], build: ["Entorns, backups, queues i alertes", "Instància n8n del client quan correspon", "Límits d’IA, observabilitat i SLA"], rule: "Cada client té cost, dades, credencials i pla de sortida identificables." },
];

const tones = { cyan: "border-cyan-400/35 bg-cyan-400/10", violet: "border-violet-400/35 bg-violet-400/10", amber: "border-amber-400/35 bg-amber-400/10", emerald: "border-emerald-400/35 bg-emerald-400/10" };

export function CompanyBuildJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  useMotionValueEvent(scrollYProgress, "change", (value) => setActive(Math.min(stages.length - 1, Math.floor(value * stages.length))));
  return <section ref={ref} className="relative grid gap-12 lg:grid-cols-[.9fr_1.1fr]">
    <div className="lg:sticky lg:top-36 lg:h-[calc(100vh-11rem)]"><p className="text-xs uppercase tracking-[0.2em] text-cyan-300">01 · Construïm mentre avancem</p><h2 className="mt-4 text-4xl tracking-[-0.05em] sm:text-6xl">L’empresa, planta per planta.</h2><p className="mt-5 max-w-lg text-white/50">No comprem tota la infraestructura el dia zero. Cada planta apareix quan ingressos, risc o operació la justifiquen.</p>
      <div className="relative mt-8 flex h-[390px] flex-col-reverse justify-start gap-2 rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_50%_80%,rgba(124,58,237,.2),transparent_55%)] p-5 sm:p-7">
        {stages.map((stage, index) => <motion.div key={stage.level} animate={{ opacity: index <= active ? 1 : .12, y: index <= active ? 0 : 18, scale: index === active ? 1.02 : 1 }} transition={{ duration: .65, ease: [0.16, 1, 0.3, 1] }} className={`flex min-h-16 items-center justify-between rounded-2xl border px-4 ${tones[stage.color as keyof typeof tones]}`}><div><span className="text-[10px] text-white/40">PLANTA {stage.level}</span><strong className="block text-sm sm:text-base">{stage.title}</strong></div><div className="hidden flex-wrap justify-end gap-1.5 sm:flex">{stage.tech.slice(0, 2).map((tech) => <TechLogo key={tech} tech={tech} compact />)}</div></motion.div>)}
        <motion.div animate={{ top: `${76 - active * 18}%` }} transition={{ duration: .7 }} className="absolute right-3 grid h-9 w-9 place-items-center rounded-full border border-violet-300/40 bg-[#11111a] shadow-[0_0_24px_rgba(139,92,246,.45)]"><Building2 className="h-4 w-4 text-violet-300" /></motion.div>
      </div>
    </div>
    <div>{stages.map((stage, index) => <motion.article key={stage.level} onViewportEnter={() => setActive(index)} viewport={{ amount: .55 }} className="flex min-h-[78vh] items-center py-12"><div className={`w-full rounded-[32px] border p-6 sm:p-9 ${tones[stage.color as keyof typeof tones]}`}><div className="flex flex-wrap items-start justify-between gap-4"><div><span className="font-mono text-xs text-white/35">FASE {stage.level}</span><h3 className="mt-2 text-3xl sm:text-5xl">{stage.title}</h3><p className="mt-2 text-sm text-white/50">{stage.moment}</p></div><span className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs text-emerald-200"><CircleDollarSign className="h-4 w-4" />{stage.budget}</span></div><div className="mt-7 flex flex-wrap gap-2">{stage.tech.map((tech) => <TechLogo key={tech} tech={tech} />)}</div><ul className="mt-8 space-y-4">{stage.build.map((item) => <li key={item} className="flex gap-3 text-sm text-white/75"><Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />{item}</li>)}</ul><p className="mt-8 border-t border-white/10 pt-5 text-sm leading-relaxed text-white/55"><strong className="text-white">Regla de pas:</strong> {stage.rule}</p></div></motion.article>)}</div>
  </section>;
}
