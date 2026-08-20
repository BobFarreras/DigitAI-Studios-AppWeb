/**
 * @file src/features/projects/ui/OperatingModel.tsx
 * @updated 2026-08-20
 * @summary Responsabilitats, entorns i rangs de cost recomanats.
 * @scope Blocs finals de decisio de la guia.
 */
import { BadgeEuro, BriefcaseBusiness, ServerCog } from "lucide-react";

const roles = [
  { icon: BriefcaseBusiness, title: "Direcció / Comercial", items: ["Relació i descoberta amb el client", "Preu, marge i prioritat", "Aprovació de costos i contractes", "Titularitat dels comptes corporatius"] },
  { icon: ServerCog, title: "Responsable tècnic", items: ["Arquitectura i estàndards", "Seguretat, dades i desplegaments", "Qualitat, monitoratge i incidents", "Estimacions i risc tècnic"] },
];
const tiers = [
  { name: "Base", price: "80–180 €/mes", text: "Web, Supabase i automatització moderada." },
  { name: "Operativa", price: "220–450 €/mes", text: "VPS, n8n, backups, observabilitat i IA." },
  { name: "Escala", price: "600 €+ /mes", text: "Alta disponibilitat, queues i múltiples entorns." },
];

export function OperatingModel() {
  return <div className="grid gap-6 lg:grid-cols-2">
    <section className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 sm:p-8"><h2 className="text-3xl tracking-[-0.04em] text-white">Qui decideix què?</h2><div className="mt-7 space-y-7">{roles.map(({ icon: Icon, title, items }) => <div key={title} className="grid gap-4 sm:grid-cols-[auto_1fr]"><span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-500/15"><Icon className="h-5 w-5 text-violet-300" /></span><div><h3 className="font-semibold text-white">{title}</h3><ul className="mt-2 space-y-1 text-sm text-white/55">{items.map((item) => <li key={item}>· {item}</li>)}</ul></div></div>)}</div></section>
    <section className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 sm:p-8"><BadgeEuro className="h-7 w-7 text-emerald-300" /><h2 className="mt-4 text-3xl tracking-[-0.04em] text-white">Cost d’infraestructura</h2><p className="mt-3 text-sm text-white/45">Rangs orientatius abans del consum variable d’IA, telefonia o missatgeria.</p><div className="mt-7 space-y-3">{tiers.map((tier, index) => <div key={tier.name} className={`rounded-2xl border p-4 ${index === 1 ? "border-emerald-400/40 bg-emerald-400/8" : "border-white/10"}`}><div className="flex items-center justify-between gap-4"><strong className="text-white">{tier.name}</strong><span className="text-sm font-semibold text-emerald-300">{tier.price}</span></div><p className="mt-2 text-xs text-white/50">{tier.text}</p></div>)}</div></section>
  </div>;
}
