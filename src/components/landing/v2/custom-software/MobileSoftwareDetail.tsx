/**
 * @file src/components/landing/v2/custom-software/MobileSoftwareDetail.tsx
 * @updated 2026-05-15
 * @summary Fitxa mobil completa per les taules del simulador.
 * @scope Presentar detall slide-up dins el mockup mobil sense gestionar dades.
 */
'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, type LucideIcon } from 'lucide-react';
import { FloatingTip } from './FloatingTip';

export type MobileDetailCell = { text: string; icon?: LucideIcon; tone?: string; tip?: string };
export type MobileDetailGroup = { title: string; cells: MobileDetailCell[] };
export type MobileDetailRow = {
  id: string;
  cells: MobileDetailCell[];
  badge: string;
  tone: string;
  detail: MobileDetailCell[];
  groups?: MobileDetailGroup[];
  summary?: string;
  statusIcon?: LucideIcon;
  action?: string;
  onAction?: () => void;
};

type Props = { row: MobileDetailRow; onBack: () => void };

export function MobileSoftwareDetail({ row, onBack }: Props) {
  const StatusIcon = row.statusIcon;
  const detail = Array.isArray(row.detail) ? row.detail : [];
  const groups = row.groups?.length ? row.groups : [{ title: 'Detall', cells: detail }];
  return (
    <motion.div
      initial={{ y: '92%', opacity: 0.72 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '92%', opacity: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 z-20 flex flex-col bg-[#f7f8f8] text-[#08090a] dark:bg-[#08090a] dark:text-[#f7f8f8]"
    >
      <header className="shrink-0 border-b border-[#d0d6e0] bg-white px-3 py-2 dark:border-[#23252a] dark:bg-[#101112]">
        <div className="mx-auto mb-2 h-1 w-12 rounded-full bg-[#c0c8d5] dark:bg-[#323334]" />
        <div className="flex items-start justify-between gap-2">
          <button onClick={onBack} className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-[720] text-[#62666d] dark:text-[#8a8f98]">
            <ArrowLeft className="h-3.5 w-3.5" />Tornar
          </button>
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-[780] ${row.tone}`}>
            {StatusIcon ? <StatusIcon className="h-3 w-3" /> : null}{row.badge}
          </span>
        </div>
        <h4 className="mt-2 text-[16px] font-[780] leading-tight">{row.cells[0]?.text}</h4>
        {row.summary ? <p className="mt-1 text-[11px] leading-4 text-[#62666d] dark:text-[#aeb7c6]">{row.summary}</p> : null}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-2.5 py-2.5">
        <div className="grid gap-2">
          {groups.map((group) => (
            <section key={group.title} className="rounded-[9px] border border-[#d0d6e0] bg-white p-2.5 dark:border-[#23252a] dark:bg-[#101112]">
              <h5 className="mb-2 text-[11px] font-[760] uppercase text-[#62666d] dark:text-[#8a8f98]">{group.title}</h5>
              <div className="grid gap-1.5">
                {group.cells.map((item, index) => <DetailItem key={`${group.title}-${item.text}-${index}`} item={item} />)}
              </div>
            </section>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function DetailItem({ item }: { item: MobileDetailCell }) {
  const Icon = item.icon;
  const body = (
    <div className="rounded-[7px] bg-[#eef1f6] px-2.5 py-2 text-[11px] dark:bg-[#161718]">
      {item.tip ? <p className="mb-0.5 text-[9px] font-[720] uppercase text-[#8a8f98]">{item.tip}</p> : null}
      <span className="flex items-start gap-1.5 font-[590] leading-4">
        {Icon ? <Icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${item.tone ?? 'text-[#8a8f98]'}`} /> : null}
        <span className="min-w-0 break-words">{item.text}</span>
      </span>
    </div>
  );
  return item.tip ? <FloatingTip text={item.tip}>{body}</FloatingTip> : body;
}
