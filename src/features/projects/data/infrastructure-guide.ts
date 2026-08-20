/**
 * @file src/features/projects/data/infrastructure-guide.ts
 * @updated 2026-08-20
 * @summary Roadmap tecnic i operatiu per construir l'empresa de productes digitals.
 * @scope Dades estàtiques de la guia visual.
 */
export type TechKey = "github" | "cloudflare" | "vercel" | "supabase" | "postgres" | "n8n" | "openai" | "anthropic" | "hostinger" | "whatsapp" | "ollama" | "redis" | "nextjs" | "typescript" | "sentry" | "stripe" | "shopify";
export type GuidePhase = { number: string; title: string; goal: string; owner: string; tech: TechKey[]; actions: string[]; result: string };

export const phases: GuidePhase[] = [
  { number: "01", title: "Fonaments de l’empresa", goal: "Que els actius siguin de l’empresa, no de persones.", owner: "Direcció + Tècnic", tech: ["cloudflare", "github"], actions: ["Domini, correus i gestor de contrasenyes", "Comptes de facturació corporatius", "MFA, accessos i document de responsables"], result: "Propietat i accessos sota control" },
  { number: "02", title: "Sistema de desenvolupament", goal: "Repetir qualitat sense començar cada projecte de zero.", owner: "Tècnic", tech: ["github"], actions: ["Organització GitHub i equips", "Template Next.js amb CI, logs i seguretat", "main protegida, develop i previews per feature"], result: "Una software factory reproduïble" },
  { number: "03", title: "Capa web i entrega", goal: "Desplegar ràpid sense convertir el VPS en un monòlit.", owner: "Tècnic", tech: ["cloudflare", "vercel"], actions: ["Cloudflare davant de dominis i DNS", "Vercel Pro per productes comercials", "Entorns preview, staging i producció"], result: "Deploys independents i reversibles" },
  { number: "04", title: "Dades i identitat", goal: "Aïllar dades per client i poder recuperar-les.", owner: "Tècnic", tech: ["supabase", "postgres"], actions: ["Projecte Supabase separat per producte crític", "Pro en producció, RLS i migrations", "Backup lògic extern també per a Storage"], result: "Dades segures, traçables i portables" },
  { number: "05", title: "Automatització i workers", goal: "Executar processos llargs fora del frontend.", owner: "Tècnic", tech: ["n8n", "postgres"], actions: ["n8n al VPS amb PostgreSQL i backups", "Queues, retries i webhooks signats", "Un entorn productiu separat de proves"], result: "Processos fiables i observables" },
  { number: "06", title: "Capa d’intel·ligència", goal: "Canviar de model sense reescriure cada aplicació.", owner: "Tècnic + Comercial", tech: ["openai", "anthropic"], actions: ["Gateway intern per als proveïdors d’IA", "Pressupost i límits per client", "Prompts versionats, evals i registre de consum"], result: "IA governada com un servei" },
  { number: "07", title: "Operació i escala", goal: "Saber què falla, quant costa i qui respon.", owner: "Direcció + Tècnic", tech: ["github", "supabase", "n8n"], actions: ["Monitoratge, alertes i runbooks", "Dashboard de marge i consum per client", "Revisió mensual de seguretat i costos"], result: "Creixement amb control operatiu" },
];

export const techMeta: Record<TechKey, { name: string; url: string; role: string }> = {
  github: { name: "GitHub", url: "https://github.com/favicon.ico", role: "Codi i CI/CD" },
  cloudflare: { name: "Cloudflare", url: "https://www.cloudflare.com/favicon.ico", role: "DNS i perímetre" },
  vercel: { name: "Vercel", url: "https://vercel.com/favicon.ico", role: "Web i previews" },
  supabase: { name: "Supabase", url: "https://supabase.com/favicon/favicon-32x32.png", role: "Auth, DB i Storage" },
  postgres: { name: "PostgreSQL", url: "https://www.postgresql.org/favicon.ico", role: "Dades persistents" },
  n8n: { name: "n8n", url: "https://n8n.io/favicon.ico", role: "Workflows i workers" },
  openai: { name: "OpenAI", url: "https://openai.com/favicon.ico", role: "Models i agents" },
  anthropic: { name: "Anthropic", url: "https://www.anthropic.com/favicon.ico", role: "Models i codi" },
  hostinger: { name: "Hostinger", url: "https://www.hostinger.com/favicon.ico", role: "VPS i xarxa" },
  whatsapp: { name: "WhatsApp", url: "https://www.whatsapp.com/favicon.ico", role: "Canal conversacional" },
  ollama: { name: "Ollama", url: "https://ollama.com/public/ollama.png", role: "Models locals" },
  redis: { name: "Redis", url: "https://redis.io/favicon.ico", role: "Queues i cache" },
  nextjs: { name: "Next.js", url: "https://nextjs.org/favicon.ico", role: "Frontend i backend web" },
  typescript: { name: "TypeScript", url: "https://www.typescriptlang.org/favicon-32x32.png", role: "Contractes i qualitat" },
  sentry: { name: "Sentry", url: "https://sentry.io/favicon.ico", role: "Errors i rendiment" },
  stripe: { name: "Stripe", url: "https://stripe.com/favicon.ico", role: "Pagaments" },
  shopify: { name: "Shopify", url: "https://www.shopify.com/favicon.ico", role: "Comerç gestionat" },
};
