/**
 * @file src/features/projects/ui/ProjectPresentation.tsx
 * @updated 2026-08-20
 * @summary Guia visual completa per estructurar i escalar l'empresa tecnologica.
 * @scope Composicio de seccions interactives del projecte Control Hub.
 */
"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowDown, Building2, ShieldCheck } from "lucide-react";
import { Link } from "@/routing";
import { ArchitectureMap } from "./ArchitectureMap";
import { AiStrategy } from "./AiStrategy";
import { CostReference } from "./CostReference";
import { GuideTimeline } from "./GuideTimeline";
import { N8nStrategy } from "./N8nStrategy";
import { OperatingModel } from "./OperatingModel";
import { ProductBlueprints } from "./ProductBlueprints";
import { TechLogo } from "./TechLogo";
import { WebAppDelivery } from "./WebAppDelivery";

export function ProjectPresentation() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28 });
  return (
    <main data-cursor-contrast="light" className="min-h-screen overflow-hidden bg-[#08080d] pt-16 text-white">
      <motion.div style={{ scaleX: progress }} className="fixed inset-x-0 top-16 z-50 h-0.5 origin-left bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400" />
      <nav className="fixed inset-x-0 top-16 z-40 flex h-14 items-center border-b border-white/10 bg-[#08080d]/88 px-5 backdrop-blur-xl sm:px-8"><Link href="/projectes" className="text-sm text-white/50 transition hover:text-white">Projectes</Link><span className="mx-3 text-white/20">/</span><strong className="text-sm">Blueprint d’empresa</strong></nav>

      <section className="relative mx-auto flex min-h-[92svh] max-w-7xl flex-col justify-center px-5 pb-20 pt-28 sm:px-8">
        <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/15 blur-[120px]" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-violet-200"><Building2 className="h-4 w-4" />Empresa de software · Blueprint 01</span>
          <h1 className="mt-8 max-w-5xl text-[clamp(3.2rem,9vw,8rem)] leading-[0.88] tracking-[-0.07em]">De la primera venda a una empresa <span className="text-violet-400">escalable.</span></h1>
          <p className="mt-8 max-w-2xl text-lg font-light leading-relaxed text-white/55 sm:text-xl">Una guia visual per decidir propietat, repositoris, infraestructura, dades, automatitzacions, IA i operació sense acumular deute des del primer client.</p>
          <div className="mt-9 flex flex-wrap gap-2"><TechLogo tech="github" /><TechLogo tech="vercel" /><TechLogo tech="supabase" /><TechLogo tech="n8n" /></div>
        </motion.div>
        <a href="#arquitectura" className="absolute bottom-8 left-5 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-white/40 sm:left-8">Veure el sistema<ArrowDown className="h-4 w-4 animate-bounce" /></a>
      </section>

      <section id="arquitectura" className="mx-auto max-w-7xl px-5 py-24 sm:px-8"><p className="text-xs uppercase tracking-[0.2em] text-cyan-300">01 · El sistema complet</p><h2 className="mt-4 max-w-4xl text-4xl tracking-[-0.05em] sm:text-6xl">Una empresa és un flux, no una col·lecció d’eines.</h2><p className="mb-10 mt-5 max-w-2xl text-white/50">Cada venda ha d’entrar en un procés repetible i acabar en un producte desplegat, mesurable i facturable.</p><ArchitectureMap /></section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8"><p className="text-xs uppercase tracking-[0.2em] text-violet-300">02 · Què venem</p><h2 className="mt-4 max-w-4xl text-4xl tracking-[-0.05em] sm:text-6xl">Tres productes. Tres arquitectures clares.</h2><p className="mb-10 mt-5 max-w-2xl text-white/50">El client veu el resultat; nosaltres controlem les capes, els costos i els punts de fallada.</p><ProductBlueprints /></section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8"><WebAppDelivery /></section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8"><N8nStrategy /></section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8"><p className="text-xs uppercase tracking-[0.2em] text-cyan-300">04 · Agents i canals</p><h2 className="mb-10 mt-4 max-w-4xl text-4xl tracking-[-0.05em] sm:text-6xl">WhatsApp, IA i automatització sense perdre el control.</h2><AiStrategy /></section>

      <section className="px-5 py-24 sm:px-8"><div className="mx-auto mb-16 max-w-4xl text-center"><p className="text-xs uppercase tracking-[0.2em] text-violet-300">05 · Del zero a escala</p><h2 className="mt-4 text-4xl tracking-[-0.05em] sm:text-6xl">L’ordre correcte de les decisions.</h2><p className="mx-auto mt-5 max-w-2xl text-white/50">No contractis totes les eines el primer dia. Activa cada capa quan l’anterior ja té propietari, normes i recuperació.</p></div><GuideTimeline /></section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8"><p className="text-xs uppercase tracking-[0.2em] text-emerald-300">06 · Governança</p><h2 className="mb-10 mt-4 max-w-4xl text-4xl tracking-[-0.05em] sm:text-6xl">Responsabilitats separades. Costos visibles.</h2><OperatingModel /></section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8"><CostReference /></section>

      <section className="mx-auto max-w-7xl px-5 pb-32 pt-16 sm:px-8"><div className="rounded-[32px] border border-violet-400/25 bg-gradient-to-br from-violet-500/15 to-cyan-400/5 p-7 sm:p-12"><ShieldCheck className="h-9 w-9 text-violet-300" /><h2 className="mt-6 max-w-4xl text-4xl tracking-[-0.05em] sm:text-6xl">La regla final: cap client ha de dependre d’una persona.</h2><p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/60">Codi a l’organització, dominis i facturació a l’empresa, secrets fora del repositori, dades amb backup i cada procés amb un responsable i un pla de recuperació.</p></div></section>
    </main>
  );
}
