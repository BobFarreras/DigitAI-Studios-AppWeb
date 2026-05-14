/**
 * @file src/components/landing/v2/AutomationMobileFlow.tsx
 * @updated 2026-05-14
 * @summary Canvas vertical mobil per automatitzacions estil workflow.
 * @scope Adaptar l'escenari de nodes desktop a pantalles petites.
 */
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import type { Workflow } from './AutomationSection';

type Props = { workflow: Workflow };
type MobilePoint = { x: number; y: number };

const smoothEase = [0.22, 1, 0.36, 1] as const;
const mobilePoints: MobilePoint[] = [
  { x: 50, y: 7 },
  { x: 30, y: 21 },
  { x: 70, y: 35 },
  { x: 28, y: 53 },
  { x: 72, y: 53 },
  { x: 50, y: 74 },
];

export function AutomationMobileFlow({ workflow }: Props) {
  const t = useTranslations('LandingV2.automation');
  const [activeNode, setActiveNode] = useState<number | null>(null);

  return (
    <div className="md:hidden">
      <div className="relative h-[760px] overflow-hidden border-t border-[#c3cad6] bg-[#eef1f6]/72 bg-[radial-gradient(circle,#aeb7c6_1px,transparent_1px)] bg-[size:18px_18px] dark:border-[#3a3d44] dark:bg-[#111315]/88 dark:bg-[radial-gradient(circle,#444850_1px,transparent_1px)]">
        <MobileEdges workflow={workflow} activeNode={activeNode} />
        {workflow.nodes.map((node, index) => {
          const Icon = node.icon;
          const point = mobilePoints[index] ?? { x: 50, y: 50 };
          const isActive = activeNode === index;
          return (
            <motion.div
              key={`${workflow.id}-${node.id}`}
              initial={{ opacity: 0, scale: 0.72, y: 18, filter: 'blur(12px)' }}
              whileInView={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.52, margin: '-8% 0px -18% 0px' }}
              transition={{ duration: 0.74, delay: index * 0.1, ease: smoothEase }}
              className={`absolute w-[118px] -translate-x-1/2 -translate-y-1/2 text-center ${isActive ? 'z-20' : 'z-10'}`}
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
            >
              <button type="button" onClick={() => setActiveNode(isActive ? null : index)} className="group w-full text-center outline-none" aria-expanded={isActive}>
                <span className={`mx-auto flex h-[74px] w-[74px] items-center justify-center rounded-[8px] border bg-[#f7f8f8]/92 shadow-[0_12px_28px_rgba(8,9,10,0.12)] backdrop-blur-sm transition-all duration-300 dark:bg-[#1a1c1f]/92 ${isActive ? 'scale-[1.06] border-[#8b5cf6]/70' : 'border-[#b8c0ce] [filter:grayscale(.72)_saturate(.55)] dark:border-[#4a4e57]'}`}>
                  <Icon className={`h-7 w-7 transition-all duration-300 ${isActive ? (node.tone ?? 'text-[#8b5cf6]') : 'text-[#8a8f98] dark:text-[#62666d]'}`} />
                </span>
                <span className="mt-2 block text-[12px] font-[650] leading-tight">{t(`flows.${workflow.id}.nodes.${node.id}.title`)}</span>
              </button>
              <NodeDetail open={isActive} align={point.x < 40 ? 'left' : point.x > 60 ? 'right' : 'center'} above={point.y > 64}>
                {t(`flows.${workflow.id}.nodes.${node.id}.explain`)}
              </NodeDetail>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function NodeDetail({ open, align, above, children }: { open: boolean; align: 'left' | 'center' | 'right'; above: boolean; children: string }) {
  const x = align === 'left' ? 'left-0' : align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2';
  const y = above ? 'bottom-[calc(100%+10px)]' : 'top-[calc(100%+10px)]';
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: above ? 10 : -10, scale: 0.94, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: above ? 10 : -10, scale: 0.94, filter: 'blur(10px)' }}
          transition={{ duration: 0.34, ease: smoothEase }}
          className={`absolute ${x} ${y} w-[252px] rounded-[8px] border border-[#c3cad6] bg-[#f7f8f8]/96 px-3.5 py-2.5 text-left text-[13px] font-[540] leading-[1.55] text-[#383b3f] shadow-[0_18px_44px_rgba(8,9,10,0.16)] backdrop-blur-md dark:border-[#4a4e57] dark:bg-[#1a1c1f]/96 dark:text-[#e2e6ec]`}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function MobileEdges({ workflow, activeNode }: { workflow: Workflow; activeNode: number | null }) {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
      {workflow.edges.map((edge, index) => {
        const from = mobilePoints[edge.from], to = mobilePoints[edge.to];
        const midY = (from.y + to.y) / 2;
        const path = `M ${from.x} ${from.y + 5} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y - 5}`;
        const isActive = activeNode === edge.from || activeNode === edge.to;
        return (
          <g key={`${edge.from}-${edge.to}`}>
            <motion.path d={path} fill="none" stroke="currentColor" strokeWidth="0.24" className="text-[#4f5662]/54 dark:text-[#9aa2ad]/46" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.05, delay: index * 0.1, ease: smoothEase }} />
            <motion.circle r="0.7" className="fill-[#8b5cf6]" animate={{ opacity: isActive ? [0.2, 1, 0.2] : 0, offsetDistance: isActive ? ['0%', '100%'] : '0%' }} transition={{ duration: 1.7, repeat: isActive ? Infinity : 0, ease: 'linear' }} style={{ offsetPath: `path("${path}")` }} />
          </g>
        );
      })}
    </svg>
  );
}
