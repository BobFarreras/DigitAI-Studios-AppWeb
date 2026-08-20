/**
 * @file src/features/projects/ui/N8nStrategy.tsx
 * @updated 2026-08-20
 * @summary Arbre professional per decidir el tenancy i llicencia de n8n.
 * @scope Guia visual de decisio comercial i tecnica.
 */
import { Building2, CheckCircle2, Network, ShieldAlert } from "lucide-react";
import { TechLogo } from "./TechLogo";

const options = [
  { icon: Building2, title: "Instància del client", badge: "Recomanat per començar", tone: "emerald", text: "El client és titular del VPS i n8n. Vosaltres configureu, desplegueu i manteniu.", points: ["Aïllament de dades i credencials", "Cost i consum imputables al client", "Sortida i transferència senzilles", "Community possible segons l’ús del client"] },
  { icon: Network, title: "Plataforma central", badge: "Només amb contracte correcte", tone: "amber", text: "La vostra empresa allotja workflows i credencials de diversos clients.", points: ["Consultar n8n Enterprise", "Separació per projectes i RBAC", "SLA, DPA, backups i auditoria", "No revendre Community com a SaaS"] },
];

export function N8nStrategy() {
  return <section className="rounded-[32px] border border-white/10 bg-[#0d0d13] p-6 sm:p-10"><div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs uppercase tracking-[0.2em] text-orange-300">Decisió crítica · n8n</p><h2 className="mt-4 max-w-3xl text-4xl tracking-[-0.05em] sm:text-6xl">Una VPS compartida o una per client?</h2></div><TechLogo tech="n8n" /></div>
    <div className="mt-10 grid gap-5 lg:grid-cols-2">{options.map(({ icon: Icon, title, badge, tone, text, points }) => <article key={title} className={`rounded-[24px] border p-6 ${tone === "emerald" ? "border-emerald-400/35 bg-emerald-400/6" : "border-amber-400/30 bg-amber-400/5"}`}><Icon className={`h-7 w-7 ${tone === "emerald" ? "text-emerald-300" : "text-amber-300"}`} /><span className="mt-5 inline-block rounded-full bg-white/8 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/55">{badge}</span><h3 className="mt-4 text-2xl">{title}</h3><p className="mt-3 text-sm leading-relaxed text-white/50">{text}</p><ul className="mt-6 space-y-3">{points.map((point) => <li key={point} className="flex gap-3 text-sm text-white/70"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />{point}</li>)}</ul></article>)}</div>
    <div className="mt-5 flex gap-4 rounded-2xl border border-red-400/20 bg-red-400/5 p-5"><ShieldAlert className="h-5 w-5 shrink-0 text-red-300" /><p className="text-sm leading-relaxed text-white/60"><strong className="text-white">No barrejar clients només per estalviar una VPS.</strong> Una credencial, node comunitari o workflow mal configurat pot creuar dades. L’estalvi d’infraestructura és menor que el risc operatiu i contractual.</p></div>
  </section>;
}
