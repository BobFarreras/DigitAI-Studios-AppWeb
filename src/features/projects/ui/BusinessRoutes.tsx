/**
 * @file src/features/projects/ui/BusinessRoutes.tsx
 * @updated 2026-08-22
 * @summary Tres rutes interactives per vendre i implantar els serveis.
 * @scope Guia comercial i tecnica privada.
 */
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, Boxes, CheckCircle2, Workflow } from "lucide-react";
import { useState } from "react";
import type { TechKey } from "../data/infrastructure-guide";
import { TechLogo } from "./TechLogo";

const routes: Array<{ title: string; icon: typeof Bot; promise: string; sell: string; flow: string[]; tech: TechKey[]; delivery: string[]; recurring: string }> = [
  { title: "Aplicacions i web", icon: Boxes, promise: "Una interfície que capta, ven o permet operar.", sell: "Landing, ecommerce, dashboard, SaaS o software intern", flow: ["Descoberta", "Prototip", "GitHub + CI", "Preview", "Producció", "Manteniment"], tech: ["nextjs", "typescript", "supabase", "vercel", "sentry"], delivery: ["Codi, disseny i documentació", "Comptes del client i entorns separats", "SEO, analítica, errors i backups"], recurring: "Manteniment, evolutius, observabilitat i consum" },
  { title: "Automatitzacions", icon: Workflow, promise: "Menys operacions manuals i menys errors.", sell: "Captura de leads, comandes, factures, CRM i notificacions", flow: ["Mapar procés", "Mesurar baseline", "Workflow test", "Aprovació humana", "Producció", "Alertes"], tech: ["n8n", "hostinger", "postgres", "redis"], delivery: ["Instància del client o llicència adequada", "Credencials aïllades i webhooks signats", "Retries, logs i manual de recuperació"], recurring: "Quota per manteniment + infraestructura + volum" },
  { title: "Agents IA", icon: Bot, promise: "Un assistent que entén i executa amb control.", sell: "WhatsApp, suport, leads, comandes i operació interna", flow: ["Canal", "API segura", "Context", "Model router", "Tools / n8n", "Humà"], tech: ["whatsapp", "openai", "ollama", "n8n", "supabase"], delivery: ["Casos d’ús i límits explícits", "Memòria, permisos i traçabilitat", "Fallback humà i avaluació de qualitat"], recurring: "Setup + quota base + missatges/tokens repercutits" },
];

export function BusinessRoutes() {
  const [selected, setSelected] = useState(0);
  const route = routes[selected];
  return <section><div className="max-w-4xl"><p className="text-xs uppercase tracking-[0.2em] text-violet-300">02 · Tres rutes de negoci</p><h2 className="mt-4 text-4xl tracking-[-0.05em] sm:text-6xl">El cap tria el resultat. El sistema revela com l’entreguem.</h2></div>
    <div className="mt-9 grid gap-3 md:grid-cols-3">{routes.map(({ title, icon: Icon, promise }, index) => <button key={title} type="button" onClick={() => setSelected(index)} className={`rounded-3xl border p-5 text-left transition duration-300 ${selected === index ? "border-violet-400/50 bg-violet-400/12 shadow-[0_20px_70px_rgba(124,58,237,.15)]" : "border-white/10 bg-white/[.03] hover:border-white/25"}`}><Icon className={`h-6 w-6 ${selected === index ? "text-violet-300" : "text-white/35"}`} /><strong className="mt-5 block text-xl">{title}</strong><span className="mt-2 block text-xs leading-relaxed text-white/45">{promise}</span></button>)}</div>
    <AnimatePresence mode="wait"><motion.div key={route.title} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: .45 }} className="mt-5 overflow-hidden rounded-[32px] border border-white/10 bg-white/[.035] p-5 sm:p-9"><div className="grid gap-9 lg:grid-cols-[1.15fr_.85fr]"><div><span className="text-xs uppercase tracking-[.16em] text-cyan-300">Què venem</span><h3 className="mt-3 text-3xl sm:text-4xl">{route.sell}</h3><div className="mt-8 flex flex-wrap items-center gap-2">{route.flow.map((step, index) => <div key={step} className="flex items-center gap-2"><motion.span initial={{ scale: .8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: index * .08 }} className="rounded-xl border border-cyan-400/20 bg-cyan-400/[.07] px-3 py-2 text-xs text-white/75">{step}</motion.span>{index < route.flow.length - 1 && <span className="text-white/20">→</span>}</div>)}</div><div className="mt-8 flex flex-wrap gap-2">{route.tech.map((tech) => <TechLogo key={tech} tech={tech} compact />)}</div></div>
      <div className="rounded-3xl border border-white/10 bg-black/20 p-5"><span className="text-xs uppercase tracking-[.16em] text-emerald-300">Entrega professional</span><ul className="mt-5 space-y-4">{route.delivery.map((item) => <li key={item} className="flex gap-3 text-sm text-white/65"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />{item}</li>)}</ul><div className="mt-6 border-t border-white/10 pt-5"><span className="text-[10px] uppercase tracking-[.14em] text-white/35">Model recurrent</span><p className="mt-2 text-sm text-violet-200">{route.recurring}</p></div></div></div></motion.div></AnimatePresence>
  </section>;
}
