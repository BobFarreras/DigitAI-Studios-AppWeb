/**
 * @file src/features/projects/ui/ProductDecisionGrid.tsx
 * @updated 2026-08-20
 * @summary Arbre de decisio visual segons el producte web que necessita el client.
 * @scope Guia privada de lliurament web.
 */
"use client";

import { motion } from "framer-motion";
import { BarChart3, Building2, LayoutTemplate, ShoppingBag } from "lucide-react";

const products = [
  { icon: LayoutTemplate, title: "Landing", signal: "Validar o captar leads", answer: "Next.js estàtic · CMS opcional", scope: "1 objectiu, formulari, analítica i SEO", tone: "cyan" },
  { icon: Building2, title: "Web corporativa", signal: "Explicar i posicionar", answer: "Next.js + CMS si edita el client", scope: "Contingut, idiomes, SEO i formularis", tone: "violet" },
  { icon: ShoppingBag, title: "Ecommerce", signal: "Vendre un catàleg", answer: "Shopify primer · custom si cal", scope: "Catàleg, checkout, impostos i logística", tone: "amber" },
  { icon: BarChart3, title: "Dashboard / SaaS", signal: "Operar dades i usuaris", answer: "Next.js + Supabase + Sentry", scope: "Auth, rols, dades, pagaments i auditories", tone: "emerald" },
] as const;

const colors = { cyan: "border-cyan-400/25 bg-cyan-400/[0.06] text-cyan-300", violet: "border-violet-400/25 bg-violet-400/[0.06] text-violet-300", amber: "border-amber-400/25 bg-amber-400/[0.06] text-amber-300", emerald: "border-emerald-400/25 bg-emerald-400/[0.06] text-emerald-300" };

export function ProductDecisionGrid() {
  return (
    <div>
      <div className="mx-auto mb-7 w-fit rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 text-center text-sm font-semibold">Quin resultat compra el client?</div>
      <div className="relative grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="absolute left-[12.5%] right-[12.5%] top-0 hidden h-px bg-gradient-to-r from-cyan-400/40 via-violet-400/40 to-emerald-400/40 xl:block" />
        {products.map((product, index) => <motion.article key={product.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ delay: index * 0.1 }} className={`relative rounded-3xl border p-5 ${colors[product.tone]}`}>
          <product.icon className="h-7 w-7" /><span className="mt-6 block text-[10px] uppercase tracking-[0.16em] text-white/40">Necessitat</span><h3 className="mt-1 text-2xl text-white">{product.title}</h3>
          <p className="mt-3 text-sm text-white/65">{product.signal}</p><div className="my-4 h-px bg-white/10" /><strong className="text-sm text-white">{product.answer}</strong><p className="mt-2 text-xs leading-relaxed text-white/45">{product.scope}</p>
        </motion.article>)}
      </div>
      <p className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-4 text-sm leading-relaxed text-amber-100/75"><strong className="text-amber-200">Decisió professional:</strong> no construïm un checkout, CMS o sistema d’auth propi si una plataforma madura resol millor el risc. Personalitzem només allò que diferencia el negoci.</p>
    </div>
  );
}
