/**
 * @file src/features/learning/ui/LearningModulePath.tsx
 * @updated 2026-05-22
 * @summary Metro-map style visual path with 3 parallel branches for learning modules.
 * @scope Presentational; renders parallel vertical paths for each branch.
 */
'use client';

import { motion } from 'framer-motion';
import { Check, Lock, Star } from 'lucide-react';
import { Link } from '@/routing';
import type { LearningModuleTreeNode } from '@/services/learning/learning-module-tree-service';

const BRANCH_COLORS = ['#1cb0f6', '#58cc02', '#ff9600'];

type Props = {
  tree: LearningModuleTreeNode[];
  trackTitle: string;
  trackColor?: string;
};

export function LearningModulePath({ tree, trackTitle }: Props) {
  return (
    <section className="mx-auto min-h-screen max-w-5xl bg-white pb-24 text-[#3c3c3c]">
      {/* Header */}
      <div className="sticky top-[58px] z-10 mx-4 rounded-xl bg-[#1f1f1f] p-4 text-white shadow-lg md:top-0 md:mx-0">
        <p className="text-xs font-black uppercase tracking-wider text-[#afafaf]">Track de formació</p>
        <h1 className="mt-1 text-2xl font-black">{trackTitle}</h1>
        <p className="mt-1 text-sm text-[#afafaf]">Tria una branca per començar. Pots explorar-les en qualsevol ordre.</p>
      </div>

      {/* 3 Branches in parallel */}
      <div className="mt-8 grid grid-cols-1 gap-8 px-4 md:grid-cols-3 md:px-8">
        {tree.map((branch, branchIndex) => (
          <BranchColumn
            key={branch.id}
            branch={branch}
            branchIndex={branchIndex}
            color={BRANCH_COLORS[branchIndex % BRANCH_COLORS.length]}
          />
        ))}
      </div>
    </section>
  );
}

function BranchColumn({
  branch,
  branchIndex,
  color,
}: {
  branch: LearningModuleTreeNode;
  branchIndex: number;
  color: string;
}) {
  const nodes = collectBranchNodes(branch);

  return (
    <div className="flex flex-col items-center">
      {/* Branch header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: branchIndex * 0.15 }}
        className="mb-6 w-full rounded-xl p-4 text-center text-white shadow-[0_6px_0_#3f8f01]"
        style={{ backgroundColor: color, boxShadow: `0 6px 0 ${darken(color, 30)}` }}
      >
        <h2 className="text-lg font-black">{branch.title}</h2>
        {branch.description ? (
          <p className="mt-1 text-xs font-bold opacity-90">{branch.description}</p>
        ) : null}
      </motion.div>

      {/* Vertical path */}
      <div className="relative flex w-full flex-col items-center gap-4">
        {/* Connector line */}
        <div
          className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2"
          style={{ backgroundColor: `${color}40` }}
        />

        {nodes.map((node, nodeIndex) => (
          <PathNode
            key={node.id}
            node={node}
            index={nodeIndex}
            color={color}
          />
        ))}
      </div>
    </div>
  );
}

function collectBranchNodes(
  branch: LearningModuleTreeNode,
  result: LearningModuleTreeNode[] = []
): LearningModuleTreeNode[] {
  result.push(branch);
  for (const child of branch.children) {
    collectBranchNodes(child, result);
  }
  return result;
}

function PathNode({
  node,
  index,
  color,
}: {
  node: LearningModuleTreeNode;
  index: number;
  color: string;
}) {
  const isLocked = node.status === 'locked';
  const isCompleted = node.status === 'completed';
  const isLeaf = node.isLeaf;

  const nodeSize = isLeaf ? 'h-14 w-14' : 'h-12 w-12';
  const nodeColors = isLocked
    ? 'bg-[#e5e5e5] text-[#afafaf]'
    : isCompleted
      ? 'text-white'
      : 'text-white';

  const bgStyle = isLocked ? {} : { backgroundColor: isCompleted ? '#58cc02' : color };

  const Icon = isCompleted ? Check : isLocked ? Lock : Star;

  const content = (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 260, damping: 20 }}
      className="relative z-10 flex flex-col items-center"
    >
      <div
        className={`flex ${nodeSize} items-center justify-center rounded-full border-4 border-white shadow-[0_4px_0_#afafaf] ${nodeColors}`}
        style={bgStyle}
      >
        <Icon className="h-6 w-6" />
      </div>
      <p className="mt-2 max-w-32 text-center text-xs font-black leading-4 text-[#3c3c3c]">
        {node.title}
      </p>
      {node.level !== 'basic' ? (
        <span className="mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
          style={{ backgroundColor: getLevelColor(node.level) }}>
          {node.level}
        </span>
      ) : null}
    </motion.div>
  );

  if (isLocked || !isLeaf) return content;

  return (
    <Link href={node.href} className="focus:outline-none focus:ring-2 focus:ring-[#58cc02]">
      {content}
    </Link>
  );
}

function getLevelColor(level: string): string {
  switch (level) {
    case 'initiation': return '#58cc02';
    case 'basic': return '#1cb0f6';
    case 'intermediate': return '#ff9600';
    case 'advanced': return '#ea2b2b';
    default: return '#afafaf';
  }
}

function darken(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max((num >> 16) - amount, 0);
  const g = Math.max(((num >> 8) & 0x00ff) - amount, 0);
  const b = Math.max((num & 0x0000ff) - amount, 0);
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}
