/**
 * @file src/features/projects/ui/ProductBlueprints.tsx
 * @updated 2026-08-20
 * @summary Diagrames dels tres productes que vendra l'empresa.
 * @scope Presentacio animada d'arquitectures de referencia.
 */
"use client";

import { motion } from "framer-motion";
import { Bot, Boxes, Workflow } from "lucide-react";
import type { TechKey } from "../data/infrastructure-guide";
import { TechLogo } from "./TechLogo";

const products: Array<{ icon: typeof Bot; title: string; promise: string; flow: string[]; tech: TechKey[]; rule: string }> = [
  { icon: Workflow, title: "Automatitzacions", promise: "Connectar sistemes i eliminar feina manual.", flow: ["Trigger", "Validació", "n8n", "Sistema destí", "Log + alerta"], tech: ["n8n", "hostinger", "postgres"], rule: "n8n orquestra; les regles crítiques viuen en serveis versionats." },
  { icon: Bot, title: "Agents IA i WhatsApp", promise: "Entendre, decidir i executar amb límits.", flow: ["WhatsApp", "Webhook", "API Agent", "Model IA", "Eines / CRM", "Resposta"], tech: ["whatsapp", "openai", "anthropic", "n8n"], rule: "L’API controla identitat, memòria i permisos; n8n executa processos." },
  { icon: Boxes, title: "Web, software i apps", promise: "Productes independents, desplegables i mesurables.", flow: ["Cloudflare", "Vercel", "Next.js API", "Supabase", "Workers / n8n"], tech: ["cloudflare", "vercel", "github", "supabase"], rule: "Cada producte té repositori, entorns, base de dades i pressupost propis." },
];

export function ProductBlueprints() {
  return <div className="grid gap-5 xl:grid-cols-3">{products.map(({ icon: Icon, title, promise, flow, tech, rule }, cardIndex) => <motion.article key={title} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: cardIndex * 0.12 }} className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6">
    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-500/15"><Icon className="h-6 w-6 text-violet-300" /></span><h3 className="mt-5 text-2xl tracking-[-0.03em]">{title}</h3><p className="mt-2 min-h-12 text-sm leading-relaxed text-white/50">{promise}</p>
    <div className="mt-6 space-y-2">{flow.map((node, index) => <div key={node} className="relative flex items-center gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-cyan-400/30 bg-cyan-400/8 font-mono text-[10px] text-cyan-300">{index + 1}</span><span className="flex-1 rounded-lg border border-white/8 bg-black/20 px-3 py-2 text-xs text-white/70">{node}</span>{index < flow.length - 1 && <span className="absolute left-[13px] top-7 h-2 w-px bg-cyan-400/40" />}</div>)}</div>
    <div className="mt-6 flex flex-wrap gap-2">{tech.map((item) => <TechLogo key={item} tech={item} compact />)}</div><p className="mt-6 border-t border-white/10 pt-4 text-xs leading-relaxed text-emerald-300">Criteri · {rule}</p>
  </motion.article>)}</div>;
}
