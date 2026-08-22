/**
 * @file src/features/projects/ui/ProjectGuideNav.tsx
 * @updated 2026-08-22
 * @summary Index persistent i sincronitzat amb les seccions de la guia.
 * @scope Navegacio interna responsive del projecte.
 */
"use client";

import { BookOpen, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const groups = [
  { title: "Construcció", links: [{ id: "construccio", label: "01 · De zero a escala" }] },
  { title: "Productes", links: [{ id: "rutes", label: "02 · Mapa de serveis" }, { id: "web-software", label: "03 · Web i software" }, { id: "automatitzacions", label: "04 · Automatitzacions" }, { id: "agents-ia", label: "05 · Agents IA" }] },
  { title: "Empresa", links: [{ id: "vendes", label: "06 · Clients i leads" }, { id: "salut", label: "07 · Economia i salut" }, { id: "seguretat", label: "08 · Seguretat i normes" }] },
  { title: "Control", links: [{ id: "governanca", label: "09 · Governança" }, { id: "costos", label: "10 · Costos" }] },
];
const links = groups.flatMap((group) => group.links);

export function ProjectGuideNav() {
  const [active, setActive] = useState("construccio");
  useEffect(() => {
    const elements = links.map(({ id }) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => { const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]; if (visible) setActive(visible.target.id); }, { rootMargin: "-25% 0px -55%", threshold: [0, .2, .5] });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  return <>
    <aside className="fixed left-5 top-36 z-30 hidden w-56 rounded-3xl border border-white/10 bg-[#0b0b11]/90 p-4 shadow-2xl backdrop-blur-xl 2xl:block"><div className="flex items-center gap-2 border-b border-white/10 pb-4 text-sm font-semibold"><BookOpen className="h-4 w-4 text-violet-300" />Guia de l’empresa</div><div className="mt-4 space-y-5">{groups.map((group) => <div key={group.title}><span className="px-2 text-[9px] uppercase tracking-[.18em] text-white/25">{group.title}</span><div className="mt-1 space-y-0.5">{group.links.map((link) => <button key={link.id} type="button" onClick={() => go(link.id)} className={`flex w-full items-center justify-between rounded-xl px-2 py-2 text-left text-xs transition ${active === link.id ? "bg-violet-400/15 text-violet-200" : "text-white/45 hover:bg-white/5 hover:text-white"}`}>{link.label}{active === link.id && <ChevronRight className="h-3.5 w-3.5" />}</button>)}</div></div>)}</div></aside>
    <div className="fixed inset-x-0 top-[120px] z-30 flex gap-2 overflow-x-auto border-b border-white/10 bg-[#09090e]/92 px-4 py-2 backdrop-blur-xl 2xl:hidden">{links.map((link) => <button key={link.id} type="button" onClick={() => go(link.id)} className={`shrink-0 rounded-full px-3 py-2 text-[10px] transition ${active === link.id ? "bg-violet-500 text-white" : "border border-white/10 text-white/45"}`}>{link.label}</button>)}</div>
  </>;
}
