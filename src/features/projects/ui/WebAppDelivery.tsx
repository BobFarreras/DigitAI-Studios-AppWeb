/**
 * @file src/features/projects/ui/WebAppDelivery.tsx
 * @updated 2026-08-20
 * @summary Seccio executiva per decidir i lliurar webs i aplicacions.
 * @scope Guia privada de projectes.
 */
import { Code2, Database, Globe2, ServerCog } from "lucide-react";
import { PlatformGovernance } from "./PlatformGovernance";
import { ProductDecisionGrid } from "./ProductDecisionGrid";
import { TechLogo } from "./TechLogo";
import { WebDeliveryFlow } from "./WebDeliveryFlow";

const environments = [
  { name: "Local", url: "localhost", data: "Dades de prova", purpose: "Desenvolupar sense tocar clients" },
  { name: "Preview", url: "pr-42.vercel.app", data: "Efímeres / test", purpose: "Validar cada pull request" },
  { name: "Staging", url: "staging.app.cat", data: "Còpia anonimitzada", purpose: "Acceptació abans del llançament" },
  { name: "Producció", url: "app.client.com", data: "Reals i protegides", purpose: "Servei, alertes i backups" },
];

export function WebAppDelivery() {
  return <div className="space-y-14">
    <div><p className="text-xs uppercase tracking-[0.2em] text-emerald-300">03 · Webs i aplicacions</p><h2 className="mt-4 max-w-5xl text-4xl tracking-[-0.05em] sm:text-6xl">Primer definim el producte. Després triem la infraestructura.</h2><p className="mt-5 max-w-3xl text-white/50">Una landing, un ecommerce i un SaaS no necessiten el mateix cost ni el mateix risc. Aquest procés converteix una petició comercial en una entrega tècnica mesurable.</p><div className="mt-7 flex flex-wrap gap-2"><TechLogo tech="nextjs" /><TechLogo tech="typescript" /><TechLogo tech="supabase" /><TechLogo tech="vercel" /></div></div>
    <ProductDecisionGrid />
    <WebDeliveryFlow />
    <div><div className="mb-6"><p className="text-xs uppercase tracking-[0.18em] text-violet-300">Arquitectura base d’una app</p><h3 className="mt-2 text-3xl">Capes independents, substituïbles i observables</h3></div><div className="grid gap-3 md:grid-cols-4">{[
      { icon: Globe2, title: "Perímetre", copy: "Domini del client · DNS/CDN Cloudflare · www/app/api", tech: "cloudflare" as const },
      { icon: Code2, title: "Aplicació", copy: "Next.js + TypeScript · UI, server actions i validació", tech: "nextjs" as const },
      { icon: Database, title: "Dades", copy: "Supabase per producte · Auth, RLS, Postgres i Storage", tech: "supabase" as const },
      { icon: ServerCog, title: "Operació", copy: "Vercel · Sentry · analítica · backups i alertes", tech: "sentry" as const },
    ].map((layer, index) => <div key={layer.title} className="rounded-3xl border border-white/10 bg-white/[0.035] p-5"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.07] text-cyan-300"><layer.icon className="h-5 w-5" /></span><span className="mt-5 block text-xs text-white/30">CAPA {index + 1}</span><h4 className="mt-1 text-xl">{layer.title}</h4><p className="my-4 min-h-14 text-xs leading-relaxed text-white/45">{layer.copy}</p><TechLogo tech={layer.tech} compact /></div>)}</div></div>
    <div><h3 className="text-3xl">Quatre entorns, quatre responsabilitats</h3><div className="mt-6 overflow-hidden rounded-3xl border border-white/10"><div className="grid grid-cols-[.7fr_1fr_1fr] gap-3 bg-white/[0.07] px-4 py-3 text-[10px] uppercase tracking-wider text-white/40 sm:grid-cols-4"><span>Entorn</span><span>URL</span><span>Dades</span><span className="hidden sm:block">Funció</span></div>{environments.map((env) => <div key={env.name} className="grid grid-cols-[.7fr_1fr_1fr] gap-3 border-t border-white/10 px-4 py-4 text-xs sm:grid-cols-4"><strong>{env.name}</strong><code className="truncate text-cyan-200/70">{env.url}</code><span className="text-white/55">{env.data}</span><span className="hidden text-white/40 sm:block">{env.purpose}</span></div>)}</div><p className="mt-4 text-xs leading-relaxed text-white/40">Secrets diferents a cada entorn. Només variables explícitament públiques arriben al navegador; claus de servei, pagaments i APIs viuen exclusivament al servidor.</p></div>
    <PlatformGovernance />
  </div>;
}
