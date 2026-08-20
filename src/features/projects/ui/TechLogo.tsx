/**
 * @file src/features/projects/ui/TechLogo.tsx
 * @updated 2026-08-20
 * @summary Node visual amb identitat oficial d'una tecnologia.
 * @scope Presentacio de logos i metadades.
 */
import { techMeta, type TechKey } from "../data/infrastructure-guide";

export function TechLogo({ tech, compact = false }: { tech: TechKey; compact?: boolean }) {
  const item = techMeta[tech];
  return (
    <span className={`inline-flex items-center rounded-xl border border-white/10 bg-white/[0.06] ${compact ? "gap-2 px-2.5 py-2" : "gap-3 px-3 py-2.5"}`}>
      <span className="h-6 w-6 shrink-0 rounded-md bg-white bg-contain bg-center bg-no-repeat p-0.5" style={{ backgroundImage: `url("${item.url}")` }} aria-hidden="true" />
      <span><strong className="block text-xs text-white">{item.name}</strong>{!compact && <small className="block text-[10px] text-white/45">{item.role}</small>}</span>
    </span>
  );
}
