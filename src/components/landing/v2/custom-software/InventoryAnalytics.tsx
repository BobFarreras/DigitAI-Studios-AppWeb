/**
 * @file src/components/landing/v2/custom-software/InventoryAnalytics.tsx
 * @updated 2026-05-13
 * @summary Analitica d'inventari amb us, preus i alternatives.
 * @scope Visualitzacio client-side derivada dels materials.
 */
'use client';
import type { ReactNode } from 'react';
import { AlertTriangle, ArrowDownRight, ArrowUpRight, BarChart3, CircleDollarSign, PackageSearch } from 'lucide-react';
import type { Material } from './model';
import type { InventoryProfile } from './inventory-utils';

type Row = { material: Material; profile: InventoryProfile };
type Props = { rows: Row[]; onDetail: (id: string) => void };

export function InventoryAnalytics({ rows, onDetail }: Props) {
  const topUsed = [...rows].sort((a, b) => b.profile.monthlyUse - a.profile.monthlyUse).slice(0, 5);
  const alerts = rows.filter((r) => r.profile.priceDelta >= 7 || r.profile.saving > 6 || r.material.state === 'Crític').slice(0, 5);
  const totalSaving = rows.reduce((sum, r) => sum + r.profile.saving * Math.max(1, r.profile.reorderQty), 0);

  return (
    <div className="grid h-full gap-3 overflow-auto p-4 lg:grid-cols-[1.1fr_.9fr]">
      <section className="rounded-[8px] border border-[#d0d6e0] bg-white p-3 dark:border-[#23252a] dark:bg-[#111213]">
        <Header icon={<BarChart3 className="h-4 w-4 text-[#6b7cff]" />} title="Materials més utilitzats" value={`${topUsed[0]?.profile.monthlyUse ?? 0}/mes`} />
        <div className="mt-3 space-y-2">{topUsed.map((row) => <UsageBar key={row.material.id} row={row} max={topUsed[0]?.profile.monthlyUse ?? 1} onDetail={() => onDetail(row.material.id)} />)}</div>
      </section>
      <section className="rounded-[8px] border border-[#d0d6e0] bg-white p-3 dark:border-[#23252a] dark:bg-[#111213]">
        <Header icon={<CircleDollarSign className="h-4 w-4 text-[#22c55e]" />} title="Estalvi potencial" value={`${Math.round(totalSaving)}€`} />
        <div className="mt-3 grid gap-2">{alerts.map((row) => <AlertRow key={row.material.id} row={row} onDetail={() => onDetail(row.material.id)} />)}</div>
      </section>
      <section className="rounded-[8px] border border-[#d0d6e0] bg-white p-3 dark:border-[#23252a] dark:bg-[#111213] lg:col-span-2">
        <Header icon={<PackageSearch className="h-4 w-4 text-[#00c2d7]" />} title="Automatismes suggerits" value={`${alerts.length} avisos`} />
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <Automation title="Preu proveïdor" text="Avisar quan un recanvi puja més d'un 7% respecte l'última compra." />
          <Automation title="Alternativa barata" text="Comparar proveïdor principal amb alternativa i marcar estalvi per unitat." />
          <Automation title="Reposició SAT" text="Generar comanda si stock disponible cau per sota de reserves actives." />
        </div>
      </section>
    </div>
  );
}

function Header({ icon, title, value }: { icon: ReactNode; title: string; value: string }) { return <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-[13px] font-semibold">{icon}{title}</div><span className="text-[12px] text-[#8a8f98]">{value}</span></div>; }
function UsageBar({ row, max, onDetail }: { row: Row; max: number; onDetail: () => void }) { return <button onClick={onDetail} className="w-full rounded-[7px] border border-[#d0d6e0] bg-[#f7f8f8] p-2 text-left dark:border-[#323334] dark:bg-[#08090a]"><div className="flex items-center justify-between gap-3 text-[12px]"><span className="font-[560]">{row.material.name}</span><span className="text-[#8a8f98]">{row.profile.monthlyUse}/mes</span></div><div className="mt-2 h-1.5 rounded-full bg-[#d8dde7] dark:bg-[#23252a]"><div className="h-1.5 rounded-full bg-[#6b7cff]" style={{ width: `${Math.max(10, (row.profile.monthlyUse / max) * 100)}%` }} /></div></button>; }
function AlertRow({ row, onDetail }: { row: Row; onDetail: () => void }) { const up = row.profile.priceDelta > 0; return <button onClick={onDetail} className="rounded-[7px] border border-[#d0d6e0] bg-[#f7f8f8] p-2 text-left dark:border-[#323334] dark:bg-[#08090a]"><div className="flex items-center justify-between gap-2"><span className="inline-flex items-center gap-2 text-[12px] font-[560]"><AlertTriangle className="h-4 w-4 text-[#facc15]" />{row.material.name}</span><span className={up ? 'text-[#ef4444]' : 'text-[#16a34a]'}>{up ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}</span></div><p className="mt-1 text-[11px] text-[#8a8f98]">{row.profile.priceDelta > 0 ? `Preu +${row.profile.priceDelta}%` : `Preu ${row.profile.priceDelta}%`} · {row.profile.alternativeSupplier}: {row.profile.alternativePrice.toFixed(2)}€</p></button>; }
function Automation({ title, text }: { title: string; text: string }) { return <div className="rounded-[7px] border border-[#d0d6e0] bg-[#f7f8f8] p-3 dark:border-[#323334] dark:bg-[#08090a]"><p className="text-[13px] font-semibold">{title}</p><p className="mt-1 text-[12px] leading-5 text-[#62666d] dark:text-[#8a8f98]">{text}</p></div>; }
