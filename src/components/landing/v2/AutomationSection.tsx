/**
 * @file src/components/landing/v2/AutomationSection.tsx
 * @updated 2026-05-13
 * @summary Canvas d'automatitzacions amb fluxos de negoci visuals.
 * @scope Mostrar potencial d'automatitzacions sense executar processos reals.
 */
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Bot, Braces, CalendarClock, CheckCircle2, Database, GitBranch, Mail, MessageCircle, Send, Share2, type LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { BrandRevealText } from '@/components/ui/brand-reveal';
type Node = { id: string; icon: LucideIcon; x: number; y: number; tone?: string };
type Edge = { from: number; to: number; bend?: number };
type Workflow = { id: string; nodes: Node[]; edges: Edge[] };
const workflows: Workflow[] = [
  {
    id: 'leads',
    nodes: [
      { id: 'campaign', icon: MessageCircle, x: 10, y: 58, tone: 'text-[#35b8e8]' },
      { id: 'interest', icon: Bot, x: 27, y: 42, tone: 'text-[#a855f7]' },
      { id: 'filter', icon: GitBranch, x: 45, y: 58, tone: 'text-[#22c55e]' },
      { id: 'crm', icon: Database, x: 63, y: 38, tone: 'text-[#6366f1]' },
      { id: 'follow', icon: CalendarClock, x: 63, y: 72, tone: 'text-[#f59e0b]' },
      { id: 'team', icon: Bell, x: 84, y: 54, tone: 'text-[#f59e0b]' },
    ],
    edges: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3, bend: -18 }, { from: 2, to: 4, bend: 18 }, { from: 3, to: 5 }, { from: 4, to: 5 }],
  },
  {
    id: 'quotes',
    nodes: [
      { id: 'request', icon: Mail, x: 10, y: 40, tone: 'text-[#35b8e8]' },
      { id: 'clean', icon: Braces, x: 27, y: 58, tone: 'text-[#a855f7]' },
      { id: 'rules', icon: GitBranch, x: 45, y: 40, tone: 'text-[#22c55e]' },
      { id: 'quote', icon: Database, x: 64, y: 30, tone: 'text-[#6366f1]' },
      { id: 'invoice', icon: CheckCircle2, x: 64, y: 70, tone: 'text-[#22c55e]' },
      { id: 'notify', icon: Bell, x: 84, y: 50, tone: 'text-[#f59e0b]' },
    ],
    edges: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3, bend: -18 }, { from: 2, to: 4, bend: 18 }, { from: 3, to: 5 }, { from: 4, to: 5 }],
  },
  {
    id: 'social',
    nodes: [
      { id: 'idea', icon: Mail, x: 11, y: 65, tone: 'text-[#35b8e8]' },
      { id: 'copy', icon: Bot, x: 27, y: 46, tone: 'text-[#a855f7]' },
      { id: 'approve', icon: CheckCircle2, x: 43, y: 65, tone: 'text-[#22c55e]' },
      { id: 'calendar', icon: CalendarClock, x: 60, y: 42, tone: 'text-[#f59e0b]' },
      { id: 'publish', icon: Share2, x: 70, y: 72, tone: 'text-[#6366f1]' },
      { id: 'report', icon: Database, x: 86, y: 52, tone: 'text-[#35b8e8]' },
    ],
    edges: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3, bend: -18 }, { from: 2, to: 4, bend: 18 }, { from: 3, to: 5 }, { from: 4, to: 5 }],
  },
  {
    id: 'support',
    nodes: [
      { id: 'chat', icon: MessageCircle, x: 10, y: 50, tone: 'text-[#35b8e8]' },
      { id: 'kb', icon: Database, x: 28, y: 34, tone: 'text-[#6366f1]' },
      { id: 'resolve', icon: GitBranch, x: 45, y: 50, tone: 'text-[#22c55e]' },
      { id: 'answer', icon: Send, x: 63, y: 34, tone: 'text-[#35b8e8]' },
      { id: 'ticket', icon: Bell, x: 63, y: 70, tone: 'text-[#f59e0b]' },
      { id: 'close', icon: CheckCircle2, x: 84, y: 50, tone: 'text-[#22c55e]' },
    ],
    edges: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3, bend: -18 }, { from: 2, to: 4, bend: 18 }, { from: 3, to: 5 }, { from: 4, to: 5 }],
  },
];
export function AutomationSection() {
  const t = useTranslations('LandingV2.automation');
  const [active, setActive] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const workflow = workflows[active];
  return (
    <section id="automatitzacions" className="relative z-10 flex min-h-[100svh] overflow-hidden border-t border-[#d0d6e0]/80 px-4 py-[72px] text-[#08090a] dark:border-[#23252a] dark:text-[#f7f8f8] sm:px-6 sm:py-[84px] lg:px-8 lg:py-[92px]">
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-center">
        <h2 className="max-w-6xl text-balance text-[clamp(28px,4.2vw,56px)] font-[590] leading-[1.02]">
          {t('titleStrong')} <BrandRevealText className="text-[#383b3f] dark:text-[#8a8f98]">{t('titleMuted')}</BrandRevealText>
        </h2>
        <div className="linear-panel mt-5 overflow-hidden border-y backdrop-blur-[2px] sm:mt-6">
          <div className="flex flex-col gap-3 border-b border-[#d0d6e0] p-3 dark:border-[#23252a] md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {workflows.map((item, index) => (
                <button key={item.id} onClick={() => { setActive(index); setHoveredNode(null); }} className={`rounded-[6px] border px-3 py-2 text-[13px] font-[590] transition-colors ${active === index ? 'border-[#8b5cf6]/50 bg-[#08090a] text-white dark:bg-[#f7f8f8] dark:text-[#08090a]' : 'border-[#d0d6e0] text-[#62666d] hover:text-[#08090a] dark:border-[#23252a] dark:text-[#8a8f98] dark:hover:text-[#f7f8f8]'}`}>
                  {t(`flows.${item.id}.name`)}
                </button>
              ))}
            </div>
            <div className="max-w-2xl text-[14px] font-[560] leading-[1.45] text-[#62666d] dark:text-[#8a8f98] md:text-right lg:text-[15px]">{t(`flows.${workflow.id}.summary`)}</div>
          </div>
          <div className="overflow-x-auto overflow-y-hidden">
            <div className="relative h-[clamp(350px,55svh,520px)] min-w-[820px] bg-[radial-gradient(circle,#d0d6e0_1px,transparent_1px)] bg-[size:18px_18px] dark:bg-[radial-gradient(circle,#23252a_1px,transparent_1px)] lg:min-w-0">
              <WorkflowEdges workflow={workflow} />
              {workflow.nodes.map((node, index) => <WorkflowNode key={`${workflow.id}-${node.id}`} node={node} index={index} flowId={workflow.id} showBubble={index === hoveredNode} onHover={setHoveredNode} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function WorkflowNode({ node, index, flowId, showBubble, onHover }: { node: Node; index: number; flowId: string; showBubble: boolean; onHover: (index: number | null) => void }) {
  const t = useTranslations('LandingV2.automation');
  const Icon = node.icon;
  return (
    <motion.div initial={{ opacity: 0, scale: 0.78, filter: 'blur(8px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ duration: 0.42, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }} className="group absolute w-[144px] -translate-x-1/2 -translate-y-1/2 text-center" onMouseEnter={() => onHover(index)} onMouseLeave={() => onHover(null)} style={{ left: `${node.x}%`, top: `${node.y}%` }}>
      {showBubble ? (
        <motion.div initial={{ opacity: 0, y: 8, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.28 }} className="absolute bottom-[calc(100%+12px)] left-1/2 hidden w-[190px] -translate-x-1/2 rounded-[8px] border border-[#d0d6e0] bg-[#f7f8f8]/90 px-3 py-2 text-left text-[12px] leading-snug text-[#62666d] shadow-[0_12px_28px_rgba(8,9,10,0.08)] backdrop-blur-md dark:border-[#323334] dark:bg-[#161718]/92 dark:text-[#d0d6e0] lg:block">
          {t(`flows.${flowId}.nodes.${node.id}.explain`)}
        </motion.div>
      ) : null}
      <div className="mx-auto flex h-[92px] w-[92px] items-center justify-center rounded-[8px] border border-[#d0d6e0] bg-[#f7f8f8]/78 shadow-[0_12px_28px_rgba(8,9,10,0.08)] transition-all duration-300 group-hover:border-[#8b5cf6]/60 dark:border-[#323334] dark:bg-[#161718]/84">
        <Icon className={`h-8 w-8 transition-all duration-300 ${showBubble ? (node.tone ?? 'text-[#8b5cf6]') : 'text-[#8a8f98] dark:text-[#62666d]'} ${showBubble ? 'scale-[1.03]' : 'grayscale saturate-50 opacity-80'}`} />
      </div>
      <h4 className="mt-3 text-[14px] font-[650] leading-tight">{t(`flows.${flowId}.nodes.${node.id}.title`)}</h4>
      <p className="mt-1 text-[11px] text-[#62666d] dark:text-[#8a8f98]">{t(`flows.${flowId}.nodes.${node.id}.meta`)}</p>
    </motion.div>
  );
}
function WorkflowEdges({ workflow }: { workflow: Workflow }) {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
      {workflow.edges.map((edge, index) => {
        const from = workflow.nodes[edge.from], to = workflow.nodes[edge.to];
        const mid = ((from.x + to.x) / 2) + (edge.bend ?? 0) * 0.1;
        const path = `M ${from.x + 4} ${from.y} C ${mid} ${from.y}, ${mid} ${to.y}, ${to.x - 4} ${to.y}`;
        return (
          <g key={`${from.id}-${to.id}`}>
            <path d={path} fill="none" stroke="currentColor" strokeWidth="0.18" className="text-[#62666d]/38 dark:text-[#8a8f98]/32" />
            <motion.circle r="0.55" className="fill-[#8b5cf6]" initial={{ offsetDistance: '0%' }} animate={{ offsetDistance: ['0%', '100%'] }} transition={{ duration: 2.2, delay: index * 0.25, repeat: Infinity, ease: 'linear' }} style={{ offsetPath: `path("${path}")` }} />
          </g>
        );
      })}
    </svg>
  );
}
