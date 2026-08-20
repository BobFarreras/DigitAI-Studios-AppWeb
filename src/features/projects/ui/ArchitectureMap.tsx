/**
 * @file src/features/projects/ui/ArchitectureMap.tsx
 * @updated 2026-08-20
 * @summary Diagrama animat del flux comercial fins a infraestructura i IA.
 * @scope Visual responsive sense logica de negoci.
 */
"use client";

import { motion } from "framer-motion";
import { BriefcaseBusiness, Code2, Users } from "lucide-react";
import { TechLogo } from "./TechLogo";

const groups = [
  { title: "Entrada", nodes: ["Client", "Brief comercial"], icon: BriefcaseBusiness },
  { title: "Producte", nodes: ["Backlog", "Disseny", "Codi"], icon: Code2 },
  { title: "Operació", nodes: ["Deploy", "Dades", "Workflows", "IA"], icon: Users },
];

export function ArchitectureMap() {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.035] p-5 sm:p-8 lg:p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.16),transparent_55%)]" />
      <div className="relative grid gap-5 lg:grid-cols-[1fr_auto_1fr_auto_1.4fr] lg:items-center">
        {groups.map((group, index) => {
          const Icon = group.icon;
          return <div key={group.title} className="contents"><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.15 }} className="rounded-2xl border border-white/10 bg-[#0c0c12] p-5"><Icon className="h-6 w-6 text-violet-400" /><h3 className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-white/50">{group.title}</h3><div className="mt-4 flex flex-wrap gap-2">{group.nodes.map((node) => <span key={node} className="rounded-full bg-white/7 px-3 py-1.5 text-xs text-white/80">{node}</span>)}</div>{index === 2 && <div className="mt-5 flex flex-wrap gap-2"><TechLogo tech="vercel" compact /><TechLogo tech="supabase" compact /><TechLogo tech="n8n" compact /><TechLogo tech="openai" compact /></div>}</motion.div>{index < 2 && <motion.span animate={{ opacity: [0.25, 1, 0.25], scaleX: [0.7, 1, 0.7] }} transition={{ duration: 2.2, repeat: Infinity }} className="hidden h-px w-12 bg-gradient-to-r from-violet-600 to-cyan-400 lg:block" />}</div>;
        })}
      </div>
      <p className="relative mt-6 text-center text-xs text-white/40">El comercial defineix el problema · El tècnic converteix la decisió en un sistema operable</p>
    </section>
  );
}
