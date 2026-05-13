/**
 * @file src/components/landing/v2/custom-software/InventoryView.tsx
 * @updated 2026-05-13
 * @summary Vista d'inventari.
 * @scope Consulta i ajust de stock.
 */
'use client';
import { motion } from 'framer-motion';
import type { Material } from './model';

type Props = {
  material: Material[];
  materialName: string;
  onSetMaterialName: (value: string) => void;
  onAddMaterial: () => void;
  onIncrement: (id: string) => void;
};

export function InventoryView({ material, materialName, onSetMaterialName, onAddMaterial, onIncrement }: Props) {
  return (
    <motion.div key="inventory" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input value={materialName} onChange={(e) => onSetMaterialName(e.target.value)} placeholder="Nou material" className="h-10 flex-1 rounded-[6px] border border-[#c0c8d5] bg-white px-3 text-[13px] dark:border-[#323334] dark:bg-[#08090a]" />
        <button onClick={onAddMaterial} className="h-10 rounded-[6px] bg-[#e4f222] px-4 text-[12px] font-semibold text-[#08090a]">Afegir material</button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {material.map((m) => (
          <article key={m.id} className="rounded-[8px] border border-[#d0d6e0] bg-[#eceff4] p-3 dark:border-[#23252a] dark:bg-[#161718]">
            <p className="text-[12px]">{m.name}</p><p className="text-[11px] text-[#62666d]">{m.id}</p>
            <div className="mt-2 flex items-center justify-between"><span className="text-[12px]">Stock: {m.qty}</span><Status state={m.state} /></div>
            <button onClick={() => onIncrement(m.id)} className="mt-3 w-full rounded-[6px] border border-[#c0c8d5] bg-white py-1.5 text-[11px] dark:border-[#323334] dark:bg-[#08090a]">+1 unitat</button>
          </article>
        ))}
      </div>
    </motion.div>
  );
}

function Status({ state }: { state: Material['state'] }) {
  const cls = state === 'Crític' ? 'bg-[#eb5757]/20 text-[#eb5757]' : state === 'Baix' ? 'bg-[#f5a623]/20 text-[#f5a623]' : 'bg-[#27a644]/20 text-[#27a644]';
  return <span className={`rounded-[4px] px-2 py-0.5 text-[11px] ${cls}`}>{state}</span>;
}
