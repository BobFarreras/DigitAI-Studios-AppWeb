/**
 * @file src/features/projects/ui/CompanyHealth.tsx
 * @updated 2026-08-22
 * @summary Quadre de comandament economic i operatiu de l'empresa.
 * @scope Guia executiva privada.
 */
import { Activity, Banknote, Calculator, Users } from "lucide-react";

const metrics = [
  { name: "Runway", target: "≥ 6 mesos", formula: "Caixa ÷ despesa neta mensual", meaning: "Temps per reaccionar sense vendre amb pànic" },
  { name: "Concentració", target: "< 30% per client", formula: "Ingressos client ÷ ingressos totals", meaning: "Dependència comercial i risc de caixa" },
  { name: "Marge brut", target: "> 50% orientatiu", formula: "(Venda − cost directe) ÷ venda", meaning: "Si el servei pot sostenir equip i estructura" },
  { name: "Utilització", target: "65–75%", formula: "Hores facturables ÷ hores disponibles", meaning: "Equilibri entre entrega, venda i millora interna" },
  { name: "Pipeline", target: "≥ 3× objectiu", formula: "Valor ponderat d’oportunitats", meaning: "Cobertura de vendes dels pròxims 90 dies" },
  { name: "Cobraments", target: "< 30 dies", formula: "Dies mitjans fins al cobrament", meaning: "Benefici comptable convertit en caixa real" },
];
const review = [
  { icon: Banknote, title: "Setmanal · Caixa", actions: ["Saldo i factures vençudes", "Pagaments dels pròxims 30 dies", "Despesa variable d’IA i cloud"] },
  { icon: Users, title: "Setmanal · Vendes", actions: ["Leads nous i qualificats", "Propostes obertes i següent acció", "Pipeline per origen i probabilitat"] },
  { icon: Activity, title: "Mensual · Clients", actions: ["Marge real per projecte", "Incidències, SLA i satisfacció", "Renovació, risc i oportunitat"] },
  { icon: Calculator, title: "Trimestral · Empresa", actions: ["Preus i paquets", "Capacitat abans de contractar", "Concentració i runway"] },
];

export function CompanyHealth() {
  return <section><p className="text-xs uppercase tracking-[.2em] text-emerald-300">07 · Economia i salut</p><h2 className="mt-4 max-w-5xl text-4xl tracking-[-.05em] sm:text-6xl">Facturar no és el mateix que construir una empresa sana.</h2><p className="mt-5 max-w-3xl text-white/50">Aquests són objectius inicials, no lleis universals. Serveixen com a semàfor perquè direcció vegi problemes abans que arribin al banc.</p>
    <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{metrics.map((metric) => <article key={metric.name} className="rounded-3xl border border-white/10 bg-white/[.035] p-5"><div className="flex items-start justify-between gap-3"><h3 className="text-xl">{metric.name}</h3><span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">{metric.target}</span></div><code className="mt-5 block text-xs text-cyan-200/70">{metric.formula}</code><p className="mt-3 text-xs leading-relaxed text-white/40">{metric.meaning}</p></article>)}</div>
    <div className="mt-6 grid gap-3 lg:grid-cols-4">{review.map(({ icon: Icon, title, actions }) => <article key={title} className="rounded-3xl border border-violet-400/15 bg-violet-400/[.04] p-5"><Icon className="h-6 w-6 text-violet-300" /><h3 className="mt-4 text-sm font-semibold">{title}</h3><ul className="mt-4 space-y-2">{actions.map((action) => <li key={action} className="text-xs leading-relaxed text-white/45">· {action}</li>)}</ul></article>)}</div>
    <div className="mt-6 rounded-3xl border border-cyan-400/20 bg-cyan-400/[.05] p-5 sm:p-7"><span className="text-xs uppercase tracking-[.16em] text-cyan-300">Com posem preu</span><div className="mt-4 grid gap-4 md:grid-cols-3"><p className="text-sm"><strong className="block text-white">Setup inicial</strong><span className="text-white/45">Descoberta + construcció + risc + marge</span></p><p className="text-sm"><strong className="block text-white">Quota mensual</strong><span className="text-white/45">Suport + monitoratge + manteniment + marge</span></p><p className="text-sm"><strong className="block text-white">Variable</strong><span className="text-white/45">Cloud, missatges i tokens mesurats per client</span></p></div></div>
  </section>;
}
