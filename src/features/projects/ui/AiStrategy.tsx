/**
 * @file src/features/projects/ui/AiStrategy.tsx
 * @updated 2026-08-20
 * @summary Arquitectura i criteris de cost per agents IA i WhatsApp.
 * @scope Comparativa visual d'inferencia gestionada i local.
 */
import { ArrowRight, Gauge, WalletCards } from "lucide-react";
import { TechLogo } from "./TechLogo";

const layers = ["Meta webhook", "API pròpia", "Policy + límits", "Model router", "Tools / n8n", "Resposta + mètriques"];
const choices = [
  { title: "API gestionada", tech: ["openai", "anthropic"] as const, price: "Pagament per tokens", best: "Producció inicial i càrrega variable", detail: "Sense GPU ni manteniment. Model petit per classificar; model potent només quan cal." },
  { title: "Ollama local", tech: ["ollama"] as const, price: "Infra + GPU + operació", best: "Privacitat estricta o volum estable alt", detail: "No hi ha quota per token, però sí hardware, electricitat, redundància, monitoratge i models." },
];

export function AiStrategy() {
  return <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]"><div className="rounded-[30px] border border-white/10 bg-white/[0.035] p-6 sm:p-8"><p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Agent de WhatsApp professional</p><h2 className="mt-4 text-4xl tracking-[-0.05em]">n8n no ha de ser el cervell.</h2><p className="mt-4 max-w-xl text-sm leading-relaxed text-white/50">El canal entra per Meta. Una API pròpia autentica, limita, guarda context i decideix. El model raona i n8n només orquestra accions llargues.</p><div className="mt-8 space-y-2">{layers.map((layer, index) => <div key={layer} className="flex items-center gap-3"><span className="w-7 font-mono text-xs text-cyan-300">0{index + 1}</span><div className="flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/75">{layer}</div>{index < layers.length - 1 && <ArrowRight className="hidden h-4 w-4 text-white/20 sm:block" />}</div>)}</div><div className="mt-6 flex flex-wrap gap-2"><TechLogo tech="whatsapp" compact /><TechLogo tech="n8n" compact /><TechLogo tech="supabase" compact /></div></div>
    <div className="space-y-4">{choices.map((choice, index) => <article key={choice.title} className={`rounded-[26px] border p-6 ${index === 0 ? "border-violet-400/35 bg-violet-400/7" : "border-white/10 bg-white/[0.035]"}`}><div className="flex flex-wrap gap-2">{choice.tech.map((tech) => <TechLogo key={tech} tech={tech} compact />)}</div><h3 className="mt-5 text-2xl">{choice.title}</h3><p className="mt-2 flex items-center gap-2 text-sm text-emerald-300"><WalletCards className="h-4 w-4" />{choice.price}</p><p className="mt-4 text-sm leading-relaxed text-white/50">{choice.detail}</p><p className="mt-5 flex gap-2 border-t border-white/10 pt-4 text-xs text-white/70"><Gauge className="h-4 w-4 text-cyan-300" /><strong>Millor per:</strong> {choice.best}</p></article>)}</div>
  </section>;
}
