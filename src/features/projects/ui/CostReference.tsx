/**
 * @file src/features/projects/ui/CostReference.tsx
 * @updated 2026-08-20
 * @summary Referencia executiva de costos fixos, variables i repercutibles.
 * @scope Snapshot orientatiu per pressupostar productes.
 */
import { CircleDollarSign, TriangleAlert } from "lucide-react";

const costs = [
  { service: "GitHub Organization", model: "Per seient / pla", estimate: "0–$21+ usuari/mes", owner: "Empresa" },
  { service: "Vercel Pro", model: "Seients + consum", estimate: "~$20 usuari/mes + ús", owner: "Empresa o client" },
  { service: "Supabase Pro", model: "Organització + compute", estimate: "$25/mes; projectes extra des de ~$10", owner: "Client/projecte" },
  { service: "Hostinger VPS KVM 2", model: "Servidor", estimate: "14,99 €/mes renovació", owner: "Client" },
  { service: "n8n Cloud", model: "Execucions", estimate: "20–50 €/mes inici", owner: "Client" },
  { service: "n8n self-hosted", model: "Infra + llicència", estimate: "Community client / Business 667 €+", owner: "Segons tenancy" },
  { service: "WhatsApp Cloud API", model: "Missatges/template", estimate: "Variable per país i categoria", owner: "Client" },
  { service: "IA via API", model: "Tokens i tools", estimate: "Variable amb límit mensual", owner: "Client o repercutit" },
  { service: "Ollama", model: "GPU + operació", estimate: "Sense tokens; infraestructura dedicada", owner: "Empresa o client" },
];

export function CostReference() {
  return <section className="rounded-[32px] border border-white/10 bg-white/[0.035] p-6 sm:p-10"><div className="flex items-start gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-400/12"><CircleDollarSign className="h-6 w-6 text-emerald-300" /></span><div><p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Snapshot · agost 2026</p><h2 className="mt-2 text-4xl tracking-[-0.05em] sm:text-6xl">Què paga l’empresa i què paga el client?</h2></div></div>
    <div className="mt-9 overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead><tr className="border-b border-white/15 text-[10px] uppercase tracking-[0.16em] text-white/35"><th className="px-3 py-4">Servei</th><th className="px-3 py-4">Model</th><th className="px-3 py-4">Ordre de cost</th><th className="px-3 py-4">Titular recomanat</th></tr></thead><tbody>{costs.map((cost) => <tr key={cost.service} className="border-b border-white/7 text-sm"><td className="px-3 py-4 font-medium text-white">{cost.service}</td><td className="px-3 py-4 text-white/50">{cost.model}</td><td className="px-3 py-4 text-emerald-300">{cost.estimate}</td><td className="px-3 py-4 text-white/60">{cost.owner}</td></tr>)}</tbody></table></div>
    <div className="mt-6 flex gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-4"><TriangleAlert className="h-5 w-5 shrink-0 text-amber-300" /><p className="text-xs leading-relaxed text-white/55">Imports orientatius abans d’IVA, promocions i consum. Pressuposta sempre amb preu de renovació, un 20% de marge tècnic i alertes de despesa. Les subscripcions ChatGPT/Claude no substitueixen les API dels agents.</p></div>
  </section>;
}
