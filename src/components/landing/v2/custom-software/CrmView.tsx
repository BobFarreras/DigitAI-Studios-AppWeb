/**
 * @file src/components/landing/v2/custom-software/CrmView.tsx
 * @updated 2026-05-13
 * @summary Vista CRM del simulador.
 * @scope Gestio de clients i moviment de fase.
 */
'use client';
import { motion } from 'framer-motion';
import type { Client, LeadStage } from './model';

type Props = {
  clients: Client[];
  query: string;
  clientName: string;
  onSetClientName: (value: string) => void;
  onAddClient: () => void;
  onMoveStage: (id: number) => void;
};

export function CrmView({ clients, query, clientName, onSetClientName, onAddClient, onMoveStage }: Props) {
  const term = query.trim().toLowerCase();
  const filtered = term ? clients.filter((c) => `${c.name} ${c.segment} ${c.owner}`.toLowerCase().includes(term)) : clients;
  return (
    <motion.div key="crm" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input value={clientName} onChange={(e) => onSetClientName(e.target.value)} placeholder="Nom empresa" className="h-10 flex-1 rounded-[6px] border border-[#c0c8d5] bg-white px-3 text-[13px] dark:border-[#323334] dark:bg-[#08090a]" />
        <button onClick={onAddClient} className="h-10 rounded-[6px] bg-[#e4f222] px-4 text-[12px] font-semibold text-[#08090a]">Afegir client</button>
      </div>
      <div className="overflow-hidden rounded-[8px] border border-[#d0d6e0] dark:border-[#23252a]">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-[#eceff4] text-[#8a8f98] dark:bg-[#161718]"><tr><th className="px-3 py-2">Client</th><th className="px-3 py-2">Responsable</th><th className="px-3 py-2">Fase</th><th className="px-3 py-2">Acció</th></tr></thead>
          <tbody>{filtered.map((c) => (
            <tr key={c.id} className="border-t border-[#d0d6e0] bg-white dark:border-[#23252a] dark:bg-[#0f1011]">
              <td className="px-3 py-2">{c.name}<p className="text-[11px] text-[#62666d]">{c.segment}</p></td>
              <td className="px-3 py-2">{c.owner}</td>
              <td className="px-3 py-2"><StagePill stage={c.stage} /></td>
              <td className="px-3 py-2"><button onClick={() => onMoveStage(c.id)} className="text-[11px] text-[#5e6ad2]">Moure fase</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </motion.div>
  );
}

function StagePill({ stage }: { stage: LeadStage }) {
  return <span className="rounded-[4px] border border-[#c0c8d5] bg-[#eceff4] px-2 py-0.5 text-[11px] dark:border-[#323334] dark:bg-[#161718]">{stage}</span>;
}
