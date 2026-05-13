/**
 * @file src/components/landing/v2/custom-software/InventoryMaterialDetail.tsx
 * @updated 2026-05-13
 * @summary Fitxa de material amb stock, proveidor i moviments.
 * @scope Detall client-side d'un material del simulador.
 */
'use client';
import type { ReactNode } from 'react';
import { ArrowLeft, Boxes, CalendarClock, Euro, MapPin, PackageCheck, ShoppingCart, Truck, UserRound } from 'lucide-react';
import type { Material } from './model';
import type { InventoryProfile } from './inventory-utils';

type Props = {
  material: Material;
  profile: InventoryProfile;
  onBack: () => void;
  onIncrement: () => void;
  onReserve: () => void;
  onOrder: () => void;
};

export function InventoryMaterialDetail({ material, profile, onBack, onIncrement, onReserve, onOrder }: Props) {
  return (
    <div className="h-full overflow-auto rounded-[10px] border border-[#d0d6e0] bg-white text-[#08090a] dark:border-[#23252a] dark:bg-[linear-gradient(135deg,#111213,#0b0c0d_58%,#101112)] dark:text-[#f7f8f8]">
      <div className="flex min-h-12 items-center justify-between border-b border-[#d0d6e0] px-4 dark:border-[#23252a]">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-[12px] font-[560] text-[#62666d] hover:text-[#08090a] dark:text-[#8a8f98] dark:hover:text-[#f7f8f8]"><ArrowLeft className="h-4 w-4" />Materials</button>
        <Status state={material.state} />
      </div>
      <section className="grid gap-4 border-b border-[#d0d6e0] px-4 py-4 dark:border-[#23252a] lg:grid-cols-[1fr_330px]">
        <div>
          <p className="text-[12px] text-[#8a8f98]">{material.id} · {profile.category}</p>
          <h4 className="mt-1 text-[24px] font-semibold leading-tight">{material.name}</h4>
          <p className="mt-2 max-w-2xl text-[13px] leading-5 text-[#62666d] dark:text-[#8a8f98]">{profile.recommendation} Disponible real: {profile.available} unitats despres de reserves.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
          <Metric icon={<Boxes className="h-4 w-4" />} label="Stock / mínim" value={`${material.qty} / ${material.min}`} />
          <Metric icon={<PackageCheck className="h-4 w-4" />} label="Reservat SAT" value={`${profile.reserved} unitats`} />
          <Metric icon={<ShoppingCart className="h-4 w-4" />} label="Comanda" value={profile.ordered ? `${profile.ordered} unitats` : 'Sense comanda'} />
        </div>
      </section>
      <div className="grid gap-0 lg:grid-cols-[1fr_300px]">
        <main className="border-b border-[#d0d6e0] p-4 dark:border-[#23252a] lg:border-b-0 lg:border-r">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            <Metric icon={<Truck className="h-4 w-4" />} label="Proveïdor" value={profile.supplier} />
            <Metric icon={<UserRound className="h-4 w-4" />} label="Contacte" value={profile.supplierContact} />
            <Metric icon={<CalendarClock className="h-4 w-4" />} label="Termini" value={profile.leadTime} />
            <Metric icon={<Euro className="h-4 w-4" />} label="Preu unitari" value={`${profile.unitPrice.toFixed(2)} €`} />
            <Metric icon={<MapPin className="h-4 w-4" />} label="Ubicació" value={profile.location} />
          </div>
          <section className="mt-4 rounded-[7px] border border-[#d0d6e0] bg-[#f7f8f8] p-3 dark:border-[#323334] dark:bg-[#08090a]">
            <h5 className="mb-2 text-[13px] font-semibold">Historial</h5>
            <div className="grid gap-2 md:grid-cols-3">{profile.history.map((item) => <p key={item} className="rounded-[6px] border border-[#d0d6e0] bg-white p-2 text-[12px] dark:border-[#323334] dark:bg-[#111213]">{item}</p>)}</div>
          </section>
        </main>
        <aside className="space-y-2 p-4">
          <Action label="+1 entrada" onClick={onIncrement} />
          <Action label="Reservar per SAT" onClick={onReserve} />
          <Action label="Demanar proveïdor" onClick={onOrder} primary />
        </aside>
      </div>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) { return <div className="rounded-[7px] border border-[#d0d6e0] bg-[#f7f8f8] p-2 text-[12px] dark:border-[#323334] dark:bg-[#08090a]"><div className="mb-1 flex items-center gap-2 text-[#8a8f98]">{icon}{label}</div><p className="break-words font-[560]">{value}</p></div>; }
function Action({ label, onClick, primary }: { label: string; onClick: () => void; primary?: boolean }) { return <button onClick={onClick} className={`h-9 w-full rounded-[6px] px-3 text-[12px] font-semibold ${primary ? 'bg-[#e4f222] text-[#08090a]' : 'border border-[#c0c8d5] bg-white dark:border-[#323334] dark:bg-[#08090a]'}`}>{label}</button>; }
function Status({ state }: { state: Material['state'] }) { const cls = state === 'Crític' ? 'border-[#ef4444]/40 bg-[#ef4444]/12 text-[#ef4444]' : state === 'Baix' ? 'border-[#facc15]/40 bg-[#facc15]/12 text-[#ca8a04]' : 'border-[#22c55e]/40 bg-[#22c55e]/12 text-[#16a34a]'; return <span className={`rounded-[5px] border px-2 py-1 text-[11px] font-semibold ${cls}`}>{state}</span>; }
