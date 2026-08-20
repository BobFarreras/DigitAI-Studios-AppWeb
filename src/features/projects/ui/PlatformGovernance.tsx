/**
 * @file src/features/projects/ui/PlatformGovernance.tsx
 * @updated 2026-08-20
 * @summary Propietat, entorns i alternatives de la plataforma web.
 * @scope Guia privada de lliurament web.
 */
import { AlertTriangle, Check, KeyRound } from "lucide-react";
import { TechLogo } from "./TechLogo";

const ownership = [
  { asset: "Domini i facturació", owner: "Client / empresa", access: "Nosaltres com a gestor", rule: "Registrar al compte corporatiu; DNS a Cloudflare. Mai a nom del tècnic." },
  { asset: "GitHub", owner: "Organització acordada", access: "Teams + permisos mínims", rule: "Repo per producte, main protegida, PR obligatòria i recuperació documentada." },
  { asset: "Supabase", owner: "Organització del client", access: "Admin o Developer", rule: "Free només prototip. Producció Pro, RLS, migrations i backups verificats." },
  { asset: "Vercel i Sentry", owner: "Client o servei gestionat", access: "Equip tècnic convidat", rule: "Contracte indica facturació, sortida, retenció de dades i SLA." },
];

const alternatives = [
  { need: "Web / frontend", primary: "Vercel", alternatives: "Cloudflare Pages · Netlify · Render", use: "Vercel per Next.js; Cloudflare per estàtic/global; Render per serveis persistents." },
  { need: "Dades + auth", primary: "Supabase", alternatives: "Neon + Auth.js/Clerk · Firebase · PostgreSQL gestionat", use: "Supabase accelera el producte; components separats donen més control i complexitat." },
  { need: "Ecommerce", primary: "Shopify", alternatives: "WooCommerce · Medusa · custom + Stripe", use: "Shopify per operar ràpid; headless/custom només per requisits diferencials." },
  { need: "Hosting servidor", primary: "Vercel / managed", alternatives: "Hostinger VPS · Fly.io · Railway", use: "VPS per n8n/workers; no per acumular totes les webs en un únic punt de fallada." },
];

export function PlatformGovernance() {
  return <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
    <div className="rounded-[32px] border border-violet-400/20 bg-violet-400/[0.05] p-5 sm:p-8"><div className="flex items-center gap-3"><KeyRound className="h-7 w-7 text-violet-300" /><h3 className="text-2xl">Qui ha de ser propietari?</h3></div><p className="mt-3 text-sm leading-relaxed text-white/50">El client conserva els actius; l’equip tècnic rep accés revocable. Si oferim servei gestionat, la propietat i el pla de sortida queden al contracte.</p>
      <div className="mt-6 space-y-3">{ownership.map((row) => <div key={row.asset} className="rounded-2xl border border-white/10 bg-black/20 p-4"><div className="flex flex-wrap justify-between gap-2"><strong>{row.asset}</strong><span className="text-xs text-violet-200">{row.owner} · {row.access}</span></div><p className="mt-2 text-xs leading-relaxed text-white/45">{row.rule}</p></div>)}</div>
      <div className="mt-5 flex gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-4"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" /><p className="text-xs leading-relaxed text-amber-100/70"><strong className="text-amber-200">Supabase Free:</strong> adequat per demo o validació, no com a compromís de producció. Projecte i organització del client, amb nosaltres convidats; mai dependent només del nostre usuari personal.</p></div>
    </div>
    <div className="rounded-[32px] border border-white/10 bg-white/[0.035] p-5 sm:p-8"><h3 className="text-2xl">Decidir sense dependència</h3><p className="mt-3 text-sm text-white/45">Una opció principal i una ruta de sortida per capa.</p><div className="mt-6 space-y-4">{alternatives.map((row) => <div key={row.need} className="border-b border-white/10 pb-4 last:border-0"><span className="text-[10px] uppercase tracking-[0.16em] text-cyan-300">{row.need}</span><div className="mt-2 flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-emerald-300" /><strong>{row.primary}</strong><span className="text-white/25">→</span><span className="text-white/45">{row.alternatives}</span></div><p className="mt-2 text-xs leading-relaxed text-white/40">{row.use}</p></div>)}</div><div className="mt-6 flex flex-wrap gap-2"><TechLogo tech="cloudflare" compact /><TechLogo tech="hostinger" compact /><TechLogo tech="shopify" compact /></div></div>
  </div>;
}
